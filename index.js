"use strict";
function accountHandler() {
    // 已登录返回true，未登录返回false，错误返回undefined
    function checkIfLogon() {
        const requestURL = '/user/findUser';

        return fetch(requestURL, {
            method: "POST",
            credentials: "same-origin"
        })
            .then(res => res.json())
            .then(data => {
                if (data) {
                    return data['flag'] ? data['flag'] : console.log(data['errorMsg']);
                }
            }).catch(console.log);
    }

    function getUserImg() {
        const requestURL = '/userInfo/showImg';

        return fetch(requestURL, {
            method: "POST",
            credentials: "same-origin"
        }).then(res => res.json()).catch(console.log);
    }

    let swap_img = () => {
        return getUserImg().then(res => {
            let data;
            const avatar = document.querySelector('.avatar');
            if (res) {
                data = btoa(res['dataObj']); // 二进制数据转Base64
            } else { // fallback img
                data = 'iVBORw0KGgoAAAANSUhEUgAAADYAAAA2CAIAAAADJ/2KAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABbSURBVGhD7c6hAYAwEMDAh2U6ZkcHwwZEVNyZ2FzPXnO2++vBLBYsFiwWLBYsFiwWLBYsFiwWLBYsFiwWLBYsFiwWLBYsFiwWLBYsFiwWLBYsFiwWLBYs/jfzAu93AhFuA80CAAAAAElFTkSuQmCC';
            }
            avatar.src = 'data:image/png;base64,' + data;
        });
    };

    function setLogoutBtn() {
        const logout_btn = document.querySelector('.logout');

        let sendLogoutRequest = () => {
            const requestURL = '/user/exit';

            return fetch(requestURL, {
                method: "POST",
                credentials: "same-origin"
            })
                .then(res => res.json())
                .catch(console.log);
        };

        logout_btn.addEventListener('click', e => {
            e.preventDefault();
            sendLogoutRequest();
        });
    }

    const login_register = document.querySelector('.login_and_register');
    const with_avatar = document.querySelector('.with_avatar');
    checkIfLogon().then(flag => {
        if (flag) {
            swap_img().then(() => {
                login_register.classList.add('hidden');
                with_avatar.classList.remove('hidden');
                setLogoutBtn();
            });
        } else {
            login_register.classList.remove('hidden');
            with_avatar.classList.add('hidden');
        }
    });
}

function pageBehaviorHandler() {
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

        // wrapper.addEventListener('click', e => {
        //     if (e.target.tagName === 'BUTTON') {
        //         switch (e.target.className) {
        //             case 'prev slider_btn':
        //                 go_back();
        //                 break;
        //             case 'next slider_btn':
        //                 changePos();
        //                 break;
        //             default:
        //                 console.log('invalid btn clicked');
        //                 break;
        //         }
        //     }
        // });
    }

    function hover_main_animate() {
        let on_hover = e => {
            const item_img = e.target.parentElement.children[1].children[0];
            const text_content = e.target.parentElement.children[2];
            const item_title = e.target.parentElement.children[2].children[0];
            const item_description = e.target.parentElement.children[2].children[1];
            switch (e.type) {
                case 'mouseenter':
                    item_img.style.transform = 'scale(1.2)';
                    text_content.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                    item_title.style.transform = 'translate(0)';
                    item_description.style.transform = 'translate(0)';
                    break;
                case 'mouseout':
                    text_content.removeAttribute('style');
                    item_img.removeAttribute('style');
                    item_title.removeAttribute('style');
                    item_description.removeAttribute('style');
                    break;
                default:
                    throw `invalid parameter ${e.type}`;
            }
        };

        const content_wrapper = document.querySelector('.content_wrapper');
        // e.target 应该是 a.cover
        content_wrapper.addEventListener('mouseenter', e => {
            e.stopPropagation();
            if (e.target.classList.contains('cover')) {
                on_hover(e);
            }
        }, { capture: true }); // 捕获事件,非冒泡
        content_wrapper.addEventListener('mouseout', e => {
            if (e.target.classList.contains('cover')) {
                on_hover(e);
            }
        });
    }

    function hover_nav_handler() {
        const nav = document.querySelector('.aside_info');
        const header = document.querySelector('header');
        let nav_offset = nav.offsetTop;

        let change_nav_style = (scroll_pos) => {
            if (scroll_pos > nav_offset - parseInt(window.getComputedStyle(header)['height'])) {
                // nav.style.willChange = 'position, top, right';
                nav.classList.add('fixed');
                nav.style.right = nav.parentElement.offsetLeft + 'px';
            } else {
                nav.classList.remove('fixed');
                nav.removeAttribute('style');
            }
        };

        let last_known_scroll_position = 0;
        let ticking = false;
        let change_by_animation = e => {
            last_known_scroll_position = window.scrollY;

            if (!ticking) {
                window.requestAnimationFrame(function () {
                    change_nav_style(last_known_scroll_position);
                    ticking = false;
                });

                ticking = true;
            }
        };
        window.addEventListener('resize', change_by_animation)
        window.addEventListener('scroll', change_by_animation);
    }

    function jump_to_section_handler() {
        const sections = document.querySelectorAll('.section');
        const header = document.querySelector('header');
        let tops = [];

        const nav_items = document.querySelectorAll('.aside_list .list_item');
        sections.forEach((ele, i) => {
            nav_items[i].dataset.pos = ele.offsetTop - parseInt(window.getComputedStyle(header)['height']);
        });

        const content_wrapper = document.querySelector('.content_wrapper');
        let data_top;
        // e.target 应是 aside_list 中元素的 a.cover
        let clicked = e => {
            if (e.target.parentElement.parentElement.classList.contains('aside_list')) {
                e.preventDefault();
                data_top = e.target.parentElement.dataset.pos;
                scrollTo({
                    top: data_top,
                    behavior: 'smooth'
                });
            }
        };

        content_wrapper.addEventListener('click', clicked);
    }

    sliderHandler();
    hover_main_animate();
    hover_nav_handler();
    jump_to_section_handler();
}

window.addEventListener('load', e => {
    // accountHandler();
    pageBehaviorHandler();
});