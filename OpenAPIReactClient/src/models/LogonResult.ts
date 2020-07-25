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
    GenericSuccessMessage,
    GenericSuccessMessageFromJSON,
    GenericSuccessMessageFromJSONTyped,
    GenericSuccessMessageToJSON,
    LogonSecurityInformation,
    LogonSecurityInformationFromJSON,
    LogonSecurityInformationFromJSONTyped,
    LogonSecurityInformationToJSON,
    UserSettings,
    UserSettingsFromJSON,
    UserSettingsFromJSONTyped,
    UserSettingsToJSON,
} from './';

/**
 * 
 * @export
 * @interface LogonResult
 */
export interface LogonResult {
    /**
     * 
     * @type {boolean}
     * @memberof LogonResult
     */
    success: boolean;
    /**
     * 
     * @type {string}
     * @memberof LogonResult
     */
    message: string;
    /**
     * 
     * @type {Date}
     * @memberof LogonResult
     */
    lastLogin?: Date | null;
    /**
     * 
     * @type {number}
     * @memberof LogonResult
     */
    failedLogins?: number;
    /**
     * 
     * @type {string}
     * @memberof LogonResult
     */
    encryptedUserSettings: string;
}

export function LogonResultFromJSON(json: any): LogonResult {
    return LogonResultFromJSONTyped(json, false);
}

export function LogonResultFromJSONTyped(json: any, ignoreDiscriminator: boolean): LogonResult {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'success': json['success'],
        'message': json['message'],
        'lastLogin': !exists(json, 'lastLogin') ? undefined : (json['lastLogin'] === null ? null : new Date(json['lastLogin'])),
        'failedLogins': !exists(json, 'failedLogins') ? undefined : json['failedLogins'],
        'encryptedUserSettings': json['encryptedUserSettings'],
    };
}

export function LogonResultToJSON(value?: LogonResult | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'success': value.success,
        'message': value.message,
        'lastLogin': value.lastLogin === undefined ? undefined : (value.lastLogin === null ? null : value.lastLogin.toISOString()),
        'failedLogins': value.failedLogins,
        'encryptedUserSettings': value.encryptedUserSettings,
    };
}


