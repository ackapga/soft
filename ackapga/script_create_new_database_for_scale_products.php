<?php

$servername = "localhost";
$username = "v_20478_Gulbanu";
$password = "dala3940";
$dbname = "v_20478_metal";

// Создаем подключение к базе данных
$conn = new mysqli($servername, $username, $password, $dbname);

// Проверяем успешность подключения
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Массив с разными именами таблиц
$tableNames = [
    "scaletbmaruewrs",
    "scaletbma3",
    "scale4du1",
    "scaletbsa3",
    "scalemksl",
    "scalemks2l",
    "scaleaurorad2",
    "scaleauroray3l",];

// Общие параметры для создания таблицы
$commonColumns = "(
  `id` INT(9) UNSIGNED NOT NULL AUTO_INCREMENT,
  `parent_id` MEDIUMINT(9) UNSIGNED NOT NULL DEFAULT '0',
  `first_parent` MEDIUMINT(9) UNSIGNED NOT NULL DEFAULT '0',
  `date` INT(10) UNSIGNED NOT NULL,
  `theme_id` SMALLINT(6) UNSIGNED NOT NULL,
  `login` varchar(30) collate utf8_unicode_ci NOT NULL,
  `message` varchar(9999) collate utf8_unicode_ci NOT NULL,
  `rating` INT(5) collate utf8_unicode_ci NOT NULL,
  `moderation` TINYINT(3) UNSIGNED NOT NULL DEFAULT '0',
  `plus` MEDIUMINT(9) NOT NULL DEFAULT '0',
  `minus` MEDIUMINT(9) NOT NULL DEFAULT '0',
  PRIMARY KEY  (`id`),
  KEY `theme_id` (`theme_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1;";

// Создаем таблицы с разными именами
foreach ($tableNames as $tableName) {
    $sql = "CREATE TABLE IF NOT EXISTS $tableName $commonColumns";

    if ($conn->query($sql) === TRUE) {
        echo "Таблица $tableName успешно создана" . PHP_EOL;
    } else {
        echo "Ошибка при создании таблицы $tableName: " . $conn->error . "<br>";
    }
}

// Закрываем соединение с базой данных
$conn->close();