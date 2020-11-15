<?php

namespace App\Entity;

use App\Repository\DecryptionKeyRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=DecryptionKeyRepository::class)
 */
class DecryptionKey
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=1024)
     */
    private $decryptionKey;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDecryptionKey(): ?string
    {
        return $this->decryptionKey;
    }

    public function setDecryptionKey(string $decryptionKey): self
    {
        $this->decryptionKey = $decryptionKey;

        return $this;
    }
}
