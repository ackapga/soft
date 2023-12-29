<?php
function replaceInFiles($directories, $search, $replace) {
    foreach ($directories as $directory) {
        echo PHP_EOL . PHP_EOL . '<span style="color: red">----------------------------------</span>>' . "\n". $directory .'----------------------------------'  . PHP_EOL . PHP_EOL;
        replaceInDirectory($directory, $search, $replace);
    }
}

function replaceInDirectory($dir, $search, $replace) {
    $files = scandir($dir);
    foreach ($files as $key => $file) {
        if ($file != '.' && $file != '..') {
            $path = $dir . '/' . $file;
            if (is_dir($path)) {
                replaceInDirectory($path, $search, $replace);
            } else {
                echo $file . ' ' . $key . PHP_EOL;
//                $content = file_get_contents($path);
//                $content = str_replace($search, $replace, $content);
//                file_put_contents($path, $content);
            }
        }
    }
}

// Список папок, в которых нужно заменить текст (относительно текущей директории)
$directoriesToProcess = [
    'aktau',
    'aktobe',
    'astana',
    'atyrau',
    'janaozen',
    'jezkazgan',
    'karaganda',
    'kokshetau',
    'kostanai',
    'kyzylorda',
    'pavlodar',
    'petropavlovsk',
    'semei',
    'shymkent',
    'taldykorgan',
    'taraz',
    'turkestan',
    'uralsk',
    'ust-kamenogorsk',
];

// Текст, который нужно заменить
$search = 'текст_для_замены';

// Текст, на который нужно заменить
$replace = 'новый_текст';

// Преобразуем список папок в абсолютные пути
$absoluteDirectories = array_map(function ($dir) {
    return __DIR__ . '/' . $dir;
}, $directoriesToProcess);

replaceInFiles($absoluteDirectories, $search, $replace);