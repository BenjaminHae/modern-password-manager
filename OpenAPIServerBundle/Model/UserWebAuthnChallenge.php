<?php
/**
 * UserWebAuthnChallenge
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
 * Class representing the UserWebAuthnChallenge model.
 *
 * @package OpenAPI\Server\Model
 * @author  OpenAPI Generator team
 */
class UserWebAuthnChallenge 
{
        /**
     * @var string
     * @SerializedName("challenge")
     * @Assert\NotNull()
     * @Assert\Type("string")
     * @Type("string")
     */
    protected $challenge;

    /**
     * Constructor
     * @param mixed[] $data Associated array of property values initializing the model
     */
    public function __construct(array $data = null)
    {
        $this->challenge = isset($data['challenge']) ? $data['challenge'] : null;
    }

    /**
     * Gets challenge.
     *
     * @return string
     */
    public function getChallenge()
    {
        return $this->challenge;
    }

    /**
     * Sets challenge.
     *
     * @param string $challenge
     *
     * @return $this
     */
    public function setChallenge($challenge)
    {
        $this->challenge = $challenge;

        return $this;
    }
}


