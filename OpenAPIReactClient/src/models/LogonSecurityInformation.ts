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
/**
 * 
 * @export
 * @interface LogonSecurityInformation
 */
export interface LogonSecurityInformation {
    /**
     * 
     * @type {Date}
     * @memberof LogonSecurityInformation
     */
    lastLogin?: Date | null;
    /**
     * 
     * @type {number}
     * @memberof LogonSecurityInformation
     */
    failedLogins?: number;
}

export function LogonSecurityInformationFromJSON(json: any): LogonSecurityInformation {
    return LogonSecurityInformationFromJSONTyped(json, false);
}

export function LogonSecurityInformationFromJSONTyped(json: any, ignoreDiscriminator: boolean): LogonSecurityInformation {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'lastLogin': !exists(json, 'lastLogin') ? undefined : (json['lastLogin'] === null ? null : new Date(json['lastLogin'])),
        'failedLogins': !exists(json, 'failedLogins') ? undefined : json['failedLogins'],
    };
}

export function LogonSecurityInformationToJSON(value?: LogonSecurityInformation | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'lastLogin': value.lastLogin === undefined ? undefined : (value.lastLogin === null ? null : value.lastLogin.toISOString()),
        'failedLogins': value.failedLogins,
    };
}


