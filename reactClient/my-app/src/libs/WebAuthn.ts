interface User {
  id: ArrayBuffer,
  displayName: string,
  name: string
}

interface AllowCredential {
  id: ArrayBuffer;
  type: "public-key";
}
export default class WebAuthn {
  readonly localStoreKey = "webAuthnPresent";
  async createCredential(challenge: ArrayBuffer, rpName: string, user: User): Promise<PublicKeyCredential> {
    const creationOptions = {
      publicKey: {
        authenticatorSelection: {
          authenticatorAttachment: "platform" as const,
          userVerification: "required" as const
        },
        challenge: challenge,
        rp: { id: document.domain, name: rpName },
        user: user,
        pubKeyCredParams: [
          { type: "public-key" as const, alg: -7 },
          { type: "public-key" as const, alg: -257 }
        ]
      }
    }
    console.log(creationOptions);
    const credentials = await navigator.credentials.create(creationOptions);
    if(!credentials)
      throw new Error("no credentials created");
    if(credentials.type !== "public-key")
      throw new Error("wrong type of credentials");
    return credentials as PublicKeyCredential;
  }

  async getCredential(challenge: ArrayBuffer, allowCredentials: Array<ArrayBuffer>): Promise<PublicKeyCredential> {
    return await navigator.credentials.get({
      publicKey: {
        challenge: challenge,
        rpId: document.domain,
        userVerification: "required",
        allowCredentials: this.generateAllowCredentials(allowCredentials)
      }
    }) as PublicKeyCredential;
  }

  private generateAllowCredentials(ids: Array<ArrayBuffer>): Array<AllowCredential> {
    return ids.map(id => ({ id: id, "type": "public-key" }));
  }

}
