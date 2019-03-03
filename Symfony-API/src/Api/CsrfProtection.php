<?php

namespace App\Api;

use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Symfony\Component\Security\Csrf\CsrfToken;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

abstract class CsrfProtection
{
    private $csrfManager;

    public function __construct(CsrfTokenManagerInterface $csrfManager)
    {
        $this->csrfManager = $csrfManager;
    }

    public function setcsrf($token)
    {
        $csrfToken = new CsrfToken("Api", $token);
        if (!$this->csrfManager->isTokenValid($csrfToken)) {
            throw new AccessDeniedHttpException('This action needs a valid csrf token!');
        }
    }
}
