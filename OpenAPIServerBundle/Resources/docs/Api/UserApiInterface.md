# OpenAPI\Server\Api\UserApiInterface

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**loginUser**](UserApiInterface.md#loginUser) | **POST** /user/login | login
[**logoutUser**](UserApiInterface.md#logoutUser) | **GET** /user/logout | Logs out current logged in user session
[**registerUser**](UserApiInterface.md#registerUser) | **PUT** /user | registration


## Service Declaration
```yaml
# src/Acme/MyBundle/Resources/services.yml
services:
    # ...
    acme.my_bundle.api.user:
        class: Acme\MyBundle\Api\UserApi
        tags:
            - { name: "open_apiserver.api", api: "user" }
    # ...
```

## **loginUser**
> OpenAPI\Server\Model\GenericSuccessMessage loginUser($logonInformation)

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

[**OpenAPI\Server\Model\GenericSuccessMessage**](../Model/GenericSuccessMessage.md)

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

