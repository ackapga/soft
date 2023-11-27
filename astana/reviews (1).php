<!DOCTYPE html>
<html>
<?php
$time=time();
if (session_id()=='') session_start();

$db=mysqli_connect("localhost","v_20478_Gulbanu","dala3940","v_20478_metal") or die();
$res=mysqli_query($db,"set names utf8");

$mess_url=mysqli_real_escape_string($db,basename($_SERVER['SCRIPT_FILENAME']));

//получаем id текущей темы
$res=mysqli_query($db,"SELECT id FROM таблица WHERE file_name='".$mess_url."'");
$res=mysqli_fetch_array($res);
$theme_id=$res["id"];
$secret = '6LcU8NAcAAAAAEy6bOhF7gT6oYeAQoiyHDLiH3mJ';
//get verify response data
$verify = file_get_contents('https://www.google.com/recaptcha/api/siteverify?secret='.$secret.'&response='.$_POST['g-recaptcha-response']);
$respponse = json_decode($verify);

if(!empty($_POST['g-recaptcha-response']))
{
      $secret = '6LfMxoYcAAAAAImyK5ZOJAdKgC10K9M14NgbdNoy';
      $verifyResponse = file_get_contents('https://www.google.com/recaptcha/api/siteverify?secret='.$secret.'&response='.$_POST['g-recaptcha-response']);
      $responseData = json_decode($verifyResponse);
        if (isset($_POST["contr_cod"])){    //отправлен комментарий
        $mess_login=htmlspecialchars($_POST["mess_login"]);
        $user_text=htmlspecialchars($_POST["user_text"]);    //код правильный
        if ($mess_login!='' and $user_text!=''){
        if (is_numeric($_POST["parent_id"]) and is_numeric($_POST["f_parent"]))
            $res=mysqli_query($db,"insert into softgroup
            (parent_id, first_parent, date, theme_id, login, message)
            values ('".$_POST["parent_id"]."','".$_POST["f_parent"]."',
            '".$time."','".$theme_id."','".$mess_login."','".$user_text."')");
        else $res=mysqli_query($db,"insert into softgroup (date, theme_id, login, message)
        values ('".$time."','".$theme_id."','".$mess_login."','".$user_text."')");
            $_SESSION["send"]="Комментарий принят!";
            header("Location: $mess_url#last"); exit;
        }
        else {
        $_SESSION["send"]="Не все поля заполнены!";
        header("Location: $mess_url#last"); exit;
        }

        }   
}

if (isset($_SESSION["send"]) and $_SESSION["send"]!="") {    //вывод сообщения
    echo '<script type="text/javascript">alert("'.$_SESSION["send"].'");</script>';
    $_SESSION["send"]="";
}
?>

<head>
    <script src='https://www.google.com/recaptcha/api.js'></script>
    <title>Отзывы наших клиентов о работе компании – Softgroup.kz</title>
    <!--/tags -->
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="keywords" content="SoftGroup, отзывы компании, продукции." />
    <meta name="description" content="Отзывы клиентов о компании Softgroup. Все отзывы публикуются без предварительного рецензирования. Отправить жалобу, благодарность на работу Softgroup.kz">
    <!--//tags -->
    <link href="../css/bootstrap.css" rel="stylesheet" type="text/css" media="all" />
    <link href="../css/bootstrap.min.css" rel="stylesheet" type="text/css" media="all" />
    <link href="../css/style.css" rel="stylesheet" type="text/css" media="all" />
    <link href="../css/jqcart.css" rel="stylesheet" type="text/css" media="all" />
    <link href="../css/font-awesome.css" rel="stylesheet">
    <link href="../css/easy-responsive-tabs.css" rel='stylesheet' type='text/css' />
    <link rel="shortcut icon" href="../images/favicon.ico" type="image/x-icon">
    <script src="https://www.google.com/recaptcha/api.js" async defer></script>

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
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-T3HWCNF"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->

    <div class="header-bot" id="home">
<div class="header-bot_inner_wthreeinfo_header_mid">
            <!-- header-bot -->
            <div class="col-md-4 logo_agile">
                <p><a href="index.html"><span>Soft</span>Gr<img src="../images/globe1.png">up</a></p>
            </div>
            <!-- header-bot -->
            <div class="col-md-4 agileits-social top_content">
                <div class="nomer"><a href="tel:87172279900">8(7172) <span>27-99-00</span></a></div>
            </div>
            <div class="clearfix"></div>
        </div>
    </div>
    <div class="ban-top">
        <div class="container">
            <div class="top_nav_left">
                <nav class="navbar navbar-default">
                    <div class="container-fluid">
                        <!-- Brand and toggle get grouped for better mobile display -->
                        <div class="navbar-header">
                            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                                <span class="sr-only">Toggle navigation</span>
                                <span class="icon-bar"></span>
                                <span class="icon-bar"></span>
                                <span class="icon-bar"></span>
                            </button>
                        </div>
                        <!-- Collect the nav links, forms, and other content for toggling -->
                        <div class="collapse navbar-collapse menu--shylock" id="bs-example-navbar-collapse-1">
                            <ul class="nav navbar-nav menu__list">
                                <li class=" menu__item"><a class="menu__link" href="../index.html">Главная <span class="sr-only">(current)</span></a></li>
                                <li class=" menu__item"><a class="menu__link" href="../products.html">Оборудование<span class="sr-only">(current)</span></a></li>
                                <li class=" menu__item"><a class="menu__link" href="../uslugi.html">Программы</a></li>
                                <li class=" menu__item"><a class="menu__link" href="automation.html">Автоматизация</a></li>
                                <li class="active menu__item menu__item--current"><a class="menu__link" href="../reviews.php">Отзывы</a></li>
                                <li class=" menu__item"><a class="menu__link" href="../about.html">О нас</a></li>
                                <li style="margin:0;" class=" menu__item"><a class="menu__link" href="../contact.html">Контакты</a></li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
            <div class="top_nav_right"><span id="open" class="glyphicon glyphicon-shopping-cart my-cart-icon"><span class="badge badge-notify my-cart-badge">
                        <div class="label-place"></div>
                    </span></span></div>
            <div class="clearfix"></div>
        </div>
    </div>
    <!-- //banner-top -->
    <!-- Modal1 -->
    <div class="modal fade" id="myModal" tabindex="-1" role="dialog">
        <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>
                <div class="modal-body modal-body-sub_agile">
                    <div class="col-md-8 modal_body_left modal_body_left1">

                        <form action="#" method="post">
                            <div class="styled-input agile-styled-input-top">
                                <input type="text" name="Name" required="">
                                <label>Name</label>
                                <span></span>
                            </div>
                            <div class="styled-input">
                                <input type="email" name="Email" required="">
                                <label>Email</label>
                                <span></span>
                            </div>
                            <input type="submit" value="Sign In">
                        </form>
                        <ul class="social-nav model-3d-0 footer-social w3_agile_social top_agile_third">
                            <li><a href="#" class="facebook">
                                    <div class="front"><i class="fa fa-facebook" aria-hidden="true"></i></div>
                                    <div class="back"><i class="fa fa-facebook" aria-hidden="true"></i></div>
                                </a></li>
                            <li><a href="#" class="twitter">
                                    <div class="front"><i class="fa fa-twitter" aria-hidden="true"></i></div>
                                    <div class="back"><i class="fa fa-twitter" aria-hidden="true"></i></div>
                                </a></li>
                            <li><a href="#" class="instagram">
                                    <div class="front"><i class="fa fa-instagram" aria-hidden="true"></i></div>
                                    <div class="back"><i class="fa fa-instagram" aria-hidden="true"></i></div>
                                </a></li>
                            <li><a href="#" class="pinterest">
                                    <div class="front"><i class="fa fa-linkedin" aria-hidden="true"></i></div>
                                    <div class="back"><i class="fa fa-linkedin" aria-hidden="true"></i></div>
                                </a></li>
                        </ul>
                        <div class="clearfix"></div>
                        <p><a href="#" data-toggle="modal" data-target="#myModal2"> Don't have an account?</a></p>

                    </div>
                    <div class="col-md-4 modal_body_right modal_body_right1">
                        <img src="../images/log_pic.jpg" alt=" " />
                    </div>
                    <div class="clearfix"></div>
                </div>
            </div>
            <!-- //Modal content-->
        </div>
    </div>

    <div class="page-head_agile_info_w3l">
        <div class="container">

            <!--/w3_short-->

            <!--//w3_short-->
        </div>
    </div>

    <!-- banner-bootom-w3-agileits -->
    <div class="banner-bootom-w3-agileits">
        <div class="container">
            <!-- mens -->
            <div class="col-md-4 products-left">

                <div class="services-breadcrumb">
                    <div class="agile_inner_breadcrumb">

                        <ul class="w3_short">
                            <li><a href="index.html">Главная</a><i>/</i></li>

                            <li>Отзывы</li>
                        </ul>
                    </div>
                </div>
                <div class="agile-contact-grids">
                    <div class="modelss">
                        <h1>Отзывы клиентов</h1>
                        <hr>
                    </div>
                    <?php
function parents($up=0, $left=0) {    //Строим иерархическое дерево комментариев
global $tag,$mess_url;

for ($i=0; $i<=count($tag[$up])-1; $i++) {
 //Можно выделять цветом указанные логины
 if ($tag[$up][$i][2]=='Admin') $tag[$up][$i][2]='<font color="#C00">Admin</font>';
 if ($tag[$up][$i][6]==0) $tag[$up][$i][6]=$tag[$up][$i][0];
 //Высчитываем рейтинг комментария
 $sum=$tag[$up][$i][4]-$tag[$up][$i][5];

 if ($up==0) echo '<div class="otz" style=" color: #2a4f5e;   margin-top:20px; border-bottom: 1px solid #e6e6ec; padding-bottom:10px; float:none!important; width:830px;">';
 else {
    if (count($tag[$up])-1!=$i)
        echo '<div class="strelka" style="padding:5px 0 0 '.($left-2).'px;">';
    else echo '<div class="strelka_2" style="padding:5px 0 0 '.$left.'px;">';
 }
 echo '<div class="comm_head" id="m'.$tag[$up][$i][0].'">';
 echo '<div style="float:left; margin-right:5px; font-size:16px!important; color:#2a4f5e;"><b>'.$tag[$up][$i][2].'</b></div>';
 




 echo '<div style="text-align:right; float:none">  '.date("d.m.Y в H:i ", $tag[$up][$i][3]).'</div></div>';
 echo '<div style="clear:both; "></div>';
 echo '<div class="comm_body"  style="float:none!important;">';
 if ($sum<0) echo '<u class="sp_link">Показать/скрыть</u><div class="comm_text">';
 else echo '<div style="word-wrap:break-word; float:none!important;">';
 echo str_replace("<br />","<br>",nl2br($tag[$up][$i][1])).'</div>';

 if (isset($tag[ $tag[$up][$i][0] ])) parents($tag[$up][$i][0],20);
 echo '</div></div>';
}
}

$res=mysqli_query($db,"SELECT * FROM softgroup
    WHERE theme_id='".$theme_id."' ORDER BY id");
$number=mysqli_num_rows($res);

if ($number>0) {
 echo '<div style="ppadding-top:10px; ">';
 while ($com=mysqli_fetch_assoc($res))
    $tag[(int)$com["parent_id"]][] = array((int)$com["id"], $com["message"],
    $com["login"], $com["date"], $com["plus"], $com["minus"], $com["first_parent"]);
 echo parents().'</div><br>';
}
?>
                    <?php
echo '<div id="last" style="margin-top:30px;">';

echo '<form method="POST" action="'.$mess_url.'#last" class="add_comment">';
echo '<div class="imya" style="float:none;font-size:18px; font-weight:bold; color:#0ba98b;"><h2>Оставить отзыв о компании Softgroup</h2></div>';
echo '<div class="oott" style="margin-left:150px; margin-top:10px; float:none;">';
echo '<div style="float:left; margin-right:5px;">Имя*</div>';
echo '<input style="height:23px; width:419px; " type="text" name="mess_login" maxlength="20" value=""></div>';
echo '<div class="oott" style="float:none;margin-left:150px; margin-top:10px">';
echo '<div  style="float:left; margin-right:5px;">Отзыв*</div>';
echo '<textarea cols="50" rows="5" name="user_text"></textarea>';
echo '</div>';

echo '<div class="g-recaptcha  " data-sitekey="6LfMxoYcAAAAAK5_rjWBfbmOElm04cX9ez9jWyUA"></div>';
echo '<div class="imya" style="margin-top:15px; margin-left:150px;"><input class="knopka" style="height:28px; font-size: 14px !important;
    background: #3a5265;
    border: 0px solid #007f87;
        box-shadow: 0 2px 2px 0 #606060;
		    -webkit-border-radius: 5px;
    text-shadow: none;
    float: left;
    width: 150px;
    line-height: normal;
    color: #fff;
    cursor: pointer;
 
    outline: none;" type="submit" value="Отправить" ></div>';

echo '</form></div>';
?>
                </div>
                <div class="clearfix"> </div>
            </div>
        </div>
    </div>
    <!-- //mens -->
    <!--/grids-->
    <div class="coupons">
        <div class="coupons-grids text-center">
            <div class="w3layouts_mail_grid">
                <div class="col-md-3 w3layouts_mail_grid_left">
                    <div class="w3layouts_mail_grid_left1 hvr-radial-out">
                        <i class="fa fa-truck" aria-hidden="true"></i>
                    </div>
                    <div class="w3layouts_mail_grid_left2">
                        <p style="font-size: 1.1em; color: #26a69a; text-transform: uppercase; letter-spacing: 0.6px; font-weight: 600;">Бесплатная Доставка</p>
                        <p>Оперативная доставка - БЕСПЛАТНО. Осуществляется доставка во все регионы РК.</p>
                    </div>
                </div>
                <div class="col-md-3 w3layouts_mail_grid_left">
                    <div class="w3layouts_mail_grid_left1 hvr-radial-out">
                        <i class="fa fa-cogs" aria-hidden="true"></i>
                    </div>
                    <div class="w3layouts_mail_grid_left2">
                        <p style="font-size: 1.1em; color: #26a69a; text-transform: uppercase; letter-spacing: 0.6px; font-weight: 600;">Сервисное обслуживание</p>
                        <p>Технические специалисты помогут вам настроить оборудование под ваши требования</p>
                    </div>
                </div>
                <div class="col-md-3 w3layouts_mail_grid_left">
                    <div class="w3layouts_mail_grid_left1 hvr-radial-out">
                        <i class="fa fa-shopping-cart" aria-hidden="true"></i>
                    </div>
                    <div class="w3layouts_mail_grid_left2">
                        <p style="font-size: 1.1em; color: #26a69a; text-transform: uppercase; letter-spacing: 0.6px; font-weight: 600;">Огромный выбор товара</p>
                        <p>У нас есть все виды оборудования для автоматизации любого вида торговли</p>
                    </div>
                </div>
                <div class="col-md-3 w3layouts_mail_grid_left">
                    <div class="w3layouts_mail_grid_left1 hvr-radial-out">
                        <i class="fa fa-users" aria-hidden="true"></i>
                    </div>
                    <div class="w3layouts_mail_grid_left2">
                        <p style="font-size: 1.1em; color: #26a69a; text-transform: uppercase; letter-spacing: 0.6px; font-weight: 600;">Квалифицированные специалисты</p>
                        <p>Наши сотрудники владеют умением и навыками для качественной работы с клиентами</p>
                    </div>
                </div>
                <div class="clearfix"> </div>
            </div>

        </div>
    </div>
    <!--grids-->
    <!-- footer -->
    <div class="footer">
        <div class="footer_agile_inner_info_w3l">
            <div class="col-md-3 footer-left">
                <div class="sign-gd">

                    <ul>
                        <li><a href="index.html">Главная</a></li>
                        <li><a href="products.html">Оборудование</a></li>
                        <li><a href="service.html">Программы</a></li>
                        <li><a href="reviews.php">Отзывы</a></li>
                        <li><a href="about.html">О нас</a></li>
                        <li><a href="contact.html">Контакты</a></li>
                        <li><a href="index.html">Кассовое оборудование</a></li>
                        <li><a href="r_keeper.html">Автоматизация ресторанов</a></li>
                        <li><a href="1c.html">Автоматизация магазинов</a></li>
                        <li><a href="umag_magazin.html">Автоматизация продуктовых магазинов</a></li>
                    </ul>
                </div>
            </div>
            <div class="col-md-9 footer-right">
                <div class="sign-grds">
                    <div class="col-md-4 sign-gd">

                        <ul>
                            <li><a href="pos.html">POS системы</a></li>
                            <li><a href="monoblock.html">Сенсорные моноблоки</a></li>
                            <li><a href="scanner.html">Сканеры штрих-кодов</a></li>
                            <li><a href="receipt.html">Принтеры чеков</a></li>
                            <li><a href="label.html">Принтеры этикеток</a></li>
                            <li><a href="scale.html">Весы электронные</a></li>
                            <li><a href="till.html">Денежные ящики</a></li>
                            <li><a href="terminal.html">Терминалы сбора данных</a></li>
                            <li><a href="banknotes.html">Счетчики и детекторы банкнот</a></li>
                            <li><a href="eas.html">Антикражное оборудование</a></li>
                        </ul>
                    </div>

                    <div class="col-md-5 sign-gd-two">

                        <div class="w3-address">
                            <div class="w3-address-grid">
                                <div class="w3-address-left">
                                    <i class="fa fa-phone" aria-hidden="true"></i>
                                </div>
                                <div class="w3-address-right">
                                    <p style="margin:0">Телефон:</p>
                                    <p><a href="tel:87015112200">+7 (701) 511-22-00</a></p>
                                    <p><a href="tel:87172279900">+7 (7172) 27-99-00</a></p>

                                </div>
                                <div class="clearfix"> </div>
                            </div>
                            <div class="w3-address-grid">
                                <div class="w3-address-left">
                                    <i class="fa fa-envelope" aria-hidden="true"></i>
                                </div>
                                <div class="w3-address-right">
                                    <p style="margin:0">Email</p>
                                    <p><a href="mailto:astana@idiamarket.kz"> astana@idiamarket.kz</a></p>
                                </div>
                                <div class="clearfix"> </div>
                            </div>
                            <div class="w3-address-grid">
                                <div class="w3-address-left">
                                    <i class="fa fa-map-marker" aria-hidden="true"></i>
                                </div>
                                <div class="w3-address-right">
                                    <p style="margin:0">Адрес</p>
                                    <p>ул. Мынбаева 43 (уг. ул. между Ауезова и Манаса), 1-этаж, 050008

                                    </p>
                                </div>
                                <div class="clearfix"> </div>
                            </div>
                            <div id="socialMedia" class="span3 pull-right">
                                <a href="https://www.youtube.com/channel/UCNDMIviMuZOhhCP7xoxGYAA/videos"><img width="50" height="50" src="../images/youtube.png" title="youtube" alt="youtube" /></a><a href="https://www.instagram.com/idiamarket/"><img width="50" height="50" src="../images/insta.png" title="instagram" alt="instagram"></a>
                            </div>
                        </div>
                    </div>

                    <div class="clearfix"></div>
                </div>
            </div>
            <div class="clearfix"></div>

            <p class="copy-right">&copy 2010-2021 SoftGroup</p>
        </div>
    </div>
    <!-- //footer -->


    <!-- js -->

    <script type="text/javascript" src="js/jquery-2.1.4.min.js"></script>
    <!-- //js -->
    <script src="js/responsiveslides.min.js"></script>

    <script src="js/modernizr.custom.js"></script>
    <!-- Custom-JavaScript-File-Links -->
    <!-- cart-js -->
    <script type="text/javascript">
        $(document).ready(function() {
            $("#fly").click(function() {
                $("#target")
                    .clone()
                    .css({
                        'position': 'absolute',
                        'z-index': '100'
                    })
                    .appendTo("#fly")
                    .animate({
                        opacity: 0.8,
                        marginLeft: 550,
                        marginTop: -750,
                        /* Важно помнить, что названия СSS-свойств пишущихся  
                                                    через дефис заменяются на аналогичные в стиле "camelCase" */
                        width: 100,
                        height: 100
                    }, 500, function() {
                        $(this).remove();
                    });
            });
        });

    </script>
    <link href="../css/jqcart.css" rel="stylesheet" type="text/css">
    <script src="js/jquery-1.11.3.min.js"></script>
    <script src="js/jqcart.min.js"></script>
    <script>
        $(function() {
            'use strict';
            // инициализация плагина
            $.jqCart({
                buttons: '.add_item',
                handler: './request/handler.php',
                cartLabel: '.label-place',
                visibleLabel: true,
                openByAdding: false,
                currency: 'тг'
            });
            // Пример с дополнительными методами
            $('#open').click(function() {
                $.jqCart('openCart'); // открыть корзину
            });
        });

    </script>
    <!-- //cart-js -->
    <!---->
    <script type='text/javascript'>
        //<![CDATA[ 
        $(window).load(function() {
            $("#slider-range").slider({
                range: true,
                min: 0,
                max: 9000,
                values: [1000, 7000],
                slide: function(event, ui) {
                    $("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
                }
            });
            $("#amount").val("$" + $("#slider-range").slider("values", 0) + " - $" + $("#slider-range").slider("values", 1));

        }); //]]>  

    </script>
    <script type="text/javascript" src="js/jquery-ui.js"></script>
    <!---->
    <!-- start-smoth-scrolling -->
    <script type="text/javascript" src="js/move-top.js"></script>
    <script type="text/javascript" src="js/jquery.easing.min.js"></script>
    <script type="text/javascript">
        jQuery(document).ready(function($) {
            $(".scroll").click(function(event) {
                event.preventDefault();
                $('html,body').animate({
                    scrollTop: $(this.hash).offset().top
                }, 1000);
            });
        });

    </script>

    <!-- //here ends scrolling icon -->

    <!-- for bootstrap working -->
    <script type="text/javascript" src="js/bootstrap.js"></script>
    <!-- WhatsHelp.io widget -->

    </body>

</html>
