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
 * @interface HistoryItem
 */
export interface HistoryItem {
    /**
     * 
     * @type {string}
     * @memberof HistoryItem
     */
    userAgent: string;
    /**
     * 
     * @type {string}
     * @memberof HistoryItem
     */
    iP: string;
    /**
     * 
     * @type {Date}
     * @memberof HistoryItem
     */
    time: Date;
    /**
     * 
     * @type {string}
     * @memberof HistoryItem
     */
    event: HistoryItemEventEnum;
    /**
     * 
     * @type {string}
     * @memberof HistoryItem
     */
    eventResult: string;
}

export function HistoryItemFromJSON(json: any): HistoryItem {
    return HistoryItemFromJSONTyped(json, false);
}

export function HistoryItemFromJSONTyped(json: any, ignoreDiscriminator: boolean): HistoryItem {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'userAgent': json['UserAgent'],
        'iP': json['IP'],
        'time': (new Date(json['Time'])),
        'event': json['Event'],
        'eventResult': json['EventResult'],
    };
}

export function HistoryItemToJSON(value?: HistoryItem | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'UserAgent': value.userAgent,
        'IP': value.iP,
        'Time': (value.time.toISOString()),
        'Event': value.event,
        'EventResult': value.eventResult,
    };
}

/**
* @export
* @enum {string}
*/
export enum HistoryItemEventEnum {
    Login = 'Login',
    ChangePassword = 'ChangePassword',
    Registration = 'Registration'
}


