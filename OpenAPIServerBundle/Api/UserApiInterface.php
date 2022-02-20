<?php
/**
 * UserApiInterface
 *
 * PHP version 8.1.1
 *
 * @category Class
 * @package  OpenAPI\Server
 * @author   OpenAPI Generator team
 * @link     https://github.com/openapitools/openapi-generator
 */

/**
 * Password Manager
 *
 * This is a password manager server.
 *
 * The version of the OpenAPI document: 0.0.1
 * Contact: test@te.st
 * Generated by: https://github.com/openapitools/openapi-generator.git
 *
 */

/**
 * NOTE: This class is auto generated by the openapi generator program.
 * https://github.com/openapitools/openapi-generator
 * Do not edit the class manually.
 */

namespace OpenAPI\Server\Api;

use Symfony\Component\HttpFoundation\File\UploadedFile;
use OpenAPI\Server\Model\ChangePassword;
use OpenAPI\Server\Model\GenericSuccessMessage;
use OpenAPI\Server\Model\HistoryItem;
use OpenAPI\Server\Model\LogonInformation;
use OpenAPI\Server\Model\LogonResult;
use OpenAPI\Server\Model\RegistrationInformation;
use OpenAPI\Server\Model\UserSettings;
use OpenAPI\Server\Model\UserWebAuthnChallenge;
use OpenAPI\Server\Model\UserWebAuthnCreateWithKey;
use OpenAPI\Server\Model\UserWebAuthnCred;
use OpenAPI\Server\Model\UserWebAuthnGet;
use OpenAPI\Server\Model\UserWebAuthnLogonResult;

/**
 * UserApiInterface Interface Doc Comment
 *
 * @category Interface
 * @package  OpenAPI\Server\Api
 * @author   OpenAPI Generator team
 * @link     https://github.com/openapitools/openapi-generator
 */
interface UserApiInterface
{

    /**
     * Sets authentication method csrf
     *
     * @param string $value Value of the csrf authentication method.
     *
     * @return void
     */
    public function setcsrf($value);

    /**
     * Operation changePassword
     *
     * change user password
     *
     * @param  \OpenAPI\Server\Model\ChangePassword $changePassword  ChangePassword Object (required)
     * @param  \array   $responseHeaders  Additional HTTP headers to return with the response ()
     *
     * @return \OpenAPI\Server\Model\GenericSuccessMessage
     */
    public function changePassword(ChangePassword $changePassword, &$responseCode, array &$responseHeaders): \OpenAPI\Server\Model\GenericSuccessMessage;


    /**
     * Operation createUserWebAuthn
     *
     * add a webauthn credential
     *
     * @param  \OpenAPI\Server\Model\UserWebAuthnCreateWithKey $userWebAuthnCreateWithKey  WebAuthnCreate Object (required)
     * @param  \array   $responseHeaders  Additional HTTP headers to return with the response ()
     *
     * @return \OpenAPI\Server\Model\GenericSuccessMessage
     */
    public function createUserWebAuthn(UserWebAuthnCreateWithKey $userWebAuthnCreateWithKey, &$responseCode, array &$responseHeaders): \OpenAPI\Server\Model\GenericSuccessMessage;


    /**
     * Operation deleteUserWebAuthn
     *
     * Delete a stored WebAuthn Public Key
     *
     * @param  \int $id  The index of the WebAuthn Public Key to delete (not the public key id) (required)
     * @param  \array   $responseHeaders  Additional HTTP headers to return with the response ()
     *
     * @return \OpenAPI\Server\Model\UserWebAuthnCred[]
     */
    public function deleteUserWebAuthn($id, &$responseCode, array &$responseHeaders): array;


    /**
     * Operation getUserHistory
     *
     * Returns a history of successful and failed logins
     *
     * @param  \array   $responseHeaders  Additional HTTP headers to return with the response ()
     *
     * @return \OpenAPI\Server\Model\HistoryItem[]
     */
    public function getUserHistory(&$responseCode, array &$responseHeaders): array;


    /**
     * Operation getUserSettings
     *
     * Returns the client settings of the current user
     *
     * @param  \array   $responseHeaders  Additional HTTP headers to return with the response ()
     *
     * @return \OpenAPI\Server\Model\UserSettings
     */
    public function getUserSettings(&$responseCode, array &$responseHeaders): \OpenAPI\Server\Model\UserSettings;


    /**
     * Operation getUserWebAuthnCreds
     *
     * get all registered WebAuthn credentials for the user
     *
     * @param  \array   $responseHeaders  Additional HTTP headers to return with the response ()
     *
     * @return \OpenAPI\Server\Model\UserWebAuthnCred[]
     */
    public function getUserWebAuthnCreds(&$responseCode, array &$responseHeaders): array;


    /**
     * Operation loginUser
     *
     * login
     *
     * @param  \OpenAPI\Server\Model\LogonInformation $logonInformation  Logon Object (required)
     * @param  \array   $responseHeaders  Additional HTTP headers to return with the response ()
     *
     * @return \OpenAPI\Server\Model\LogonResult
     */
    public function loginUser(LogonInformation $logonInformation, &$responseCode, array &$responseHeaders): \OpenAPI\Server\Model\LogonResult;


    /**
     * Operation loginUserWebAuthnChallenge
     *
     * get a WebAuthN challenge
     *
     * @param  \array   $responseHeaders  Additional HTTP headers to return with the response ()
     *
     * @return \OpenAPI\Server\Model\UserWebAuthnChallenge
     */
    public function loginUserWebAuthnChallenge(&$responseCode, array &$responseHeaders): \OpenAPI\Server\Model\UserWebAuthnChallenge;


    /**
     * Operation loginUserWebAuthnGet
     *
     * login user with WebAuthn
     *
     * @param  \OpenAPI\Server\Model\UserWebAuthnGet $userWebAuthnGet  WebAuthnGet Object (required)
     * @param  \array   $responseHeaders  Additional HTTP headers to return with the response ()
     *
     * @return \OpenAPI\Server\Model\UserWebAuthnLogonResult
     */
    public function loginUserWebAuthnGet(UserWebAuthnGet $userWebAuthnGet, &$responseCode, array &$responseHeaders): \OpenAPI\Server\Model\UserWebAuthnLogonResult;


    /**
     * Operation logoutUser
     *
     * Logs out current logged in user session
     *
     * @param  \array   $responseHeaders  Additional HTTP headers to return with the response ()
     *
     * @return \OpenAPI\Server\Model\GenericSuccessMessage
     */
    public function logoutUser(&$responseCode, array &$responseHeaders): \OpenAPI\Server\Model\GenericSuccessMessage;


    /**
     * Operation registerUser
     *
     * registration
     *
     * @param  \OpenAPI\Server\Model\RegistrationInformation $registrationInformation  Registration Object (required)
     * @param  \array   $responseHeaders  Additional HTTP headers to return with the response ()
     *
     * @return \OpenAPI\Server\Model\GenericSuccessMessage
     */
    public function registerUser(RegistrationInformation $registrationInformation, &$responseCode, array &$responseHeaders): \OpenAPI\Server\Model\GenericSuccessMessage;


    /**
     * Operation setUserSettings
     *
     * change client settings of current user
     *
     * @param  \OpenAPI\Server\Model\UserSettings $userSettings  Settings Object (required)
     * @param  \array   $responseHeaders  Additional HTTP headers to return with the response ()
     *
     * @return \OpenAPI\Server\Model\GenericSuccessMessage
     */
    public function setUserSettings(UserSettings $userSettings, &$responseCode, array &$responseHeaders): \OpenAPI\Server\Model\GenericSuccessMessage;

}
