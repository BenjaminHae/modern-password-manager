<?php

namespace App\EventListener;

use Symfony\Component\Security\Http\Event\LogoutEvent;
use App\Api\UserApi;

class LogoutListener
{
    private $userApi;

    public function __construct(UserApi $userApi)
    {
        $this->userApi = $userApi;
    }

    public function onSymfonyComponentSecurityHttpEventLogoutEvent(LogoutEvent $logoutEvent): void {
        $response = $this->userApi->onLogoutSuccess(null);
        $logoutEvent->setResponse($response);
    }

}
?>
