var testim = document.getElementById("testim"),
    testimDots = Array.prototype.slice.call(document.getElementById("testim-dots").children),
    testimContent = Array.prototype.slice.call(document.getElementById("testim-content").children),
    testimLeftArrow = document.getElementById("left-arrow"),
    testimRightArrow = document.getElementById("right-arrow"),
    testimSpeed = 10000,
    currentSlide = 0,
    currentActive = 0,
    testimTimer,
    touchStartPos,
    touchEndPos,
    touchPosDiff,
    ignoreTouch = 30,
    prevDot = 0;

window.onload = function() {

    // Testim Script
    let mnIndex = 0;

    function playSlide(slide) {


        for (var k = 0; k < testimDots.length; k++) {
            testimContent[k].classList.remove("active");
            testimContent[k].classList.remove("inactive");

            testimContent[k].classList.remove("active-left");
            testimContent[k].classList.remove("inactive-left");


            testimDots[k].classList.remove("active");
        }

        if (slide < 0) {
            slide = currentSlide = testimContent.length - 1;
        }

        if (slide > testimContent.length - 1) {
            slide = currentSlide = 0;
        }

        if (currentActive != currentSlide) {
            testimContent[currentActive].classList.add("inactive");
        }
        testimContent[slide].classList.add("active");
        testimDots[slide].classList.add("active");

        currentActive = currentSlide;

        clearTimeout(testimTimer);
        testimTimer = setTimeout(function() {
            playSlide(currentSlide += 1);
        }, testimSpeed)
    }


    function playSlideLeft(slide) {

        for (var k = 0; k < testimDots.length; k++) {
            testimContent[k].classList.remove("active");
            testimContent[k].classList.remove("inactive");

            testimContent[k].classList.remove("active-left");
            testimContent[k].classList.remove("inactive-left");


            testimDots[k].classList.remove("active");
        }

        if (slide < 0) {
            slide = currentSlide = testimContent.length - 1;
        }

        if (slide > testimContent.length - 1) {
            slide = currentSlide = 0;
        }

        if (currentActive != currentSlide) {
            testimContent[currentActive].classList.add("inactive-left");
        }
        testimContent[slide].classList.add("active-left");
        testimDots[slide].classList.add("active");

        currentActive = currentSlide;

        clearTimeout(testimTimer);
        testimTimer = setTimeout(function() {
            playSlide(currentSlide += 1);
        }, testimSpeed)
    }


    function getPrevDotNumber() {
        for (let index = 0; index < testimDots.length; index++) {
            if (testimDots[index].classList.contains("active")) {
                return index;
            }
        }
    }


    testimLeftArrow.addEventListener("click", function() {
        playSlideLeft(currentSlide -= 1);
    })

    testimRightArrow.addEventListener("click", function() {
        playSlide(currentSlide += 1);
    })

    for (var l = 0; l < testimDots.length; l++) {
        testimDots[l].addEventListener("click", function() {

            mnIndex = getPrevDotNumber();


            if (mnIndex > testimDots.indexOf(this)) {

                playSlideLeft(currentSlide = testimDots.indexOf(this));
            } else {

                playSlide(currentSlide = testimDots.indexOf(this));
            }
        })
    }

    // playSlide(currentSlide);

    // keyboard shortcuts
    document.addEventListener("keyup", function(e) {
        switch (e.keyCode) {
            case 37:
                testimLeftArrow.click();
                break;

            case 39:
                testimRightArrow.click();
                break;

            case 39:
                testimRightArrow.click();
                break;

            default:
                break;
        }
    })

    testim.addEventListener("touchstart", function(e) {
        touchStartPos = e.changedTouches[0].clientX;
    })

    testim.addEventListener("touchend", function(e) {
        touchEndPos = e.changedTouches[0].clientX;

        touchPosDiff = touchStartPos - touchEndPos;



        if (touchPosDiff > 0 + ignoreTouch) {
            testimLeftArrow.click();
        } else if (touchPosDiff < 0 - ignoreTouch) {
            testimRightArrow.click();
        } else {
            return;
        }

    })
}

const containerTimelineItem =
    // window.getComputedStyle(
    document.querySelectorAll('.container-timeline-item')
    //     , '::before'
    // );



const containerTimeLineData = [{
        img: "../images/automation/steps/8.webp",
        title: "Бесплатная консультация по продукту",
        desc: "Для нас важно время и удобство клиента. Мы стараемся быстро и качественно рассказать вам о современной технологии автоматизации, ее возможностях, а также о том, какие задачи она решает."
    },
    {
        img: "../images/automation/steps/2.webp",
        title: "Анализ и выявление проблемных зон",
        desc: "Целью данного этапа является выявление и анализ проблем в функциональных структурах предприятия, которые могут быть решены с помощью автоматизации."
    },
    {
        img: "../images/automation/steps/3.webp",
        title: "Разработка системы по индивидуальному решению клиента",
        desc: "После составления плана, сформированного совместно в ходе обсуждения, разработчики приступают к построению системы автоматизации. Индивидуальный подход к каждому клиенту создает возможность для клиента заказать свои личные улучшения."
    },
    {
        img: "../images/automation/steps/4.webp",
        title: "Внедрение и запуск системы",
        desc: "Наши решения позволят вам в короткие сроки и максимально эффективно запустить автоматизацию существующие бизнес-процессы."
    },
    {
        img: "../images/automation/steps/7.webp",
        title: "Комплексное обучение персонала",
        desc: "Квалифицированные специалисты готовы обучить обслуживающий персонал клиента работе с установленным оборудованием, подробно расскажут обо всех функциях, помогут настроить самостоятельно, а также ответят на все дополнительные вопросы."
    },
    {
        img: "../images/automation/steps/6.webp",
        title: "Тех поддержка и дальнейшие обновление",
        desc: "Техническая поддержка по любым вопросам, связанным с функционалом программы, после окончания тестового периода системной интеграции"
    }
]


document.querySelector(".container-timeline-content").innerHTML = `<div class="container-timeline-box displayFlex">
    <div class="container-timeline-box-image">
    <img src="../images/automation/steps/3.webp">
</div>
<div class="container-timeline-box-content ">
    <h3> Разработка системы по индивидуальному решению клиента</h3>
    <p>После составления плана, сформированного совместно в ходе обсуждения, разработчики приступают к построению системы автоматизации. Индивидуальный подход к каждому клиенту создает возможность для клиента заказать свои личные улучшения.</p>
</div>
</div>`

const heigght = document.querySelector(".container-timeline-content").clientHeight
    // document.querySelector(".container-timeline-content").style.height = `${heigght }px`;



document.querySelector(".container-timeline-content").innerHTML = ``

containerTimeLineData.forEach(item => {
    const box = document.createElement("div")
    box.classList.add("container-timeline-box");
    box.innerHTML = `
        <div class="container-timeline-box-image">
            <img src="${item.img}">
        </div>
        <div class="container-timeline-box-content ">
            <h3> ${item.title}</h3>
            <p>${item.desc}</p>
        </div>
`
    document.querySelector(".container-timeline-content").appendChild(box)
})


document.querySelector(".container-timeline-content").children[0].classList.add("displayFlex")

window.addEventListener('scroll', updateView);
let isClicked = false
let isChanged = false

function updateView() {
    if (window.pageYOffset + 500 > document.querySelector(".py-5").offsetTop) {
        if (isChanged == false) {
            slideshow()
        }
    }
}
let prevIdx
let idx = 0;
containerTimelineItem.forEach(a => {
    a.addEventListener('mouseenter', function() {

        isClicked = true
        a.childNodes[1].classList.add('container-timeline-item-active')
        a.childNodes[3].classList.add('container-timeline-item-active-title')

        for (let i = 0; i < containerTimelineItem.length; i++) {
            let b = containerTimelineItem[i];
            if (b != a) {
                if (b.childNodes[1].classList.contains('container-timeline-item-active') && b.childNodes[3].classList.contains('container-timeline-item-active-title')) {
                    b.childNodes[1].classList.remove('container-timeline-item-active')
                    b.childNodes[3].classList.remove('container-timeline-item-active-title')

                }
            } else {
                prevIdx = idx
                idx = i
            }
        }

        for (let i = 0; i < containerTimelineItem.length; i++) {
            let b = containerTimelineItem[i];

            b.childNodes[1].classList.remove('container-timeline-item-active')
            b.childNodes[3].classList.remove('container-timeline-item-active-title')

        }




        document.querySelector(`#container-timeline-item-${idx+1} span`).classList.add('container-timeline-item-active')
        document.querySelector(`#container-timeline-item-${idx+1} p`).classList.add('container-timeline-item-active-title')


        if (idx !== prevIdx) {
            function addDisplayFlex() {

                // document.querySelector(".container-timeline-content").children[prevIdx].classList.remove("removeItem")
                for (let index = 0; index < document.querySelector(".container-timeline-content").children.length; index++) {
                    document.querySelector(".container-timeline-content").children[index].classList.remove("removeItem")
                    document.querySelector(".container-timeline-content").children[prevIdx].classList.remove("displayFlex")
                }
                document.querySelector(".container-timeline-content").children[idx].classList.add("displayFlex")
            }

            for (let index = 0; index < document.querySelector(".container-timeline-content").children.length; index++) {
                document.querySelector(".container-timeline-content").children[index].classList.remove("displayFlex");
            }
            document.querySelector(".container-timeline-content").children[prevIdx].classList.remove("displayFlex")
            document.querySelector(".container-timeline-content").children[prevIdx].classList.add("removeItem")

            setTimeout(
                addDisplayFlex,
                400
            )
        }
    })

})


let im = 1;
let pm = 0;

window.mobileCheck = function() {
    let check = false;
    (function(a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check
};


if (mobileCheck() === true) {
    // isClicked = true


}

function timeLineSwipe() {


    for (let index = 0; index < document.querySelector(".container-timeline-content").children.length; index++) {
        document.querySelector(".container-timeline-content").children[index].classList.remove("removeItem")
        document.querySelector(".container-timeline-content").children[prevIdx].classList.remove("displayFlex")
    }
    if (idx !== prevIdx) {



        function addDisplayFlex1() {
            // document.querySelector(".container-timeline-content").children[prevIdx].classList.remove("removeItem")

            for (let index = 0; index < document.querySelector(".container-timeline-content").children.length; index++) {
                document.querySelector(".container-timeline-content").children[index].classList.remove("removeItem")
                document.querySelector(".container-timeline-content").children[prevIdx].classList.remove("displayFlex")
            }
            document.querySelector(".container-timeline-content").children[idx].classList.add("displayFlex")
        }

        for (let index = 0; index < document.querySelector(".container-timeline-content").children.length; index++) {
            document.querySelector(".container-timeline-content").children[index].classList.remove("displayFlex");
        }
        document.querySelector(".container-timeline-content").children[prevIdx].classList.remove("displayFlex")
        document.querySelector(".container-timeline-content").children[prevIdx].classList.add("removeItem")

        setTimeout(
            addDisplayFlex1,
            400
        )
    }
}

function slideshow() {


    setInterval(function() {
        if (isClicked == false) {

            containerTimelineItem.forEach(a => {


                for (let i = 0; i < containerTimelineItem.length; i++) {
                    let b = containerTimelineItem[i];

                    b.childNodes[1].classList.remove('container-timeline-item-active')
                    b.childNodes[3].classList.remove('container-timeline-item-active-title')

                }
                containerTimelineItem[im].childNodes[1].classList.add('container-timeline-item-active')
                containerTimelineItem[im].childNodes[3].classList.add('container-timeline-item-active-title')

                function addDisplayFlex() {
                    // document.querySelector(".container-timeline-content").children[prevIdx].classList.remove("removeItem")
                    for (let index = 0; index < document.querySelector(".container-timeline-content").children.length; index++) {
                        document.querySelector(".container-timeline-content").children[index].classList.remove("removeItem")
                        document.querySelector(".container-timeline-content").children[pm].classList.remove("displayFlex")
                    }

                    if (im > 0) {
                        document.querySelector(".container-timeline-content").children[im - 1].classList.add("displayFlex")
                    } else {
                        document.querySelector(".container-timeline-content").children[5].classList.add("displayFlex")
                    }
                }

                for (let index = 0; index < document.querySelector(".container-timeline-content").children.length; index++) {
                    document.querySelector(".container-timeline-content").children[index].classList.remove("displayFlex");
                }
                document.querySelector(".container-timeline-content").children[pm].classList.remove("displayFlex")
                document.querySelector(".container-timeline-content").children[pm].classList.add("removeItem")

                setTimeout(
                    addDisplayFlex,
                    500
                )
            })

            pm = im
            im++;
            if (im > 5) {
                im = 0
            }
        }

    }, 4000)
    isChanged = true
}


function offset(el) {
    var rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

// example use
var div = document.querySelector(".container-timeline-box-image");
var divOffset = offset(div);
let firstY = divOffset.top;

let blockHeight = document.querySelector(".container-timeline-content").clientHeight


let onBlock = false
let secondY = blockHeight + firstY;


document.addEventListener('scroll',
    function(e) {
        if (window.pageYOffset > firstY - 300 && window.pageYOffset < secondY + 100) {
            onBlock = true;
        } else {
            onBlock = false;
        }


    }
)



document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;
var yDown = null;

function getTouches(evt) {
    return evt.touches || // browser API
        evt.originalEvent.touches; // jQuery
}

function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
};

function handleTouchMove(evt) {
    if (!xDown || !yDown) {
        return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if (onBlock) {
        if (Math.abs(xDiff) > Math.abs(yDiff)) { /*most significant*/
            if (xDiff > 0) {
                /* right swipe */

                if (idx !== 5) {
                    prevIdx = idx;
                    idx++;
                    timeLineSwipe()
                }


                for (let i = 0; i < containerTimelineItem.length; i++) {
                    let b = containerTimelineItem[i];
                    b.childNodes[1].classList.remove('container-timeline-item-active')
                }

                document.querySelector(`#container-timeline-item-${idx+1} span`).classList.add('container-timeline-item-active')
            } else {
                /* left swipe */
                if (idx !== 0) {
                    prevIdx = idx;
                    idx--;
                    timeLineSwipe()


                    for (let i = 0; i < containerTimelineItem.length; i++) {
                        let b = containerTimelineItem[i];
                        b.childNodes[1].classList.remove('container-timeline-item-active')
                    }

                    document.querySelector(`#container-timeline-item-${idx+1} span`).classList.add('container-timeline-item-active')
                }
            }
        }
        /* reset values */
        xDown = null;
        yDown = null;
    }
};