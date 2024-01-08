<?php


require_once($_SERVER['DOCUMENT_ROOT'] . '/admin/config.php');


$sql1 = "SELECT * FROM `softgroup_users`";

// Выполнение запроса
$result = $conn->query($sql1);

var_dump($result->fetch_assoc());

// Закрытие соединения с базой данных
$conn->close();



die();
$tableNames = ["softgroup_users",];

$commonColumns = "(id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

$username = 'ackapga';
$password = 'keremet273';
$hashedPassword = hash('sha256', $password);

foreach ($tableNames as $tableName) {
    $sql1 = "CREATE TABLE IF NOT EXISTS $tableName $commonColumns";
    if ($conn->query($sql1) === TRUE) {
        echo "Таблица $tableName успешно создана" . PHP_EOL;
    } else {
        echo "Ошибка при создании таблицы $tableName: " . $conn->error . "<br>";
    }
    $sql = "INSERT INTO softgroup_users (username, password) VALUES ('$username', '$hashedPassword')";
    if ($conn->query($sql) === TRUE) {
        echo "Добавлен новый пользователь";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}
$conn->close();