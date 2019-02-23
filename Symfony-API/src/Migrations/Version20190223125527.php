<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190223125527 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'sqlite', 'Migration can only be executed safely on \'sqlite\'.');

        $this->addSql('DROP INDEX IDX_7D3656A4A76ED395');
        $this->addSql('CREATE TEMPORARY TABLE __temp__account AS SELECT id, user_id, name, password, other FROM account');
        $this->addSql('DROP TABLE account');
        $this->addSql('CREATE TABLE account (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, user_id INTEGER NOT NULL, name CLOB NOT NULL COLLATE BINARY, password CLOB NOT NULL COLLATE BINARY, other CLOB DEFAULT NULL COLLATE BINARY --(DC2Type:json)
        , CONSTRAINT FK_7D3656A4A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('INSERT INTO account (id, user_id, name, password, other) SELECT id, user_id, name, password, other FROM __temp__account');
        $this->addSql('DROP TABLE __temp__account');
        $this->addSql('CREATE INDEX IDX_7D3656A4A76ED395 ON account (user_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'sqlite', 'Migration can only be executed safely on \'sqlite\'.');

        $this->addSql('DROP INDEX IDX_7D3656A4A76ED395');
        $this->addSql('CREATE TEMPORARY TABLE __temp__account AS SELECT id, user_id, name, password, other FROM account');
        $this->addSql('DROP TABLE account');
        $this->addSql('CREATE TABLE account (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, user_id INTEGER NOT NULL, name CLOB NOT NULL, password CLOB NOT NULL, other CLOB DEFAULT NULL --(DC2Type:json)
        )');
        $this->addSql('INSERT INTO account (id, user_id, name, password, other) SELECT id, user_id, name, password, other FROM __temp__account');
        $this->addSql('DROP TABLE __temp__account');
        $this->addSql('CREATE INDEX IDX_7D3656A4A76ED395 ON account (user_id)');
    }
}
