# OpenAPI\Server\Api\UserApiInterface

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**changePassword**](UserApiInterface.md#changePassword) | **POST** /user/changepassword | change user password
[**createUserWebAuthn**](UserApiInterface.md#createUserWebAuthn) | **POST** /user/webauthn | add a webauthn credential
[**deleteUserWebAuthn**](UserApiInterface.md#deleteUserWebAuthn) | **DELETE** /user/webauthn/{id} | Delete a stored WebAuthn Public Key
[**getUserHistory**](UserApiInterface.md#getUserHistory) | **GET** /user/history | Returns a history of successful and failed logins
[**getUserSettings**](UserApiInterface.md#getUserSettings) | **GET** /user/settings | Returns the client settings of the current user
[**getUserWebAuthnCreds**](UserApiInterface.md#getUserWebAuthnCreds) | **GET** /user/webauthn | get all registered WebAuthn credentials for the user
[**loginUser**](UserApiInterface.md#loginUser) | **POST** /user/login | login
[**loginUserWebAuthnChallenge**](UserApiInterface.md#loginUserWebAuthnChallenge) | **GET** /user/login/webauthn | get a WebAuthN challenge
[**loginUserWebAuthnGet**](UserApiInterface.md#loginUserWebAuthnGet) | **POST** /user/login/webauthn | login user with WebAuthn
[**logoutUser**](UserApiInterface.md#logoutUser) | **GET** /user/logout | Logs out current logged in user session
[**registerUser**](UserApiInterface.md#registerUser) | **PUT** /user | registration
[**setUserSettings**](UserApiInterface.md#setUserSettings) | **POST** /user/settings | change client settings of current user


## Service Declaration
```yaml
# src/Acme/MyBundle/Resources/services.yml
services:
    # ...
    acme.my_bundle.api.user:
        class: Acme\MyBundle\Api\UserApi
        tags:
            - { name: "open_api_server.api", api: "user" }
    # ...
```

## **changePassword**
> OpenAPI\Server\Model\GenericSuccessMessage changePassword($changePassword)

change user password

change password of current user and upload reencrypted accounts

### Example Implementation
```php
<?php
// src/Acme/MyBundle/Api/UserApiInterface.php

namespace Acme\MyBundle\Api;

use OpenAPI\Server\Api\UserApiInterface;

class UserApi implements UserApiInterface
{

    /**
     * Configure API key authorization: csrf
     */
    public function setcsrf($apiKey)
    {
        // Retrieve logged in user from $apiKey ...
    }

    // ...

    /**
     * Implementation of UserApiInterface#changePassword
     */
    public function changePassword(ChangePassword $changePassword)
    {
        // Implement the operation ...
    }

    // ...
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **changePassword** | [**OpenAPI\Server\Model\ChangePassword**](../Model/ChangePassword.md)| ChangePassword Object |

### Return type

[**OpenAPI\Server\Model\GenericSuccessMessage**](../Model/GenericSuccessMessage.md)

### Authorization

[csrf](../../README.md#csrf)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

## **createUserWebAuthn**
> OpenAPI\Server\Model\GenericSuccessMessage createUserWebAuthn($userWebAuthnCreateWithKey)

add a webauthn credential

add webauthn

### Example Implementation
```php
<?php
// src/Acme/MyBundle/Api/UserApiInterface.php

namespace Acme\MyBundle\Api;

use OpenAPI\Server\Api\UserApiInterface;

class UserApi implements UserApiInterface
{

    /**
     * Configure API key authorization: csrf
     */
    public function setcsrf($apiKey)
    {
        // Retrieve logged in user from $apiKey ...
    }

    // ...

    /**
     * Implementation of UserApiInterface#createUserWebAuthn
     */
    public function createUserWebAuthn(UserWebAuthnCreateWithKey $userWebAuthnCreateWithKey)
    {
        // Implement the operation ...
    }

    // ...
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userWebAuthnCreateWithKey** | [**OpenAPI\Server\Model\UserWebAuthnCreateWithKey**](../Model/UserWebAuthnCreateWithKey.md)| WebAuthnCreate Object |

### Return type

[**OpenAPI\Server\Model\GenericSuccessMessage**](../Model/GenericSuccessMessage.md)

### Authorization

[csrf](../../README.md#csrf)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

## **deleteUserWebAuthn**
> OpenAPI\Server\Model\UserWebAuthnCred deleteUserWebAuthn($id)

Delete a stored WebAuthn Public Key

### Example Implementation
```php
<?php
// src/Acme/MyBundle/Api/UserApiInterface.php

namespace Acme\MyBundle\Api;

use OpenAPI\Server\Api\UserApiInterface;

class UserApi implements UserApiInterface
{

    // ...

    /**
     * Implementation of UserApiInterface#deleteUserWebAuthn
     */
    public function deleteUserWebAuthn($id)
    {
        // Implement the operation ...
    }

    // ...
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| The index of the WebAuthn Public Key to delete (not the public key id) |

### Return type

[**OpenAPI\Server\Model\UserWebAuthnCred**](../Model/UserWebAuthnCred.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

## **getUserHistory**
> OpenAPI\Server\Model\HistoryItem getUserHistory()

Returns a history of successful and failed logins

### Example Implementation
```php
<?php
// src/Acme/MyBundle/Api/UserApiInterface.php

namespace Acme\MyBundle\Api;

use OpenAPI\Server\Api\UserApiInterface;

class UserApi implements UserApiInterface
{

    // ...

    /**
     * Implementation of UserApiInterface#getUserHistory
     */
    public function getUserHistory()
    {
        // Implement the operation ...
    }

    // ...
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**OpenAPI\Server\Model\HistoryItem**](../Model/HistoryItem.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

## **getUserSettings**
> OpenAPI\Server\Model\UserSettings getUserSettings()

Returns the client settings of the current user

### Example Implementation
```php
<?php
// src/Acme/MyBundle/Api/UserApiInterface.php

namespace Acme\MyBundle\Api;

use OpenAPI\Server\Api\UserApiInterface;

class UserApi implements UserApiInterface
{

    // ...

    /**
     * Implementation of UserApiInterface#getUserSettings
     */
    public function getUserSettings()
    {
        // Implement the operation ...
    }

    // ...
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**OpenAPI\Server\Model\UserSettings**](../Model/UserSettings.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

## **getUserWebAuthnCreds**
> OpenAPI\Server\Model\UserWebAuthnCred getUserWebAuthnCreds()

get all registered WebAuthn credentials for the user

### Example Implementation
```php
<?php
// src/Acme/MyBundle/Api/UserApiInterface.php

namespace Acme\MyBundle\Api;

use OpenAPI\Server\Api\UserApiInterface;

class UserApi implements UserApiInterface
{

    // ...

    /**
     * Implementation of UserApiInterface#getUserWebAuthnCreds
     */
    public function getUserWebAuthnCreds()
    {
        // Implement the operation ...
    }

    // ...
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**OpenAPI\Server\Model\UserWebAuthnCred**](../Model/UserWebAuthnCred.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

## **loginUser**
> OpenAPI\Server\Model\LogonResult loginUser($logonInformation)

login

### Example Implementation
```php
<?php
// src/Acme/MyBundle/Api/UserApiInterface.php

namespace Acme\MyBundle\Api;

use OpenAPI\Server\Api\UserApiInterface;

class UserApi implements UserApiInterface
{

    /**
     * Configure API key authorization: csrf
     */
    public function setcsrf($apiKey)
    {
        // Retrieve logged in user from $apiKey ...
    }

    // ...

    /**
     * Implementation of UserApiInterface#loginUser
     */
    public function loginUser(LogonInformation $logonInformation)
    {
        // Implement the operation ...
    }

    // ...
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **logonInformation** | [**OpenAPI\Server\Model\LogonInformation**](../Model/LogonInformation.md)| Logon Object |

### Return type

[**OpenAPI\Server\Model\LogonResult**](../Model/LogonResult.md)

### Authorization

[csrf](../../README.md#csrf)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

## **loginUserWebAuthnChallenge**
> OpenAPI\Server\Model\UserWebAuthnChallenge loginUserWebAuthnChallenge()

get a WebAuthN challenge

### Example Implementation
```php
<?php
// src/Acme/MyBundle/Api/UserApiInterface.php

namespace Acme\MyBundle\Api;

use OpenAPI\Server\Api\UserApiInterface;

class UserApi implements UserApiInterface
{

    // ...

    /**
     * Implementation of UserApiInterface#loginUserWebAuthnChallenge
     */
    public function loginUserWebAuthnChallenge()
    {
        // Implement the operation ...
    }

    // ...
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**OpenAPI\Server\Model\UserWebAuthnChallenge**](../Model/UserWebAuthnChallenge.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

## **loginUserWebAuthnGet**
> OpenAPI\Server\Model\UserWebAuthnLogonResult loginUserWebAuthnGet($userWebAuthnGet)

login user with WebAuthn

add webauthn

### Example Implementation
```php
<?php
// src/Acme/MyBundle/Api/UserApiInterface.php

namespace Acme\MyBundle\Api;

use OpenAPI\Server\Api\UserApiInterface;

class UserApi implements UserApiInterface
{

    /**
     * Configure API key authorization: csrf
     */
    public function setcsrf($apiKey)
    {
        // Retrieve logged in user from $apiKey ...
    }

    // ...

    /**
     * Implementation of UserApiInterface#loginUserWebAuthnGet
     */
    public function loginUserWebAuthnGet(UserWebAuthnGet $userWebAuthnGet)
    {
        // Implement the operation ...
    }

    // ...
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userWebAuthnGet** | [**OpenAPI\Server\Model\UserWebAuthnGet**](../Model/UserWebAuthnGet.md)| WebAuthnGet Object |

### Return type

[**OpenAPI\Server\Model\UserWebAuthnLogonResult**](../Model/UserWebAuthnLogonResult.md)

### Authorization

[csrf](../../README.md#csrf)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

## **logoutUser**
> OpenAPI\Server\Model\GenericSuccessMessage logoutUser()

Logs out current logged in user session

### Example Implementation
```php
<?php
// src/Acme/MyBundle/Api/UserApiInterface.php

namespace Acme\MyBundle\Api;

use OpenAPI\Server\Api\UserApiInterface;

class UserApi implements UserApiInterface
{

    // ...

    /**
     * Implementation of UserApiInterface#logoutUser
     */
    public function logoutUser()
    {
        // Implement the operation ...
    }

    // ...
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**OpenAPI\Server\Model\GenericSuccessMessage**](../Model/GenericSuccessMessage.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

## **registerUser**
> OpenAPI\Server\Model\GenericSuccessMessage registerUser($registrationInformation)

registration

### Example Implementation
```php
<?php
// src/Acme/MyBundle/Api/UserApiInterface.php

namespace Acme\MyBundle\Api;

use OpenAPI\Server\Api\UserApiInterface;

class UserApi implements UserApiInterface
{

    /**
     * Configure API key authorization: csrf
     */
    public function setcsrf($apiKey)
    {
        // Retrieve logged in user from $apiKey ...
    }

    // ...

    /**
     * Implementation of UserApiInterface#registerUser
     */
    public function registerUser(RegistrationInformation $registrationInformation)
    {
        // Implement the operation ...
    }

    // ...
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **registrationInformation** | [**OpenAPI\Server\Model\RegistrationInformation**](../Model/RegistrationInformation.md)| Registration Object |

### Return type

[**OpenAPI\Server\Model\GenericSuccessMessage**](../Model/GenericSuccessMessage.md)

### Authorization

[csrf](../../README.md#csrf)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

## **setUserSettings**
> OpenAPI\Server\Model\GenericSuccessMessage setUserSettings($userSettings)

change client settings of current user

parameter contains encrypted client settings

### Example Implementation
```php
<?php
// src/Acme/MyBundle/Api/UserApiInterface.php

namespace Acme\MyBundle\Api;

use OpenAPI\Server\Api\UserApiInterface;

class UserApi implements UserApiInterface
{

    /**
     * Configure API key authorization: csrf
     */
    public function setcsrf($apiKey)
    {
        // Retrieve logged in user from $apiKey ...
    }

    // ...

    /**
     * Implementation of UserApiInterface#setUserSettings
     */
    public function setUserSettings(UserSettings $userSettings)
    {
        // Implement the operation ...
    }

    // ...
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userSettings** | [**OpenAPI\Server\Model\UserSettings**](../Model/UserSettings.md)| Settings Object |

### Return type

[**OpenAPI\Server\Model\GenericSuccessMessage**](../Model/GenericSuccessMessage.md)

### Authorization

[csrf](../../README.md#csrf)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

