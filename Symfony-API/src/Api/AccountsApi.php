<?php
// src/Acme/MyBundle/Api/AccountsApiInterface.php

namespace App\Api;

use OpenAPI\Server\Api\AccountsApiInterface;
use OpenAPI\Server\Model\Account;

class AccountsApi implements AccountsApiInterface
{

    // ...

    /**
     * Implementation of AccountsApiInterface#getAccounts
     */
    public function getAccounts(&$responseCode, array &$responseHeaders)
    {
	return new Account(["name"=> "test"]);
        // Implement the operation ...
    }

    // ...
}
