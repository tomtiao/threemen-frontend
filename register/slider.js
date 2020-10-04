function slider() {
    const SLIDE = document.querySelector('.side_slider');
    const IMG_LIST_LEN = 3;
    let index = 0;
    let img_name;
    setInterval(() => {
        img_name = index % IMG_LIST_LEN;
        SLIDE.style.backgroundImage = `url(\"/static/img/login/${img_name}.jpg\")`;
        index++;
    }, 5000);
}

window.addEventListener('load', slider);