const data = [{
        link: "label_3120t.php",
        title: "Принтер этикеток 3120T",
        desc: "Легкий и удобный принтер этикеток со скоростью 127мм/сек с разрешением 203 dpi имеет превосходные технические характеристики для печати этикеток шириной 76 мм. Принтер этикеток 3120T имеет функции: автоматической калибровки бумаги и функцию контроля температуры.",
        img: "../images/label/1.jpg",
        price: 45360,
        color: "black",
        paperWidth: 76,
        interfaces: ["usb"],
        autoCut: true,
        winding: true,
    }, {
        link: "label_2408d.php",
        title: "Принтер этикеток 2408DC",
        desc: "Высокопроизводительный принтер GS-2408D со скоростью 203мм/сек с разрешением 203 dpi имеет превосходные технические характеристики для печати этикеток шириной 104 мм. Данный принетер является отличным решением для розничной торговли, маркировки полок, а также для сервисов доставки.",
        img: "../images/2408D/1.png",
        price: 45360,
        color: "white",
        paperWidth: 104,
        interfaces: ["usb", "serial", "wifi", "bluetooth"],
        autoCut: true,
        winding: true,
    }, {
        link: "label_3120tub.php",
        title: "Принтер этикеток 3120TUB",
        desc: "Высокопроизводительный принтер 3120TUB со скоростью 127 мм/сек с разрешением 203 dpi имеет превосходные технические характеристики для печати этикеток шириной 76 мм. Данный принетер является безупречным решением для организации работы торговых компаний разной специализации.",
        img: "../images/3120TUB/1.jpg",
        price: 33390,
        color: "gray",
        paperWidth: 76,
        interfaces: ["usb"],
        autoCut: false,
        winding: false,
    },
    {
        link: "label_3120tl.php",
        title: "Принтер этикеток 3120TL",
        desc: "Высокопроизводительный принтер GP-3120TL со скоростью 127 мм/сек с разрешением 203 dpi имеет превосходные технические характеристики для печати этикеток шириной 76 мм. Данный принетер является безупречным решением для организации работы торговых компаний разной специализации.",
        img: "../images/3120TL/2.jpg",
        price: 44100,
        color: "black",
        paperWidth: 76,
        interfaces: ["usb"],
        autoCut: true,
        winding: false,
    },
    {
        link: "label_3120tuc.php",
        title: "Принтер этикеток 3120TUC",
        desc: "Высокопроизводительный принтер GP-3120TL со скоростью 127 мм/сек с разрешением 203 dpi имеет превосходные технические характеристики для печати этикеток шириной 80 мм. Данный принетер является безупречным решением для организации работы торговых компаний разной специализации.",
        img: "../images/3120TUC/1.jpg",
        price: 37080,
        color: "black",
        paperWidth: 80,
        interfaces: ["usb"],
        autoCut: true,
        winding: false,
    },
]

const labels = document.getElementById('labels');

const priceSort = document.getElementById('priceSort');

let priceSortedArray = data.sort(function(a, b) {
    let x = a.price;
    let y = b.price;

    return x - y;
});
let initialArray = priceSortedArray;

let initStage = true;

priceSort.addEventListener("change", function() {
    if (priceSort.value == "first") {
        priceSortedArray = data.sort(function(a, b) {
            let x = a.price;
            let y = b.price;

            return x - y;
        });

    } else if (priceSort.value == "second") {
        priceSortedArray = data.sort(function(a, b) {
            let x = a.price;
            let y = b.price;

            return y - x;
        });
    }

    initialArray = priceSortedArray;
    filterArray();
});


function displayList(array) {
    labels.innerHTML = "";
    let video = document.createElement('div');
    // <p>Звоните прямо сейчас: <br><a href="tel:87015112200">8(727)<span> 344-99-00</span></a>; <a href="tel:+77012667700"><b>+7 701 266-77-00</b></a></p>
    video.innerHTML = `
            <div class="video1"><iframe width="780" height="439" src="https://www.youtube.com/embed/jpDM-Ybi5DE?rel=0&autoplay=0" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
            `;

    array.map((a) => {
        let item = document.createElement('div');
        item.classList.add("main");
        var formatter = function(priceSum) {
            let mn = 0;
            let price = priceSum.toString()
            for (let ij = price.length; ij > 0; ij--) {
                if (mn % 3 == 0) {
                    // price.splice(ij, 0, " ")
                    price = [price.slice(0, ij), " ", price.slice(ij)].join('');
                }
                mn++;
            }
            return price;
        }

        item.innerHTML = `
        <a href="${a.link}">
            <div class="col-md-3">
                <img src="${a.img}">
            </div>
            <div class="col-md-7">
                <div class="nazvanie">
                    <p>${a.title}</p>
                </div>
                <p>${a.desc}</p>
            </div>
            <div class="col-md-2">
                <p><span class="item-price-indicator_second">Цена:<br> </span><span class="item_price_second">${formatter(a.price)} тг </span></p>
                <a class="hvr-outline-out button2" href="${a.link}">Перейти</a>
            </div>
        </a>
    `;
        labels.appendChild(item);

    })
}

function showInitialStage() {
    displayList(initialArray);
    let params = countParam(initialArray);
    showParamCounters(params)
        // console.log("object");
}


showInitialStage();

let filterParam = {
    color: [],
    paperWidth: [],
    winding: []
}



function filterArray() {
    let updatedArray = initialArray.filter(function(a) {
            if (filterParam.color.length !== 0) {
                for (let i = 0; i < filterParam.color.length; i++) {
                    if (a.color === filterParam.color[i]) {
                        return a;
                    }
                }
            } else {
                return a;
            }
        })
        .filter(function(a) {
            if (filterParam.paperWidth.length !== 0) {
                for (let i = 0; i < filterParam.paperWidth.length; i++) {
                    if (a.paperWidth === filterParam.paperWidth[i]) {
                        return a;
                    }
                }
            } else {
                return a;
            }
        })
        .filter(function(a) {
            if (filterParam.winding.length !== 0) {
                for (let i = 0; i < filterParam.winding.length; i++) {
                    if (a.winding === filterParam.winding[i]) {
                        return a;
                    }
                }
            } else {
                return a;
            }
        })


    let params = countParam(updatedArray);
    showParamCounters(params)
        // console.log(updatedArray);


    if (updatedArray.length !== 0) {
        displayList(updatedArray)
        addFilterOption(filterOptionArray)
    } else {
        clickArr[clickArr.length - 1].checked = false;
        clickArr.pop()
        filterOptionArray.pop()
        errorMsg()
            // console.log(clickArr);
            // console.log(filterOptionArray)
        updateFilterParam()
    }
}

let clickArr = []
let filterOptionArray = []
let btnArray = []

const whiteBtn = document.getElementById('whiteBtn');
const blackBtn = document.getElementById('blackBtn');
const grayBtn = document.getElementById('grayBtn');
const firstWidthBtn = document.getElementById('firstWidthBtn');
const secondWidthBtn = document.getElementById('secondWidthBtn');
const thirdWidthBtn = document.getElementById('thirdWidthBtn');
const withAutoCutBtn = document.getElementById('withAutoCutBtn');
const wtAutoCutBtn = document.getElementById('wtAutoCutBtn');
const autoSeperationBtn = document.getElementById('autoSeperationBtn');
const noAutoSeperationBtn = document.getElementById('noAutoSeperationBtn');


function updateFilterParam() {
    filterParam.color = [];

    if (whiteBtn.checked === true) {
        filterParam.color.push("white");
    }

    if (blackBtn.checked === true) {
        filterParam.color.push("black");
    }

    if (grayBtn.checked === true) {
        filterParam.color.push("gray");
    }

    filterParam.paperWidth = [];

    if (firstWidthBtn.checked === true) {
        filterParam.paperWidth.push(76);
    }

    if (secondWidthBtn.checked === true) {
        filterParam.paperWidth.push(80);
    }

    if (thirdWidthBtn.checked === true) {
        filterParam.paperWidth.push(104);
    }

    filterParam.winding = [];

    if (autoSeperationBtn.checked === true) {
        filterParam.winding.push(true);
    }

    if (noAutoSeperationBtn.checked === true) {
        filterParam.winding.push(false);
    }

    // console.log("object");
    filterArray()
}

function spliceMethod(value) {
    const idx = clickArr.indexOf(value);
    if (idx > -1) {
        clickArr.splice(idx, 1);
    }
}

function spliceMethodSecond(value) {
    const idx = filterOptionArray.indexOf(value);
    if (idx > -1) {
        filterOptionArray.splice(idx, 1);
    }
}

function whiteBtnClick() {
    if (whiteBtn.checked == true) {
        filterOptionArray.push('белый')
        clickArr.push(whiteBtn)
        arrCounter = true;
    } else {
        spliceMethod(whiteBtn);
        spliceMethodSecond('белый')
        arrCounter = false;
    }
    updateFilterParam()
}

function blackBtnClick() {
    if (blackBtn.checked == true) {
        filterOptionArray.push('черный')
        clickArr.push(blackBtn)
        arrCounter = true;
    } else {
        spliceMethod(blackBtn);
        spliceMethodSecond('черный')
        arrCounter = false;
    }
    updateFilterParam()
}

function grayBtnClick() {
    if (grayBtn.checked == true) {
        filterOptionArray.push('черный')
        clickArr.push(grayBtn)
        arrCounter = true;
    } else {
        spliceMethod(grayBtn);
        spliceMethodSecond('черный')
        arrCounter = false;
    }
    updateFilterParam()
}

function firstWidthBtnClick() {
    if (firstWidthBtn.checked == true) {
        filterOptionArray.push('до 80мм')
        clickArr.push(firstWidthBtn)
        arrCounter = true;
    } else {
        spliceMethod(firstWidthBtn);
        spliceMethodSecond('до 80мм')
        arrCounter = false;
    }
    updateFilterParam()
}

function secondWidthBtnClick() {
    if (secondWidthBtn.checked == true) {
        filterOptionArray.push('до 82мм')
        clickArr.push(secondWidthBtn)
        arrCounter = true;
    } else {
        spliceMethod(secondWidthBtn);
        spliceMethodSecond('до 82мм')
        arrCounter = false;
    }
    updateFilterParam()
}

function thirdWidthBtnClick() {
    if (thirdWidthBtn.checked == true) {
        filterOptionArray.push('до 120мм')
        clickArr.push(thirdWidthBtn)
        arrCounter = true;
    } else {
        spliceMethod(thirdWidthBtn);
        spliceMethodSecond('до 120мм')
        arrCounter = false;
    }
    updateFilterParam()
}

function autoSeperationBtnClick() {
    if (autoSeperationBtn.checked == true) {
        filterOptionArray.push('имеется')
        clickArr.push(autoSeperationBtn)
        arrCounter = true;
    } else {
        spliceMethod(autoSeperationBtn);
        spliceMethodSecond('имеется')
        arrCounter = false;
    }
    updateFilterParam()
}

function noAutoSeperationBtnClick() {
    if (noAutoSeperationBtn.checked == true) {
        filterOptionArray.push('отсуствует')
        clickArr.push(noAutoSeperationBtn)
        arrCounter = true;
    } else {
        spliceMethod(noAutoSeperationBtn);
        spliceMethodSecond('отсуствует')
        arrCounter = false;
    }
    updateFilterParam()
}

whiteBtn.addEventListener('click', whiteBtnClick)
blackBtn.addEventListener('click', blackBtnClick)
grayBtn.addEventListener('click', grayBtnClick)
firstWidthBtn.addEventListener('click', firstWidthBtnClick)
secondWidthBtn.addEventListener('click', secondWidthBtnClick)
thirdWidthBtn.addEventListener('click', thirdWidthBtnClick)
autoSeperationBtn.addEventListener('click', autoSeperationBtnClick)
noAutoSeperationBtn.addEventListener('click', noAutoSeperationBtnClick)


let checkBoxArr = []
    // settings関数で初期設定 全体に適応させたい場合
iziToast.settings({
    timeout: 3000, // default timeout
    resetOnHover: true,
    // icon: '', // icon class
    transitionIn: 'flipInX',
    transitionOut: 'flipOutX',
    position: 'topRight', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter, center
    onOpen: function() {
        // console.log('callback abriu!');
    },
    onClose: function() {
        // console.log("callback fechou!");
    }
});


// error
function errorMsg() {
    iziToast.warning({ title: '', message: 'По таким параметрам продуктов не найдено' });
}


const filter = document.getElementById("filter");
let arrCounter = true;

function addFilterOption(arr) {
    let index = 0;
    filter.innerHTML = "";
    arr.map(a => {
        let filterOption = document.createElement('div');
        filterOption.setAttribute("data-id", index)
        filterOption.id = "filterOption"
        filterOption.classList.add('filter-option')
        if (arrCounter == true) {
            filterOption.classList.add('filter-animation')
        }
        if (index > 0) {
            document.querySelector(`[data-id="${index - 1}"]`).classList.remove('filter-animation');
        }
        filterOption.innerHTML = `
        <span class="filter-option-value" data-id="${index}">${a} 
            <svg xmlns="https://www.w3.org/2000/svg" style="
            pointer-events: none;
            margin-left: 8.5px;" data-id="${index} width="10px" height="10px" viewBox="0 0 7 7" id="filterOptionSvg" fill="none">
                <path data-id="${index} id="filterOptionPath" fill-rule="evenodd" clip-rule="evenodd" d="M4.00199 4.7091L6.64844 7.35554L7.35554 6.64844L4.7091 4.00199L7.35554 1.35554L6.64844 0.648438L4.00199 3.29488L1.35554 0.648438L0.648438 1.35554L3.29488 4.00199L0.648438 6.64844L1.35554 7.35554L4.00199 4.7091Z" fill="#C4C4C4"></path>
            </svg>
        </span>
        `;
        filter.appendChild(filterOption);
        index++;
    })
}

let filterOption = document.querySelector(".filter-option");

document.addEventListener(
    "click",
    function(e) {
        e = e || window.event;
        let target = e.srcElement;
        if (
            target.id === "filterOption" ||
            target.parentNode.id === "filterOption"
        ) {
            arrCounter = false;
            // console.log(filterOptionArray);
            let selectedId = parseInt(target.getAttribute('data-id'), 10);
            removeFilterElement(selectedId)
                // console.log(filterOptionArray);

        }
    },
    false
);


function removeFilterElement(value) {
    filterOptionArray.splice(value, 1);
    clickArr[value].checked = false;
    clickArr.splice(value, 1)
    updateFilterParam();
}

function countParam(array) {
    let color1 = 0;
    let color2 = 0;
    let color3 = 0;
    let paperWidth1 = 0;
    let paperWidth2 = 0;
    let paperWidth3 = 0;
    let winding1 = 0;
    let winding2 = 0;

    for (let index = 0; index < array.length; index++) {

        if (array[index].color == "white") {
            color1++;
        } else if (array[index].color == "black") {
            color2++;
        } else if (array[index].color == "gray") {
            color3++;
        }

        if (array[index].paperWidth == 76) {
            paperWidth1++;
        } else if (array[index].paperWidth == 80) {
            paperWidth2++;
        } else if (array[index].paperWidth == 104) {
            paperWidth3++;
        }



        if (array[index].winding == true) {
            winding1++;
        } else if (array[index].winding == false) {
            winding2++;
        }
    }

    return [color1, color2, color3, paperWidth1, paperWidth2, paperWidth3, winding1, winding2]

}

function showParamCounters(array) {
    for (let index = 0; index < array.length; index++) {
        document.getElementById(`${index+1}param`).innerHTML = array[index]
    }
}

// var filename = window.location.href.split('/').pop().split('#')[0].split('?')[0];
// console.log(filename);