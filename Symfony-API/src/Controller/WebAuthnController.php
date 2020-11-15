<?php

namespace App\Controller;

use App\Entity\WebAuthnPublicKey;
use App\Entity\User;
use App\Entity\DecryptionKey;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Common\Collections\Criteria;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use OpenAPI\Server\Model\UserWebAuthnCreate;
use lbuchs\WebAuthn\WebAuthn;
use lbuchs\WebAuthn\Binary\ByteBuffer;

class WebAuthnController
{
    private $entityManager;
    private $session;
    private $webAuthn;
    private $eventController;

    public function __construct(EntityManagerInterface $entityManager, SessionInterface $session, EventController $eventController)
    {
        $this->entityManager = $entityManager;
        $this->session = $session;
        $this->eventController = $eventController;
        $configuration = $this->getRp();
        $this->webAuthn = new WebAuthn($configuration["name"], $configuration["id"], $configuration["allowedFormats"]);
    }

    private function getRp() {
        return ["name"=>"Password Manager", "id"=>"debian-vms-hp.lab", "allowedFormats" => ["none"]];
    }

    private function fillWebAuthnPublicKeyFromAttestationResult($data, WebAuthnPublicKey $webauthn)
    {
        $webauthn->setPublicKey($data->credentialPublicKey);
        return $webauthn;
    }

    private function getSpecificWebAuthnForUser(User $user, int $id)
    {
        $idCriteria = Criteria::create()
            ->where(Criteria::expr()->eq("id", $id));
        return $user->getWebAuthnPublicKeys()->matching($idCriteria)[0];
    }

    public function registerWebAuthnDevice(User $user, UserWebAuthnCreate $request) {
        $pk = $this->entityManager->getRepository(WebAuthnPublicKey::class)
            ->findOneByPublicKey($request->getId());
        if(null !== $pk) {
            return null;
        }
        $webAuthnResponse = $request->getResponse();
        $webAuthnResult = $this->webAuthn->processCreate(base64_decode($webAuthnResponse->getClientDataJSON()), base64_decode($webAuthnResponse->getAttestationObject()), $this->getChallenge(), true, true);

        $decryptionKey = new DecryptionKey();
        $decryptionKey->setDecryptionKey($request->getKey());
        $webauthn = $this->fillWebAuthnPublicKeyFromAttestationResult($webAuthnResult, new WebAuthnPublicKey());
        //TODO: Bekomme ich die id auch aus der Attestation?
        $webauthn->setPublicKeyId($request->getId());
        $webauthn->setDeviceName($request->getName());
        $webauthn->setCounter(0);
        $webauthn->setDecryptionKey($decryptionKey);

        $user->addWebAuthnPublicKey($webauthn);
        $this->entityManager->persist($decryptionKey);
        $this->entityManager->persist($webauthn);
        $this->entityManager->flush();
        return $webauthn;
    }

    public function createChallenge() {
        $challenge = ByteBuffer::randomBuffer(32);
        $this->persistChallenge($challenge);
        return $challenge;
    }

    public function checkCredentials($credentials, UserInterface $user) {
        $challenge = $this->getChallenge(); 
        if ($challenge === null) {
            return false;
        } 
        $pk = $this->entityManager->getRepository(WebAuthnPublicKey::class)
            ->findOneByPublicKeyId($credentials["id"]);
        $result = null;
        try {
            $result = $this->webAuthn->processGet(
                base64_decode($credentials["clientDataJSON"]),
                base64_decode($credentials["authenticatorData"]), 
                base64_decode($credentials["signature"]), 
                $pk->getPublicKey(), 
                $challenge, 
                null, 
                true, 
                true);
            //Todo: Update Counter
            $this->rememberLogonKeyId($pk->getId());
        }
        catch (\Exception $e) {
            $this->eventController->StoreEvent($user, "Login", "WebAuthn failed: " . $e->getMessage());
            throw $e;
        }
        return $result;
    }

    public function getWebAuthnDevices($user) {
        return $user->getWebAuthnPublicKeys()->map(function($pk) { return $pk->getAsOpenAPIUserWebAuthnCred(); } );
    }

    public function deleteWebAuthnDevice(User $user, int $id) {
        $webauthn = $this->getSpecificWebAuthnForUser($user, $id);
        $deviceName = $webAuthn->getDeviceName();
        $decryptionKey = $webauthn->getDecryptionKey();
        $this->entityManager->remove($webauthn);
        $this->entityManager->remove($decryptionKey);
        $this->entityManager->flush();
        $this->eventController->StoreEvent($currentUser, "WebAuthn Delete", "Device Name: " . $deviceName);
        return true;
    }

    public function persistChallenge($challenge) {
        $this->session->set("webAuthnChallenge", $challenge); 
    }

    public function getChallenge() {
        return $this->session->get("webAuthnChallenge", null); 
    }

    public function rememberLogonKeyId($keyId) {
        $this->session->set("webAuthnLogonKeyId", $keyId); 
    }

    public function getLogonKey(): ?WebAuthnPublicKey {
        $keyId = $this->session->get("webAuthnLogonKeyId", null); 
        if ($keyId === null)
            return null;
        $pk = $this->entityManager->getRepository(WebAuthnPublicKey::class)
            ->findOneById($keyId);
        return $pk;
    }
    
}
