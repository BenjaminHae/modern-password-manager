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
        $accounts = array();
        for ($i = 0; $i <= 10; $i++) {
            array_push($accounts, new Account(["name"=> "test" . $i ]));
        }
	return $accounts;
        // Implement the operation ...
    }

    // ...
}
