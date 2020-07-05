<?php

namespace App\Api;

use App\Controller\AccountController;
use App\Entity\User;
use App\Controller\EventController;
use Doctrine\ORM\EntityManagerInterface;
use OpenAPI\Server\Api\UserApiInterface;
use OpenAPI\Server\Model\UserSettings as OpenAPIUserSettings;
use OpenAPI\Server\Model\AccountId;
use OpenAPI\Server\Model\ChangePassword;
use OpenAPI\Server\Model\LogonInformation;
use OpenAPI\Server\Model\Registration;
use OpenAPI\Server\Model\RegistrationInformation;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Symfony\Component\Security\Http\Logout\LogoutSuccessHandlerInterface;

class UserApi extends CsrfProtection implements UserApiInterface, LogoutSuccessHandlerInterface
{
    private $entityManager;
    private $passwordEncoder;
    private $security;
    private $session;
    private $accountsController;
    private $eventController;

    public function __construct(EntityManagerInterface $entityManager, UserPasswordEncoderInterface $passwordEncoder, Security $security, SessionInterface $session, EventController $eventController, CsrfTokenManagerInterface $csrfManager, $allowRegistration)
    {
        parent::__construct($csrfManager);
        $this->entityManager = $entityManager;
        $this->passwordEncoder = $passwordEncoder;
        $this->eventController = $eventController;
        $this->security = $security;
        $this->session = $session;
        $this->allowRegistration = strtolower($allowRegistration) === "true";
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
            $username = $currentUser->getUsername();
            return $this->generateApiSuccess("logged in as " . $username);
        }
        return $this->generateApiError("failed to log in");
    }

    public function logoutUser(&$responseCode, array &$responseHeaders) 
    {
        $currentUser = $this->security->getUser();
        if ($currentUser)
        {
            $username = $currentUser->getUsername();
            return $this->generateApiError("still logged in as " . $username);
        }
        return $this->generateApiSuccess("logged out");
    }

    public function registerUser(RegistrationInformation $registration, &$responseCode, array &$responseHeaders) {
        if (!$this->allowRegistration) {
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

    public function getUserHistory(&$responseCode, array &$responseHeaders) 
    {
        $currentUser = $this->security->getUser();
        return $currentUser->getEvents()->map(function($event) { return $event->getAsOpenAPIHistoryItem(); } );
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
