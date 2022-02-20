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
use Psr\Log\LoggerInterface;

class AccountsApi extends CsrfProtection implements AccountsApiInterface
{
    private $entityManager;
    private $passwordEncoder;
    private $security;
    private $accountsController;

    public function __construct(EntityManagerInterface $entityManager, Security $security, CsrfTokenManagerInterface $csrfManager, LoggerInterface $logger)
    {
        parent::__construct($csrfManager, $logger);
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

    public function addAccounts(array $accounts, &$responseCode, array &$responseHeaders): array
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
        if ($this->getAccountsController()->deleteAccount($currentUser, $id)) {
            return $this->getCurrentUsersAccounts();
        }
        else {
            $this->logger->error('deletion of account failed, account does not exist');
            $responseCode = 404;
        }
    }

    public function updateAccount($id, OpenAPIAccount $account, &$responseCode, array &$responseHeaders)
    {
        $currentUser = $this->security->getUser();
        if ($this->getAccountsController()->updateAccountFromAPI($currentUser, $id, $account)) {
            return $this->getCurrentUsersAccounts();
        }
        else {
            $this->logger->error('updating account failed, account does not exist');
            $responseCode = 404;
        }
    }


    // ...
}
