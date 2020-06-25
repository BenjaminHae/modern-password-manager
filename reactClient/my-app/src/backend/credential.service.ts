import { ICredentialProvider } from './controller/credentialProvider';
import { CredentialProviderUndefined } from './controller/credentialProviderUndefined';

export class CredentialService {
  public credentialProvider: ICredentialProvider

  constructor() {
    this.credentialProvider = new CredentialProviderUndefined();
  }

  setProvider(newProvider: ICredentialProvider) {
    this.credentialProvider = newProvider;
  }

  getKey(): CryptoKey {
    return this.credentialProvider.getKey();
  }
}
