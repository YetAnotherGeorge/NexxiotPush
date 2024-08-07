CREATE DATABASE IF NOT EXISTS `nexxiot`;
USE `nexxiot`;

DROP TABLE IF EXISTS `containers`;
CREATE TABLE `containers` (
	`_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`id` VARCHAR(255) NOT NULL,                               -- string
	`external_id` VARCHAR(255) NOT NULL,                      -- string
	`display_name` VARCHAR(255) NOT NULL,                     -- string
	`tags` VARCHAR(255) NOT NULL DEFAULT "",                  -- Record<string, any> -> string
	`legacy_id` VARCHAR(255) NOT NULL,                        -- string
	`metadata` VARCHAR(255) NOT NULL DEFAULT "",              -- Record<string, any> -> string
	`create_time` VARCHAR(50),                                -- string (iso 8601)
	`update_time` VARCHAR(50),	                               -- string (iso 8601)
	`group_ids` VARCHAR(255),                                 -- Record<string, any> -> string
	`state_connect_time` VARCHAR(50) DEFAULT NULL,            -- string (iso 8601) | undefined    
	`state_location_lat` DOUBLE DEFAULT NULL,                 -- number | undefined			
	`state_location_lon` DOUBLE DEFAULT NULL,                 -- number | undefined
	`state_location_measure_time` VARCHAR(50) DEFAULT NULL,   -- string(iso 8601) | undefined
	`state_location_country_code` VARCHAR(10) DEFAULT NULL,   -- string | undefined
	`state_location_display_name` VARCHAR(255) DEFAULT NULL,  -- string | undefined
	`state_movement_state` VARCHAR(20) DEFAULT NULL,          -- string | undefined
	`state_movement_change_time` VARCHAR(50) DEFAULT NULL,    -- string (iso 8601) | undefined
	`state_movement_measure_time` VARCHAR(50) DEFAULT NULL    -- string (iso 8601) | undefined
);