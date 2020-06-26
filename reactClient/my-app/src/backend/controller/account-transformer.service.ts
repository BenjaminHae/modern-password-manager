import { CryptoService } from '../crypto.service';
import { ICredentialProvider } from '../controller/credentialProvider';
import { CryptedObject } from '../models/cryptedObject';
import { Account } from '../models/account';
import { encryptedAccount } from '../models/encryptedAccount';
import { AccountId as OpenAPIAccountId } from '@pm-server/pm-server-react-client';

export class AccountTransformerService {

  constructor(private crypto: CryptoService) {
  }

  async encryptAccount(account: Account, credentials?: ICredentialProvider): Promise<encryptedAccount> {
    let name: CryptedObject;
    let other: CryptedObject;
    name = await this.crypto.encryptChar(account.name, undefined, credentials)
    other = await this.crypto.encryptChar(account.getOtherJSON(), undefined, credentials);
    return new encryptedAccount(account.index, name, account.enpassword, other);
  }

  async decryptAccount(encrypted: encryptedAccount): Promise<Account> {
    let name: string;
    let other: string;
    name = await this.crypto.decryptChar(encrypted.name);
    other = await this.crypto.decryptChar(encrypted.other);
    let account = new Account(encrypted.index, name, encrypted.password);
    account.other = JSON.parse(other);
    return account;
  }

  getPassword(account: Account): Promise<string> {
    return this.crypto.decryptChar(account.enpassword);
  }

  encryptedAccountFromOpenAPI(apiAccount: OpenAPIAccountId): encryptedAccount {
    if (!apiAccount.index || !apiAccount.name || !apiAccount.password || !apiAccount.additional) {
      throw new Error("account index is undefined");
    }
    return new encryptedAccount(
        apiAccount.index,
        CryptedObject.fromBase64JSON(apiAccount.name),
        CryptedObject.fromBase64JSON(apiAccount.password),
        CryptedObject.fromBase64JSON(apiAccount.additional)
        );
  }

  encryptedAccountToOpenAPI(account: encryptedAccount): OpenAPIAccountId {
    return {
      index: account.index,
      name: account.name.toBase64JSON(),
      additional: account.other.toBase64JSON(),
      password: account.password.toBase64JSON()
    };
  }
}
