<?php
/**
 * HistoryItem
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
 * Class representing the HistoryItem model.
 *
 * @package OpenAPI\Server\Model
 * @author  OpenAPI Generator team
 */
class HistoryItem 
{
        /**
     * @var string
     * @SerializedName("UserAgent")
     * @Assert\NotNull()
     * @Assert\Type("string")
     * @Type("string")
     */
    protected $userAgent;

    /**
     * @var string
     * @SerializedName("IP")
     * @Assert\NotNull()
     * @Assert\Type("string")
     * @Type("string")
     */
    protected $iP;

    /**
     * @var \DateTime
     * @SerializedName("Time")
     * @Assert\NotNull()
     * @Assert\DateTime()
     * @Type("DateTime")
     */
    protected $time;

    /**
     * @var string
     * @SerializedName("Event")
     * @Assert\NotNull()
     * @Assert\Choice({ "Login", "ChangePassword", "Registration" })
     * @Assert\Type("string")
     * @Type("string")
     */
    protected $event;

    /**
     * @var string
     * @SerializedName("EventResult")
     * @Assert\NotNull()
     * @Assert\Type("string")
     * @Type("string")
     */
    protected $eventResult;

    /**
     * Constructor
     * @param mixed[] $data Associated array of property values initializing the model
     */
    public function __construct(array $data = null)
    {
        $this->userAgent = isset($data['userAgent']) ? $data['userAgent'] : null;
        $this->iP = isset($data['iP']) ? $data['iP'] : null;
        $this->time = isset($data['time']) ? $data['time'] : null;
        $this->event = isset($data['event']) ? $data['event'] : null;
        $this->eventResult = isset($data['eventResult']) ? $data['eventResult'] : null;
    }

    /**
     * Gets userAgent.
     *
     * @return string
     */
    public function getUserAgent()
    {
        return $this->userAgent;
    }

    /**
     * Sets userAgent.
     *
     * @param string $userAgent
     *
     * @return $this
     */
    public function setUserAgent($userAgent)
    {
        $this->userAgent = $userAgent;

        return $this;
    }

    /**
     * Gets iP.
     *
     * @return string
     */
    public function getIP()
    {
        return $this->iP;
    }

    /**
     * Sets iP.
     *
     * @param string $iP
     *
     * @return $this
     */
    public function setIP($iP)
    {
        $this->iP = $iP;

        return $this;
    }

    /**
     * Gets time.
     *
     * @return \DateTime
     */
    public function getTime(): \DateTime
    {
        return $this->time;
    }

    /**
     * Sets time.
     *
     * @param \DateTime $time
     *
     * @return $this
     */
    public function setTime(\DateTime $time)
    {
        $this->time = $time;

        return $this;
    }

    /**
     * Gets event.
     *
     * @return string
     */
    public function getEvent()
    {
        return $this->event;
    }

    /**
     * Sets event.
     *
     * @param string $event
     *
     * @return $this
     */
    public function setEvent($event)
    {
        $this->event = $event;

        return $this;
    }

    /**
     * Gets eventResult.
     *
     * @return string
     */
    public function getEventResult()
    {
        return $this->eventResult;
    }

    /**
     * Sets eventResult.
     *
     * @param string $eventResult
     *
     * @return $this
     */
    public function setEventResult($eventResult)
    {
        $this->eventResult = $eventResult;

        return $this;
    }
}


