#
# Structure for table "git_info"
#

DROP TABLE IF EXISTS `git_info`;
CREATE TABLE `git_info` (
  `id` bigint(2) NOT NULL AUTO_INCREMENT,
  `uid` bigint(2) DEFAULT NULL,
  `git_name` varchar(255) DEFAULT NULL,
  `git_password` varchar(255) DEFAULT NULL,
  `git_email` varchar(255) DEFAULT NULL,
  `git_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uid` (`uid`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

#
# Data for table "git_info"
#

#
# Structure for table "migrations"
#

DROP TABLE IF EXISTS `migrations`;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

#
# Data for table "migrations"
#

#
# Structure for table "setting"
#

DROP TABLE IF EXISTS `setting`;
CREATE TABLE `setting` (
  `id` bigint(2) NOT NULL AUTO_INCREMENT,
  `uid` bigint(2) DEFAULT NULL,
  `theme` varchar(255) DEFAULT NULL,
  `previewTheme` varchar(255) DEFAULT NULL,
  `editorTheme` varchar(255) DEFAULT NULL,
  `tocm` tinyint(1) DEFAULT NULL,
  `imageUpload` tinyint(1) DEFAULT NULL,
  `htmlDecode` varchar(255) DEFAULT NULL,
  `emoji` tinyint(1) DEFAULT NULL,
  `taskList` tinyint(1) DEFAULT NULL,
  `tex` tinyint(1) DEFAULT NULL,
  `flowChart` tinyint(1) DEFAULT NULL,
  `sequenceDiagram` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

#
# Data for table "setting"
#

INSERT INTO `setting` VALUES (1,1,'default','default','solarized',1,1,'true',1,1,1,1,1);

#
# Structure for table "system_setting"
#

DROP TABLE IF EXISTS `system_setting`;
CREATE TABLE `system_setting` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `open_register` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting` (`open_register`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

#
# Data for table "system_setting"
#

INSERT INTO `system_setting` VALUES (1,'true');

#
# Structure for table "users"
#

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

#
# Data for table "users"
#
