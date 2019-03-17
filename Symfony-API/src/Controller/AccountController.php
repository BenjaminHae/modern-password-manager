<?php

namespace App\Controller;

use App\Entity\Account;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Common\Collections\Criteria;
use OpenAPI\Server\Model\AccountId as OpenAPIAccountId;

class AccountController
{
     
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    private function fillAccountFromRequest($request, Account $account)
    {
        $account->setName($request->getName());
        $account->setPassword($request->getPassword());
        $account->setOther($request->getAdditional());
        return $account;
    }

    public function addAccountFromAPI($user, $request)
    {
        $account = $this->fillAccountFromRequest($request, new Account());
        $user->addAccount($account);
        $this->entityManager->persist($account);
        $this->entityManager->flush();
    }

    public function getAccountsForUserAsAPI($user)
    {
	return $user->getAccounts()->map(function($account) { return $account->getAsOpenAPIAccount(); } );
    }

    public function getSpecificAccountForUser($user, int $id)
    {
        $idCriteria = Criteria::create()
            ->where(Criteria::expr()->eq("id", $id));
        return $user->getAccounts()->matching($idCriteria)[0];
    }

    public function getSpecificAccountForUserAsAPI($user, int $id)
    {
        return $this->getSpecificAccountForUser($user, $id)->getAsOpenAPIAccount();
    }

    public function deleteAccount($user, $id)
    {
        $this->getSpecificAccountForUser($user, $id);
        $account = $this->getSpecificAccountForUser($user, $id);
        $this->entityManager->remove($account);
        $this->entityManager->flush();
        return true;
    }

    public function updateAccountFromApi($user, OpenAPIAccountId $account)
    {
        return $this->updateAccountsFromApi($user, [$account]);
    }

    public function updateAccountsFromApi($user, $accounts)
    {
        //todo if every account should be updated there must be a way that reduces database regquests, i.e. get all accounts for the account
        foreach ($accounts as $account)
        {
            $currentAccount = $this->getSpecificAccountForUser($user, $account->getIndex());
            $this->fillAccountFromRequest($account, $currentAccount);
        }
        $this->entityManager->flush();
        return true;
    }
}
?>
