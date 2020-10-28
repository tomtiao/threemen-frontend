"use strict";

function pageBehaviorHandler() {
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

        function getStallDishes(shop_name) {
            function makeRequest(shop_name) {
                const requestURL = '/restaurantInfo/showDishByShop';
        
                let urlParams = new URLSearchParams();
        
                urlParams.append('shopName', shop_name);
        
                return fetch(requestURL, {
                    method: 'POST',
                    body: urlParams,
                    credentials: 'same-origin'
                }).then(res => res.json()).catch(console.log);
            }

            function cleanList() {
                const dishes_list = document.querySelector('.dishes_list');

                while (dishes_list.childElementCount > 1) {
                    dishes_list.removeChild(dishes_list.firstElementChild.nextElementSibling);
                }
            }

            // expected base64 string
            function createListItem(dishes_name, dishes_price, dishes_img_src) {
                let list_item = document.createElement('dd');
                list_item.classList.add('dishes_item');

                let img_wrapper = document.createElement('div');
                img_wrapper.classList.add('dishes_img_wrapper');

                let dishes_img = new Image();
                dishes_img.classList.add('dishes_img');
                dishes_img.src = 'data:image/png;base64,' + dishes_img_src;

                img_wrapper.append(dishes_img);

                let desc = document.createElement('div');
                desc.classList.add('dishes_desc');

                let name = document.createElement('h1');
                name.classList.add('dishes_name');
                name.textContent = dishes_name;

                let price = document.createElement('p');
                price.classList.add('dishes_price');

                let price_content = document.createElement('span');
                price_content.classList.add('price_content');
                price_content.textContent = dishes_price;

                price.append(price_content);

                desc.append(name ,price);

            }

            function updateDishesList(shop_name) {
                const dishes_list = document.querySelector('.dishes_list');

                cleanList();

                makeRequest(shop_name).then(data_obj => {
                    let dishes_array = data_obj['dataObj'];

                    dishes_array.forEach(o => {
                        dishes_list.append(createListItem());
                    });
                });
            }
        }


        function listenItemHandler() {
            const content_list = document.querySelector('.content_list');

            content_list.addEventListener('click', e => {
                if (e.target.tagName === 'A') {
                    e.preventDefault();
                    console.log(e.target.parentElement.dataset.position + " " + e.target.parentElement.dataset.floor);
                    console.log(e.target.parentElement.children[2].children[0].textContent);
                    let shop_name = e.target.parentElement.children[2].children[0].textContent;
                    getStallDishes(shop_name);
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

    pageSwitchHandler();
    hover_main_animate();
    stopHeaderTriggerEvent();
    asidePanelHandler();
}

function updateListHandler() {
    const location_list = {
        1: '北苑食堂',
        2: '北苑食堂',
        3: '北苑食堂',
        4: '南苑食堂',
        5: '南苑食堂'
    };

    function makeRequest(location_id) {
        const requestURL = '/restaurantInfo/showShopsByLocation';
        // const stallData = '/static/json/data.json';

        let urlParams = new URLSearchParams();

        urlParams.append('location_id', location_id);

        let getURL = requestURL + '?' + urlParams.toString();
        return fetch(getURL, {
            method: 'GET',
            credentials: 'same-origin'
        }).then(res => res.json()).catch(console.log);
    }

    // img expected base64 string
    function createListItem(stall_img_src, stall_name, stall_desc, stall_position, stall_floor) {
        let cover = document.createElement('a');
        cover.classList.add('cover');
        
        let bg_block = document.createElement('div');
        bg_block.classList.add('bg_block');
        
        let bg_img = new Image();
        bg_img.classList.add('bg_img');
        bg_img.src = 'data:image/png;base64,' + stall_img_src;
        bg_img.alt = stall_name;

        bg_block.append(bg_img);

        let text_content = document.createElement('div');
        text_content.classList.add('text_content');

        let item_title = document.createElement('h1');
        item_title.classList.add('item_title');
        item_title.textContent = stall_name;

        let desc = document.createElement('p');
        desc.classList.add('description');
        desc.textContent = stall_desc || '10:30-13:00; 17:00-19:00';

        text_content.append(item_title, desc);

        let list_item = document.createElement('li');
        list_item.classList.add('list_item');
        list_item.dataset.position = stall_position;
        list_item.dataset.floor = stall_floor;

        list_item.append(cover, bg_block, text_content);

        return list_item;
    }

    function fillStallList() {
        const content_list = document.querySelector('.content_list');

        const keys = Object.keys(location_list);

        keys.forEach((value) => {
            makeRequest(value).then(res_obj => {
                let data_obj = res_obj;
                let info_array = data_obj['dataObj'];
                info_array.forEach(o => {
                    content_list.append(createListItem(o['img'], o['shopName'], '', location_list[value], value));
                });
            });
        });

        // return makeRequest().then(data => {
        //     data.forEach((stall_obj) => {
        //         content_list.append(createListItem(, stall_obj['name'], stall_obj['time'], stall_obj['location'], stall_obj['floor']));
        //     });
        // });
    }
    
    fillStallList().then(() => {
        pageBehaviorHandler();
    });
}



window.addEventListener('load', e => {
    updateListHandler();
});