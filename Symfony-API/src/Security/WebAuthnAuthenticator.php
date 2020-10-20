<?php

namespace App\Security;

use App\Entity\User;
use App\Entity\WebAuthnPublicKey;
use App\Controller\WebAuthnController;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Guard\AbstractGuardAuthenticator;

class WebAuthnAuthenticator extends AbstractGuardAuthenticator
{
    private $em;
    private $session;
    private $security;

    public function __construct(EntityManagerInterface $em, SessionInterface $session, Security $security)
    {
        $this->em = $em;
        $this->session = $session;
        $this->security = $security;
    }

    /**
     * Called on every request to decide if this authenticator should be
     * used for the request. Returning `false` will cause this authenticator
     * to be skipped.
     */
    public function supports(Request $request)
    {
        if ($this->security->getUser()) {
            return false;
        }
        if (!('open_api_server_user_loginuserwebauthnget' === $request->attributes->get('_route') && $request->isMethod('POST') && ($request->headers->get('Content-Type') === "application/json"))) {
            return false;
        }
        $data = json_decode($request->getContent(), true);
        //check for valid data
        $keys = [ "id", "response" ];
        foreach ($keys as $key) {
            if (! array_key_exists($key, $data))
                return false;
        }
        $responseKeys = [ "authenticatorData", "clientDataJSON", "type", "signature", "userHandle" ];
        foreach ($responseKeys as $key) {
            if (! array_key_exists($key, $data["response"]))
                return false;
        }
        return true;
    }

    /**
     * Called on every request. Return whatever credentials you want to
     * be passed to getUser() as $credentials.
     */
    public function getCredentials(Request $request)
    {
        $data = json_decode($request->getContent(), true);
        //check for valid data
        $responseKeys = [ "authenticatorData", "clientDataJSON", "type", "signature", "userHandle" ];
        $credentials = [];
        $credentials["id"] = $data["id"];
        //extract credentials
        foreach ($responseKeys as $key) {
            $credentials[$key] = $data["response"][$key];
        }
        /*
            $credentials->clientDataJSON,
            $credentials->authenticatorData, 
            $credentials->signature, 
            $credentials->userHandle, 
            $credentials->id, 
        */
        return $credentials;
    }

    public function getUser($credentials, UserProviderInterface $userProvider)
    {
        if (null === $credentials) {
            // The token header was empty, authentication fails with HTTP Status
            // Code 401 "Unauthorized"
            return null;
        }
        $pk = $this->em->getRepository(WebAuthnPublicKey::class)
            ->findOneByPublicKeyId($credentials["id"]);
        if (null === $pk) {
            return null;
        }
        return $pk->getUser();
    }

    public function checkCredentials($credentials, UserInterface $user)
    {
        $webAuthn = new WebAuthnController($this->em, $this->session);
        return $webAuthn->checkCredentials($credentials);
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, $providerKey)
    {
        // on success, let the request continue
        return null;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception)
    {
        $data = [
            // you may want to customize or obfuscate the message first
            "success" => false,
            'message' => "login failed"

            // or to translate this message
            // $this->translator->trans($exception->getMessageKey(), $exception->getMessageData())
        ];

        return new JsonResponse($data, Response::HTTP_UNAUTHORIZED);
    }

    /**
     * Called when authentication is needed, but it's not sent
     */
    public function start(Request $request, AuthenticationException $authException = null)
    {
        $data = [
            // you might translate this message
            'message' => 'Authentication Required'
        ];

        return new JsonResponse($data, Response::HTTP_UNAUTHORIZED);
    }

    public function supportsRememberMe()
    {
        return false;
    }
}
