<?php

namespace App\EventSubscriber;
use OpenAPI\Server\Controller\Controller as OpenAPIController;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Symfony\Component\Security\Csrf\CsrfToken;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Event\FilterControllerEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\KernelEvents;

class CsrfTokenSubscriber implements EventSubscriberInterface
{
    private $csrfManager;

    public function __construct(CsrfTokenManagerInterface $csrfManager)
    {
        $this->csrfManager = $csrfManager;
    }

    public function onKernelController(FilterControllerEvent $event)
    {
        $controller = $event->getController();

        /*
         * $controller passed can be either a class or a Closure.
         * This is not usual in Symfony but it may happen.
         * If it is a class, it comes in array format
         */
        if (!is_array($controller)) {
            return;
        }

        if ($controller[0] instanceof OpenAPIController) {
            if ($event->getRequest()->getMethod() == "GET")
            {
                return;
            }
            $data =  json_decode($event->getRequest()->getContent(), true);
            if (!array_key_exists("csrfToken", $data)) {
                throw new AccessDeniedHttpException('This action needs a valid csrf token!');
            }
            $csrfToken = new CsrfToken("Api", $data["csrfToken"]);
            if (!$this->csrfManager->isTokenValid($csrfToken)) {
                throw new AccessDeniedHttpException('This action needs a valid csrf token!');
            }
        }
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::CONTROLLER => 'onKernelController',
        ];
    }
}
?>
