<?php
// src/Acme/MyBundle/Api/MaintenanceApiInterface.php

namespace App\Api;

use App\Controller\WebAuthnController;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use OpenAPI\Server\Api\MaintenanceApiInterface;
use OpenAPI\Server\Model\ServerInformation;

class MaintenanceApi implements MaintenanceApiInterface
{
    
    private $csrfManager;
    private $allowRegistration;
    private $defaultUserConfig;
    private $idleTimeout;
    private $webAuthnController;

    public function __construct(CsrfTokenManagerInterface $csrfManager, WebAuthnController $webAuthnController, $allowRegistration, $idleTimeout, $defaultUserConfig)
    {
        $this->csrfManager = $csrfManager;
        $this->allowRegistration = strtolower($allowRegistration) === "true";
        $this->defaultUserConfig = $defaultUserConfig;
        $this->idleTimeout = $idleTimeout;
        $this->webAuthnController = $webAuthnController;
    }

    /**
     * Implementation of MaintenanceApiInterface#serverInformation
     */
    public function serverInformation(&$responseCode, array &$responseHeaders): ServerInformation
    {
        $challenge = base64_encode($this->webAuthnController->createChallenge()->getBinaryString());
        $csrfToken = $this->csrfManager->getToken("Api")->getValue();

        return new ServerInformation( [
            "csrfToken" => $csrfToken, 
            "allowRegistration" => $this->allowRegistration, 
            "idleTimeout" => $this->idleTimeout, 
            "defaultUserConfiguration" => $this->defaultUserConfig, 
            "webAuthNChallenge" => $challenge 
        ]);
    }

}
