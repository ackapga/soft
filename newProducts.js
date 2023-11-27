const data = [{
    link: "scanner_6600B.php",
    img: "images/slider-card-images/ava1.png",
    title: "Беспроводной сканер штрих кода 6600 B"
}, {
    link: "pos_3021_white_pro.php",
    img: "images/slider-card-images/ava2.jpg",
    title: "Сенсорный Моноблок 3021 PRO, белый"
}, {
    link: "thermalprinter_RP326.php",
    img: "images/slider-card-images/ava3.jpg",
    title: "Принтер чеков Rongta RP 326"
}, {
    link: "scale_RLS1100C.php",
    img: "images/slider-card-images/ava4.png",
    title: "Весы Rongta RLS1100C"
}, {
    link: "scanner_70-2D.php",
    img: "images/slider-card-images/ava5.png",
    title: "Стационарный сканер штрих кодов 70-2D"
}, {
    link: "scanpal_eda_50.php",
    img: "images/slider-card-images/ava6.png",
    title: "ТСД терминал Honeywell ScanPal EDA50"
}]

const cards = document.querySelector('.sm-cards');


// console.log(data.length);

for (let i = 0; i < data.length; i++) {
    let card = document.createElement('li');
    card.classList.add("sm-card");
    card.innerHTML = `
        <a href="${data[i].link}">
            <div class="sm-card-inner">
                <div class="sm-card-inner-wrap">
                    <div class="sm-card-img ">
                        <img src="${data[i].img}" alt=" ">
                    </div>
                    <div class="sm-card-title">

                        <p>    ${data[i].title}</p>
                    </div>
                </div>
            </div>
        </a>`;
    cards.appendChild(card);
}