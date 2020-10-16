function checkIfLogon() {
    const requestURL = '/user/findUserCookie';
    return fetch(requestURL, {
        method: 'POST'
    })
        .then(res => res.json());
}
// function goTo() {
//     let section = document.querySelector('.section');
//     section.addEventListener('click', e => {
//         if (e.target.tagName === 'BUTTON') {
//             switch (e.target.className) {
//                 case 'section_btn':
//                     break;
//                 case 'section_btn me':
//                     location.assign('/me');
//                     break;
//                 default:
//                     break;
//             }
//         }
//     })
// }
function sliderHandler() {
    const slider_list = document.querySelector('.slider_list');
    const list_item = document.querySelector('.slider_list .list_item');

    let list_item_width = parseInt(getComputedStyle(list_item).width);
    let pixel = 0;
    let changePos = () => {
        if (pixel <= list_item_width * -2) {
            pixel = 0;
        } else {
            pixel -= list_item_width;
        }
        slider_list.style.transform = `translate(${pixel}px)`;
    };

    let timer;
    let interval = () => {
        timer = setInterval(changePos, 5000);
    };
    interval();

    let timeout;
    let pause = () => {
        clearInterval(timer);
        clearTimeout(timeout);
    };

    let resume = () => {
        timeout = setTimeout(() => {
            interval();
        }, 500);
    };

    const wrapper = document.querySelector('.slider_wrapper');
    wrapper.addEventListener('mouseenter', pause);
    wrapper.addEventListener('mouseleave', resume);

    let go_back = () => {
        if (pixel < 0) {
            pixel += list_item_width;
        } else {
            pixel = list_item_width * -2;
        }
        slider_list.style.transform = `translate(${pixel}px)`;
    };

    wrapper.addEventListener('click', e => {
        if (e.target.tagName === 'BUTTON') {
            switch (e.target.className) {
                case 'prev slider_btn':
                    go_back();
                    break;
                case 'next slider_btn':
                    changePos();
                    break;
                default:
                    console.log('invalid btn clicked');
                    break;
            }
        }
    });
}

function hover_main_animate() {
    let main_list_items = {
        content_list_items: document.querySelectorAll('.content_list .list_item'),
        aside_list_items: document.querySelectorAll('.aside_list .list_item')
    };

    function onHover(e) {
        const item_img = e.currentTarget.children[1].children[0];
        const item_title = e.currentTarget.children[2].children[0];
        const item_description = e.currentTarget.children[2].children[1];
        console.log(e.type);
        console.log(e.currentTarget);
        console.log(e.target);
        switch (e.type) {
            case 'mouseenter':
                item_img.style.transform = 'scale(1.2)';
                item_title.style.transform = 'translate(0)';
                item_description.style.transform = 'translate(0)';
                break;
            case 'mouseout':
                console.log('should remove style')
                item_img.removeAttribute('style');
                item_title.removeAttribute('style');
                item_description.removeAttribute('style');
                break;
            default:
                throw `invalid parameter ${e.type}`;
        }
    };

    let obj_keys = Object.keys(main_list_items);
    obj_keys.forEach((key) => {
        for (let item of main_list_items[key]) {
            item.addEventListener('mouseenter', onHover);
            item.addEventListener('mouseout', onHover);
        }
    });
}

window.addEventListener('load', e => {
    checkIfLogon()
        .then(console.log)
        .catch(console.log);
    // goTo();
    sliderHandler();
    hover_main_animate();
});