import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1760431044444 implements MigrationInterface {
    name = 'Init1760431044444'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`products\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` text NULL, \`sku\` varchar(100) NULL, \`price\` decimal(10,2) NULL, \`inventory\` int NOT NULL DEFAULT '0', \`images\` json NULL, \`categories\` json NULL, \`status\` varchar(20) NOT NULL DEFAULT 'active', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_c44ac33a05b144dd0d9ddcf932\` (\`sku\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product_mappings\` (\`id\` int NOT NULL AUTO_INCREMENT, \`product_id\` int NOT NULL, \`platform_id\` int NOT NULL, \`platform_product_id\` varchar(255) NULL, \`platform_data\` json NULL, \`sync_status\` varchar(255) NOT NULL DEFAULT 'pending', \`last_synced_at\` datetime NULL, \`sync_direction\` varchar(255) NOT NULL DEFAULT 'bidirectional', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`order_items\` (\`id\` int NOT NULL AUTO_INCREMENT, \`order_id\` int NOT NULL, \`product_id\` int NULL, \`product_mapping_id\` int NULL, \`quantity\` int NOT NULL, \`unit_price\` decimal(10,2) NULL, \`total_price\` decimal(10,2) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`orders\` (\`id\` int NOT NULL AUTO_INCREMENT, \`platform_id\` int NOT NULL, \`platform_order_id\` varchar(100) NOT NULL, \`customer_name\` varchar(255) NULL, \`customer_email\` varchar(255) NULL, \`customer_phone\` varchar(20) NULL, \`shipping_address\` json NULL, \`billing_address\` json NULL, \`total_amount\` decimal(10,2) NULL, \`currency\` varchar(3) NOT NULL DEFAULT 'VND', \`status\` varchar(50) NULL, \`payment_status\` varchar(50) NULL, \`payment_method\` varchar(50) NULL, \`notes\` text NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`sync_logs\` (\`id\` int NOT NULL AUTO_INCREMENT, \`platform_id\` int NULL, \`sync_type\` varchar(50) NOT NULL, \`sync_direction\` varchar(10) NOT NULL, \`status\` varchar(20) NOT NULL, \`started_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`completed_at\` timestamp NULL, \`records_processed\` int NOT NULL DEFAULT '0', \`records_success\` int NOT NULL DEFAULT '0', \`records_failed\` int NOT NULL DEFAULT '0', \`error_message\` text NULL, \`sync_data\` json NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`webhook_events\` (\`id\` int NOT NULL AUTO_INCREMENT, \`platform_id\` int NULL, \`event_type\` varchar(100) NOT NULL, \`payload\` json NOT NULL, \`processed\` tinyint NOT NULL DEFAULT 0, \`processed_at\` timestamp NULL, \`error_message\` text NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`platforms\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NOT NULL, \`display_name\` varchar(100) NOT NULL, \`api_config\` json NULL, \`webhook_url\` varchar(500) NULL, \`status\` varchar(20) NOT NULL DEFAULT 'active', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_6add27e349b6905c85e016fa2c\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`sync_conflicts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`product_mapping_id\` int NOT NULL, \`conflict_type\` varchar(50) NOT NULL, \`local_value\` json NOT NULL, \`platform_value\` json NOT NULL, \`resolution\` varchar(20) NOT NULL DEFAULT 'pending', \`resolved_by\` int NULL, \`resolved_at\` timestamp NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`product_mappings\` ADD CONSTRAINT \`FK_f2d293475ee7ae7b8b85f8f4937\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product_mappings\` ADD CONSTRAINT \`FK_b9a4ea8f5cbfa8cbecf045c8fc7\` FOREIGN KEY (\`platform_id\`) REFERENCES \`platforms\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_items\` ADD CONSTRAINT \`FK_145532db85752b29c57d2b7b1f1\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_items\` ADD CONSTRAINT \`FK_9263386c35b6b242540f9493b00\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_items\` ADD CONSTRAINT \`FK_99013ab620684ec3a72ed18b89c\` FOREIGN KEY (\`product_mapping_id\`) REFERENCES \`product_mappings\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_54aaa061d731b28146f0b982f7f\` FOREIGN KEY (\`platform_id\`) REFERENCES \`platforms\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`sync_logs\` ADD CONSTRAINT \`FK_b0cc8faa0921e5ed94f6ea9e233\` FOREIGN KEY (\`platform_id\`) REFERENCES \`platforms\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`webhook_events\` ADD CONSTRAINT \`FK_7aaa20d22e131a2f7c90c0bcfb3\` FOREIGN KEY (\`platform_id\`) REFERENCES \`platforms\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`sync_conflicts\` ADD CONSTRAINT \`FK_b2f5c0a5a96c3fab4e618442f39\` FOREIGN KEY (\`product_mapping_id\`) REFERENCES \`product_mappings\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sync_conflicts\` DROP FOREIGN KEY \`FK_b2f5c0a5a96c3fab4e618442f39\``);
        await queryRunner.query(`ALTER TABLE \`webhook_events\` DROP FOREIGN KEY \`FK_7aaa20d22e131a2f7c90c0bcfb3\``);
        await queryRunner.query(`ALTER TABLE \`sync_logs\` DROP FOREIGN KEY \`FK_b0cc8faa0921e5ed94f6ea9e233\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_54aaa061d731b28146f0b982f7f\``);
        await queryRunner.query(`ALTER TABLE \`order_items\` DROP FOREIGN KEY \`FK_99013ab620684ec3a72ed18b89c\``);
        await queryRunner.query(`ALTER TABLE \`order_items\` DROP FOREIGN KEY \`FK_9263386c35b6b242540f9493b00\``);
        await queryRunner.query(`ALTER TABLE \`order_items\` DROP FOREIGN KEY \`FK_145532db85752b29c57d2b7b1f1\``);
        await queryRunner.query(`ALTER TABLE \`product_mappings\` DROP FOREIGN KEY \`FK_b9a4ea8f5cbfa8cbecf045c8fc7\``);
        await queryRunner.query(`ALTER TABLE \`product_mappings\` DROP FOREIGN KEY \`FK_f2d293475ee7ae7b8b85f8f4937\``);
        await queryRunner.query(`DROP TABLE \`sync_conflicts\``);
        await queryRunner.query(`DROP INDEX \`IDX_6add27e349b6905c85e016fa2c\` ON \`platforms\``);
        await queryRunner.query(`DROP TABLE \`platforms\``);
        await queryRunner.query(`DROP TABLE \`webhook_events\``);
        await queryRunner.query(`DROP TABLE \`sync_logs\``);
        await queryRunner.query(`DROP TABLE \`orders\``);
        await queryRunner.query(`DROP TABLE \`order_items\``);
        await queryRunner.query(`DROP TABLE \`product_mappings\``);
        await queryRunner.query(`DROP INDEX \`IDX_c44ac33a05b144dd0d9ddcf932\` ON \`products\``);
        await queryRunner.query(`DROP TABLE \`products\``);
    }

}
