<meta charset="UTF-8">
<?php 

if(isset($_POST['submit'])){
    $to = "astana@idiamarket.kz"; // Здесь нужно написать e-mail, куда будут приходить письма
    $from = $_POST['user_email']; // this is the sender's Email address
    $first_name = $_POST['user_name'];
	$phone = $_POST['user_phone'];
	$name_product = $_POST['name_product'];
    $subject = "Форма отправки сообщений с сайта";
    $subject2 = "Copy of your form submission";
    $message = $first_name . " get message:" . "\n\n" . $_POST['name_product'];
    $message2 = "Here is a copy of your message " . $first_name . "\n\n" . $_POST['user_comment'];

    $headers = "From:" . $from;
    $headers2 = "From:" . $to;
	
    mail($to,$subject,$message,$headers);
   // mail($from,$subject2,$message2,$headers2); // sends a copy of the message to the sender - Отключено!
    echo "Сообщение отправлено. Спасибо Вам " . $first_name . ", мы скоро свяжемся с Вами.";
	echo "<br /><br /><a href='https://softgroup.kz/'>Вернуться на сайт.</a>";

}

?>
<!--Переадресация на главную страницу сайта, через 3 секунды-->
<script language="JavaScript" type="text/javascript">
function changeurl(){eval(self.location="https://softgroup.kz/");}
window.setTimeout("changeurl();",3000);
</script>