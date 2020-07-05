<?php

namespace App\EventListener;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Http\Event\InteractiveLoginEvent;
use Symfony\Component\Security\Core\Event\AuthenticationFailureEvent;
use App\Entity\Event;
use App\Repository\UserRepository;
use App\Controller\EventController;

class LoginListener
{
    private $em;
    private $requestStack;
    private $userRepository;
    private $eventController;

    public function __construct(RequestStack $request, UserRepository $userRepository, EventController $eventController)
    {
        $this->requestStack = $request;
        $this->userRepository = $userRepository;
        $this->eventController = $eventController;
    }

    public function onSecurityInteractiveLogin(InteractiveLoginEvent $event)
    {
        // Get the User entity.
        $user = $event->getAuthenticationToken()->getUser();
        $request = $event->getRequest();

        $this->eventController->StoreLoginEvent($user, $request, "Login", "success");
    }

    public function onSecurityAuthenticationFailure(AuthenticationFailureEvent $event) {
        // Get the User entity.
        $UNAUTHENTICATEDuser = $this->userRepository->findOneByUsernameUNAUTHENTICATED($event->getAuthenticationToken()->getUser());
        $request = $this->requestStack->getCurrentRequest();
        
        $this->eventController->StoreLoginEvent($UNAUTHENTICATEDuser, $request, "Login", "failed");
    }
}
?>
