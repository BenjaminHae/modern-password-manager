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
    LogonInformation,
    LogonInformationFromJSON,
    LogonInformationFromJSONTyped,
    LogonInformationToJSON,
    UserInformation,
    UserInformationFromJSON,
    UserInformationFromJSONTyped,
    UserInformationToJSON,
} from './';

/**
 * 
 * @export
 * @interface RegistrationInformation
 */
export interface RegistrationInformation {
    /**
     * 
     * @type {string}
     * @memberof RegistrationInformation
     */
    username?: string;
    /**
     * 
     * @type {string}
     * @memberof RegistrationInformation
     */
    password?: string;
    /**
     * 
     * @type {string}
     * @memberof RegistrationInformation
     */
    email?: string;
}

export function RegistrationInformationFromJSON(json: any): RegistrationInformation {
    return RegistrationInformationFromJSONTyped(json, false);
}

export function RegistrationInformationFromJSONTyped(json: any, ignoreDiscriminator: boolean): RegistrationInformation {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'username': !exists(json, 'username') ? undefined : json['username'],
        'password': !exists(json, 'password') ? undefined : json['password'],
        'email': !exists(json, 'email') ? undefined : json['email'],
    };
}

export function RegistrationInformationToJSON(value?: RegistrationInformation | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'username': value.username,
        'password': value.password,
        'email': value.email,
    };
}


