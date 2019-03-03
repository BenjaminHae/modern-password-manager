<?php

namespace App\Api;

use App\Entity\Account;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Common\Collections\Criteria;
use OpenAPI\Server\Api\AccountsApiInterface;
use OpenAPI\Server\Model\Account as OpenAPIAccount;
use OpenAPI\Server\Model\AccountId;
use OpenAPI\Server\Model\Index;
use Symfony\Component\Security\Core\Security;

class AccountsApi implements AccountsApiInterface
{
    private $entityManager;
    private $passwordEncoder;
    private $security;
    private $session;

    public function __construct(EntityManagerInterface $entityManager, Security $security)
    {
        $this->entityManager = $entityManager;
        $this->security = $security;
    }

    private function getCurrentUsersAccounts() 
    {
        $currentUser = $this->security->getUser();
	return $currentUser->getAccounts()->map(function($account) { return $account->getAsOpenAPIAccount(); } );
    }

    private function getCurrentUsersSpecificAccount(int $id)
    {
        $currentUser = $this->security->getUser();
        $idCriteria = Criteria::create()
            ->where(Criteria::expr()->eq("id", $id));
        return $currentUser->getAccounts()->matching($idCriteria)[0];
    }

    private function fillAccountFromRequest($request, Account $account)
    {
        $account->setName($request->getName());
        $account->setPassword($request->getPassword());
        $account->setOther($request->getAdditional());
    }

    public function setcsrf($token)
    {
        $csrfToken = new CsrfToken("Api", $token);
        if (!$this->csrfManager->isTokenValid($csrfToken)) {
            throw new AccessDeniedHttpException('This action needs a valid csrf token!');
        }
    }
    
    // ...

    /**
     * Implementation of AccountsApiInterface#getAccounts
     */
    public function getAccounts(&$responseCode, array &$responseHeaders)
    {
        return $this->getCurrentUsersAccounts();
    }

    public function addAccount(OpenAPIAccount $request, &$responseCode, array &$responseHeaders)
    {
        $currentUser = $this->security->getUser();
        $account = new Account();
        $this->fillAccountFromRequest($request, $account);
        $currentUser->addAccount($account);
        $this->entityManager->persist($account);
        $this->entityManager->flush();
        return $this->getCurrentUsersAccounts();
    }

    public function deleteAccount(Index $body, &$responseCode, array &$responseHeaders)
    {
        $account = $this->getCurrentUsersSpecificAccount($body->getIndex());
        $this->entityManager->remove($account);
        $this->entityManager->flush();
        return $this->getCurrentUsersAccounts();
    }

    public function updateAccount(AccountId $body, &$responseCode, array &$responseHeaders)
    {
        $account = $this->getCurrentUsersSpecificAccount($body->getIndex());
        $this->fillAccountFromRequest($body, $account);
        $this->entityManager->flush();
        return $this->getCurrentUsersAccounts();
    }


    // ...
}
