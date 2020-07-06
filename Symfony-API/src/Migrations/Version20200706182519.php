<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200706182519 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE migration_versions');
        $this->addSql('DROP INDEX IDX_7D3656A4A76ED395');
        $this->addSql('CREATE TEMPORARY TABLE __temp__account AS SELECT id, user_id, name, password, other FROM account');
        $this->addSql('DROP TABLE account');
        $this->addSql('CREATE TABLE account (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, user_id INTEGER NOT NULL, name CLOB NOT NULL COLLATE BINARY, password CLOB NOT NULL COLLATE BINARY, other CLOB DEFAULT NULL COLLATE BINARY, CONSTRAINT FK_7D3656A4A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('INSERT INTO account (id, user_id, name, password, other) SELECT id, user_id, name, password, other FROM __temp__account');
        $this->addSql('DROP TABLE __temp__account');
        $this->addSql('CREATE INDEX IDX_7D3656A4A76ED395 ON account (user_id)');
        $this->addSql('DROP INDEX IDX_3BAE0AA7A76ED395');
        $this->addSql('CREATE TEMPORARY TABLE __temp__event AS SELECT id, user_id, user_agent, ip, time, event_type, action_result FROM event');
        $this->addSql('DROP TABLE event');
        $this->addSql('CREATE TABLE event (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, user_id INTEGER NOT NULL, user_agent VARCHAR(255) NOT NULL COLLATE BINARY, ip VARCHAR(255) NOT NULL COLLATE BINARY, event_type VARCHAR(255) NOT NULL COLLATE BINARY, event_result VARCHAR(255) NOT NULL, time DATETIME NOT NULL, CONSTRAINT FK_3BAE0AA7A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('INSERT INTO event (id, user_id, user_agent, ip, time, event_type, event_result) SELECT id, user_id, user_agent, ip, time, event_type, action_result FROM __temp__event');
        $this->addSql('DROP TABLE __temp__event');
        $this->addSql('CREATE INDEX IDX_3BAE0AA7A76ED395 ON event (user_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE migration_versions (version VARCHAR(14) NOT NULL COLLATE BINARY, executed_at DATETIME NOT NULL --(DC2Type:datetime_immutable)
        , PRIMARY KEY(version))');
        $this->addSql('DROP INDEX IDX_7D3656A4A76ED395');
        $this->addSql('CREATE TEMPORARY TABLE __temp__account AS SELECT id, user_id, name, password, other FROM account');
        $this->addSql('DROP TABLE account');
        $this->addSql('CREATE TABLE account (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, user_id INTEGER NOT NULL, name CLOB NOT NULL, password CLOB NOT NULL, other CLOB DEFAULT NULL)');
        $this->addSql('INSERT INTO account (id, user_id, name, password, other) SELECT id, user_id, name, password, other FROM __temp__account');
        $this->addSql('DROP TABLE __temp__account');
        $this->addSql('CREATE INDEX IDX_7D3656A4A76ED395 ON account (user_id)');
        $this->addSql('DROP INDEX IDX_3BAE0AA7A76ED395');
        $this->addSql('CREATE TEMPORARY TABLE __temp__event AS SELECT id, user_id, user_agent, ip, time, event_type, event_result FROM event');
        $this->addSql('DROP TABLE event');
        $this->addSql('CREATE TABLE event (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, user_id INTEGER NOT NULL, user_agent VARCHAR(255) NOT NULL, ip VARCHAR(255) NOT NULL, event_type VARCHAR(255) NOT NULL, action_result VARCHAR(255) NOT NULL COLLATE BINARY, time DATETIME NOT NULL)');
        $this->addSql('INSERT INTO event (id, user_id, user_agent, ip, time, event_type, action_result) SELECT id, user_id, user_agent, ip, time, event_type, event_result FROM __temp__event');
        $this->addSql('DROP TABLE __temp__event');
        $this->addSql('CREATE INDEX IDX_3BAE0AA7A76ED395 ON event (user_id)');
    }
}
