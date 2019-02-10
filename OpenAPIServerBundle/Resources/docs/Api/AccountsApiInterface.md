# OpenAPI\Server\Api\AccountsApiInterface

All URIs are relative to *http://http:/v0*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getAccounts**](AccountsApiInterface.md#getAccounts) | **GET** /accounts | Returns the accounts stored by the current user


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

## **getAccounts**
> OpenAPI\Server\Model\Account getAccounts()

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

[**OpenAPI\Server\Model\Account**](../Model/Account.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

