<?php
/**
 * Logon
 *
 * PHP version 5
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
 * OpenAPI spec version: 0.0.1
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
 * Class representing the Logon model.
 *
 * @package OpenAPI\Server\Model
 * @author  OpenAPI Generator team
 */
class Logon 
{
        /**
     * @var string|null
     * @SerializedName("username")
     * @Assert\Type("string")
     * @Type("string")
     */
    protected $username;

    /**
     * @var string|null
     * @SerializedName("authkey")
     * @Assert\Type("string")
     * @Type("string")
     */
    protected $authkey;

    /**
     * Constructor
     * @param mixed[] $data Associated array of property values initializing the model
     */
    public function __construct(array $data = null)
    {
        $this->username = isset($data['username']) ? $data['username'] : null;
        $this->authkey = isset($data['authkey']) ? $data['authkey'] : null;
    }

    /**
     * Gets username.
     *
     * @return string|null
     */
    public function getUsername()
    {
        return $this->username;
    }

    /**
     * Sets username.
     *
     * @param string|null $username
     *
     * @return $this
     */
    public function setUsername($username = null)
    {
        $this->username = $username;

        return $this;
    }

    /**
     * Gets authkey.
     *
     * @return string|null
     */
    public function getAuthkey()
    {
        return $this->authkey;
    }

    /**
     * Sets authkey.
     *
     * @param string|null $authkey
     *
     * @return $this
     */
    public function setAuthkey($authkey = null)
    {
        $this->authkey = $authkey;

        return $this;
    }
}


