function autoplay() {
  var active    = $('.slider .nav span.on'),
      index     = parseInt(active.attr('rel')),
      maxIndex  = $('.slider .nav span').length - 1,
      nextIndex = index+1;

  if ( nextIndex > maxIndex ) nextIndex = 0;

  $('.slider .nav span[rel="'+nextIndex+'"]').click();
}

$(document).ready(function() {
 $(".slider").each(function () { // обрабатываем каждый слайдер
  var obj = $(this);
  $(obj).append("<div class='nav'></div>");
  $(obj).find("li").each(function () {
   $(obj).find(".nav").append("<span rel='"+$(this).index()+"'></span>"); // добавляем блок навигации
   $(this).addClass("slider"+$(this).index());
  });
  $(obj).find("span").first().addClass("on"); // делаем активным первый элемент меню
 });  
  
  setInterval(autoplay, 2000);
});
function sliderJS (obj, sl) { // slider function
 var ul = $(sl).find("ul"); // находим блок
 var bl = $(sl).find("li.slider"+obj); // находим любой из элементов блока
 var step = $(bl).width(); // ширина объекта
 $(ul).animate({marginLeft: "-"+step*obj}, 500); // 500 это скорость перемотки
}
$(document).on("click", ".slider .nav span", function() { // slider click navigate
 var sl = $(this).closest(".slider"); // находим, в каком блоке был клик
 $(sl).find("span").removeClass("on"); // убираем активный элемент
 $(this).addClass("on"); // делаем активным текущий
 var obj = $(this).attr("rel"); // узнаем его номер
 sliderJS(obj, sl); // слайдим
 return false;
});