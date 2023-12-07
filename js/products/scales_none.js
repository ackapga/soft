import {getListByCategory} from '../modules/dataProducts.js';
const data = getListByCategory();

const scales_none = document.getElementById('scales_none');
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
    scales_none.innerHTML = "";
    let video = document.createElement('div');
    // <p>Звоните прямо сейчас: <br><a href="tel:87273449900">8(727)<span> 344-99-00</span></a>; <a href="tel:+77012667700"><b>+7 701 266-77-00</b></a></p>
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
            </a>
            <div class="col-md-2">
                <p><span class="item-price-indicator_second">Цена:<br> </span><span class="item_price_second">${formatter(a.price)} тг </span></p>
                <a class="hvr-outline-out button2" href="${a.link}">Перейти</a>
            </div>
        
    `;
        scales_none.appendChild(item);

    })
}

function showInitialStage() {
    displayList(initialArray);
    let params = countParam(initialArray);
    showParamCounters(params)
}

showInitialStage();

let filterParam = {
    position: [],
    interface: [],
    weight: [],
    series: []
}

// filterArray()

function filterArray() {
    let updatedArray = initialArray.filter(function(a) {
            if (filterParam.position.length !== 0) {
                for (let i = 0; i < filterParam.position.length; i++) {
                    for (let j = 0; j < a.position.length; j++) {
                        if (a.position[j] === filterParam.position[i]) {
                            return a;
                        }
                    }
                }
            } else {
                return a;
            }
        })
        .filter(function(a) {
            if (filterParam.interface.length !== 0) {
                for (let i = 0; i < filterParam.interface.length; i++) {
                    for (let j = 0; j < a.interface.length; j++) {
                        if (a.interface[j] === filterParam.interface[i]) {
                            return a;
                        }
                    }
                }
            } else {
                return a;
            }
        })
        .filter(function(a) {
            if (filterParam.weight.length !== 0) {
                for (let i = 0; i < filterParam.weight.length; i++) {
                    if (a.weight === filterParam.weight[i]) {
                        return a;
                    }
                }
            } else {
                return a;
            }
        })
        .filter(function(a) {
            if (filterParam.series.length !== 0) {
                for (let i = 0; i < filterParam.series.length; i++) {
                    if (a.series === filterParam.series[i]) {
                        return a;
                    }
                }
            } else {
                return a;
            }
        })


    let params = countParam(updatedArray);
    showParamCounters(params)
    console.log(updatedArray);
    console.log(filterParam);
    if (updatedArray.length !== 0) {
        displayList(updatedArray)
        addFilterOption(filterOptionArray)
    } else {
        if (clickArr.length > 0) {
            clickArr[clickArr.length - 1].checked = false;
            clickArr.pop()
            filterOptionArray.pop()
            errorMsg()
            updateFilterParam()
        }
    }
}

let clickArr = []
let filterOptionArray = []
let btnArray = []

const c1b1 = document.getElementById('c1b1');
const c1b2 = document.getElementById('c1b2');
const c1b3 = document.getElementById('c1b3');
const c1b4 = document.getElementById('c1b4');

const c2b1 = document.getElementById('c2b1');
const c2b2 = document.getElementById('c2b2');
const c2b3 = document.getElementById('c2b3');
const c2b4 = document.getElementById('c2b4');
const c2b5 = document.getElementById('c2b5');

const c3b1 = document.getElementById('c3b1');
const c3b2 = document.getElementById('c3b2');
const c3b3 = document.getElementById('c3b3');
const c3b4 = document.getElementById('c3b4');
const c3b5 = document.getElementById('c3b5');

const c4b1 = document.getElementById('c4b1');
const c4b2 = document.getElementById('c4b2');
const c4b3 = document.getElementById('c4b3');
const c4b4 = document.getElementById('c4b4');




function updateFilterParam() {
    filterParam.position = [];

    if (c1b1.checked) {
        filterParam.position.push("table");
    }

    if (c1b2.checked) {
        filterParam.position.push("floor");
    }

    if (c1b3.checked) {
        filterParam.position.push("trade");
    }

    if (c1b4.checked) {
        filterParam.position.push("pallet");
    }


    filterParam.interface = [];

    if (c2b1.checked) {
        filterParam.interface.push("serial");
    }

    if (c2b2.checked) {
        filterParam.interface.push("lan");
    }

    if (c2b3.checked) {
        filterParam.interface.push("usb");
    }

    if (c2b4.checked) {
        filterParam.interface.push("wifi");
    }

    if (c2b5.checked) {
        filterParam.interface.push("none");
    }


    filterParam.weight = [];

    if (c3b1.checked) {
        filterParam.weight.push(32);
    }

    if (c3b2.checked) {
        filterParam.weight.push(200);
    }

    if (c3b3.checked) {
        filterParam.weight.push(200);
    }


    if (c3b4.checked) {
        filterParam.weight.push(1000);
    }


    if (c3b5.checked) {
        filterParam.weight.push(1000);
    }


    filterParam.series = [];

    if (c4b1.checked) {
        filterParam.series.push("mk");
    }

    if (c4b2.checked) {
        filterParam.series.push("tb");
    }

    if (c4b3.checked) {
        filterParam.series.push("th");
    }

    if (c4b4.checked) {
        filterParam.series.push("4d");
    }


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

function c1b1Click() {
    if (c1b1.checked == true) {
        filterOptionArray.push('Настольный')
        clickArr.push(c1b1)
        arrCounter = true;
    } else {
        spliceMethod(c1b1);
        spliceMethodSecond('Настольный')
        arrCounter = false;
    }
    updateFilterParam()
}

function c1b2Click() {
    if (c1b2.checked == true) {
        filterOptionArray.push('Напольный')
        clickArr.push(c1b2)
        arrCounter = true;
    } else {
        spliceMethod(c1b2);
        spliceMethodSecond('Напольный')
        arrCounter = false;
    }
    updateFilterParam()
}

function c1b3Click() {
    if (c1b3.checked == true) {
        filterOptionArray.push('Товарный')
        clickArr.push(c1b3)
        arrCounter = true;
    } else {
        spliceMethod(c1b3);
        spliceMethodSecond('Товарный')
        arrCounter = false;
    }
    updateFilterParam()
}

function c1b4Click() {
    if (c1b4.checked == true) {
        filterOptionArray.push('Паллетный')
        clickArr.push(c1b4)
        arrCounter = true;
    } else {
        spliceMethod(c1b4);
        spliceMethodSecond('Паллетный')
        arrCounter = false;
    }
    updateFilterParam()
}


function c2b1Click() {
    if (c2b1.checked == true) {
        filterOptionArray.push('Serial')
        clickArr.push(c2b1)
        arrCounter = true;
    } else {
        spliceMethod(c2b1);
        spliceMethodSecond('Serial')
        arrCounter = false;
    }
    updateFilterParam()
}

function c2b2Click() {
    if (c2b2.checked == true) {
        filterOptionArray.push('Lan')
        clickArr.push(c2b2)
        arrCounter = true;
    } else {
        spliceMethod(c2b2);
        spliceMethodSecond('Lan')
        arrCounter = false;
    }
    updateFilterParam()
}

function c2b3Click() {
    if (c2b3.checked == true) {
        filterOptionArray.push('USB')
        clickArr.push(c2b3)
        arrCounter = true;
    } else {
        spliceMethod(c2b3);
        spliceMethodSecond('USB')
        arrCounter = false;
    }
    updateFilterParam()
}

function c2b4Click() {
    if (c2b4.checked == true) {
        filterOptionArray.push('WiFi')
        clickArr.push(c2b4)
        arrCounter = true;
    } else {
        spliceMethod(c2b4);
        spliceMethodSecond('WiFi')
        arrCounter = false;
    }

    updateFilterParam()
}

function c2b5Click() {
    if (c2b5.checked == true) {
        filterOptionArray.push('Сетевой адаптер')
        clickArr.push(c2b5)
        arrCounter = true;
    } else {
        spliceMethod(c2b5);
        spliceMethodSecond('Сетевой адаптер')
        arrCounter = false;
    }

    updateFilterParam()
}


function c3b1Click() {
    if (c3b1.checked == true) {
        filterOptionArray.push('до 32кг')
        clickArr.push(c3b1)
        arrCounter = true;
    } else {
        spliceMethod(c3b1);
        spliceMethodSecond('до 32кг')
        arrCounter = false;
    }
    updateFilterParam()
}

function c3b2Click() {
    if (c3b2.checked == true) {
        filterOptionArray.push('до 60кг')
        clickArr.push(c3b2)
        arrCounter = true;
    } else {
        spliceMethod(c3b2);
        spliceMethodSecond('до 60кг')
        arrCounter = false;
    }
    updateFilterParam()
}

function c3b3Click() {
    if (c3b3.checked == true) {
        filterOptionArray.push('до 200кг')
        clickArr.push(c3b3)
        arrCounter = true;
    } else {
        spliceMethod(c3b3);
        spliceMethodSecond('до 200кг')
        arrCounter = false;
    }
    updateFilterParam()
}

function c3b4Click() {
    if (c3b4.checked == true) {
        filterOptionArray.push('до 500кг')
        clickArr.push(c3b4)
        arrCounter = true;
    } else {
        spliceMethod(c3b4);
        spliceMethodSecond('до 500кг')
        arrCounter = false;
    }
    updateFilterParam()
}

function c3b5Click() {
    if (c3b5.checked == true) {
        filterOptionArray.push('до 1000кг')
        clickArr.push(c3b5)
        arrCounter = true;
    } else {
        spliceMethod(c3b5);
        spliceMethodSecond('до 1000кг')
        arrCounter = false;
    }
    updateFilterParam()
}


function c4b1Click() {
    if (c4b1.checked == true) {
        filterOptionArray.push('Весы МК')
        clickArr.push(c4b1)
        arrCounter = true;
    } else {
        spliceMethod(c4b1);
        spliceMethodSecond('Весы МК')
        arrCounter = false;
    }
    updateFilterParam()
}

function c4b2Click() {
    if (c4b2.checked == true) {
        filterOptionArray.push('Весы TB')
        clickArr.push(c4b2)
        arrCounter = true;
    } else {
        spliceMethod(c4b2);
        spliceMethodSecond('Весы TB')
        arrCounter = false;
    }
    updateFilterParam()
}

function c4b3Click() {
    if (c4b3.checked == true) {
        filterOptionArray.push('Весы TH')
        clickArr.push(c4b3)
        arrCounter = true;
    } else {
        spliceMethod(c4b3);
        spliceMethodSecond('Весы TH')
        arrCounter = false;
    }
    updateFilterParam()
}

function c4b4Click() {
    if (c4b4.checked == true) {
        filterOptionArray.push('Весы 4D')
        clickArr.push(c4b4)
        arrCounter = true;
    } else {
        spliceMethod(c4b4);
        spliceMethodSecond('Весы 4D')
        arrCounter = false;
    }
    updateFilterParam()
}


c1b1.addEventListener('click', c1b1Click)
c1b2.addEventListener('click', c1b2Click)
c1b3.addEventListener('click', c1b3Click)
c1b4.addEventListener('click', c1b4Click)

c2b1.addEventListener('click', c2b1Click)
c2b2.addEventListener('click', c2b2Click)
c2b3.addEventListener('click', c2b3Click)
c2b4.addEventListener('click', c2b4Click)
c2b5.addEventListener('click', c2b5Click)


c3b1.addEventListener('click', c3b1Click)
c3b2.addEventListener('click', c3b2Click)
c3b3.addEventListener('click', c3b3Click)
c3b4.addEventListener('click', c3b4Click)
c3b5.addEventListener('click', c3b5Click)

c4b1.addEventListener('click', c4b1Click)
c4b2.addEventListener('click', c4b2Click)
c4b3.addEventListener('click', c4b3Click)
c4b4.addEventListener('click', c4b4Click)

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
    let position1 = 0;
    let position2 = 0;
    let position3 = 0;
    let position4 = 0;

    let interface1 = 0;
    let interface2 = 0;
    let interface3 = 0;
    let interface4 = 0;
    let interface5 = 0;

    let weight1 = 0;
    let weight2 = 0;
    let weight3 = 0;
    let weight4 = 0;
    let weight5 = 0;

    let series1 = 0;
    let series2 = 0;
    let series3 = 0;
    let series4 = 0;



    for (let index = 0; index < array.length; index++) {
        for (let i = 0; i < array[index].position.length; i++) {
            if (array[index].position[i] == "table") {
                position1++;
            } else if (array[index].position[i] == "floor") {
                position2++;
            } else if (array[index].position[i] == "trade") {
                position3++;
            } else if (array[index].position[i] == "pallet") {
                position4++;
            }
        }


        for (let i = 0; i < array[index].interface.length; i++) {
            if (array[index].interface[i] == "serial") {
                interface1++;
            } else if (array[index].interface[i] == "lan") {
                interface2++;
            } else if (array[index].interface[i] == "usb") {
                interface3++;
            } else if (array[index].interface[i] == "wifi") {
                interface4++;
            } else if (array[index].interface[i] == "none") {
                interface5++;
            }
        }

        if (array[index].weight == 32) {
            weight1++;
        } else if (array[index].weight == 200) {
            weight3++;
            weight2++;
        } else if (array[index].weight == 1000) {
            weight5++;
            weight4++;
        }


        if (array[index].series == "mk") {
            series1++;
        } else if (array[index].series == "tb") {
            series2++;
        } else if (array[index].series == "th") {
            series3++;
        } else if (array[index].series == "4d") {
            series4++;
        }
    }

    return [
        position1, position2, position3, position4,
        interface1, interface2, interface3, interface4, interface5,
        weight1, weight3, weight5,
        series1, series2, series3, series4,
        weight2, weight4
    ]

}

function showParamCounters(array) {
    for (let i = 0; i < array.length; i++) {
        document.getElementById(`param${i+1}`).innerHTML = array[i];
        // console.log(array);
    }
}