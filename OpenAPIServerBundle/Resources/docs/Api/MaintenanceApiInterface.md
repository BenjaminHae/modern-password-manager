# OpenAPI\Server\Api\MaintenanceApiInterface

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**serverInformation**](MaintenanceApiInterface.md#serverInformation) | **GET** /info | get information about the server for the client


## Service Declaration
```yaml
# src/Acme/MyBundle/Resources/services.yml
services:
    # ...
    acme.my_bundle.api.maintenance:
        class: Acme\MyBundle\Api\MaintenanceApi
        tags:
            - { name: "open_apiserver.api", api: "maintenance" }
    # ...
```

## **serverInformation**
> OpenAPI\Server\Model\ServerInformation serverInformation()

get information about the server for the client

### Example Implementation
```php
<?php
// src/Acme/MyBundle/Api/MaintenanceApiInterface.php

namespace Acme\MyBundle\Api;

use OpenAPI\Server\Api\MaintenanceApiInterface;

class MaintenanceApi implements MaintenanceApiInterface
{

    // ...

    /**
     * Implementation of MaintenanceApiInterface#serverInformation
     */
    public function serverInformation()
    {
        // Implement the operation ...
    }

    // ...
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**OpenAPI\Server\Model\ServerInformation**](../Model/ServerInformation.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

