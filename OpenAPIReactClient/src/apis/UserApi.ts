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


import * as runtime from '../runtime';
import {
    ChangePassword,
    ChangePasswordFromJSON,
    ChangePasswordToJSON,
    GenericSuccessMessage,
    GenericSuccessMessageFromJSON,
    GenericSuccessMessageToJSON,
    HistoryItem,
    HistoryItemFromJSON,
    HistoryItemToJSON,
    LogonInformation,
    LogonInformationFromJSON,
    LogonInformationToJSON,
    LogonResult,
    LogonResultFromJSON,
    LogonResultToJSON,
    RegistrationInformation,
    RegistrationInformationFromJSON,
    RegistrationInformationToJSON,
    UserSettings,
    UserSettingsFromJSON,
    UserSettingsToJSON,
} from '../models';

export interface ChangePasswordRequest {
    changePassword: ChangePassword;
}

export interface LoginUserRequest {
    logonInformation: LogonInformation;
}

export interface RegisterUserRequest {
    registrationInformation: RegistrationInformation;
}

export interface SetUserSettingsRequest {
    userSettings: UserSettings;
}

/**
 * 
 */
export class UserApi extends runtime.BaseAPI {

    /**
     * change password of current user and upload reencrypted accounts
     * change user password
     */
    async changePasswordRaw(requestParameters: ChangePasswordRequest): Promise<runtime.ApiResponse<GenericSuccessMessage>> {
        if (requestParameters.changePassword === null || requestParameters.changePassword === undefined) {
            throw new runtime.RequiredError('changePassword','Required parameter requestParameters.changePassword was null or undefined when calling changePassword.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["X-CSRF-TOKEN"] = this.configuration.apiKey("X-CSRF-TOKEN"); // csrf authentication
        }

        const response = await this.request({
            path: `/user/changepassword`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ChangePasswordToJSON(requestParameters.changePassword),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => GenericSuccessMessageFromJSON(jsonValue));
    }

    /**
     * change password of current user and upload reencrypted accounts
     * change user password
     */
    async changePassword(requestParameters: ChangePasswordRequest): Promise<GenericSuccessMessage> {
        const response = await this.changePasswordRaw(requestParameters);
        return await response.value();
    }

    /**
     * Returns a history of successful and failed logins
     */
    async getUserHistoryRaw(): Promise<runtime.ApiResponse<Array<HistoryItem>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/user/history`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(HistoryItemFromJSON));
    }

    /**
     * Returns a history of successful and failed logins
     */
    async getUserHistory(): Promise<Array<HistoryItem>> {
        const response = await this.getUserHistoryRaw();
        return await response.value();
    }

    /**
     * Returns the client settings of the current user
     */
    async getUserSettingsRaw(): Promise<runtime.ApiResponse<UserSettings>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/user/settings`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => UserSettingsFromJSON(jsonValue));
    }

    /**
     * Returns the client settings of the current user
     */
    async getUserSettings(): Promise<UserSettings> {
        const response = await this.getUserSettingsRaw();
        return await response.value();
    }

    /**
     * login
     */
    async loginUserRaw(requestParameters: LoginUserRequest): Promise<runtime.ApiResponse<LogonResult>> {
        if (requestParameters.logonInformation === null || requestParameters.logonInformation === undefined) {
            throw new runtime.RequiredError('logonInformation','Required parameter requestParameters.logonInformation was null or undefined when calling loginUser.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["X-CSRF-TOKEN"] = this.configuration.apiKey("X-CSRF-TOKEN"); // csrf authentication
        }

        const response = await this.request({
            path: `/user/login`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: LogonInformationToJSON(requestParameters.logonInformation),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => LogonResultFromJSON(jsonValue));
    }

    /**
     * login
     */
    async loginUser(requestParameters: LoginUserRequest): Promise<LogonResult> {
        const response = await this.loginUserRaw(requestParameters);
        return await response.value();
    }

    /**
     * Logs out current logged in user session
     */
    async logoutUserRaw(): Promise<runtime.ApiResponse<GenericSuccessMessage>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/user/logout`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => GenericSuccessMessageFromJSON(jsonValue));
    }

    /**
     * Logs out current logged in user session
     */
    async logoutUser(): Promise<GenericSuccessMessage> {
        const response = await this.logoutUserRaw();
        return await response.value();
    }

    /**
     * registration
     */
    async registerUserRaw(requestParameters: RegisterUserRequest): Promise<runtime.ApiResponse<GenericSuccessMessage>> {
        if (requestParameters.registrationInformation === null || requestParameters.registrationInformation === undefined) {
            throw new runtime.RequiredError('registrationInformation','Required parameter requestParameters.registrationInformation was null or undefined when calling registerUser.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["X-CSRF-TOKEN"] = this.configuration.apiKey("X-CSRF-TOKEN"); // csrf authentication
        }

        const response = await this.request({
            path: `/user`,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: RegistrationInformationToJSON(requestParameters.registrationInformation),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => GenericSuccessMessageFromJSON(jsonValue));
    }

    /**
     * registration
     */
    async registerUser(requestParameters: RegisterUserRequest): Promise<GenericSuccessMessage> {
        const response = await this.registerUserRaw(requestParameters);
        return await response.value();
    }

    /**
     * parameter contains encrypted client settings
     * change client settings of current user
     */
    async setUserSettingsRaw(requestParameters: SetUserSettingsRequest): Promise<runtime.ApiResponse<GenericSuccessMessage>> {
        if (requestParameters.userSettings === null || requestParameters.userSettings === undefined) {
            throw new runtime.RequiredError('userSettings','Required parameter requestParameters.userSettings was null or undefined when calling setUserSettings.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["X-CSRF-TOKEN"] = this.configuration.apiKey("X-CSRF-TOKEN"); // csrf authentication
        }

        const response = await this.request({
            path: `/user/settings`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: UserSettingsToJSON(requestParameters.userSettings),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => GenericSuccessMessageFromJSON(jsonValue));
    }

    /**
     * parameter contains encrypted client settings
     * change client settings of current user
     */
    async setUserSettings(requestParameters: SetUserSettingsRequest): Promise<GenericSuccessMessage> {
        const response = await this.setUserSettingsRaw(requestParameters);
        return await response.value();
    }

}
