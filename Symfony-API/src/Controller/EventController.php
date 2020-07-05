<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use App\Entity\Event;
use App\Entity\User;

class EventController
{
    private $em;
    private $requestStack;

    public function __construct(EntityManagerInterface $em, RequestStack $request)
    {
        $this->em = $em;
        $this->requestStack = $request;
    }

    public function StoreLoginEvent(User $user, string $eventType, string $eventResult) {
        $request = $this->requestStack->getCurrentRequest();

        $event = new Event();
        $event->setUserAgent($request->headers->get('User-Agent'));
        $event->setIp($request->getClientIp());
        $event->setTime(new \DateTime());
        $event->setEventType($eventType);
        $event->setActionResult($eventResult);

        $user->addEvent($event);

        $this->em->persist($event);
        $this->em->flush();
    }
}
