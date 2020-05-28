import { CredentialProvider } from './controller/credentialProvider';
//todo make ciphers configurable

export class CredentialService {
  public credentialProvider: CredentialProvider

  constructor() {
    this.credentialProvider = new CredentialProvider();
  }

  generateFromPassword(password: string): PromiseLike<CryptoKey>{
    return this.credentialProvider.generateFromPassword(password);
  }

  getKey(): CryptoKey | undefined {
    return this.credentialProvider.getKey();
  }
}
