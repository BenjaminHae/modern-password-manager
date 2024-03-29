<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\Criteria;
use Doctrine\Common\Collections\Expr\Comparison;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;

/**
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 */
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=180, unique=true)
     */
    private $username;

    /**
     * @ORM\Column(type="json")
     */
    private $roles = [];

    /**
     * @var string The hashed password
     * @ORM\Column(type="string")
     */
    private $password;

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

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Account", mappedBy="user", orphanRemoval=true)
     */
    private $accounts;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $ClientConfiguration;

    /**
     * @ORM\OneToMany(targetEntity=Event::class, mappedBy="User", orphanRemoval=true)
     */
    private $events;

    /**
     * @ORM\OneToMany(targetEntity=WebAuthnPublicKey::class, mappedBy="User", orphanRemoval=true)
     */
    private $webAuthnPublicKeys;

    public function __construct()
    {
        $this->accounts = new ArrayCollection();
        $this->events = new ArrayCollection();
        $this->webAuthnPublicKeys = new ArrayCollection();
    }

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

    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    public function getPassword(): string
    {
        return (string) $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
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

    /**
     * @return Collection|Account[]
     */
    public function getAccounts(): Collection
    {
        return $this->accounts;
    }

    public function addAccount(Account $account): self
    {
        if (!$this->accounts->contains($account)) {
            $this->accounts[] = $account;
            $account->setUser($this);
        }

        return $this;
    }

    public function removeAccount(Account $account): self
    {
        if ($this->accounts->contains($account)) {
            $this->accounts->removeElement($account);
            // set the owning side to null (unless already changed)
            if ($account->getUser() === $this) {
                $account->setUser(null);
            }
        }

        return $this;
    }

    public function getClientConfiguration(): ?string
    {
        return $this->ClientConfiguration;
    }

    public function setClientConfiguration(?string $ClientConfiguration): self
    {
        $this->ClientConfiguration = $ClientConfiguration;

        return $this;
    }

    /**
     * @return Collection|Event[]
     */
    public function getEvents(): Collection
    {
        return $this->events;
    }

    public function addEvent(Event $event): self
    {
        if (!$this->events->contains($event)) {
            $this->events[] = $event;
            $event->setUser($this);
        }

        return $this;
    }

    public function removeEvent(Event $event): self
    {
        if ($this->events->contains($event)) {
            $this->events->removeElement($event);
            // set the owning side to null (unless already changed)
            if ($event->getUser() === $this) {
                $event->setUser(null);
            }
        }

        return $this;
    }

    public function getLastSuccessfulLoginEvent(): ?Event
    {
        $lastLoginCriteria = Criteria::create();
        $lastLoginCriteria
            ->where(Criteria::expr()->eq('EventType', "Login"))
            ->andWhere(Criteria::expr()->startsWith('EventResult', "success"))
            ->orderBy(['Time' => 'DESC']);
        $relevantLogin = $this->events->matching($lastLoginCriteria)->next();
        if ($relevantLogin) {
          return $relevantLogin;
        }
        return null;
    }

    public function getLastSuccessfulLoginTimeAndUnsuccessfulCount() {
        $lastLogin = $this->getLastSuccessfulLoginEvent();
        $lastLoginTime = null;
        $unsuccessfulCriteria = Criteria::create();
        $unsuccessfulCriteria
            ->where(Criteria::expr()->eq('EventType', "Login"))
            ->andWhere(Criteria::expr()->startsWith('EventResult', "failed"));
        if ($lastLogin !== null) {
            $lastLoginTime = $lastLogin->getTime();
            $unsuccessfulCriteria
                ->andWhere(Criteria::expr()->gt('Time', $lastLoginTime));
        }
        $unsuccessful = $this->events->matching($unsuccessfulCriteria);
        return [$lastLoginTime, $unsuccessful->count()];
    }

    /**
     * @return Collection|WebAuthnPublicKey[]
     */
    public function getWebAuthnPublicKeys(): Collection
    {
        return $this->webAuthnPublicKeys;
    }

    public function addWebAuthnPublicKey(WebAuthnPublicKey $webAuthnPublicKey): self
    {
        if (!$this->webAuthnPublicKeys->contains($webAuthnPublicKey)) {
            $this->webAuthnPublicKeys[] = $webAuthnPublicKey;
            $webAuthnPublicKey->setUser($this);
        }

        return $this;
    }

    public function removeWebAuthnPublicKey(WebAuthnPublicKey $webAuthnPublicKey): self
    {
        if ($this->webAuthnPublicKeys->contains($webAuthnPublicKey)) {
            $this->webAuthnPublicKeys->removeElement($webAuthnPublicKey);
            // set the owning side to null (unless already changed)
            if ($webAuthnPublicKey->getUser() === $this) {
                $webAuthnPublicKey->setUser(null);
            }
        }

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string {
        return $this->getUsername();
    }
}
