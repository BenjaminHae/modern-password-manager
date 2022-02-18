<?php

namespace App\Security;

use App\Entity\User;
use App\Entity\WebAuthnPublicKey;
use App\Controller\EventController;
use App\Controller\WebAuthnController;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Psr\Log\LoggerInterface;

class WebAuthnAuthenticator extends AbstractAuthenticator
{
    const RESPONSE_KEYS = [ "authenticatorData", "clientDataJSON", "type", "signature" ];
    private $em;
    private $security;
    private $requestStack;
    private $logger;

    public function __construct(EntityManagerInterface $em, Security $security, EventController $eventController, RequestStack $requestStack, LoggerInterface $logger)
    {
        $this->em = $em;
        $this->security = $security;
        $this->eventController = $eventController;
        $this->requestStack = $requestStack;
        $this->logger = $logger;
    }

    /**
     * Called on every request to decide if this authenticator should be
     * used for the request. Returning `false` will cause this authenticator
     * to be skipped.
     */
    public function supports(Request $request): ?bool
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
        foreach (self::RESPONSE_KEYS as $key) {
            if (! array_key_exists($key, $data["response"]))
                return false;
        }
        return true;
    }

    /**
     * Called on every request. Return whatever credentials you want to
     * be passed to getUser() as $credentials.
     */
    public function authenticate(Request $request): Passport
    {
        $this->logger->debug("Reading WebAuthN Response Data");
        $data = json_decode($request->getContent(), true);
        //check for valid data
        $credentials = [];
        $credentials["id"] = $data["id"];
        //extract credentials
        foreach (self::RESPONSE_KEYS as $key) {
            $credentials[$key] = $data["response"][$key];
        }
        /*
            $credentials->clientDataJSON,
            $credentials->authenticatorData, 
            $credentials->signature, 
            $credentials->userHandle, 
            $credentials->id, 
        */
        $this->logger->debug("Obtaining User From Credentials");
        $user = $this->getUserFromWebAuthNCredentials($credentials);
        if ($user === null) {
            $this->logger->error("Could not obtain user from WebAuthNCredentials");
            throw new CustomUserMessageAuthenticationException('No user found for WebAuthNCredentials');
        }
        $this->logger->debug("Creating Passport");
        // todo implement user badge
        return new Passport(
            new UserBadge(
                $credentials["id"], 
                function ($id) {
                    return $this->getUserFromWebAuthNCredentials($id);
                }
            ), 
            new CustomCredentials(
                function ($credentials, UserInterface $user) {
                    return $this->checkCredentials($credentials, $user);
                },
                $credentials
            )
        );

    }

    public function getUserFromWebAuthNCredentials($id)
    {
        $pk = $this->em->getRepository(WebAuthnPublicKey::class)
            ->findOneByPublicKeyId($id);
        if (null === $pk) {
            return null;
        }
        return $pk->getUser();
    }

    public function checkCredentials($credentials, UserInterface $user)
    {
        $webAuthn = new WebAuthnController($this->em, $this->eventController, $this->requestStack, $this->logger);
        return $webAuthn->checkCredentials($credentials, $user);
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        // on success, let the request continue
        return null;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
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
}
