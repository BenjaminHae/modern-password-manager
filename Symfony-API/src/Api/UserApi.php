<?php

namespace App\Api;

use App\Controller\AccountController;
use App\Entity\User;
use App\Entity\WebAuthnPublicKey;
use App\Controller\EventController;
use App\Controller\WebAuthnController;
use Doctrine\ORM\EntityManagerInterface;
use OpenAPI\Server\Api\UserApiInterface;
use OpenAPI\Server\Model\UserSettings as OpenAPIUserSettings;
use OpenAPI\Server\Model\AccountId;
use OpenAPI\Server\Model\ChangePassword;
use OpenAPI\Server\Model\LogonInformation;
use OpenAPI\Server\Model\UserWebAuthnGet;
use OpenAPI\Server\Model\UserWebAuthnCreate;
use OpenAPI\Server\Model\UserWebAuthnCreateWithKey;
use OpenAPI\Server\Model\UserWebAuthnChallenge;
use OpenAPI\Server\Model\Registration;
use OpenAPI\Server\Model\RegistrationInformation;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Symfony\Component\Security\Http\Logout\LogoutSuccessHandlerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Psr\Log\LoggerInterface;

class UserApi extends CsrfProtection implements UserApiInterface, LogoutSuccessHandlerInterface
{
    private $entityManager;
    private $passwordEncoder;
    private $security;
    private $session;
    private $accountsController;
    private $eventController;
    private $requestStack;

    public function __construct(EntityManagerInterface $entityManager, UserPasswordEncoderInterface $passwordEncoder, Security $security, SessionInterface $session, EventController $eventController, CsrfTokenManagerInterface $csrfManager, RequestStack $requestStack, LoggerInterface $logger, $allowRegistration)
    {
        parent::__construct($csrfManager, $logger);
        $this->entityManager = $entityManager;
        $this->passwordEncoder = $passwordEncoder;
        $this->eventController = $eventController;
        $this->security = $security;
        $this->session = $session;
        $this->allowRegistration = strtolower($allowRegistration) === "true";
        $this->requestStack = $requestStack;
    }

    private function getAccountsController()
    {
        if (!$this->accountsController)
        {
            $this->accountsController = new AccountController($this->entityManager);
        }
        return $this->accountsController;
    }

    private function generateApiError($msg)
    {
        return ["success" => false, "message" => $msg];
    }

    private function generateApiSuccess($msg)
    {
        return ["success" => true, "message" => $msg];
    }

    // ...

    public function loginUser(LogonInformation $body, &$responseCode, array &$responseHeaders) {
        $currentUser = $this->security->getUser();
        if ($currentUser)
        {
            return $this->loginResultGenerator($currentUser);
        }
        $this->logger->error('standard login failed');
        return $this->generateApiError("failed to log in");
    }

    public function loginUserWebAuthnGet(UserWebAuthnGet $request, &$responseCode, array &$responseHeaders) {
        $currentUser = $this->security->getUser();
        if ($currentUser)
        {
            $pk = $this->entityManager->getRepository(WebAuthnPublicKey::class)
                ->findOneByPublicKeyId($request->getId());
            $result = $this->loginResultGenerator($currentUser, " using WebAuthn key for " . $pk->getDeviceName());
            $result["decryptionKey"] = $pk->getDecryptionKey()->getDecryptionKey();
            return $result;
        }
        $this->logger->error('webAuthN login failed');
        return $this->generateApiError("failed to log in");
    }

    private function loginResultGenerator($currentUser, String $extraMessage = "") {
        $username = $currentUser->getUsername();
        $loginReport = $currentUser->getLastSuccessfulLoginTimeAndUnsuccessfulCount();
        $result = $this->generateApiSuccess("logged in as " . $username . $extraMessage);
        if ($loginReport[0] !== null) {
            $result["lastLogin"] = $loginReport[0]->format('Y-m-d\TH:i:s.u');
        }
        $result["failedLogins"] = $loginReport[1];
        return $result;
    }

    public function logoutUser(&$responseCode, array &$responseHeaders) 
    {
        $currentUser = $this->security->getUser();
        if ($currentUser)
        {
            $username = $currentUser->getUsername();
            $this->logger->error('logout failed');
            return $this->generateApiError("still logged in as " . $username);
        }
        return $this->generateApiSuccess("logged out");
    }

    public function registerUser(RegistrationInformation $registration, &$responseCode, array &$responseHeaders) {
        if (!$this->allowRegistration) {
          $this->logger->info('registration is disabled but was accessed');
          return $this->generateApiError("registration is not allowed");
        }
        $user = new User();
        $user->setUsername($registration->getUsername());
        $user->setEmail($registration->getEmail());
        $user->setPassword($this->passwordEncoder->encodePassword($user, $registration->getPassword()));
        $this->entityManager->persist($user);
        $this->entityManager->flush();
        $this->eventController->StoreEvent($user, "Register", "success");
        return $this->generateApiSuccess("successfully registered");
    }

    public function loginUserWebAuthnChallenge(&$responseCode, array &$responseHeaders) {
        $webAuthnController = new WebAuthnController($this->entityManager, $this->session, $this->eventController, $this->requestStack);
        $challenge = base64_encode($webAuthnController->createChallenge()->getBinaryString());
        return new UserWebAuthnChallenge(["challenge" => $challenge]);
    }

    public function createUserWebAuthn(UserWebAuthnCreateWithKey $request, &$responseCode, array &$responseHeaders) {
        $currentUser = $this->security->getUser();
        if (!$currentUser) {
            $responseCode = 403;
            return $this->generateApiError("unauthorized");
        }
        $webAuthnController = new WebAuthnController($this->entityManager, $this->session, $this->eventController, $this->requestStack);
        try {
            $webAuthn = $webAuthnController->registerWebAuthnDevice($currentUser, $request);
            $this->eventController->StoreEvent($currentUser, "WebAuthn Store", "Device Name: " . $webAuthn->getDeviceName());
        }
        catch (\Exception $e) {
            $this->eventController->StoreEvent($currentUser, "WebAuthn Store", "failed: " . $e->getMessage());
            $this->logger->error('WebAuthN creation failed: ' . $e->getMessage());
            throw $e;
        }
        return $this->generateApiSuccess("successfully registered webauthn credential");
    }

    public function deleteUserWebAuthn($id, &$responseCode, array &$responseHeaders) {
        $currentUser = $this->security->getUser();
        $webAuthnController = new WebAuthnController($this->entityManager, $this->session, $this->eventController, $this->requestStack);
        $webAuthnController->deleteWebAuthnDevice($currentUser, $id);
        return $webAuthnController->getWebAuthnDevices($currentUser);
    }

    public function getUserHistory(&$responseCode, array &$responseHeaders) 
    {
        $currentUser = $this->security->getUser();
        return $currentUser->getEvents()->map(function($event) { return $event->getAsOpenAPIHistoryItem(); } );
    }

    public function getUserWebAuthnCreds(&$responseCode, array &$responseHeaders) 
    {
        $currentUser = $this->security->getUser();
        $webAuthnController = new WebAuthnController($this->entityManager, $this->session, $this->eventController, $this->requestStack);
        return $webAuthnController->getWebAuthnDevices($currentUser);
        
    }

    public function getUserSettings(&$responseCode, array &$responseHeaders) 
    {
        $currentUser = $this->security->getUser();
        $userSettings = $currentUser->getClientConfiguration();
        return new OpenAPIUserSettings(["encryptedUserSettings" => $userSettings]);
    }

    public function setUserSettings(OpenAPIUserSettings $userSettings, &$responseCode, array &$responseHeaders) {
        $currentUser = $this->security->getUser();
        $userSettings = $currentUser->setClientConfiguration($userSettings->getEncryptedUserSettings());
        $this->entityManager->flush();
        return $this->generateApiSuccess("successfully stored user settings");
    }

    public function changePassword(ChangePassword $changes, &$responseCode, array &$responseHeaders)
    {
        $currentUser = $this->security->getUser();
        if (!$this->passwordEncoder->isPasswordValid($currentUser, $changes->getOldPassword())) {
            $this->eventController->StoreEvent($currentUser, "ChangePassword", "failed: old password wrong");
            return $this->generateApiError("Old Password is wrong");
        }
        $newHash = $this->passwordEncoder->encodePassword($currentUser, $changes->getNewPassword());
        $currentUser->setPassword($newHash);
        $this->getAccountsController()->updateAccountsFromApi($currentUser, $changes->getAccounts());
        $this->entityManager->flush();
        $this->eventController->StoreEvent($currentUser, "ChangePassword", "success");
        return $this->generateApiSuccess("Changed password, please relogin");
        //Todo: Auto Logout?
    }

    // ...
    public function onLogoutSuccess(Request $request) 
    {
        $response = new Response();
        $response->setContent(json_encode( $this->generateApiSuccess("logged out") ));
        $response->headers->set('Content-Type', 'application/json');      
        return $response;
    }
}
