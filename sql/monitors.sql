CREATE TABLE `monitors` (
  `id` int(9) UNSIGNED NOT NULL,
  `parent_id` mediumint(9) UNSIGNED NOT NULL DEFAULT 0,
  `first_parent` mediumint(9) UNSIGNED NOT NULL DEFAULT 0,
  `date` int(10) UNSIGNED NOT NULL,
  `theme_id` smallint(6) UNSIGNED NOT NULL,
  `login` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `message` varchar(9999) COLLATE utf8_unicode_ci NOT NULL,
  `rating` int(5) NOT NULL,
  `moderation` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `plus` mediumint(9) NOT NULL DEFAULT 0,
  `minus` mediumint(9) NOT NULL DEFAULT 0
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

ALTER TABLE `monitors`
  MODIFY `id` int(9) UNSIGNED NOT NULL AUTO_INCREMENT;
COMMIT;
