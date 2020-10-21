<?php

namespace App\EventListener;

use Symfony\Component\Security\Http\Event\InteractiveLoginEvent;
use Symfony\Component\Security\Core\Event\AuthenticationFailureEvent;
use App\Repository\UserRepository;
use App\Controller\EventController;

class LoginListener
{
    private $userRepository;
    private $eventController;

    public function __construct(UserRepository $userRepository, EventController $eventController)
    {
        $this->userRepository = $userRepository;
        $this->eventController = $eventController;
    }

    public function onSecurityInteractiveLogin(InteractiveLoginEvent $event)
    {
        // Get the User entity.
        $user = $event->getAuthenticationToken()->getUser();

        $this->eventController->StoreEvent($user, "Login", "success");
    }

    public function onSecurityAuthenticationFailure(AuthenticationFailureEvent $event) {
        // Get the User entity.
        $UNAUTHENTICATEDuser = $this->userRepository->findOneByUsernameUNAUTHENTICATED($event->getAuthenticationToken()->getUser());
        if ($UNAUTHENTICATEDuser) {
            $this->eventController->StoreEvent($UNAUTHENTICATEDuser, "Login", "failed: " . $event->getAuthenticationException()->getMessage());
        }
    }
}
?>
