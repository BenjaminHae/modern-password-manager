# OpenAPI\Server\Api\AccountsApiInterface

All URIs are relative to *http://http:/v0*

Method | HTTP request | Description
------------- | ------------- | -------------
[**addAccount**](AccountsApiInterface.md#addAccount) | **PUT** /accounts | Add Account
[**deleteAccount**](AccountsApiInterface.md#deleteAccount) | **DELETE** /accounts | Delete a stored Account
[**getAccounts**](AccountsApiInterface.md#getAccounts) | **GET** /accounts | Returns the accounts stored by the current user
[**updateAccount**](AccountsApiInterface.md#updateAccount) | **POST** /accounts | Update a stored account


## Service Declaration
```yaml
# src/Acme/MyBundle/Resources/services.yml
services:
    # ...
    acme.my_bundle.api.accounts:
        class: Acme\MyBundle\Api\AccountsApi
        tags:
            - { name: "open_apiserver.api", api: "accounts" }
    # ...
```

## **addAccount**
> OpenAPI\Server\Model\AccountId addAccount($body)

Add Account

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
     * Implementation of AccountsApiInterface#addAccount
     */
    public function addAccount(Account $body)
    {
        // Implement the operation ...
    }

    // ...
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**OpenAPI\Server\Model\Account**](../Model/Account.md)| Account Values |

### Return type

[**OpenAPI\Server\Model\AccountId**](../Model/AccountId.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

## **deleteAccount**
> OpenAPI\Server\Model\AccountId deleteAccount($body)

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
    public function deleteAccount(Index $body)
    {
        // Implement the operation ...
    }

    // ...
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**OpenAPI\Server\Model\Index**](../Model/Index.md)| Account Id |

### Return type

[**OpenAPI\Server\Model\AccountId**](../Model/AccountId.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
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
> array updateAccount($body)

Update a stored account

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
     * Implementation of AccountsApiInterface#updateAccount
     */
    public function updateAccount(AccountId $body)
    {
        // Implement the operation ...
    }

    // ...
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**OpenAPI\Server\Model\AccountId**](../Model/AccountId.md)| Account Object |

### Return type

**array**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

