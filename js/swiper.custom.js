// Swiper Slider
var TrandingSlider = new Swiper('.tranding-slider', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    loop: true,
    spaceBetween: 1,
    slidesPerView: 'auto',
    coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 100,
        modifier: 2.5,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    }
});

// const animationAuto = setInterval(function () {
//     document.querySelector('.swiper-button-next').click();
// }, 1000);
//
// document.querySelector('.tranding-slider-control').addEventListener("click", function () {
//     clearInterval(animationAuto);
// });

// Region Slider

// Region Slider
const images = [
    'region-shimkent.png',
    'region-almaty.png',
    'region-astana.png',
];

const nameCity = [
    'ШЫМКЕНТ','АЛМАТЫ','АСТАНА',
];

let activeImage = 0;
const sliderPlace = document.querySelector('.region-img');
const widthOffset = document.querySelector('.region-slider').clientWidth;
sliderPlace.style.width = 3 * widthOffset + "px";
sliderPlace.style.height = widthOffset + "px";
sliderPlace.style.left = '-' + widthOffset + "px";
let flag = true;


const initSlider = () => {
    const img = document.createElement('img');
    img.alt = '';
    img.src = '/images/about/' + images[activeImage];
    sliderPlace.append(img);
    nextImagesGeneration();
}

const nextImagesGeneration = () => {
    let nextImages = activeImage + 1;
    if (nextImages >= images.length && nextImages >= nameCity.length) nextImages = 0;
    const img = document.createElement('img');
    img.alt = '';
    img.src = '/images/about/' + images[nextImages];
    document.querySelector('.region-name').innerHTML = nameCity[nextImages];
    sliderPlace.append(img);
}

const nextSlide = () => {
    if (!flag) return;
    flag = !flag;
    activeImage++;
    if (activeImage >= images.length) activeImage = 0;
    nextImagesGeneration();
    animate({
        duration: 1000,
        draw: function (progress) {
            // document.querySelector('.region-img img').style.width = (widthOffset * (1 - progress)) + "px";
             document.querySelector('.region-img img').style.width = (widthOffset * (1 - progress)) + "px";
        },
        removeElement: document.querySelector('.region-img img')
    });
}

initSlider();


document.querySelector('.region-right').addEventListener('click', nextSlide);


const animate = ({duration, draw, removeElement}) => {
    const start = performance.now();

    requestAnimationFrame(function animate(time) {
        let step = (time - start) / duration;
        if (step > 1) step = 1;
        draw(step);
        if (step < 1) {
            requestAnimationFrame(animate);
        } else {
            removeElement.remove();
            flag = true;
        }
    });
}