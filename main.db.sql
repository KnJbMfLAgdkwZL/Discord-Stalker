BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS `invites_dead` (
	`url`	TEXT,
	`guild_id`	TEXT,
	`guild_name`	TEXT,
	`guild_icon`	TEXT,
	`inviter_id`	TEXT,
	`inviter_username`	TEXT,
	`inviter_discriminator`	TEXT,
	`inviter_avatar`	TEXT,
	`inviter_bot`	TEXT
);
CREATE TABLE IF NOT EXISTS `invites_baned` (
	`url`	TEXT,
	`guild_id`	TEXT,
	`guild_name`	TEXT,
	`guild_icon`	TEXT,
	`inviter_id`	TEXT,
	`inviter_username`	TEXT,
	`inviter_discriminator`	TEXT,
	`inviter_avatar`	TEXT,
	`inviter_bot`	TEXT
);
CREATE TABLE IF NOT EXISTS `invites` (
	`url`	TEXT,
	`guild_id`	TEXT,
	`guild_name`	TEXT,
	`guild_icon`	TEXT,
	`inviter_id`	TEXT,
	`inviter_username`	TEXT,
	`inviter_discriminator`	TEXT,
	`inviter_avatar`	TEXT,
	`inviter_bot`	TEXT
);
CREATE TABLE IF NOT EXISTS `guilds_check` (
	`frieds_on_server`	INTEGER,
	`frieds_in_voise`	INTEGER,
	`users_on_server`	INTEGER,
	`users_in_voise`	INTEGER,
	`guild_id`	TEXT,
	`guild_name`	TEXT,
	`check_cnt`	INTEGER
);
CREATE TABLE IF NOT EXISTS `friends_logs` (
	`guild_name`	TEXT,
	`guild_id`	TEXT,
	`channel_name`	TEXT,
	`channel_id`	TEXT,
	`user_name`	TEXT,
	`user_id`	TEXT,
	`date_time`	TEXT,
	`status`	TEXT
);
CREATE TABLE IF NOT EXISTS `friends` (
	`id`	TEXT,
	`name`	TEXT,
	`discriminator`	TEXT,
	`avatar`	TEXT
);
COMMIT;
