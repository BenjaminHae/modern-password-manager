export class CredentialProviderUndefined {

  getKey(): CryptoKey{
    throw new Error("No Credentials existing");
  }
}
