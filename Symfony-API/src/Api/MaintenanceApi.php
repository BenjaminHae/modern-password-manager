<?php
// src/Acme/MyBundle/Api/MaintenanceApiInterface.php

namespace App\Api;

use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use OpenAPI\Server\Api\MaintenanceApiInterface;
use OpenAPI\Server\Model\ServerInformation;

class MaintenanceApi implements MaintenanceApiInterface
{
    
    private $csrfManager;

    public function __construct(CsrfTokenManagerInterface $csrfManager)
    {
        $this->csrfManager = $csrfManager;
    }

    /**
     * Implementation of MaintenanceApiInterface#serverInformation
     */
    public function serverInformation(&$responseCode, array &$responseHeaders)
    {
        return new ServerInformation(["csrfToken" => $this->csrfManager->getToken("Api")->getValue()]);
    }

}
