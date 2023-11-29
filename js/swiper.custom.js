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

const animationAuto = setInterval(function () {
    document.querySelector('.swiper-button-next').click();
}, 1000);

document.querySelector('.tranding-slider-control').addEventListener("click", function () {
    clearInterval(animationAuto);
});

// Region Slider
const images = [
    'region-almaty.png',
    'region-astana.png',
    'region-shimkent.png',
];

let activeImage = 0;
const sliderPlace = document.querySelector('.custom_slider_line');
const widthOffset = document.querySelector('.custom_slider').clientWidth;
sliderPlace.style.width = 3 * widthOffset + "px";
sliderPlace.style.height = widthOffset + "px";
sliderPlace.style.left = '-' + widthOffset + "px";
let flag = true;


const initSlider = () => {
    const img = document.createElement('img');
    img.alt = '';
    img.src = '/test/images/' + images[activeImage];
    sliderPlace.append(img);
    nextImagesGeneration();
    prevImagesGeneration();
}

const nextImagesGeneration = () => {
    let nextImages = activeImage + 1;
    if (nextImages >= images.length) nextImages = 0;
    const img = document.createElement('img');
    img.alt = '';
    img.src = '/test/images/' + images[nextImages];
    sliderPlace.append(img);
}

const prevImagesGeneration = (w = false) => {
    let nextImages = activeImage - 1;
    if (nextImages < 0) nextImages = images.length - 1;
    const img = document.createElement('img');
    img.alt = '';
    img.src = '/test/images/' + images[nextImages];
    if (w) img.style.width = 0;
    sliderPlace.prepend(img);
}

const nextSlide = () => {
    if (!flag) return;
    flag = !flag;
    activeImage++;
    if (activeImage >= images.length) activeImage = 0;
    //document.querySelector('.custom_slider_line img').remove();
    nextImagesGeneration();
    animate({
        duration: 1000,
        draw: function (progress) {
            document.querySelector('.custom_slider_line img').style.width = (widthOffset * (1-progress)) + "px";
        },
        removeElement: document.querySelector('.custom_slider_line img')
    });
}

const prevSlide = () => {
    if (!flag) return;
    flag = !flag;
    activeImage--;
    if (activeImage < 0) activeImage = images.length - 1;
    //document.querySelector('.custom_slider_line img:last-child').remove();
    prevImagesGeneration(true);
    animate({
        duration: 1000,
        draw: function (progress) {
            document.querySelector('.custom_slider img').style.width = (widthOffset * progress) + "px";
        },
        removeElement: document.querySelector('.custom_slider_line img:last-child')
    });
}

initSlider();

setInterval(function () {
    document.querySelector('.custom_next_button').click()
}, 5000);

document.querySelector('.custom_next_button').addEventListener('click', nextSlide);
document.querySelector('.custom_prev_button').addEventListener('click', prevSlide);

const animate = ({duration, draw, removeElement }) => {
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





