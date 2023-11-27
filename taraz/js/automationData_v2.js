const data = [{
        title: "Супермаркеты",
        desc: "установка электронного торгового оборудования и автоматизированной системы управления бизнес-процессом.",
        link: 'market.html',
        img: "../../../../images/automation/grocery-cart.svg"
    },
    {
        title: "Магазины",
        desc: "выполняем сервисные функции по запросу клиента, предоставляя ему доступ к определённым ресурсам или услугам.",
        link: 'shop.html',
        img: "../../../../images/automation/shops.svg"
    },
    {
        title: "Магазин косметики",
        desc: "установка электронного торгового оборудования и автоматизированной системы управления бизнес-процессом.",
        link: 'cosmetic.html',
        img: "../../../../images/automation/cosmetics.svg"
    },
    {
        title: "Магазин одежды",
        desc: "установка электронного торгового оборудования и автоматизированной системы управления бизнес-процессом.",
        link: 'clothes.html',
        img: "../../../../images/automation/clothing-store.svg"
    },
    {
        title: "Рестораны",
        desc: "внедрения программно-аппаратных комплексов автоматизации бизнес-процессов на предприятиях общественного питания.",
        link: 'restaurant.html',
        img: "../../../../images/automation/catering.svg"
    },
    {
        title: "Кафе",
        desc: "внедрения программно-аппаратных комплексов автоматизации бизнес-процессов на предприятиях общественного питания.",
        link: 'cafe.html',
        img: "../../../../images/automation/cafe.svg"
    },
    {
        title: "Быстрое питание (фаст фуды)",
        desc: "внедрения программно-аппаратных комплексов автоматизации бизнес-процессов на предприятиях общественного питания.",
        link: 'fast-food.html',
        img: "../../../../images/automation/fast-food.svg"
    },
    {
        title: "Аптека",
        desc: "служит для того, чтобы обеспечивать оптимизацию бизнес-процессов и разных видов складской работы на предприятии.",
        link: 'apteka.html',
        img: "../../../../images/automation/drugstore.svg"
    },
    {
        title: "Склады",
        desc: "служит для того, чтобы обеспечивать оптимизацию бизнес-процессов и разных видов складской работы на предприятии.",
        link: 'sklad.html',
        img: "../../../../images/automation/warehouse.svg"
    },
    {
        title: "Бухгалтерия",
        desc: "комплекс программных средств, который позволяет вести непрерывное фиксирование и анализ данных.",
        link: 'account.html',
        img: "../../../../images/automation/accounting/icon.svg"
    },
    {
        title: "Производства",
        desc: "выполняем сервисные функции по запросу клиента, предоставляя ему доступ к определённым ресурсам или услугам.",
        link: 'production.html',
        img: "../../../../images/automation/production.svg"
    },
    //  {
    //     title: "ПO для <br> серверов",
    //     desc: "выполняем сервисные функции по запросу клиента, предоставляя ему доступ к определённым ресурсам или услугам.",
    //     link: '1c.html',
    //     img: "../../../../images/automation/q.svg"
    // },

]

const pageContent = document.querySelector('.page-content');

for (let i = 0; i < data.length; i++) {
    let dCard = document.createElement('div');
    dCard.classList.add('d_card');
    dCard.innerHTML = `
        <a href="${data[i].link}" style="height: 100%; width: 100%;">
            <img class="content-img" src="${data[i].img}"  >
            <div class="content">
                 <h2 class="heading">${data[i].title}</h2>
            </div>
        </a>`;
    // dCard.style.backgroundImage. = `url(${data[i].img})`;
    // <p class="data-content">${data[i].desc}</p>

    pageContent.appendChild(dCard);
}


function smoothScroll(eID) {
    var startY = currentYPosition();
    var stopY = elmYPosition(eID);
    var distance = stopY > startY ? stopY - startY : startY - stopY;
    if (distance < 100) {
        scrollTo(0, stopY);
        return;
    }
    var speed = Math.round(distance / 100);
    if (speed >= 20) speed = 20;
    var step = Math.round(distance / 25);
    var leapY = stopY > startY ? startY + step : startY - step;
    var timer = 0;
    if (stopY > startY) {
        for (var i = startY; i < stopY; i += step) {
            setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
            leapY += step;
            if (leapY > stopY) leapY = stopY;
            timer++;
        }
        return;
    }
    for (var i = startY; i > stopY; i -= step) {
        setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
        leapY -= step;
        if (leapY < stopY) leapY = stopY;
        timer++;
    }
}

function elmYPosition(eID) {
    var elm = document.getElementById(eID);
    var y = elm.offsetTop;
    var node = elm;
    while (node.offsetParent && node.offsetParent != document.body) {
        node = node.offsetParent;
        y += node.offsetTop;
    }
    return y;
}

function currentYPosition() {
    // Firefox, Chrome, Opera, Safari
    if (self.pageYOffset) return self.pageYOffset;
    // Internet Explorer 6 - standards mode
    if (document.documentElement && document.documentElement.scrollTop)
        return document.documentElement.scrollTop;
    // Internet Explorer 6, 7 and 8
    if (document.body.scrollTop) return document.body.scrollTop;
    return 0;
}

var audio = new Audio('../../images/audio2.mp3');
var video = document.getElementById("background-video")
audio.play();
video.play();

document.getElementById("scrollDownBtn").addEventListener("click", function() {
    let pageHeight = document.querySelector('.automation-first').clientHeight;
    // window.scroll(0, pageHeight);
    $('body,html').animate({ scrollTop: pageHeight }, 800);
})

window.addEventListener("scroll", function(e) {
    if (window.scrollY >= window.innerHeight) {
        audio.pause()
        video.pause()
    } else {
        audio.play()
        video.play()
    }
})