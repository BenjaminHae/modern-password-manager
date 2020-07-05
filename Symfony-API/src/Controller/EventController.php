<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Event;
use App\Entity\User;

class EventController
{
    private $em;
    private $userRepository;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    public function StoreLoginEvent(User $user, Request $request, string $eventType, string $eventResult) {
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
