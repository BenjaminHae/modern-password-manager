<?php

namespace App\Security;

use App\Entity\User;
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
use lbuchs\WebAuthn\WebAuthn;

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
        if (!('open_api_server_user_loginuser' === $request->attributes->get('_route') && $request->isMethod('POST') && ($request->headers->get('Content-Type') === "application/json"))) {
            return false;
        }
        $data = json_decode($request->getContent(), true);
        //check for valid data
        $keys = [ "clientDataJSON", "authenticatorData", "signature", "pubKeyId", "userHandle" ];
        foreach ($keys as $key) {
            if (! array_key_exists($key, $data))
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
        $keys = [ "clientDataJSON", "authenticatorData", "signature", "pubKeyId", "userHandle" ];
        $credentials = [];
        //extract credentials
        foreach ($keys as $key) {
            $credentials[$key] = $data[$key];
        }
        /*
            $credentials->clientDataJSON,
            $credentials->authenticatorData, 
            $credentials->signature, 
            $credentials->userHandle, 
            $credentials->pubKeyId, 
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
        //todo identify user by public key or something similar

        // if a User is returned, checkCredentials() is called
        return $this->em->getRepository(User::class)//WebAuthnPublicKey->findOneBy(
            ->findOneBy(['apiToken' => $credentials])
        ;
    }

    public function checkCredentials($credentials, UserInterface $user)
    {
        // todo validate credentials using the webauthn library
        $challenge = $this->session->get(challenge, null); 
        if ($challenge === null) {
            return false;
        } 
        $configuration = $this->getRp();
        $webAuthn = new WebAuthn($configuration["name"], $configuration["id"]);
        return $webAuthn->processGet(
            $credentials->clientDataJSON,
            $credentials->authenticatorData, 
            $credentials->signature, 
            $user->credentialPublicKey, 
            $challenge, 
            null, 
            true, 
            true);
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
            'message' => strtr("login failed", "login failed")

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
