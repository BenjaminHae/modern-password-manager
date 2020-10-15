<?php

namespace App\Controller;

use App\Entity\WebAuthnPublicKey;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Common\Collections\Criteria;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

class WebAuthnController
{
    private $entityManager;
    private $session;

    public function __construct(EntityManagerInterface $entityManager, SessionInterface $session)
    {
        $this->entityManager = $entityManager;
        $this->session = $session;
    }

    private function fillWebAuthnPublicKeyFromRequest($request, WebAuthnPublicKey $webauthn)
    {
        $webauthn->setDeviceName($request->getName());
        $webauthn->setCounter(0);
        $webauthn->setType();
        $webauthn->setAttestationObject();
        $webauthn->setClientDataJSON();
        $webauthn->setPublicKey();
        return $webauthn;
    }

    private function getSpecificWebAuthnForUser(User $user, int $id)
    {
        $idCriteria = Criteria::create()
            ->where(Criteria::expr()->eq("id", $id));
        return $user->getWebAuthnPublicKeys()->matching($idCriteria)[0];
    }

    public function registerWebAuthnDevice(User $user, $request) {
        $webauthn = $this->fillWebAuthnFromRequest($request, new WebAuthnPublicKey());
        $user->addWebAuthnPublicKey($webauthn);
        $this->entityManager->persist($webauthn);
        $this->entityManager->flush();
    }

    public function removeWebAuthnDevice(User $user, int $id) {
        $webauthn = $this->getSpecificWebAuthnForUser($user, $id);
        $this->entityManager->remove($webauthn);
        $this->entityManager->flush();
        return true;
    }

    public function persistChallenge($challenge) {
        $this->session->set("webAuthnChallenge", $challenge); 
    }
    
}
