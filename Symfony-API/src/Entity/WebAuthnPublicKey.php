<?php

namespace App\Entity;

use App\Repository\WebAuthnPublicKeyRepository;
use Doctrine\ORM\Mapping as ORM;
use OpenAPI\Server\Model\UserWebAuthnCred as OpenAPIUserWebAuthnCred;

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
    private $deviceName;

    /**
     * @ORM\Column(type="string", length=1024)
     */
    private $PublicKeyId;

    /**
     * @ORM\ManyToOne(targetEntity=DecryptionKey::class)
     * @ORM\JoinColumn(nullable=false)
     */
    private $decryptionKey;

    /**
     * @ORM\Column(type="datetimetz", nullable=true)
     */
    private $lastUsed;

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

    public function getDeviceName(): ?string
    {
        return $this->deviceName;
    }

    public function setDeviceName(string $deviceName): self
    {
        $this->deviceName = $deviceName;

        return $this;
    }

    public function getAsOpenAPIUserWebAuthnCred(): OpenAPIUserWebAuthnCred
    {
        $contents = [
            "name" => $this->getDeviceName(),
            "id" => $this->getId(),
            "lastUsed" => $this->getLastUsed()
        ];
        return new OpenAPIUserWebAuthnCred($contents);
    }

    public function getPublicKeyId(): ?string
    {
        return $this->PublicKeyId;
    }

    public function setPublicKeyId(string $PublicKeyId): self
    {
        $this->PublicKeyId = $PublicKeyId;

        return $this;
    }

    public function getDecryptionKey(): ?DecryptionKey
    {
        return $this->decryptionKey;
    }

    public function setDecryptionKey(?DecryptionKey $decryptionKey): self
    {
        $this->decryptionKey = $decryptionKey;

        return $this;
    }

    public function getLastUsed(): ?\DateTimeInterface
    {
        return $this->lastUsed;
    }

    public function setLastUsed(?\DateTimeInterface $lastUsed): self
    {
        $this->lastUsed = $lastUsed;

        return $this;
    }

}
