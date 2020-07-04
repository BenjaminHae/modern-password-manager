<?php

namespace App\Entity;

use App\Repository\EventRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=EventRepository::class)
 */
class Event
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
    private $UserAgent;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $IP;

    /**
     * @ORM\Column(type="datetimetz")
     */
    private $Time;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $EventType;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $ActionResult;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUserAgent(): ?string
    {
        return $this->UserAgent;
    }

    public function setUserAgent(string $UserAgent): self
    {
        $this->UserAgent = $UserAgent;

        return $this;
    }

    public function getIP(): ?string
    {
        return $this->IP;
    }

    public function setIP(string $IP): self
    {
        $this->IP = $IP;

        return $this;
    }

    public function getTime(): ?\DateTimeInterface
    {
        return $this->Time;
    }

    public function setTime(\DateTimeInterface $Time): self
    {
        $this->Time = $Time;

        return $this;
    }

    public function getEventType(): ?string
    {
        return $this->EventType;
    }

    public function setEventType(string $EventType): self
    {
        $this->EventType = $EventType;

        return $this;
    }

    public function getActionResult(): ?string
    {
        return $this->ActionResult;
    }

    public function setActionResult(string $ActionResult): self
    {
        $this->ActionResult = $ActionResult;

        return $this;
    }
}
