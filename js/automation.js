const containerTimelineItem =
    // window.getComputedStyle(
    document.querySelectorAll('.container-timeline-item')
    //     , '::before'
    // );



const containerTimeLineData = [{
        img: "./images/automation/steps/8.png",
        title: "Бесплатная консультация по продукту",
        desc: "Для нас важно время и удобство клиента. Мы стараемся быстро и качественно рассказать вам о современной технологии автоматизации, ее возможностях, а также о том, какие задачи она решает."
    },
    {
        img: "./images/automation/steps/2.png",
        title: "Анализ и выявление проблемных зон",
        desc: "Целью данного этапа является выявление и анализ проблем в функциональных структурах предприятия, которые могут быть решены с помощью автоматизации."
    },
    {
        img: "./images/automation/steps/3.png",
        title: "Разработка системы по индивидуальному решению клиента",
        desc: "После составления плана, сформированного совместно в ходе обсуждения, разработчики приступают к построению системы автоматизации. Индивидуальный подход к каждому клиенту создает возможность для клиента заказать свои личные улучшения."
    },
    {
        img: "./images/automation/steps/4.png",
        title: "Внедрение и запуск системы",
        desc: "Наши решения позволят вам в короткие сроки и максимально эффективно запустить автоматизацию существующие бизнес-процессы."
    },
    {
        img: "./images/automation/steps/7.png",
        title: "Комплексное обучение персонала",
        desc: "Квалифицированные специалисты готовы обучить обслуживающий персонал клиента работе с установленным оборудованием, подробно расскажут обо всех функциях, помогут настроить самостоятельно, а также ответят на все дополнительные вопросы."
    },
    {
        img: "./images/automation/steps/6.png",
        title: "Тех поддержка и дальнейшие обновление",
        desc: "Техническая поддержка по любым вопросам, связанным с функционалом программы, после окончания тестового периода системной интеграции"
    }
]

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
// console.log();
let isClicked = false
let isChanged = false

function updateView() {
    if (window.pageYOffset + 500 > document.querySelector(".py-5").offsetTop) {
        if (isChanged == false) {
            slideshow()
        }
    }
}

containerTimelineItem.forEach(a => {
    a.addEventListener('click', function() {
        isClicked = true
        a.childNodes[1].classList.toggle('container-timeline-item-active')
        a.childNodes[3].classList.toggle('container-timeline-item-active-title')

        let idx = 0;
        for (let i = 0; i < containerTimelineItem.length; i++) {
            let b = containerTimelineItem[i];
            if (b != a) {
                if (b.childNodes[1].classList.contains('container-timeline-item-active') && b.childNodes[3].classList.contains('container-timeline-item-active-title')) {
                    b.childNodes[1].classList.remove('container-timeline-item-active')
                    b.childNodes[3].classList.remove('container-timeline-item-active-title')

                }
            } else {
                idx = i
            }
        }
        for (let index = 0; index < document.querySelector(".container-timeline-content").children.length; index++) {
            document.querySelector(".container-timeline-content").children[index].classList.remove("displayFlex");
        }
        document.querySelector(".container-timeline-content").children[idx].classList.add("displayFlex")

    })
})

let im = 1;



function slideshow() {


    setInterval(function() {
        if (isClicked == false) {

            containerTimelineItem.forEach(a => {


                for (let i = 0; i < containerTimelineItem.length; i++) {
                    let b = containerTimelineItem[i];
                    if (b.childNodes[1].classList.contains('container-timeline-item-active') && b.childNodes[3].classList.contains('container-timeline-item-active-title')) {
                        b.childNodes[1].classList.remove('container-timeline-item-active')
                        b.childNodes[3].classList.remove('container-timeline-item-active-title')
                    }
                }
                containerTimelineItem[im].childNodes[1].classList.add('container-timeline-item-active')
                containerTimelineItem[im].childNodes[3].classList.add('container-timeline-item-active-title')

                for (let index = 0; index < document.querySelector(".container-timeline-content").children.length; index++) {
                    document.querySelector(".container-timeline-content").children[index].classList.remove("displayFlex");
                }
                document.querySelector(".container-timeline-content").children[im].classList.add("displayFlex")
            })

            im++;
            if (im > 5) {
                im = 0
            }
        }

    }, 4000)
    isChanged = true
}