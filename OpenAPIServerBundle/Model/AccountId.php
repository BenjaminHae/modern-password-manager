<?php
/**
 * AccountId
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
 * Class representing the AccountId model.
 *
 * @package OpenAPI\Server\Model
 * @author  OpenAPI Generator team
 */
class AccountId 
{
        /**
     * @var int
     * @SerializedName("index")
     * @Assert\NotNull()
     * @Assert\Type("int")
     * @Type("int")
     */
    protected $index;

    /**
     * @var string
     * @SerializedName("name")
     * @Assert\NotNull()
     * @Assert\Type("string")
     * @Type("string")
     */
    protected $name;

    /**
     * @var string
     * @SerializedName("additional")
     * @Assert\NotNull()
     * @Assert\Type("string")
     * @Type("string")
     */
    protected $additional;

    /**
     * @var string
     * @SerializedName("password")
     * @Assert\NotNull()
     * @Assert\Type("string")
     * @Type("string")
     */
    protected $password;

    /**
     * Constructor
     * @param mixed[] $data Associated array of property values initializing the model
     */
    public function __construct(array $data = null)
    {
        $this->index = isset($data['index']) ? $data['index'] : null;
        $this->name = isset($data['name']) ? $data['name'] : null;
        $this->additional = isset($data['additional']) ? $data['additional'] : null;
        $this->password = isset($data['password']) ? $data['password'] : null;
    }

    /**
     * Gets index.
     *
     * @return int
     */
    public function getIndex()
    {
        return $this->index;
    }

    /**
     * Sets index.
     *
     * @param int $index
     *
     * @return $this
     */
    public function setIndex($index)
    {
        $this->index = $index;

        return $this;
    }

    /**
     * Gets name.
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Sets name.
     *
     * @param string $name
     *
     * @return $this
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Gets additional.
     *
     * @return string
     */
    public function getAdditional()
    {
        return $this->additional;
    }

    /**
     * Sets additional.
     *
     * @param string $additional
     *
     * @return $this
     */
    public function setAdditional($additional)
    {
        $this->additional = $additional;

        return $this;
    }

    /**
     * Gets password.
     *
     * @return string
     */
    public function getPassword()
    {
        return $this->password;
    }

    /**
     * Sets password.
     *
     * @param string $password
     *
     * @return $this
     */
    public function setPassword($password)
    {
        $this->password = $password;

        return $this;
    }
}


