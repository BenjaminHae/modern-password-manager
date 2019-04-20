# OpenAPI\Server\Api\AccountsApiInterface

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**addAccounts**](AccountsApiInterface.md#addAccounts) | **PUT** /accounts | Add Account
[**deleteAccount**](AccountsApiInterface.md#deleteAccount) | **DELETE** /accounts/{id} | Delete a stored Account
[**getAccounts**](AccountsApiInterface.md#getAccounts) | **GET** /accounts | Returns the accounts stored by the current user
[**updateAccount**](AccountsApiInterface.md#updateAccount) | **POST** /accounts/{id} | Update a stored account


## Service Declaration
```yaml
# src/Acme/MyBundle/Resources/services.yml
services:
    # ...
    acme.my_bundle.api.accounts:
        class: Acme\MyBundle\Api\AccountsApi
        tags:
            - { name: "open_api_server.api", api: "accounts" }
    # ...
```

## **addAccounts**
> OpenAPI\Server\Model\AccountId addAccounts($account)

Add Account

### Example Implementation
```php
<?php
// src/Acme/MyBundle/Api/AccountsApiInterface.php

namespace Acme\MyBundle\Api;

use OpenAPI\Server\Api\AccountsApiInterface;

class AccountsApi implements AccountsApiInterface
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
     * Implementation of AccountsApiInterface#addAccounts
     */
    public function addAccounts(array $account)
    {
        // Implement the operation ...
    }

    // ...
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **account** | [**OpenAPI\Server\Model\Account**](../Model/array.md)| Account Values |

### Return type

[**OpenAPI\Server\Model\AccountId**](../Model/AccountId.md)

### Authorization

[csrf](../../README.md#csrf)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

## **deleteAccount**
> OpenAPI\Server\Model\AccountId deleteAccount($id)

Delete a stored Account

### Example Implementation
```php
<?php
// src/Acme/MyBundle/Api/AccountsApiInterface.php

namespace Acme\MyBundle\Api;

use OpenAPI\Server\Api\AccountsApiInterface;

class AccountsApi implements AccountsApiInterface
{

    // ...

    /**
     * Implementation of AccountsApiInterface#deleteAccount
     */
    public function deleteAccount($id)
    {
        // Implement the operation ...
    }

    // ...
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| The id of the account |

### Return type

[**OpenAPI\Server\Model\AccountId**](../Model/AccountId.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

## **getAccounts**
> OpenAPI\Server\Model\AccountId getAccounts()

Returns the accounts stored by the current user

### Example Implementation
```php
<?php
// src/Acme/MyBundle/Api/AccountsApiInterface.php

namespace Acme\MyBundle\Api;

use OpenAPI\Server\Api\AccountsApiInterface;

class AccountsApi implements AccountsApiInterface
{

    // ...

    /**
     * Implementation of AccountsApiInterface#getAccounts
     */
    public function getAccounts()
    {
        // Implement the operation ...
    }

    // ...
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**OpenAPI\Server\Model\AccountId**](../Model/AccountId.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

## **updateAccount**
> OpenAPI\Server\Model\AccountId updateAccount($id, $account)

Update a stored account

### Example Implementation
```php
<?php
// src/Acme/MyBundle/Api/AccountsApiInterface.php

namespace Acme\MyBundle\Api;

use OpenAPI\Server\Api\AccountsApiInterface;

class AccountsApi implements AccountsApiInterface
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
     * Implementation of AccountsApiInterface#updateAccount
     */
    public function updateAccount($id, Account $account)
    {
        // Implement the operation ...
    }

    // ...
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| The id of the account |
 **account** | [**OpenAPI\Server\Model\Account**](../Model/Account.md)| Account Object |

### Return type

[**OpenAPI\Server\Model\AccountId**](../Model/AccountId.md)

### Authorization

[csrf](../../README.md#csrf)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

