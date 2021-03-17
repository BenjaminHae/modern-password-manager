<?php

namespace App\EventListener;

use Symfony\Component\Security\Http\Event\InteractiveLoginEvent;
use Symfony\Component\Security\Core\Event\AuthenticationFailureEvent;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\UserRepository;
use App\Entity\WebAuthnPublicKey;
use App\Controller\EventController;
use App\Controller\WebAuthnController;

class LoginListener
{
    private $userRepository;
    private $eventController;
    private $entityManager;
    private $webAuthn;

    public function __construct(EntityManagerInterface $entityManager, UserRepository $userRepository, EventController $eventController, WebAuthnController $webAuthn)
    {
        $this->userRepository = $userRepository;
        $this->eventController = $eventController;
        $this->entityManager = $entityManager;
        $this->webAuthn = $webAuthn;
    }

    public function onSecurityInteractiveLogin(InteractiveLoginEvent $event)
    {
        // Get the User entity.
        $user = $event->getAuthenticationToken()->getUser();

        $methodInfo = " using username and password";
        $pk = $this->webAuthn->getLogonKeyId();
        if ($pk) {
            $methodInfo = " using WebAuthnKey for device " . $pk->getDeviceName();
            $pk = $this->webAuthn->removeLogonKeyId();
        }
        $this->eventController->StoreEvent($user, "Login", "success" . $methodInfo);
        // invalidate challenge that was presented for login
        $this->webAuthn->removeChallenge();
    }

    public function onSecurityAuthenticationFailure(AuthenticationFailureEvent $event) {
        // invalidate challenge that was presented for this
        $this->webAuthn->removeChallenge();
        // Get the User entity.
        $UNAUTHENTICATEDuser = $this->userRepository->findOneByUsernameUNAUTHENTICATED($event->getAuthenticationToken()->getUser());
        if ($UNAUTHENTICATEDuser) {
            $this->eventController->StoreEvent($UNAUTHENTICATEDuser, "Login", "failed: " . $event->getAuthenticationException()->getMessage());
        }
    }

}
?>
