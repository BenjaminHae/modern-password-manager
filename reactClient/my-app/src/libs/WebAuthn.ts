interface User {
  id: ArrayBuffer,
  displayName: string,
  name: string
}
export default class WebAuthn {
  readonly localStoreKey = "webAuthnPresent";
  async createCredential(challenge: ArrayBuffer, rpName: string, user: User): Promise<PublicKeyCredential> {
    let credentials = await navigator.credentials.create({
      publicKey: {
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required"
        },
        challenge: challenge,
        rp: { id: document.domain, name: rpName },
        user: user,
        pubKeyCredParams: [
          { type: "public-key", alg: -7 },
          { type: "public-key", alg: -257 }
        ]
      }
    });
    this.rememberStorage(); 
    if(!credentials)
      throw new Error("no credentials created");
    if(credentials.type !== "public-key")
      throw new Error("wrong type of credentials");
    return credentials as PublicKeyCredential;
  }

  async getCredential(challenge: ArrayBuffer) {
    return await navigator.credentials.get({
      publicKey: {
        challenge: challenge,
        rpId: document.domain,
        userVerification: "required",
      }
    }) as PublicKeyCredential;
  }

  rememberStorage() {
    window.localStorage.setItem(this.localStoreKey, "yes")
  }

  clearStorage() {
    window.localStorage.removeItem(this.localStoreKey)
  }

  credentialsAvailable(): boolean {
    return window.localStorage.getItem(this.localStoreKey) === "yes";
  }
}
