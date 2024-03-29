<?php
/**
 * AccountsApiInterfaceTest
 * PHP version 8.1.1
 *
 * @category Class
 * @package  OpenAPI\Server\Tests\Api
 * @author   openapi-generator contributors
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
 * Please update the test case below to test the endpoint.
 */

namespace OpenAPI\Server\Tests\Api;

use OpenAPI\Server\Configuration;
use OpenAPI\Server\ApiClient;
use OpenAPI\Server\ApiException;
use OpenAPI\Server\ObjectSerializer;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

/**
 * AccountsApiInterfaceTest Class Doc Comment
 *
 * @category Class
 * @package  OpenAPI\Server\Tests\Api
 * @author   openapi-generator contributors
 * @link     https://github.com/openapitools/openapi-generator
 */
class AccountsApiInterfaceTest extends WebTestCase
{

    /**
     * Setup before running any test cases
     */
    public static function setUpBeforeClass()
    {
    }

    /**
     * Setup before running each test case
     */
    public function setUp()
    {
    }

    /**
     * Clean up after running each test case
     */
    public function tearDown()
    {
    }

    /**
     * Clean up after running all test cases
     */
    public static function tearDownAfterClass()
    {
    }

    /**
     * Test case for addAccounts
     *
     * Add Account.
     *
     */
    public function testAddAccounts()
    {
        $client = static::createClient();

        $path = '/accounts';

        $crawler = $client->request('PUT', $path, [], [], ['CONTENT_TYPE' => 'application/json']);
    }

    /**
     * Test case for deleteAccount
     *
     * Delete a stored Account.
     *
     */
    public function testDeleteAccount()
    {
        $client = static::createClient();

        $path = '/accounts/{id}';
        $pattern = '{id}';
        $data = $this->genTestData('\d+');
        $path = str_replace($pattern, $data, $path);

        $crawler = $client->request('DELETE', $path);
    }

    /**
     * Test case for getAccounts
     *
     * Returns the accounts stored by the current user.
     *
     */
    public function testGetAccounts()
    {
        $client = static::createClient();

        $path = '/accounts';

        $crawler = $client->request('GET', $path);
    }

    /**
     * Test case for updateAccount
     *
     * Update a stored account.
     *
     */
    public function testUpdateAccount()
    {
        $client = static::createClient();

        $path = '/accounts/{id}';
        $pattern = '{id}';
        $data = $this->genTestData('\d+');
        $path = str_replace($pattern, $data, $path);

        $crawler = $client->request('POST', $path, [], [], ['CONTENT_TYPE' => 'application/json']);
    }

    protected function genTestData($regexp)
    {
        $grammar  = new \Hoa\File\Read('hoa://Library/Regex/Grammar.pp');
        $compiler = \Hoa\Compiler\Llk\Llk::load($grammar);
        $ast      = $compiler->parse($regexp);
        $generator = new \Hoa\Regex\Visitor\Isotropic(new \Hoa\Math\Sampler\Random());

        return $generator->visit($ast);
    }
}
