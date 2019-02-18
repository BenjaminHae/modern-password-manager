<?php

namespace App\Api;

use OpenAPI\Server\Api\UserApiInterface;
use OpenAPI\Server\Model\Logon;
use OpenAPI\Server\Model\Registration;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;


class UserApi implements UserApiInterface
{
    private $entityManager;
    private $passwordEncoder;

    public function __construct(EntityManagerInterface $entityManager, UserPasswordEncoderInterface $passwordEncoder)
    {
        $this->entityManager = $entityManager;
        $this->passwordEncoder = $passwordEncoder;
    }

    // ...

    public function loginUser(Logon $body, &$responseCode, array &$responseHeaders) {
        return ["success"=> true];
    }

    public function logoutUser(&$responseCode, array &$responseHeaders) {
        $responseCode = 501;
        return ["not implemented"=> true];
    }

    public function registerUser(Registration $registration, &$responseCode, array &$responseHeaders) {
	$user = new User();
        $user->setUsername($registration->getUsername());
        $user->setEmail($registration->getEmail());
        $user->setPassword($this->passwordEncoder->encodePassword($user, $registration->getPassword()));
        $this->entityManager->persist($user);
        $this->entityManager->flush();
        return ["success" => true];
    }

    // ...
}
