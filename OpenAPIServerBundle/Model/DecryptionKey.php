<?php
/**
 * DecryptionKey
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
 * Class representing the DecryptionKey model.
 *
 * @package OpenAPI\Server\Model
 * @author  OpenAPI Generator team
 */
class DecryptionKey 
{
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
        $this->decryptionKey = isset($data['decryptionKey']) ? $data['decryptionKey'] : null;
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


