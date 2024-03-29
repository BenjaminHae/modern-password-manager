<?php
/**
 * UserWebAuthnLogonResult
 *
 * PHP version 8.1.1
 *
 * @category Class
 * @package  OpenAPI\Server\Model
 * @author   OpenAPI Generator team
 * @link     https://github.com/openapitools/openapi-generator
 */

/**
 * Password Manager
 *
 * This is a password manager server.
 *
 * The version of the OpenAPI document: 0.0.1
 * Contact: test@te.st
 * Generated by: https://github.com/openapitools/openapi-generator.git
 *
 */

/**
 * NOTE: This class is auto generated by the openapi generator program.
 * https://github.com/openapitools/openapi-generator
 * Do not edit the class manually.
 */

namespace OpenAPI\Server\Model;

use Symfony\Component\Validator\Constraints as Assert;
use JMS\Serializer\Annotation\Type;
use JMS\Serializer\Annotation\SerializedName;

/**
 * Class representing the UserWebAuthnLogonResult model.
 *
 * @package OpenAPI\Server\Model
 * @author  OpenAPI Generator team
 */
class UserWebAuthnLogonResult 
{
        /**
     * @var bool
     * @SerializedName("success")
     * @Assert\NotNull()
     * @Assert\Type("bool")
     * @Type("bool")
     */
    protected $success;

    /**
     * @var string
     * @SerializedName("message")
     * @Assert\NotNull()
     * @Assert\Type("string")
     * @Type("string")
     */
    protected $message;

    /**
     * @var \DateTime|null
     * @SerializedName("lastLogin")
     * @Assert\DateTime()
     * @Type("DateTime")
     */
    protected $lastLogin;

    /**
     * @var int|null
     * @SerializedName("failedLogins")
     * @Assert\Type("int")
     * @Type("int")
     */
    protected $failedLogins;

    /**
     * @var string
     * @SerializedName("decryptionKey")
     * @Assert\NotNull()
     * @Assert\Type("string")
     * @Type("string")
     */
    protected $decryptionKey;

    /**
     * Constructor
     * @param mixed[] $data Associated array of property values initializing the model
     */
    public function __construct(array $data = null)
    {
        $this->success = isset($data['success']) ? $data['success'] : null;
        $this->message = isset($data['message']) ? $data['message'] : null;
        $this->lastLogin = isset($data['lastLogin']) ? $data['lastLogin'] : null;
        $this->failedLogins = isset($data['failedLogins']) ? $data['failedLogins'] : null;
        $this->decryptionKey = isset($data['decryptionKey']) ? $data['decryptionKey'] : null;
    }

    /**
     * Gets success.
     *
     * @return bool
     */
    public function isSuccess()
    {
        return $this->success;
    }

    /**
     * Sets success.
     *
     * @param bool $success
     *
     * @return $this
     */
    public function setSuccess($success)
    {
        $this->success = $success;

        return $this;
    }

    /**
     * Gets message.
     *
     * @return string
     */
    public function getMessage()
    {
        return $this->message;
    }

    /**
     * Sets message.
     *
     * @param string $message
     *
     * @return $this
     */
    public function setMessage($message)
    {
        $this->message = $message;

        return $this;
    }

    /**
     * Gets lastLogin.
     *
     * @return \DateTime|null
     */
    public function getLastLogin(): ?\DateTime
    {
        return $this->lastLogin;
    }

    /**
     * Sets lastLogin.
     *
     * @param \DateTime|null $lastLogin
     *
     * @return $this
     */
    public function setLastLogin(\DateTime $lastLogin = null)
    {
        $this->lastLogin = $lastLogin;

        return $this;
    }

    /**
     * Gets failedLogins.
     *
     * @return int|null
     */
    public function getFailedLogins()
    {
        return $this->failedLogins;
    }

    /**
     * Sets failedLogins.
     *
     * @param int|null $failedLogins
     *
     * @return $this
     */
    public function setFailedLogins($failedLogins = null)
    {
        $this->failedLogins = $failedLogins;

        return $this;
    }

    /**
     * Gets decryptionKey.
     *
     * @return string
     */
    public function getDecryptionKey()
    {
        return $this->decryptionKey;
    }

    /**
     * Sets decryptionKey.
     *
     * @param string $decryptionKey
     *
     * @return $this
     */
    public function setDecryptionKey($decryptionKey)
    {
        $this->decryptionKey = $decryptionKey;

        return $this;
    }
}


