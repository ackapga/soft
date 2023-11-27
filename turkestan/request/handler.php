<?php
parse_str($_POST['orderlist'], $orderlist);
parse_str($_POST['userdata'], $userdata);
/*
$orderlist - массив со списком заказа
$userdata - данные заказчика
*/

// При желании, можно посмотреть полученные данные, записав их в файл:
// file_put_contents('cart_data_log.txt', var_export($orderlist, 1) . "\r\n");
// file_put_contents('cart_data_log.txt', var_export($userdata, 1), FILE_APPEND);


// Заголовок письма
$subject = 'Заказ от '.date('d.m.Y').'г.';
// ваш Email
$admin_mail = 'idiasoftgroup@gmail.com';
// Email заказчика (как fallback - ваш же Email)
$to = !empty($userdata['user_mail']) ? $userdata['user_mail'] : $admin_mail;

$token = "1793100576:AAEPdhzR3Ogn2X-zwxNYLg48bSYHgG6zZWQ";
$chat_id = "-1001571347347";

// Формируем таблицу с заказанными товарами
$tbl = '<table style="width: 100%; border-collapse: collapse;">
	<tr>
		<th style="width: 1%; border: 1px solid #333333; padding: 5px;">ID</th>
		<th style="width: 1%; border: 1px solid #333333; padding: 5px;"></th>
		<th style="border: 1px solid #333333; padding: 5px;">Наименование</th>
		<th style="border: 1px solid #333333; padding: 5px;">Цена</th>
		<th style="border: 1px solid #333333; padding: 5px;">Кол-во</th>
	</tr>';
$total_sum = 0;

foreach($orderlist as $id => $item_data) {
	$total_sum += (float)$item_data['count'] * (float)$item_data['price'];
	$tbl .= '
	<tr>
		<td style="border: 1px solid #333333; padding: 5px;">'.$item_data['id'].'</td>
		<td style="border: 1px solid #333333;"><img src="'.$item_data['img'].'" alt="" style="max-width: 64px; max-height: 64px;"></td>
		<td style="border: 1px solid #333333; padding: 5px;">'.$item_data['title'].'</td>
		<td style="border: 1px solid #333333; padding: 5px;">'.$item_data['price'].'</td>
		<td style="border: 1px solid #333333; padding: 5px;">'.$item_data['count'].'</td>
	</tr>';
	$txts .= '<b>Название товара: </b>'.$item_data['title'].'<b>, Кол-во: </b>'.$item_data['count'].'<b>, Цена: </b>'.$item_data['price']."%0A";
}


$arr = array(
  'Имя клиента: ' => $userdata['user_name'],
  'Телефон: ' => $userdata['user_phone'],
  'Email: ' => $userdata['user_mail'],
  'Адресс: ' => $userdata['user_address'],
  'Комментарий: ' => $userdata['user_comment'],
  'Сумма: ' => $total_sum,
  '' => $txts
 );

foreach($arr as $key => $value) {
  $msg .= "<b>".$key."</b> ".$value."%0A";
};


$sendToTelegram = fopen("https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id}&parse_mode=html&text={$msg}","r");

$tbl .= '<tr>
		<td  style="border: 1px solid #333333; padding: 5px;" colspan="3">Итого:</td>
		<td style="border: 1px solid #333333; padding: 5px;"><b>'.$total_sum.'</b></td>
		<td style="border: 1px solid #333333;">&nbsp;</td>
	</tr>
</table>';
// Тело письма
$body = '
<html>
<head>
  <title>'.$subject.'</title>
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-T3HWCNF');</script>
<!-- End Google Tag Manager -->
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-E0MLEWZE9L"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-E0MLEWZE9L');
</script></head>
<body>
  <p>Информация о заказчике:</p>
	<ul>
		<li><b>Ф.И.О.:</b> '.$userdata['user_name'].'</li>
		<li><b>Тел.:</b> '.$userdata['user_phone'].'</li>
		<li><b>Email:</b> '.$userdata['user_mail'].'</li>
		<li><b>Адрес:</b> '.$userdata['user_address'].'</li>
		<li><b>Комментарий:</b> '.$userdata['user_comment'].'</li>
	</ul>
	<p>Информация о заказе:</p>
  '.$tbl.'
	<p>Отправитель: сайт softgroup.kz</p>
</body>
</html>';

// Заголовки
$headers   = []; // или $headers = array() для версии ниже 5.4
$headers[] = 'MIME-Version: 1.0'; // Обязательный заголовок
$headers[] = 'Content-type: text/html; charset=utf-8'; // Обязательный заголовок. Кодировку изменить при необходимости
$headers[] = 'From: Softgroup.kz <zakaz@softgroup.kz>'; // От кого
$headers[] = 'Bcc: Admin <'.$admin_mail.'>'; // скрытая копия админу сайта, т.е. вам
$headers[] = 'X-Mailer: PHP/'.phpversion();
// Отправка
$send_ok = mail($to, $subject, $body, implode("\r\n", $headers));

// Ответ на запрос
$response = [
	'errors' => !$send_ok,
	'message' => $send_ok ? 'Заказ принят в обработку!' : 'Хьюстон! У нас проблемы!'
];
// ! Для версий PHP < 5.4 использовать традиционный синтаксис инициализации массивов:
/*
$response = array (
	'errors' => !$send_ok,
	'message' => $send_ok ? 'Заказ принят в обработку!' : 'Хьюстон! У нас проблемы!'
);
*/


exit( json_encode($response) );

?>