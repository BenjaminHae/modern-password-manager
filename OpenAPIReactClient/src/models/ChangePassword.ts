/* tslint:disable */
/* eslint-disable */
/**
 * Password Manager
 * This is a password manager server.
 *
 * The version of the OpenAPI document: 0.0.1
 * Contact: test@te.st
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import {
    AccountId,
    AccountIdFromJSON,
    AccountIdFromJSONTyped,
    AccountIdToJSON,
} from './AccountId';

/**
 * 
 * @export
 * @interface ChangePassword
 */
export interface ChangePassword {
    /**
     * 
     * @type {string}
     * @memberof ChangePassword
     */
    oldPassword: string;
    /**
     * 
     * @type {string}
     * @memberof ChangePassword
     */
    newPassword: string;
    /**
     * 
     * @type {Array<AccountId>}
     * @memberof ChangePassword
     */
    accounts: Array<AccountId>;
}

export function ChangePasswordFromJSON(json: any): ChangePassword {
    return ChangePasswordFromJSONTyped(json, false);
}

export function ChangePasswordFromJSONTyped(json: any, ignoreDiscriminator: boolean): ChangePassword {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'oldPassword': json['oldPassword'],
        'newPassword': json['newPassword'],
        'accounts': ((json['accounts'] as Array<any>).map(AccountIdFromJSON)),
    };
}

export function ChangePasswordToJSON(value?: ChangePassword | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'oldPassword': value.oldPassword,
        'newPassword': value.newPassword,
        'accounts': ((value.accounts as Array<any>).map(AccountIdToJSON)),
    };
}

