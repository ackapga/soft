/* Массив новых продуктов */
const cardsArray = [
    {
        link: "scanner_6600B.php",
        img: "/images/slider-card-images/ava1.png",
        title: "Беспроводной сканер штрих кода 6600 B"
    }, {
        link: "pos_3021_white_pro.php",
        img: "/images/slider-card-images/ava2.jpg",
        title: "Сенсорный Моноблок 3021 PRO, белый"
    }, {
        link: "thermalprinter_RP326.php",
        img: "/images/slider-card-images/ava3.jpg",
        title: "Принтер чеков Rongta RP 326"
    }, {
        link: "scale_RLS1100C.php",
        img: "/images/slider-card-images/ava4.png",
        title: "Весы Rongta RLS1100C"
    }, {
        link: "scanner_70-2D.php",
        img: "/images/slider-card-images/ava5.png",
        title: "Стационарный сканер штрих кодов 70-2D"
    }, {
        link: "scanpal_eda_50.php",
        img: "/images/slider-card-images/ava6.png",
        title: "ТСД терминал Honeywell ScanPal EDA50"
    }]

const cardsContainer = document.querySelector('.sm-cards');

if (cardsContainer) {
    const fragment = document.createDocumentFragment();

    for (let i = 0, len = cardsArray.length; i < len; i++) {
        const card = document.createElement('li');
        card.classList.add("sm-card");
        card.innerHTML = `
        <a href="${cardsArray[i].link}">
            <div class="sm-card-inner">
                <div class="sm-card-inner-wrap">
                    <div class="sm-card-img">
                        <img src="${cardsArray[i].img}" alt="${cardsArray[i].title}">
                    </div>
                    <div class="sm-card-title">
                        <p>${cardsArray[i].title}</p>
                    </div>
                </div>
            </div>
        </a>`;
        fragment.appendChild(card);
    }
    cardsContainer.appendChild(fragment);
}

/* Массив списка наших клиентов */
const clientsArray = [
    {
    img: '/images/logo/sinooil.png',
    alt: 'Sinooil logotype'
    },
    {
        img: '/images/logo/hel.png',
        alt: 'Helious logotype'
    },
    {
        img: '/images/logo/tech.png',
        alt: 'Technodom logotype'
    },
    {
        img: '/images/logo/meg.png',
        alt: 'Mega logotype'
    },
    {
        img: '/images/logo/magnum.png',
        alt: 'Magnum logotype'
    },
    {
        img: '/images/logo/ecco.png',
        alt: 'Ecco logotype'
    }, {
        img: '/images/logo/koton.png',
        alt: 'Koton logotype'
    }, {
        img: '/images/logo/kul.png',
        alt: 'Kulan-oil logotype'
    }, {
        img: '/images/logo/Forte.png',
        alt: 'Kazkom logotype'
    }, {
        img: '/images/logo/kul.png',
        alt: 'Nazarbayev university logotype'
    }
]

const ourClients = document.querySelector('.our-clients');

if (ourClients) {
    const fragment = document.createDocumentFragment();

    for (let i = 0, len = clientsArray.length; i < len; i++) {
        const client = document.createElement("li");
        client.innerHTML = `<img src="${clientsArray[i].img}" alt="${clientsArray[i].alt}" />`;
        fragment.appendChild(client);
    }

    ourClients.appendChild(fragment);
}