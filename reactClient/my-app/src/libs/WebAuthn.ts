interface User {
  id: ArrayBuffer,
  displayName: string,
  name: string
}
export default class WebAuthn {
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
    });
  }

  rememberStorage() {
    //todo store existence of key in local storage
  }

  clearStorage() {
    //todo remove existence of key in local storage
  }

  credentialsAvailable(): boolean {
    //todo retrieve existence of key in local storage
    return true;
  }
}
