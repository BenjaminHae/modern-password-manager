<?php

namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ControllerEvent;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Bundle\FrameworkBundle\Controller\TemplateController;
use Symfony\Component\HttpFoundation\HeaderUtils;


class HeaderSubscriber implements EventSubscriberInterface
{
    public function __construct()
    {
    }

    //public function onKernelController(ControllerEvent $event)
    //{
        //$controller = $event->getController();

        //// when a controller class defines multiple action methods, the controller
        //// is returned as [$controllerInstance, 'methodName']
        //if (is_array($controller)) {
        //    $controller = $controller[0];
        //}

        //if ($controller instanceof Symfony\Bundle\FrameworkBundle\Controller\TemplateController) {
        //    // do session!
        //}
    //}

    public function onKernelResponse(ResponseEvent $event)
    {
        $response = $event->getResponse();
        $ct = $response->headers->get('content-type', "text/html");
        if ($ct === "text/html") {
            $response->headers->set("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; object-src 'none'; frame-ancestors 'none';");
            $response->headers->set("Referrer-Policy", "no-referrer");
        }
        else {
            $disposition = $response->headers->makeDisposition(HeaderUtils::DISPOSITION_ATTACHMENT, "data.json");
            $response->headers->set('Content-Disposition', $disposition);
            $response->headers->set('X-Content-Type-Options', "nosniff");
        }
    }

    public static function getSubscribedEvents()
    {
        return [
            //KernelEvents::CONTROLLER => 'onKernelController',
            KernelEvents::RESPONSE => 'onKernelResponse',
        ];
    }
}
?>
