<?php
/**
 * ChangePassword
 *
 * PHP version 7.1.3
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
 * Class representing the ChangePassword model.
 *
 * @package OpenAPI\Server\Model
 * @author  OpenAPI Generator team
 */
class ChangePassword 
{
        /**
     * @var string
     * @SerializedName("oldPassword")
     * @Assert\NotNull()
     * @Assert\Type("string")
     * @Type("string")
     */
    protected $oldPassword;

    /**
     * @var string
     * @SerializedName("newPassword")
     * @Assert\NotNull()
     * @Assert\Type("string")
     * @Type("string")
     */
    protected $newPassword;

    /**
     * @var OpenAPI\Server\Model\AccountId[]
     * @SerializedName("accounts")
     * @Assert\NotNull()
     * @Assert\Valid()
     * @Assert\All({
     *   @Assert\Type("OpenAPI\Server\Model\AccountId")
     * })
     * @Type("array<OpenAPI\Server\Model\AccountId>")
     */
    protected $accounts;

    /**
     * Constructor
     * @param mixed[] $data Associated array of property values initializing the model
     */
    public function __construct(array $data = null)
    {
        $this->oldPassword = isset($data['oldPassword']) ? $data['oldPassword'] : null;
        $this->newPassword = isset($data['newPassword']) ? $data['newPassword'] : null;
        $this->accounts = isset($data['accounts']) ? $data['accounts'] : null;
    }

    /**
     * Gets oldPassword.
     *
     * @return string
     */
    public function getOldPassword()
    {
        return $this->oldPassword;
    }

    /**
     * Sets oldPassword.
     *
     * @param string $oldPassword
     *
     * @return $this
     */
    public function setOldPassword($oldPassword)
    {
        $this->oldPassword = $oldPassword;

        return $this;
    }

    /**
     * Gets newPassword.
     *
     * @return string
     */
    public function getNewPassword()
    {
        return $this->newPassword;
    }

    /**
     * Sets newPassword.
     *
     * @param string $newPassword
     *
     * @return $this
     */
    public function setNewPassword($newPassword)
    {
        $this->newPassword = $newPassword;

        return $this;
    }

    /**
     * Gets accounts.
     *
     * @return OpenAPI\Server\Model\AccountId[]
     */
    public function getAccounts(): array
    {
        return $this->accounts;
    }

    /**
     * Sets accounts.
     *
     * @param OpenAPI\Server\Model\AccountId[] $accounts
     *
     * @return $this
     */
    public function setAccounts(array $accounts)
    {
        $this->accounts = $accounts;

        return $this;
    }
}


