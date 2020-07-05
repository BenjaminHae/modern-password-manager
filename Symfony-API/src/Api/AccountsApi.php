<?php

namespace App\Api;

use App\Controller\AccountController;
use Doctrine\ORM\EntityManagerInterface;
use OpenAPI\Server\Api\AccountsApiInterface;
use OpenAPI\Server\Model\Account as OpenAPIAccount;
use OpenAPI\Server\Model\AccountId;
use OpenAPI\Server\Model\Index;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

class AccountsApi extends CsrfProtection implements AccountsApiInterface
{
    private $entityManager;
    private $passwordEncoder;
    private $security;
    private $accountsController;

    public function __construct(EntityManagerInterface $entityManager, Security $security, CsrfTokenManagerInterface $csrfManager)
    {
        parent::__construct($csrfManager);
        $this->entityManager = $entityManager;
        $this->security = $security;
    }

    private function getAccountsController()
    {
        if (!$this->accountsController) {
            $this->accountsController = new AccountController($this->entityManager);
        }
        return $this->accountsController;
    }

    private function getCurrentUsersAccounts() 
    {
        $currentUser = $this->security->getUser();
        return $this->getAccountsController()->getAccountsForUserAsAPI($currentUser);
    }

    private function getCurrentUsersSpecificAccount(int $id)
    {
        $currentUser = $this->security->getUser();
        return $this->getAccountsController()->getSpecificAccountForUserAsAPI($currentUser, $id);
    }

    // ...

    /**
     * Implementation of AccountsApiInterface#getAccounts
     */
    public function getAccounts(&$responseCode, array &$responseHeaders)
    {
        return $this->getCurrentUsersAccounts();
    }

    public function addAccounts(array $accounts, &$responseCode, array &$responseHeaders)
    {
        $currentUser = $this->security->getUser();
        foreach ($accounts as $account) {
            $this->getAccountsController()->addAccountFromAPI($currentUser, $account);
        }
        return $this->getCurrentUsersAccounts();
    }

    public function deleteAccount($id, &$responseCode, array &$responseHeaders)
    {
        $currentUser = $this->security->getUser();
        $this->getAccountsController()->deleteAccount($currentUser, $id);
        return $this->getCurrentUsersAccounts();
    }

    public function updateAccount($id, OpenAPIAccount $account, &$responseCode, array &$responseHeaders)
    {
        $currentUser = $this->security->getUser();
        $this->getAccountsController()->updateAccountFromAPI($currentUser, $id, $account);
        return $this->getCurrentUsersAccounts();
    }


    // ...
}
