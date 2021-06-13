<?php

namespace App\Controller;

use App\Entity\Account;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Common\Collections\Criteria;
use OpenAPI\Server\Model\AccountId as OpenAPIAccountId;
use OpenAPI\Server\Model\Account as OpenAPIAccount;

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
        $account = $this->getSpecificAccountForUser($user, $id);
        if ($account) {
            $this->entityManager->remove($account);
            $this->entityManager->flush();
            return true;
        }
        return false;
    }

    public function updateAccountFromApi($user, $id, OpenAPIAccount $account)
    {
        return $this->updateAccountsFromApi($user, [["index"=>$id, "account"=>$account]]);
    }

    /*
     * updates all accounts in the provided array,
     * does not update any account if one fails (for example does not exist)
     */
    public function updateAccountsFromApi($user, $accounts)
    {
        //todo if every account should be updated there must be a way that reduces database regquests, i.e. get all accounts for the account
        foreach ($accounts as $account)
        {
            if (is_array($account)) {
                $currentAccount = $this->getSpecificAccountForUser($user, $account["index"]);
                $account = $account["account"];
            }
            else {
                $currentAccount = $this->getSpecificAccountForUser($user, $account->getIndex());
            }
            if (!$currentAccount) {
                return false;
            }
            $this->fillAccountFromRequest($account, $currentAccount);
        }
        $this->entityManager->flush();
        return true;
    }
}
?>
