<?php

namespace App\Controller;

use App\Entity\WebAuthnPublicKey;
use App\Entity\User;
use App\Entity\DecryptionKey;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Common\Collections\Criteria;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use OpenAPI\Server\Model\UserWebAuthnCreateWithKey;
use lbuchs\WebAuthn\WebAuthn;
use lbuchs\WebAuthn\Binary\ByteBuffer;
use Psr\Log\LoggerInterface;

class WebAuthnController
{
    const SESSION_CHALLENGE_KEY = "webAuthnChallenge";
    const SESSION_LOGON_KEY_ID = "webAuthnLogonKeyId";
    private $entityManager;
    private $session;
    private $webAuthn;
    private $eventController;
    private $logger;

    public function __construct(EntityManagerInterface $entityManager, SessionInterface $session, EventController $eventController, RequestStack $requestStack, LoggerInterface $logger)
    {
        $this->entityManager = $entityManager;
        $this->session = $session;
        $this->eventController = $eventController;
        $this->logger = $logger;
        if ($requestStack && $requestStack->getCurrentRequest()) {
            $server_name = $requestStack->getCurrentRequest()->server->get("SERVER_NAME");
        } else {
            $server_name = "";
        }
        $configuration = $this->getRp($server_name);
        $this->webAuthn = new WebAuthn($configuration["name"], $configuration["id"], $configuration["allowedFormats"]);
    }

    private function getRp($hostname) {
        return ["name"=>"Password Manager", "id"=> $hostname, "allowedFormats" => ["none"]];
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

    public function registerWebAuthnDevice(User $user, UserWebAuthnCreateWithKey $request) {
        $pk = $this->entityManager->getRepository(WebAuthnPublicKey::class)
            ->findOneByPublicKeyId($request->getId());
        if(null !== $pk) {
            return null;
        }
        $challenge = $this->getChallenge(); 
        if ($challenge === null) {
            $this->logger->error('WebAuthn->register failed: no challenge present');
            return null;
        } 
        $webAuthnResponse = $request->getResponse();
        $webAuthnResult = $this->webAuthn->processCreate(base64_decode($webAuthnResponse->getClientDataJSON()), base64_decode($webAuthnResponse->getAttestationObject()), $challenge, true, true);

        $decryptionKey = new DecryptionKey();
        $decryptionKey->setDecryptionKey($request->getDecryptionKey());
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
            $this->logger->error('WebAuthn->checkCredentials failed: no challenge present');
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
                $pk->getCounter(), 
                true, 
                true);
            $pk->setLastUsed(new \DateTime());
            $pk->setCounter($this->webAuthn->getSignatureCounter());
            $this->rememberLogonKeyId($pk->getId());
            $this->entityManager->flush();
        }
        catch (\Exception $e) {
            $this->eventController->StoreEvent($user, "Login", "WebAuthn failed: " . $e->getMessage());
            $this->logger->error('WebAuthn->checkCredentials failed: ' . $e->getMessage());
            throw $e;
        }
        return $result;
    }

    public function getWebAuthnDevices($user) {
        return $user->getWebAuthnPublicKeys()->map(function($pk) { return $pk->getAsOpenAPIUserWebAuthnCred(); } );
    }

    public function deleteWebAuthnDevice(User $user, int $id) {
        $webAuthn = $this->getSpecificWebAuthnForUser($user, $id);
        if ($webAuthn !== null) {
            $deviceName = $webAuthn->getDeviceName();
            $decryptionKey = $webAuthn->getDecryptionKey();
            $this->entityManager->remove($webAuthn);
            $this->entityManager->remove($decryptionKey);
            $this->entityManager->flush();
            $this->eventController->StoreEvent($user, "WebAuthn Delete", "Device Name: " . $deviceName);
            return true;
        }
        else {
            $this->eventController->StoreEvent($user, "WebAuthn Delete", "failed: Tried to delete inexistent key $id");
            return false;
        }
    }

    private function persistChallenge(ByteBuffer $challenge) {
        $this->session->set(SELF::SESSION_CHALLENGE_KEY, $challenge); 
    }

    public function getChallenge(): ?ByteBuffer {
        $challenge = $this->session->get(SELF::SESSION_CHALLENGE_KEY, null); 
        $this->removeChallenge();
        return $challenge; 
    }

    public function removeChallenge() {
        $this->session->remove(SELF::SESSION_CHALLENGE_KEY); 
    }

    public function rememberLogonKeyId($keyId) {
        $this->session->set(SELF::SESSION_LOGON_KEY_ID, $keyId); 
    }

    public function removeLogonKeyId() {
        $this->session->remove(SELF::SESSION_LOGON_KEY_ID); 
    }

    public function getLogonKeyId(): ?WebAuthnPublicKey {
        $keyId = $this->session->get(SELF::SESSION_LOGON_KEY_ID, null); 
        if ($keyId === null)
            return null;
        $pk = $this->entityManager->getRepository(WebAuthnPublicKey::class)
            ->findOneById($keyId);
        return $pk;
    }
    
}
