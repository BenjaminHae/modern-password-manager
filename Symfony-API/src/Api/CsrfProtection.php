<?php

namespace App\Api;

use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Symfony\Component\Security\Csrf\CsrfToken;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Psr\Log\LoggerInterface;

abstract class CsrfProtection
{
    private $csrfManager;
    private $logger;

    public function __construct(CsrfTokenManagerInterface $csrfManager, LoggerInterface $logger)
    {
        $this->csrfManager = $csrfManager;
        $this->logger = $logger;
    }

    public function setcsrf($token)
    {
        $csrfToken = new CsrfToken("Api", $token);
        if (!$this->csrfManager->isTokenValid($csrfToken)) {
            $this->logger->error('csrf token invalid '.$csrfToken);
            throw new AccessDeniedHttpException('This action needs a valid csrf token!');
        }
    }
}
