<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200704181027 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE event (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, user_agent VARCHAR(255) NOT NULL, ip VARCHAR(255) NOT NULL, time DATETIME NOT NULL, event_type VARCHAR(255) NOT NULL, action_result VARCHAR(255) NOT NULL)');
        $this->addSql('DROP TABLE migration_versions');
        $this->addSql('DROP INDEX IDX_7D3656A4A76ED395');
        $this->addSql('CREATE TEMPORARY TABLE __temp__account AS SELECT id, user_id, name, password, other FROM account');
        $this->addSql('DROP TABLE account');
        $this->addSql('CREATE TABLE account (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, user_id INTEGER NOT NULL, name CLOB NOT NULL COLLATE BINARY, password CLOB NOT NULL COLLATE BINARY, other CLOB DEFAULT NULL COLLATE BINARY, CONSTRAINT FK_7D3656A4A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('INSERT INTO account (id, user_id, name, password, other) SELECT id, user_id, name, password, other FROM __temp__account');
        $this->addSql('DROP TABLE __temp__account');
        $this->addSql('CREATE INDEX IDX_7D3656A4A76ED395 ON account (user_id)');
        $this->addSql('ALTER TABLE user ADD COLUMN client_configuration CLOB DEFAULT NULL');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE migration_versions (version VARCHAR(14) NOT NULL COLLATE BINARY, executed_at DATETIME NOT NULL --(DC2Type:datetime_immutable)
        , PRIMARY KEY(version))');
        $this->addSql('DROP TABLE event');
        $this->addSql('DROP INDEX IDX_7D3656A4A76ED395');
        $this->addSql('CREATE TEMPORARY TABLE __temp__account AS SELECT id, user_id, name, password, other FROM account');
        $this->addSql('DROP TABLE account');
        $this->addSql('CREATE TABLE account (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, user_id INTEGER NOT NULL, name CLOB NOT NULL, password CLOB NOT NULL, other CLOB DEFAULT NULL)');
        $this->addSql('INSERT INTO account (id, user_id, name, password, other) SELECT id, user_id, name, password, other FROM __temp__account');
        $this->addSql('DROP TABLE __temp__account');
        $this->addSql('CREATE INDEX IDX_7D3656A4A76ED395 ON account (user_id)');
        $this->addSql('DROP INDEX UNIQ_8D93D649F85E0677');
        $this->addSql('CREATE TEMPORARY TABLE __temp__user AS SELECT id, username, roles, password, email, client_settings, server_settings FROM user');
        $this->addSql('DROP TABLE user');
        $this->addSql('CREATE TABLE user (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, username VARCHAR(180) NOT NULL, roles CLOB NOT NULL --(DC2Type:json)
        , password VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, client_settings CLOB DEFAULT NULL --(DC2Type:json)
        , server_settings CLOB DEFAULT NULL --(DC2Type:json)
        )');
        $this->addSql('INSERT INTO user (id, username, roles, password, email, client_settings, server_settings) SELECT id, username, roles, password, email, client_settings, server_settings FROM __temp__user');
        $this->addSql('DROP TABLE __temp__user');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649F85E0677 ON user (username)');
    }
}
