import { ICredentialSource, CredentialReadiness } from './CredentialSource';
import PersistDecryptionKey from './PersistDecryptionKey';
import CredentialProviderPersist from '../backend/controller/credentialProviderPersist';
import { BackendService } from '../backend/backend.service';
import { BackendOptions } from '../backend/api/maintenance.service';
import { ILogonInformation } from '../backend/api/user.service';
import { UserWebAuthnCred } from '@pm-server/pm-server-react-client';
import WebAuthn from './WebAuthn';

export default class WebAuthNCredentialSource implements ICredentialSource {
  private credIds?: Array<ArrayBuffer>; 
  private persistor?: PersistDecryptionKey;
  
  constructor (private backend: BackendService, private backendWaiter: Promise<BackendOptions>, private debug: (value: string) => void) {
  }

  private getPersistor(): PersistDecryptionKey {
    if (!this.persistor) {
      this.persistor = new PersistDecryptionKey();
    }
    return this.persistor;
  }

  credentialReadinessSupported(): CredentialReadiness {
    return CredentialReadiness.automatedWithInteraction;
  }
  async credentialsReady(): Promise<boolean> {
    this.debug("checking if WebAuthN credentials are present");
    const persistor = this.getPersistor();
    this.credIds = await persistor.getCredentialIds();
    const credsAvailable = this.credIds.length > 0;
    this.debug(`CredsAvailable: ${credsAvailable}`);
    return credsAvailable;
  }

  async retrieveCredentials(): Promise<ILogonInformation|null> {
    this.debug(`Trying to do webAuthn get`);
    let credentials: PublicKeyCredential;
    try {
      await this.backendWaiter;
      const challenge = await this.backend.getWebAuthnChallenge();
      this.debug(`retrieved challenge`);
      const webAuthn = new WebAuthn();
      let credIds: Array<ArrayBuffer> = [];
      if (this.credIds) {
        credIds = this.credIds;
      }
      credentials = await webAuthn.getCredential(challenge, credIds);
    }
    catch(e) {
      this.debug(`WebAuthn get failed: ${e.message}`);
      return null;
    }

    const response = credentials.response as AuthenticatorAssertionResponse;
    const persistor = this.getPersistor();
    let keyIndex: number | undefined;
    if (!response.userHandle) {
      this.debug(`no user Handle was specified`);
      this.debug(`Trying to get by id ${credentials.id}`);
      try {
        keyIndex = await persistor.indexByCredentialId(credentials.id);
      }
      catch(e) {
        this.debug(`Finding credential in indexdb failed: ${e.message}`);
        return null;
      }
      if (!keyIndex) {
        this.debug(`could not get key by id: no user Handle or keyId was specified`);
        return null;
      }
    }
    else {
      const userIdView = new DataView(response.userHandle);
      keyIndex = userIdView.getInt16(1)
    }
    await persistor.setLastUsed(keyIndex, new Date());
    try {
      this.debug(`waiting for backend`);
      this.debug(`sending webauthn to server`);
      const info = await this.backend.logonWithWebAuthn(credentials.id, response.authenticatorData, response.clientDataJSON, response.signature, credentials.type, keyIndex, persistor);
      this.debug(`successful`);
      return info;
    }
    catch(e) {
      let message = "";
      if (e.message)
        message = e.message;
      else
        message = JSON.stringify(e, Object.getOwnPropertyNames(e));
      this.debug(`WebAuthn Login failed: ${message}`);
      // TODO
      //this.messages.showMessage(`WebAuthn Login failed: ${message}`, {autoClose: false, variant: "danger" });
      return null;
    }
  }

  async createCredential(deviceName: string, userName: string, password: string): Promise<void> {
    const persistor = this.getPersistor();
    const creds = new CredentialProviderPersist(persistor);
    this.debug('starting registration of WebAuthN keys');
    await creds.generateFromPassword(password);
    if (!await this.backend.verifyCredentials(creds)) {
      this.debug('Password did not match');
      return Promise.reject("Password does not match");
    }
    this.debug('persist decryption key locally');
    const storedKey = await creds.persistKey();
    try {
      this.debug('Retrieving challenge');
      const challenge = await this.backend.getWebAuthnChallenge();
      this.debug(`Received Challenge`);
      const webAuthn = new WebAuthn();
      const userIdBuffer = new ArrayBuffer(16);
      const idView = new DataView(userIdBuffer);
      idView.setInt16(1, storedKey.keyIndex);
      this.debug('Requesting credential from device');
      const webAuthCredential = await webAuthn.createCredential(challenge, 'Password-Manager', {id: userIdBuffer, displayName:userName, name:userName});
      this.debug(`Device handled registration successfully`);
      persistor.appendCredentialId(storedKey.keyIndex, webAuthCredential.rawId, webAuthCredential.id, userName);
      const attestationResponse = webAuthCredential.response as AuthenticatorAttestationResponse;
      this.debug(`Sending registration to backend`);
      await this.backend.createWebAuthn(webAuthCredential.id, deviceName, attestationResponse.attestationObject, attestationResponse.clientDataJSON, webAuthCredential.type, storedKey.wrappedServerKey);
      this.debug(`Success`);
    } catch(e) {
      this.debug(`Registration failed: ${e.message}`);
      this.debug(`Removing persisted keys`);
      persistor.removeKeys(storedKey.keyIndex);
      throw e;
    }
  }
  async getUserBackendCredential(): Promise<Array<UserWebAuthnCred>> {
    return await this.backend.getWebAuthnCreds()
  }
  async deleteCredential(id: number): Promise<Array<UserWebAuthnCred>> {
    return await this.backend.deleteWebAuthn(id);
  }
}
