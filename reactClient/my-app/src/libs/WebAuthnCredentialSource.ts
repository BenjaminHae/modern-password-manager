import { ICredentialSource, CredentialReadiness } from './CredentialSource';
import PersistDecryptionKey from './PersistDecryptionKey';
import { BackendService } from '../backend/backend.service';
import { BackendOptions } from '../backend/api/maintenance.service';
import { ILogonInformation } from '../backend/api/user.service';
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
      // todo
      //this.messages.showMessage(`WebAuthn Login failed: ${message}`, {autoClose: false, variant: "danger" });
      return null;
    }
  }
}
