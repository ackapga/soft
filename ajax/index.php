<!DOCTYPE HTML>
<html lang="ru"><head>
<meta charset="UTF-8">
<title>Отправка формы на AJAX (https://maxsite.org/page/send-form-ajax)</title>
<link rel="stylesheet" href="assets/css/style.css">
<script src="assets/js/jquery.min.js"></script>
</head><body>
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-T3HWCNF"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
<div class="layout-center-wrap"><div class="layout-wrap pad50-b">

<h2>Форма на email</h2>
 
<form id="my_form_email">
	<div class="mar10-tb"><label>Имя: <input type="text" name="f[name]" required></label></div>
	<div class="mar10-tb"><label>Email: <input type="email" name="f[email]" required></label></div>
	<div class="mar10-tb"><label>Телефон: <input type="text" name="f[phone]"></label></div>
	<div class="mar10-tb"><label>Ваше сообщение: <input type="text" name="f[mes]" required></label></div>
	<div><button type="submit">Отправить</button></div>
</form> 
 
<div id="my_message_email"></div>

<script> 
$('#my_form_email').submit(function(){
	
	$.post(
		'post-email.php', // адрес обработчика
		 $("#my_form_email").serialize(), // отправляемые данные  		
		
		function(msg) { // получен ответ сервера  
			// $('#my_form_email').hide('slow');
			$('#my_message_email').html(msg);
		}
	);
	
	return false;
});
</script> 



</div></div>
<link rel="stylesheet" href="assets/css/-lazy.css">
<link rel="stylesheet" href="assets/css/fontawesome.css">
</body></html>