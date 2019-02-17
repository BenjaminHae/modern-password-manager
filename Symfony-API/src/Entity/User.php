<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 */
class User
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $username;

    /**
     * @ORM\Column(type="string", length=510)
     */
    private $passwordHash;

    /**
     * @ORM\Column(type="binary")
     */
    private $salt;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $email;

    /**
     * @ORM\Column(type="json", nullable=true)
     */
    private $clientSettings = [];

    /**
     * @ORM\Column(type="json", nullable=true)
     */
    private $serverSettings = [];

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): self
    {
        $this->username = $username;

        return $this;
    }

    public function getPasswordHash(): ?string
    {
        return $this->passwordHash;
    }

    public function setPasswordHash(string $passwordHash): self
    {
        $this->passwordHash = $passwordHash;

        return $this;
    }

    public function getSalt()
    {
        return $this->salt;
    }

    public function setSalt($salt): self
    {
        $this->salt = $salt;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getClientSettings(): ?array
    {
        return $this->clientSettings;
    }

    public function setClientSettings(?array $clientSettings): self
    {
        $this->clientSettings = $clientSettings;

        return $this;
    }

    public function getServerSettings(): ?array
    {
        return $this->serverSettings;
    }

    public function setServerSettings(?array $serverSettings): self
    {
        $this->serverSettings = $serverSettings;

        return $this;
    }
}
