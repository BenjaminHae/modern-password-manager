<?php

namespace App\Entity;

use App\Repository\WebAuthnPublicKeyRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=WebAuthnPublicKeyRepository::class)
 */
class WebAuthnPublicKey
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="webAuthnPublicKeys")
     * @ORM\JoinColumn(nullable=false)
     */
    private $User;

    /**
     * @ORM\Column(type="integer")
     */
    private $counter;

    /**
     * @ORM\Column(type="string", length=1024)
     */
    private $publicKey;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $type;

    /**
     * @ORM\Column(type="string", length=1024)
     */
    private $attestationObject;

    /**
     * @ORM\Column(type="string", length=1024)
     */
    private $clientDataJSON;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $deviceName;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->User;
    }

    public function setUser(?User $User): self
    {
        $this->User = $User;

        return $this;
    }

    public function getCounter(): ?int
    {
        return $this->counter;
    }

    public function setCounter(int $counter): self
    {
        $this->counter = $counter;

        return $this;
    }

    public function getPublicKey(): ?string
    {
        return $this->publicKey;
    }

    public function setPublicKey(string $publicKey): self
    {
        $this->publicKey = $publicKey;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
    }

    public function getAttestationObject(): ?string
    {
        return $this->attestationObject;
    }

    public function setAttestationObject(string $attestationObject): self
    {
        $this->attestationObject = $attestationObject;

        return $this;
    }

    public function getClientDataJSON(): ?string
    {
        return $this->clientDataJSON;
    }

    public function setClientDataJSON(string $clientDataJSON): self
    {
        $this->clientDataJSON = $clientDataJSON;

        return $this;
    }

    public function getDeviceName(): ?string
    {
        return $this->deviceName;
    }

    public function setDeviceName(string $deviceName): self
    {
        $this->deviceName = $deviceName;

        return $this;
    }
}
