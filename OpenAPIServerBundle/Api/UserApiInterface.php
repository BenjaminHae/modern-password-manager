<?php
/**
 * UserApiInterface
 * PHP version 7.1.3
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
     * @param  OpenAPI\Server\Model\ChangePassword $changePassword  ChangePassword Object (required)
     * @param  integer $responseCode     The HTTP response code to return
     * @param  array   $responseHeaders  Additional HTTP headers to return with the response ()
     *
     * @return OpenAPI\Server\Model\GenericSuccessMessage
     *
     */
    public function changePassword(ChangePassword $changePassword, &$responseCode, array &$responseHeaders);

    /**
     * Operation createUserWebAuthn
     *
     * add a webauthn credential
     *
     * @param  OpenAPI\Server\Model\UserWebAuthnCreateWithKey $userWebAuthnCreateWithKey  WebAuthnCreate Object (required)
     * @param  integer $responseCode     The HTTP response code to return
     * @param  array   $responseHeaders  Additional HTTP headers to return with the response ()
     *
     * @return OpenAPI\Server\Model\GenericSuccessMessage
     *
     */
    public function createUserWebAuthn(UserWebAuthnCreateWithKey $userWebAuthnCreateWithKey, &$responseCode, array &$responseHeaders);

    /**
     * Operation deleteUserWebAuthn
     *
     * Delete a stored WebAuthn Public Key
     *
     * @param  int $id  The id of the WebAuthn Public Key to delete (required)
     * @param  integer $responseCode     The HTTP response code to return
     * @param  array   $responseHeaders  Additional HTTP headers to return with the response ()
     *
     * @return OpenAPI\Server\Model\UserWebAuthnCred[]
     *
     */
    public function deleteUserWebAuthn($id, &$responseCode, array &$responseHeaders);

    /**
     * Operation getUserHistory
     *
     * Returns a history of successful and failed logins
     *
     * @param  integer $responseCode     The HTTP response code to return
     * @param  array   $responseHeaders  Additional HTTP headers to return with the response ()
     *
     * @return OpenAPI\Server\Model\HistoryItem[]
     *
     */
    public function getUserHistory(&$responseCode, array &$responseHeaders);

    /**
     * Operation getUserSettings
     *
     * Returns the client settings of the current user
     *
     * @param  integer $responseCode     The HTTP response code to return
     * @param  array   $responseHeaders  Additional HTTP headers to return with the response ()
     *
     * @return OpenAPI\Server\Model\UserSettings
     *
     */
    public function getUserSettings(&$responseCode, array &$responseHeaders);

    /**
     * Operation getUserWebAuthnCreds
     *
     * get all registered WebAuthn credentials for the user
     *
     * @param  integer $responseCode     The HTTP response code to return
     * @param  array   $responseHeaders  Additional HTTP headers to return with the response ()
     *
     * @return OpenAPI\Server\Model\UserWebAuthnCred[]
     *
     */
    public function getUserWebAuthnCreds(&$responseCode, array &$responseHeaders);

    /**
     * Operation loginUser
     *
     * login
     *
     * @param  OpenAPI\Server\Model\LogonInformation $logonInformation  Logon Object (required)
     * @param  integer $responseCode     The HTTP response code to return
     * @param  array   $responseHeaders  Additional HTTP headers to return with the response ()
     *
     * @return OpenAPI\Server\Model\LogonResult
     *
     */
    public function loginUser(LogonInformation $logonInformation, &$responseCode, array &$responseHeaders);

    /**
     * Operation loginUserWebAuthnChallenge
     *
     * get WebAuthn challenge
     *
     * @param  integer $responseCode     The HTTP response code to return
     * @param  array   $responseHeaders  Additional HTTP headers to return with the response ()
     *
     * @return OpenAPI\Server\Model\UserWebAuthnChallenge
     *
     */
    public function loginUserWebAuthnChallenge(&$responseCode, array &$responseHeaders);

    /**
     * Operation loginUserWebAuthnGet
     *
     * login user with WebAuthn
     *
     * @param  OpenAPI\Server\Model\UserWebAuthnGet $userWebAuthnGet  WebAuthnGet Object (required)
     * @param  integer $responseCode     The HTTP response code to return
     * @param  array   $responseHeaders  Additional HTTP headers to return with the response ()
     *
     * @return OpenAPI\Server\Model\UserWebAuthnLogonResult
     *
     */
    public function loginUserWebAuthnGet(UserWebAuthnGet $userWebAuthnGet, &$responseCode, array &$responseHeaders);

    /**
     * Operation logoutUser
     *
     * Logs out current logged in user session
     *
     * @param  integer $responseCode     The HTTP response code to return
     * @param  array   $responseHeaders  Additional HTTP headers to return with the response ()
     *
     * @return OpenAPI\Server\Model\GenericSuccessMessage
     *
     */
    public function logoutUser(&$responseCode, array &$responseHeaders);

    /**
     * Operation registerUser
     *
     * registration
     *
     * @param  OpenAPI\Server\Model\RegistrationInformation $registrationInformation  Registration Object (required)
     * @param  integer $responseCode     The HTTP response code to return
     * @param  array   $responseHeaders  Additional HTTP headers to return with the response ()
     *
     * @return OpenAPI\Server\Model\GenericSuccessMessage
     *
     */
    public function registerUser(RegistrationInformation $registrationInformation, &$responseCode, array &$responseHeaders);

    /**
     * Operation setUserSettings
     *
     * change client settings of current user
     *
     * @param  OpenAPI\Server\Model\UserSettings $userSettings  Settings Object (required)
     * @param  integer $responseCode     The HTTP response code to return
     * @param  array   $responseHeaders  Additional HTTP headers to return with the response ()
     *
     * @return OpenAPI\Server\Model\GenericSuccessMessage
     *
     */
    public function setUserSettings(UserSettings $userSettings, &$responseCode, array &$responseHeaders);
}
