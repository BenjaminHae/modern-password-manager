<?php

/**
 * UserController
 * PHP version 7.1.3
 *
 * @category Class
 * @package  OpenAPI\Server\Controller
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

namespace OpenAPI\Server\Controller;

use \Exception;
use JMS\Serializer\Exception\RuntimeException as SerializerRuntimeException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\Validator\Constraints as Assert;
use OpenAPI\Server\Api\UserApiInterface;
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
 * UserController Class Doc Comment
 *
 * @category Class
 * @package  OpenAPI\Server\Controller
 * @author   OpenAPI Generator team
 * @link     https://github.com/openapitools/openapi-generator
 */
class UserController extends Controller
{

    /**
     * Operation changePassword
     *
     * change user password
     *
     * @param Request $request The Symfony request to handle.
     * @return Response The Symfony response.
     */
    public function changePasswordAction(Request $request)
    {
        // Make sure that the client is providing something that we can consume
        $consumes = ['application/json'];
        if (!static::isContentTypeAllowed($request, $consumes)) {
            // We can't consume the content that the client is sending us
            return new Response('', 415);
        }

        // Figure out what data format to return to the client
        $produces = ['application/json'];
        // Figure out what the client accepts
        $clientAccepts = $request->headers->has('Accept')?$request->headers->get('Accept'):'*/*';
        $responseFormat = $this->getOutputFormat($clientAccepts, $produces);
        if ($responseFormat === null) {
            return new Response('', 406);
        }

        // Handle authentication
        // Authentication 'csrf' required
        // Set key with prefix in header
        $securitycsrf = $request->headers->get('X-CSRF-TOKEN');

        // Read out all input parameter values into variables
        $changePassword = $request->getContent();

        // Use the default value if no value was provided

        // Deserialize the input values that needs it
        try {
            $inputFormat = $request->getMimeType($request->getContentType());
            $changePassword = $this->deserialize($changePassword, 'OpenAPI\Server\Model\ChangePassword', $inputFormat);
        } catch (SerializerRuntimeException $exception) {
            return $this->createBadRequestResponse($exception->getMessage());
        }

        // Validate the input values
        $asserts = [];
        $asserts[] = new Assert\NotNull();
        $asserts[] = new Assert\Type("OpenAPI\Server\Model\ChangePassword");
        $asserts[] = new Assert\Valid();
        $response = $this->validate($changePassword, $asserts);
        if ($response instanceof Response) {
            return $response;
        }


        try {
            $handler = $this->getApiHandler();

            // Set authentication method 'csrf'
            $handler->setcsrf($securitycsrf);

            // Make the call to the business logic
            $responseCode = 200;
            $responseHeaders = [];
            $result = $handler->changePassword($changePassword, $responseCode, $responseHeaders);

            // Find default response message
            $message = '';

            // Find a more specific message, if available
            switch ($responseCode) {
                case 200:
                    $message = 'OK';
                    break;
                case 403:
                    $message = 'Unauthorized';
                    break;
            }

            return new Response(
                $result !== null ?$this->serialize($result, $responseFormat):'',
                $responseCode,
                array_merge(
                    $responseHeaders,
                    [
                        'Content-Type' => $responseFormat,
                        'X-OpenAPI-Message' => $message
                    ]
                )
            );
        } catch (Exception $fallthrough) {
            return $this->createErrorResponse(new HttpException(500, 'An unsuspected error occurred.', $fallthrough));
        }
    }

    /**
     * Operation createUserWebAuthn
     *
     * add a webauthn credential
     *
     * @param Request $request The Symfony request to handle.
     * @return Response The Symfony response.
     */
    public function createUserWebAuthnAction(Request $request)
    {
        // Make sure that the client is providing something that we can consume
        $consumes = ['application/json'];
        if (!static::isContentTypeAllowed($request, $consumes)) {
            // We can't consume the content that the client is sending us
            return new Response('', 415);
        }

        // Figure out what data format to return to the client
        $produces = ['application/json'];
        // Figure out what the client accepts
        $clientAccepts = $request->headers->has('Accept')?$request->headers->get('Accept'):'*/*';
        $responseFormat = $this->getOutputFormat($clientAccepts, $produces);
        if ($responseFormat === null) {
            return new Response('', 406);
        }

        // Handle authentication
        // Authentication 'csrf' required
        // Set key with prefix in header
        $securitycsrf = $request->headers->get('X-CSRF-TOKEN');

        // Read out all input parameter values into variables
        $userWebAuthnCreateWithKey = $request->getContent();

        // Use the default value if no value was provided

        // Deserialize the input values that needs it
        try {
            $inputFormat = $request->getMimeType($request->getContentType());
            $userWebAuthnCreateWithKey = $this->deserialize($userWebAuthnCreateWithKey, 'OpenAPI\Server\Model\UserWebAuthnCreateWithKey', $inputFormat);
        } catch (SerializerRuntimeException $exception) {
            return $this->createBadRequestResponse($exception->getMessage());
        }

        // Validate the input values
        $asserts = [];
        $asserts[] = new Assert\NotNull();
        $asserts[] = new Assert\Type("OpenAPI\Server\Model\UserWebAuthnCreateWithKey");
        $asserts[] = new Assert\Valid();
        $response = $this->validate($userWebAuthnCreateWithKey, $asserts);
        if ($response instanceof Response) {
            return $response;
        }


        try {
            $handler = $this->getApiHandler();

            // Set authentication method 'csrf'
            $handler->setcsrf($securitycsrf);

            // Make the call to the business logic
            $responseCode = 200;
            $responseHeaders = [];
            $result = $handler->createUserWebAuthn($userWebAuthnCreateWithKey, $responseCode, $responseHeaders);

            // Find default response message
            $message = '';

            // Find a more specific message, if available
            switch ($responseCode) {
                case 200:
                    $message = 'OK';
                    break;
                case 403:
                    $message = 'Unauthorized';
                    break;
            }

            return new Response(
                $result !== null ?$this->serialize($result, $responseFormat):'',
                $responseCode,
                array_merge(
                    $responseHeaders,
                    [
                        'Content-Type' => $responseFormat,
                        'X-OpenAPI-Message' => $message
                    ]
                )
            );
        } catch (Exception $fallthrough) {
            return $this->createErrorResponse(new HttpException(500, 'An unsuspected error occurred.', $fallthrough));
        }
    }

    /**
     * Operation deleteUserWebAuthn
     *
     * Delete a stored WebAuthn Public Key
     *
     * @param Request $request The Symfony request to handle.
     * @return Response The Symfony response.
     */
    public function deleteUserWebAuthnAction(Request $request, $id)
    {
        // Figure out what data format to return to the client
        $produces = ['application/json'];
        // Figure out what the client accepts
        $clientAccepts = $request->headers->has('Accept')?$request->headers->get('Accept'):'*/*';
        $responseFormat = $this->getOutputFormat($clientAccepts, $produces);
        if ($responseFormat === null) {
            return new Response('', 406);
        }

        // Handle authentication

        // Read out all input parameter values into variables

        // Use the default value if no value was provided

        // Deserialize the input values that needs it
        try {
            $id = $this->deserialize($id, 'int', 'string');
        } catch (SerializerRuntimeException $exception) {
            return $this->createBadRequestResponse($exception->getMessage());
        }

        // Validate the input values
        $asserts = [];
        $asserts[] = new Assert\NotNull();
        $asserts[] = new Assert\Type("int");
        $response = $this->validate($id, $asserts);
        if ($response instanceof Response) {
            return $response;
        }


        try {
            $handler = $this->getApiHandler();


            // Make the call to the business logic
            $responseCode = 200;
            $responseHeaders = [];
            $result = $handler->deleteUserWebAuthn($id, $responseCode, $responseHeaders);

            // Find default response message
            $message = '';

            // Find a more specific message, if available
            switch ($responseCode) {
                case 200:
                    $message = 'successful operation';
                    break;
                case 400:
                    $message = 'Invalid status value';
                    break;
                case 403:
                    $message = 'Unauthorized';
                    break;
            }

            return new Response(
                $result !== null ?$this->serialize($result, $responseFormat):'',
                $responseCode,
                array_merge(
                    $responseHeaders,
                    [
                        'Content-Type' => $responseFormat,
                        'X-OpenAPI-Message' => $message
                    ]
                )
            );
        } catch (Exception $fallthrough) {
            return $this->createErrorResponse(new HttpException(500, 'An unsuspected error occurred.', $fallthrough));
        }
    }

    /**
     * Operation getUserHistory
     *
     * Returns a history of successful and failed logins
     *
     * @param Request $request The Symfony request to handle.
     * @return Response The Symfony response.
     */
    public function getUserHistoryAction(Request $request)
    {
        // Figure out what data format to return to the client
        $produces = ['application/json'];
        // Figure out what the client accepts
        $clientAccepts = $request->headers->has('Accept')?$request->headers->get('Accept'):'*/*';
        $responseFormat = $this->getOutputFormat($clientAccepts, $produces);
        if ($responseFormat === null) {
            return new Response('', 406);
        }

        // Handle authentication

        // Read out all input parameter values into variables

        // Use the default value if no value was provided

        // Validate the input values


        try {
            $handler = $this->getApiHandler();


            // Make the call to the business logic
            $responseCode = 200;
            $responseHeaders = [];
            $result = $handler->getUserHistory($responseCode, $responseHeaders);

            // Find default response message
            $message = '';

            // Find a more specific message, if available
            switch ($responseCode) {
                case 200:
                    $message = 'Array of logins';
                    break;
                case 403:
                    $message = 'Unauthorized';
                    break;
            }

            return new Response(
                $result !== null ?$this->serialize($result, $responseFormat):'',
                $responseCode,
                array_merge(
                    $responseHeaders,
                    [
                        'Content-Type' => $responseFormat,
                        'X-OpenAPI-Message' => $message
                    ]
                )
            );
        } catch (Exception $fallthrough) {
            return $this->createErrorResponse(new HttpException(500, 'An unsuspected error occurred.', $fallthrough));
        }
    }

    /**
     * Operation getUserSettings
     *
     * Returns the client settings of the current user
     *
     * @param Request $request The Symfony request to handle.
     * @return Response The Symfony response.
     */
    public function getUserSettingsAction(Request $request)
    {
        // Figure out what data format to return to the client
        $produces = ['application/json'];
        // Figure out what the client accepts
        $clientAccepts = $request->headers->has('Accept')?$request->headers->get('Accept'):'*/*';
        $responseFormat = $this->getOutputFormat($clientAccepts, $produces);
        if ($responseFormat === null) {
            return new Response('', 406);
        }

        // Handle authentication

        // Read out all input parameter values into variables

        // Use the default value if no value was provided

        // Validate the input values


        try {
            $handler = $this->getApiHandler();


            // Make the call to the business logic
            $responseCode = 200;
            $responseHeaders = [];
            $result = $handler->getUserSettings($responseCode, $responseHeaders);

            // Find default response message
            $message = '';

            // Find a more specific message, if available
            switch ($responseCode) {
                case 200:
                    $message = 'stored client values (encrypted string that contains a JSON)';
                    break;
                case 403:
                    $message = 'Unauthorized';
                    break;
            }

            return new Response(
                $result !== null ?$this->serialize($result, $responseFormat):'',
                $responseCode,
                array_merge(
                    $responseHeaders,
                    [
                        'Content-Type' => $responseFormat,
                        'X-OpenAPI-Message' => $message
                    ]
                )
            );
        } catch (Exception $fallthrough) {
            return $this->createErrorResponse(new HttpException(500, 'An unsuspected error occurred.', $fallthrough));
        }
    }

    /**
     * Operation getUserWebAuthnCreds
     *
     * get all registered WebAuthn credentials for the user
     *
     * @param Request $request The Symfony request to handle.
     * @return Response The Symfony response.
     */
    public function getUserWebAuthnCredsAction(Request $request)
    {
        // Figure out what data format to return to the client
        $produces = ['application/json'];
        // Figure out what the client accepts
        $clientAccepts = $request->headers->has('Accept')?$request->headers->get('Accept'):'*/*';
        $responseFormat = $this->getOutputFormat($clientAccepts, $produces);
        if ($responseFormat === null) {
            return new Response('', 406);
        }

        // Handle authentication

        // Read out all input parameter values into variables

        // Use the default value if no value was provided

        // Validate the input values


        try {
            $handler = $this->getApiHandler();


            // Make the call to the business logic
            $responseCode = 200;
            $responseHeaders = [];
            $result = $handler->getUserWebAuthnCreds($responseCode, $responseHeaders);

            // Find default response message
            $message = '';

            // Find a more specific message, if available
            switch ($responseCode) {
                case 200:
                    $message = 'list of stored WebAuthn credentials';
                    break;
                case 403:
                    $message = 'Unauthorized';
                    break;
            }

            return new Response(
                $result !== null ?$this->serialize($result, $responseFormat):'',
                $responseCode,
                array_merge(
                    $responseHeaders,
                    [
                        'Content-Type' => $responseFormat,
                        'X-OpenAPI-Message' => $message
                    ]
                )
            );
        } catch (Exception $fallthrough) {
            return $this->createErrorResponse(new HttpException(500, 'An unsuspected error occurred.', $fallthrough));
        }
    }

    /**
     * Operation loginUser
     *
     * login
     *
     * @param Request $request The Symfony request to handle.
     * @return Response The Symfony response.
     */
    public function loginUserAction(Request $request)
    {
        // Make sure that the client is providing something that we can consume
        $consumes = ['application/json'];
        if (!static::isContentTypeAllowed($request, $consumes)) {
            // We can't consume the content that the client is sending us
            return new Response('', 415);
        }

        // Figure out what data format to return to the client
        $produces = ['application/json'];
        // Figure out what the client accepts
        $clientAccepts = $request->headers->has('Accept')?$request->headers->get('Accept'):'*/*';
        $responseFormat = $this->getOutputFormat($clientAccepts, $produces);
        if ($responseFormat === null) {
            return new Response('', 406);
        }

        // Handle authentication
        // Authentication 'csrf' required
        // Set key with prefix in header
        $securitycsrf = $request->headers->get('X-CSRF-TOKEN');

        // Read out all input parameter values into variables
        $logonInformation = $request->getContent();

        // Use the default value if no value was provided

        // Deserialize the input values that needs it
        try {
            $inputFormat = $request->getMimeType($request->getContentType());
            $logonInformation = $this->deserialize($logonInformation, 'OpenAPI\Server\Model\LogonInformation', $inputFormat);
        } catch (SerializerRuntimeException $exception) {
            return $this->createBadRequestResponse($exception->getMessage());
        }

        // Validate the input values
        $asserts = [];
        $asserts[] = new Assert\NotNull();
        $asserts[] = new Assert\Type("OpenAPI\Server\Model\LogonInformation");
        $asserts[] = new Assert\Valid();
        $response = $this->validate($logonInformation, $asserts);
        if ($response instanceof Response) {
            return $response;
        }


        try {
            $handler = $this->getApiHandler();

            // Set authentication method 'csrf'
            $handler->setcsrf($securitycsrf);

            // Make the call to the business logic
            $responseCode = 200;
            $responseHeaders = [];
            $result = $handler->loginUser($logonInformation, $responseCode, $responseHeaders);

            // Find default response message
            $message = '';

            // Find a more specific message, if available
            switch ($responseCode) {
                case 200:
                    $message = 'OK';
                    break;
                case 405:
                    $message = 'Invalid input';
                    break;
            }

            return new Response(
                $result !== null ?$this->serialize($result, $responseFormat):'',
                $responseCode,
                array_merge(
                    $responseHeaders,
                    [
                        'Content-Type' => $responseFormat,
                        'X-OpenAPI-Message' => $message
                    ]
                )
            );
        } catch (Exception $fallthrough) {
            return $this->createErrorResponse(new HttpException(500, 'An unsuspected error occurred.', $fallthrough));
        }
    }

    /**
     * Operation loginUserWebAuthnChallenge
     *
     * get a WebAuthN challenge
     *
     * @param Request $request The Symfony request to handle.
     * @return Response The Symfony response.
     */
    public function loginUserWebAuthnChallengeAction(Request $request)
    {
        // Figure out what data format to return to the client
        $produces = ['application/json'];
        // Figure out what the client accepts
        $clientAccepts = $request->headers->has('Accept')?$request->headers->get('Accept'):'*/*';
        $responseFormat = $this->getOutputFormat($clientAccepts, $produces);
        if ($responseFormat === null) {
            return new Response('', 406);
        }

        // Handle authentication

        // Read out all input parameter values into variables

        // Use the default value if no value was provided

        // Validate the input values


        try {
            $handler = $this->getApiHandler();


            // Make the call to the business logic
            $responseCode = 200;
            $responseHeaders = [];
            $result = $handler->loginUserWebAuthnChallenge($responseCode, $responseHeaders);

            // Find default response message
            $message = '';

            // Find a more specific message, if available
            switch ($responseCode) {
                case 200:
                    $message = 'returns a challenge that can be used exactly once and is only valid until a new challenge is generated';
                    break;
            }

            return new Response(
                $result !== null ?$this->serialize($result, $responseFormat):'',
                $responseCode,
                array_merge(
                    $responseHeaders,
                    [
                        'Content-Type' => $responseFormat,
                        'X-OpenAPI-Message' => $message
                    ]
                )
            );
        } catch (Exception $fallthrough) {
            return $this->createErrorResponse(new HttpException(500, 'An unsuspected error occurred.', $fallthrough));
        }
    }

    /**
     * Operation loginUserWebAuthnGet
     *
     * login user with WebAuthn
     *
     * @param Request $request The Symfony request to handle.
     * @return Response The Symfony response.
     */
    public function loginUserWebAuthnGetAction(Request $request)
    {
        // Make sure that the client is providing something that we can consume
        $consumes = ['application/json'];
        if (!static::isContentTypeAllowed($request, $consumes)) {
            // We can't consume the content that the client is sending us
            return new Response('', 415);
        }

        // Figure out what data format to return to the client
        $produces = ['application/json'];
        // Figure out what the client accepts
        $clientAccepts = $request->headers->has('Accept')?$request->headers->get('Accept'):'*/*';
        $responseFormat = $this->getOutputFormat($clientAccepts, $produces);
        if ($responseFormat === null) {
            return new Response('', 406);
        }

        // Handle authentication
        // Authentication 'csrf' required
        // Set key with prefix in header
        $securitycsrf = $request->headers->get('X-CSRF-TOKEN');

        // Read out all input parameter values into variables
        $userWebAuthnGet = $request->getContent();

        // Use the default value if no value was provided

        // Deserialize the input values that needs it
        try {
            $inputFormat = $request->getMimeType($request->getContentType());
            $userWebAuthnGet = $this->deserialize($userWebAuthnGet, 'OpenAPI\Server\Model\UserWebAuthnGet', $inputFormat);
        } catch (SerializerRuntimeException $exception) {
            return $this->createBadRequestResponse($exception->getMessage());
        }

        // Validate the input values
        $asserts = [];
        $asserts[] = new Assert\NotNull();
        $asserts[] = new Assert\Type("OpenAPI\Server\Model\UserWebAuthnGet");
        $asserts[] = new Assert\Valid();
        $response = $this->validate($userWebAuthnGet, $asserts);
        if ($response instanceof Response) {
            return $response;
        }


        try {
            $handler = $this->getApiHandler();

            // Set authentication method 'csrf'
            $handler->setcsrf($securitycsrf);

            // Make the call to the business logic
            $responseCode = 200;
            $responseHeaders = [];
            $result = $handler->loginUserWebAuthnGet($userWebAuthnGet, $responseCode, $responseHeaders);

            // Find default response message
            $message = '';

            // Find a more specific message, if available
            switch ($responseCode) {
                case 200:
                    $message = 'OK';
                    break;
                case 405:
                    $message = 'Invalid input';
                    break;
            }

            return new Response(
                $result !== null ?$this->serialize($result, $responseFormat):'',
                $responseCode,
                array_merge(
                    $responseHeaders,
                    [
                        'Content-Type' => $responseFormat,
                        'X-OpenAPI-Message' => $message
                    ]
                )
            );
        } catch (Exception $fallthrough) {
            return $this->createErrorResponse(new HttpException(500, 'An unsuspected error occurred.', $fallthrough));
        }
    }

    /**
     * Operation logoutUser
     *
     * Logs out current logged in user session
     *
     * @param Request $request The Symfony request to handle.
     * @return Response The Symfony response.
     */
    public function logoutUserAction(Request $request)
    {
        // Figure out what data format to return to the client
        $produces = ['application/json'];
        // Figure out what the client accepts
        $clientAccepts = $request->headers->has('Accept')?$request->headers->get('Accept'):'*/*';
        $responseFormat = $this->getOutputFormat($clientAccepts, $produces);
        if ($responseFormat === null) {
            return new Response('', 406);
        }

        // Handle authentication

        // Read out all input parameter values into variables

        // Use the default value if no value was provided

        // Validate the input values


        try {
            $handler = $this->getApiHandler();


            // Make the call to the business logic
            $responseCode = 200;
            $responseHeaders = [];
            $result = $handler->logoutUser($responseCode, $responseHeaders);

            // Find default response message
            $message = '';

            // Find a more specific message, if available
            switch ($responseCode) {
                case 200:
                    $message = 'OK';
                    break;
            }

            return new Response(
                $result !== null ?$this->serialize($result, $responseFormat):'',
                $responseCode,
                array_merge(
                    $responseHeaders,
                    [
                        'Content-Type' => $responseFormat,
                        'X-OpenAPI-Message' => $message
                    ]
                )
            );
        } catch (Exception $fallthrough) {
            return $this->createErrorResponse(new HttpException(500, 'An unsuspected error occurred.', $fallthrough));
        }
    }

    /**
     * Operation registerUser
     *
     * registration
     *
     * @param Request $request The Symfony request to handle.
     * @return Response The Symfony response.
     */
    public function registerUserAction(Request $request)
    {
        // Make sure that the client is providing something that we can consume
        $consumes = ['application/json'];
        if (!static::isContentTypeAllowed($request, $consumes)) {
            // We can't consume the content that the client is sending us
            return new Response('', 415);
        }

        // Figure out what data format to return to the client
        $produces = ['application/json'];
        // Figure out what the client accepts
        $clientAccepts = $request->headers->has('Accept')?$request->headers->get('Accept'):'*/*';
        $responseFormat = $this->getOutputFormat($clientAccepts, $produces);
        if ($responseFormat === null) {
            return new Response('', 406);
        }

        // Handle authentication
        // Authentication 'csrf' required
        // Set key with prefix in header
        $securitycsrf = $request->headers->get('X-CSRF-TOKEN');

        // Read out all input parameter values into variables
        $registrationInformation = $request->getContent();

        // Use the default value if no value was provided

        // Deserialize the input values that needs it
        try {
            $inputFormat = $request->getMimeType($request->getContentType());
            $registrationInformation = $this->deserialize($registrationInformation, 'OpenAPI\Server\Model\RegistrationInformation', $inputFormat);
        } catch (SerializerRuntimeException $exception) {
            return $this->createBadRequestResponse($exception->getMessage());
        }

        // Validate the input values
        $asserts = [];
        $asserts[] = new Assert\NotNull();
        $asserts[] = new Assert\Type("OpenAPI\Server\Model\RegistrationInformation");
        $asserts[] = new Assert\Valid();
        $response = $this->validate($registrationInformation, $asserts);
        if ($response instanceof Response) {
            return $response;
        }


        try {
            $handler = $this->getApiHandler();

            // Set authentication method 'csrf'
            $handler->setcsrf($securitycsrf);

            // Make the call to the business logic
            $responseCode = 200;
            $responseHeaders = [];
            $result = $handler->registerUser($registrationInformation, $responseCode, $responseHeaders);

            // Find default response message
            $message = '';

            // Find a more specific message, if available
            switch ($responseCode) {
                case 200:
                    $message = 'successful operation';
                    break;
                case 405:
                    $message = 'Invalid input';
                    break;
            }

            return new Response(
                $result !== null ?$this->serialize($result, $responseFormat):'',
                $responseCode,
                array_merge(
                    $responseHeaders,
                    [
                        'Content-Type' => $responseFormat,
                        'X-OpenAPI-Message' => $message
                    ]
                )
            );
        } catch (Exception $fallthrough) {
            return $this->createErrorResponse(new HttpException(500, 'An unsuspected error occurred.', $fallthrough));
        }
    }

    /**
     * Operation setUserSettings
     *
     * change client settings of current user
     *
     * @param Request $request The Symfony request to handle.
     * @return Response The Symfony response.
     */
    public function setUserSettingsAction(Request $request)
    {
        // Make sure that the client is providing something that we can consume
        $consumes = ['application/json'];
        if (!static::isContentTypeAllowed($request, $consumes)) {
            // We can't consume the content that the client is sending us
            return new Response('', 415);
        }

        // Figure out what data format to return to the client
        $produces = ['application/json'];
        // Figure out what the client accepts
        $clientAccepts = $request->headers->has('Accept')?$request->headers->get('Accept'):'*/*';
        $responseFormat = $this->getOutputFormat($clientAccepts, $produces);
        if ($responseFormat === null) {
            return new Response('', 406);
        }

        // Handle authentication
        // Authentication 'csrf' required
        // Set key with prefix in header
        $securitycsrf = $request->headers->get('X-CSRF-TOKEN');

        // Read out all input parameter values into variables
        $userSettings = $request->getContent();

        // Use the default value if no value was provided

        // Deserialize the input values that needs it
        try {
            $inputFormat = $request->getMimeType($request->getContentType());
            $userSettings = $this->deserialize($userSettings, 'OpenAPI\Server\Model\UserSettings', $inputFormat);
        } catch (SerializerRuntimeException $exception) {
            return $this->createBadRequestResponse($exception->getMessage());
        }

        // Validate the input values
        $asserts = [];
        $asserts[] = new Assert\NotNull();
        $asserts[] = new Assert\Type("OpenAPI\Server\Model\UserSettings");
        $asserts[] = new Assert\Valid();
        $response = $this->validate($userSettings, $asserts);
        if ($response instanceof Response) {
            return $response;
        }


        try {
            $handler = $this->getApiHandler();

            // Set authentication method 'csrf'
            $handler->setcsrf($securitycsrf);

            // Make the call to the business logic
            $responseCode = 200;
            $responseHeaders = [];
            $result = $handler->setUserSettings($userSettings, $responseCode, $responseHeaders);

            // Find default response message
            $message = '';

            // Find a more specific message, if available
            switch ($responseCode) {
                case 200:
                    $message = 'OK';
                    break;
                case 403:
                    $message = 'Unauthorized';
                    break;
            }

            return new Response(
                $result !== null ?$this->serialize($result, $responseFormat):'',
                $responseCode,
                array_merge(
                    $responseHeaders,
                    [
                        'Content-Type' => $responseFormat,
                        'X-OpenAPI-Message' => $message
                    ]
                )
            );
        } catch (Exception $fallthrough) {
            return $this->createErrorResponse(new HttpException(500, 'An unsuspected error occurred.', $fallthrough));
        }
    }

    /**
     * Returns the handler for this API controller.
     * @return UserApiInterface
     */
    public function getApiHandler()
    {
        return $this->apiServer->getApiHandler('user');
    }
}
