"use strict";

function pageBehaviorHandler() {
    // function sliderHandler() {
    //     const slider_list = document.querySelector('.slider_list');
    //     const list_item = document.querySelector('.slider_list .list_item');

    //     let list_item_width = parseInt(getComputedStyle(list_item).width);
    //     let pixel = 0;
    //     let changePos = () => {
    //         if (pixel <= list_item_width * -2) {
    //             pixel = 0;
    //         } else {
    //             pixel -= list_item_width;
    //         }
    //         slider_list.style.transform = `translate(${pixel}px)`;
    //     };

    //     let timer;
    //     let interval = () => {
    //         timer = setInterval(changePos, 5000);
    //     };
    //     interval();

    //     let timeout;
    //     let pause = () => {
    //         clearInterval(timer);
    //         clearTimeout(timeout);
    //     };

    //     let resume = () => {
    //         timeout = setTimeout(() => {
    //             interval();
    //         }, 500);
    //     };

    //     const wrapper = document.querySelector('.slider_wrapper');
    //     wrapper.addEventListener('mouseenter', pause);
    //     wrapper.addEventListener('mouseleave', resume);

    //     let go_back = () => {
    //         if (pixel < 0) {
    //             pixel += list_item_width;
    //         } else {
    //             pixel = list_item_width * -2;
    //         }
    //         slider_list.style.transform = `translate(${pixel}px)`;
    //     };

    //     wrapper.addEventListener('click', e => {
    //         if (e.target.tagName === 'BUTTON') {
    //             switch (e.target.className) {
    //                 case 'prev slider_btn':
    //                     go_back();
    //                     break;
    //                 case 'next slider_btn':
    //                     changePos();
    //                     break;
    //                 default:
    //                     console.log('invalid btn clicked');
    //                     break;
    //             }
    //         }
    //     });
    // }

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

    // function hover_nav_handler() {
    //     const nav = document.querySelector('.aside_info');
    //     const header = document.querySelector('header');
    //     let nav_offset = nav.offsetTop;

    //     let change_nav_style = (scroll_pos) => {
    //         if (scroll_pos > nav_offset - parseInt(window.getComputedStyle(header)['height'])) {
    //             // nav.style.willChange = 'position, top, right';
    //             nav.classList.add('fixed');
    //             nav.style.right = nav.parentElement.offsetLeft + 'px';
    //         } else {
    //             nav.classList.remove('fixed');
    //             nav.removeAttribute('style');
    //         }
    //     };

    //     let last_known_scroll_position = 0;
    //     let ticking = false;
    //     let change_by_animation = e => {
    //         last_known_scroll_position = window.scrollY;

    //         if (!ticking) {
    //             window.requestAnimationFrame(function () {
    //                 change_nav_style(last_known_scroll_position);
    //                 ticking = false;
    //             });

    //             ticking = true;
    //         }
    //     };
    //     window.addEventListener('resize', change_by_animation)
    //     window.addEventListener('scroll', change_by_animation);
    // }

    // function jump_to_section_handler() {
    //     const sections = document.querySelectorAll('.section');
    //     const header = document.querySelector('header');
    //     let tops = [];

    //     const nav_items = document.querySelectorAll('.aside_list .list_item');
    //     sections.forEach((ele, i) => {
    //         nav_items[i].dataset.pos = ele.offsetTop - parseInt(window.getComputedStyle(header)['height']);
    //     });

    //     const content_wrapper = document.querySelector('.content_wrapper');
    //     let data_top;
    //     // e.target 应是 aside_list 中元素的 a.cover
    //     let clicked = e => {
    //         if (e.target.parentElement.parentElement.classList.contains('aside_list')) {
    //             e.preventDefault();
    //             data_top = e.target.parentElement.dataset.pos;
    //             scrollTo({
    //                 top: data_top,
    //                 behavior: 'smooth'
    //             });
    //         }
    //     };

    //     content_wrapper.addEventListener('click', clicked);
    // }

    function pageSwitchHandler() {
        function listenListHandler() {
            const pos_list = document.querySelector('.position_selection_list');
            const floor_list = document.querySelector('.floor_selection_list');

            // expected A element
            let setItemStyle = (item_link, list) => {
                for (let ele of list.children) {
                    if (ele.classList.contains('current_active')) {
                        ele.classList.remove('current_active');
                    }
                }
                item_link.parentElement.classList.add('current_active');
            };


            // if param is south, then hide north, vice versa
            let manipulateTaggedItem = (tag, action) => {
                let hide = (tag) => {
                    let targets = document.querySelectorAll('.floor_selection_list .list_item.' + tag);

                    for (let t of targets) {
                        t.classList.add('hide');
                    }
                };

                let show = (tag) => {
                    let targets = document.querySelectorAll('.floor_selection_list .list_item.' + tag);

                    for (let t of targets) {
                        t.classList.remove('hide');
                    }
                };

                switch (action) {
                    case 'show':
                        show(tag);
                        break;
                    case 'hide':
                        hide(tag);
                        break;
                    default:
                        console.log(`unexpected param ${action}`);
                        break;
                }
            };

            // 控制内容显示
            let updateContentList = (position, floor) => {
                let items = document.querySelectorAll('.content_list .list_item');

                // 点击层数列表，floor不为undefined
                if (floor !== undefined) {
                    if (position !== 'all') {
                        for (let item of items) {
                            if (item.dataset.position !== position || item.dataset.floor !== floor) {
                                item.classList.add('hide');
                            } else {
                                item.classList.remove('hide');
                            }
                        }
                    } else {
                        for (let item of items) {
                            item.classList.remove('hide');
                        }
                    }
                } else { // 点击位置列表，floor不为undefined
                    if (position !== 'all') {
                        for (let item of items) {
                            if (item.dataset.position !== position) {
                                item.classList.add('hide');
                            } else {
                                item.classList.remove('hide');
                            }
                        }
                    } else {
                        for (let item of items) {
                            item.classList.remove('hide');
                        }
                    }
                }

            };

            let changeFloorList = (position) => {
                switch (position) {
                    case 'south':
                        manipulateTaggedItem('south', 'show');
                        manipulateTaggedItem('north', 'hide');
                        break;
                    case 'north':
                        manipulateTaggedItem('north', 'show');
                        manipulateTaggedItem('south', 'hide');
                        break;
                    case 'all':
                        manipulateTaggedItem('north', 'show');
                        manipulateTaggedItem('south', 'show');
                        break;
                    default:
                        console.log(`unexpected param ${position}`);
                        break;
                }
            };

            const all = document.querySelector('.list_item.all .item_link');

            let listenList = (list) => {
                list.addEventListener('click', e => {
                    if (e.target.tagName === 'A') {
                        e.preventDefault();
                        setItemStyle(e.target, list); // 控制列表样式
                        if (list === pos_list) {
                            setItemStyle(all, all.parentElement.parentElement);
                            changeFloorList(e.target.parentElement.dataset.position); // 控制楼层列表项显示
                            updateContentList(e.target.parentElement.dataset.position); // 控制内容显示
                        } else {
                            updateContentList(e.target.parentElement.dataset.position, e.target.parentElement.dataset.floor);
                        }
                    }
                });
            };

            listenList(pos_list);
            listenList(floor_list);
        }


        function listenItemHandler() {
            const content_list = document.querySelector('.content_list');

            content_list.addEventListener('click', e => {
                if (e.target.tagName === 'A') {
                    e.preventDefault();
                    console.log(e.target.parentElement.dataset.position + " " + e.target.parentElement.dataset.floor);
                    console.log(e.target.parentElement.children[2].children[0].textContent);
                }
            });
        }

        listenListHandler();
        listenItemHandler();
    }

    function stopHeaderTriggerEvent() {
        document.querySelector('header').addEventListener('click', e => {
            e.stopPropagation();
        });
    }

    function asidePanelHandler() {
        const aside = document.querySelector('aside');
        const mask = document.querySelector('.go_dark');

        document.body.addEventListener('click', e => {
            aside.classList.remove('show');
            mask.classList.remove('active');
        });

        // stop click event in aside panel from going up
        aside.addEventListener('click', e => {
            e.stopPropagation();
        });

        const content_list = document.querySelector('.content_list');

        content_list.addEventListener('click', e => {
            if (e.target.classList.contains('cover')) {
                e.stopPropagation();
                aside.classList.add('show');
                mask.classList.add('active');
            }
        });

        let setItemStyle = (item_link, list) => {
            for (let ele of list.children) {
                if (ele.classList.contains('active')) {
                    ele.classList.remove('active');
                }
            }
            item_link.parentElement.classList.add('active');
        };

        // find element in the list with index
        let findItem = (index, list) => {
            for (let ele of list) {
                if (ele.dataset.index === index) {
                    return ele;
                }
            }
        };

        let scrollToSection = (index, list) => {
            let expected_target = findItem(index, list);
            expected_target.scrollIntoView();
        };

        const side_nav = document.querySelector('.side_nav_list');

        const dishes_list_titles = document.querySelectorAll('.dishes_section_title');

        side_nav.addEventListener('click', e => {
            if (e.target.tagName === 'A') {
                e.preventDefault();
                console.log(e.target.dataset.index);
                setItemStyle(e.target, side_nav);
                scrollToSection(e.target.dataset.index, dishes_list_titles);
            }
        });

        let switch_panel = (panel) => {
            const content = document.querySelector('.stall_content_wrapper');
            const info = document.querySelector('.stall_info_wrapper');

            switch (panel) {
                case 'order':
                    content.classList.remove('hide');
                    info.classList.add('hide');
                    break;
                case 'info':
                    info.classList.remove('hide');
                    content.classList.add('hide');
                    break;
                default:
                    console.log(`unexpected param ${panel}`);
                    break;
            }
        };

        const tab_list = document.querySelector('.tab_list');

        tab_list.addEventListener('click', e => {
            if (e.target.tagName === 'A') {
                setItemStyle(e.target, tab_list);
                switch_panel(e.target.parentElement.dataset.panel);
            }
        });
    }

    // sliderHandler();
    pageSwitchHandler();
    hover_main_animate();
    // hover_nav_handler();
    // jump_to_section_handler();
    stopHeaderTriggerEvent();
    asidePanelHandler();
}


window.addEventListener('load', e => {
    pageBehaviorHandler();
});