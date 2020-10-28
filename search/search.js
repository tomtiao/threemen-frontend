"use strict";
// 设置分类样式
function filterHandler() {
    let lists = document.querySelectorAll('.list');
    let btns = document.querySelectorAll('.list_btn');
    // handle bubble from btn
    for (let list of lists) {
        list.addEventListener('click', e => {
            e.preventDefault();
            if (e.target.tagName === 'BUTTON') {
                if (!e.target.classList.contains('active')) {
                    e.target.classList.add('active');
                }
                for (let btn of btns) {
                    // remove class 'active' from other buttons in the same group
                    if (btn.classList.contains('active') &&
                        btn !== e.target &&
                        btn.parentNode.parentNode === e.target.parentNode.parentNode) {
                        btn.classList.remove('active');
                    }
                }
            }
        });
    }

    btns[0].classList.add('active');
}

// function toTop() {
//     let to_top_btn = document.querySelector('.to_top');
//     to_top_btn.addEventListener('click', () => window.scroll({ top: 0, behavior: 'smooth' }));
// }

// function mobi() {
//     document.querySelector('.catagory_btn')
//         .addEventListener('click', e => {
//             e.preventDefault();
//             e.stopPropagation();
//             document.querySelector('.catagory_list.list')
//                 .classList.toggle('show');
//         })
//     document.querySelector('.catagory_list')
//         .addEventListener('click', e => {
//             e.stopPropagation();
//         });
//     document.body.addEventListener('click', e => {
//         const list = document.querySelector('.catagory_list');
//         if (list.classList.contains('show')) {
//             list.classList.remove('show');
//         }
//     });
// }

function pageBehaviourHandler() {
    function initPageList(totalPage) {
        totalPage = totalPage || 1;

        const select_page_list = document.querySelector('.select_page_list');
        const prev_page_btn_item = document.querySelector('.select_page_list .list_item.prev_page');

        let cleanList = () => {
            while (select_page_list.childElementCount > 3) {
                select_page_list.removeChild(prev_page_btn_item.nextElementSibling);
            }
        };

        cleanList();

        const next_page_btn_item = document.querySelector('.select_page_list .list_item.next_page');
        let create_page_btn = (page) => {
            let new_list_item = document.createElement('li');
            new_list_item.classList.add('list_item');

            let new_page_btn = document.createElement('button');
            new_page_btn.classList.add('list_btn');
            new_page_btn.dataset.page = page;
            new_page_btn.textContent = page;
            new_list_item.append(new_page_btn);

            select_page_list.insertBefore(new_list_item, next_page_btn_item);
        };

        for (let i = 1; i <= totalPage; i++) {
            create_page_btn(i);
        }
    }

    function getKeyword() {
        return document.getElementById('search_bar').value;
    }

    function hideDetailPanel() {
        const detail_wrappers = document.querySelectorAll('.info_detail > div');
    
        for (let wrapper of detail_wrappers) {
            if (wrapper.classList.contains('customer_wrapper_empty')) {
                wrapper.classList.remove('hide');
                
                continue;
            }
    
            wrapper.classList.add('hide');
        }
    }

    function controlSearchBlock(action) {
        const search_bar = document.querySelector('.search.filter_block');

        switch (action) {
            case 'show':
                search_bar.classList.remove('hide');
                break;
            case 'hide':
                search_bar.classList.add('hide');
                break;
            default:
                throw `unexpected param ${action}`;
        }
    }

    let last_time_catagory;
    function listenFilterList() {
        let btns = document.querySelectorAll('.catagory_list .list_btn');

        btns.forEach((btn) => {
            btn.addEventListener('click', e => {
                // 点击的是新分类
                if (!btn.classList.contains('active')) {
                    last_time_catagory = btn.dataset.catagory;
                    if (last_time_catagory !== 'working') {
                        updateListAndPageSelection(last_time_catagory, null, false);
                        controlSearchBlock('hide');
                    } else {
                        updateListAndPageSelection(last_time_catagory, getKeyword(), false);
                        controlSearchBlock('show');
                    }
                    hideDetailPanel();
                }
            });
        });
        last_time_catagory = btns[0].dataset.catagory;
    }

    function requestPageAndInfo(catagory, currentPage, pageSize, content) {
        const requestURLs = {
            'else': '/order/showAllOrderForWorker',
            'working': '/workStudyServlet/showWorkStudy'
        };

        let bodyParams = new URLSearchParams();
        bodyParams.append('currentPage', currentPage);
        bodyParams.append('pageSize', pageSize || 4);

        let queryParams = new URLSearchParams();
        switch (catagory) {
            case 'shopping':
                queryParams.append('serviceType', 'marketService');
                break;
            case 'ordering_food':
                queryParams.append('serviceType', 'restaurantService');
                break;
            case 'working':
                bodyParams.append('content', content || '');
                break;
            default:
                throw `unexpected param ${catagory}`;
        }
        
        // why this looks weird? check out api docs
        if (catagory !== 'working') { // if not catagory working
            let queryURL = requestURLs['else'] + '?' + queryParams.toString();
            return fetch(queryURL, {
                method: 'POST',
                body: bodyParams,
                credentials: 'same-origin'
            }).then(res => res.json()).catch(console.log);
        } else { // is catagory working
            return fetch(requestURLs['working'], {
                method: 'POST',
                body: bodyParams,
                credentials: 'same-origin'
            }).then(res => res.json()).catch(console.log);
        }
    }
    
    function listenSearchBtn() {
        const search_btn = document.querySelector('.search_btn');

        search_btn.addEventListener('click', e => {
            updateListAndPageSelection('working', getKeyword(), false);
        });
    }

    let currentPage = 1;
    // if catagory isn't catargory 'working', param content would be ingored.
    function updateListAndPageSelection(catagory, content, isInitial) {
        requestPageAndInfo(catagory, currentPage, null, content)
            .then(page_and_info_o => {
                let totalPage = page_and_info_o['dataObj']['totalPage'];
                let info_array = page_and_info_o['dataObj']['list'];

                initPageList(totalPage);
                updateList(info_array, catagory);

                if (isInitial) {
                    listenFilterList();
                    listenPageList();
                }
            }).catch(console.log);
    }

    function updateList(info_array, catagory) {
        const info_list = document.querySelector('.info_list');

        let cleanList = () => {
            while (info_list.firstChild) {
                info_list.removeChild(info_list.firstChild);
            }
        };

        cleanList();

        switch (catagory) {
            case 'shopping':
                info_array.forEach((info_o) => {
                    info_list.append(createListItem(info_o['commAddress'], info_o['address'], info_o['commNum'], catagory));
                });
                break;
            case 'working':
                info_array.forEach((info_o) => {
                    info_list.append(createListItem(info_o['position'], info_o));
                });
                break;
            default:
                throw (`invalid param ${catagory}`);
        }
    }

    // item_content can be Array
    function createListItem(item_title, item_content, order_id, catagory) {
        let new_info_item = document.createElement('li');
        new_info_item.classList.add('list_item');

        let new_info_title = document.createElement('h1');
        new_info_title.classList.add('item_title');
        new_info_title.textContent = item_title;

        let new_second_list = document.createElement('ul');
        new_second_list.classList.add('item_brief');

        // if item_content is plain object, then it is catagory working
        if (item_content.toString() === '[object Object]') {
            let new_second_list_item = document.createElement('li');
            new_second_list_item.classList.add('brief_item');

            let new_second_item_label = document.createElement('span');
            new_second_item_label.classList.add('item_label');
            new_second_item_label.textContent = '固定岗位';

            new_second_list_item.append(new_second_item_label);

            if (item_content['fixSeat'] !== undefined) {
                new_second_list_item.append(document.createTextNode(item_content['fixSeat']));
            } else {
                new_second_list_item.append(document.createTextNode('无'));
                // new_second_list_item.append(document.createTextNode('foooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo'));
            }

            new_second_list.append(new_second_list_item);

            let new_second_list_item_copied = new_second_list_item.cloneNode(false);

            let new_second_item_label_copied = new_second_item_label.cloneNode(false)
            new_second_item_label_copied.textContent = '临时岗位';

            new_second_list_item_copied.append(new_second_item_label_copied);

            if (item_content['temSeat'] !== undefined) {
                new_second_list_item_copied.append(document.createTextNode(item_content['temSeat']));
            } else {
                new_second_list_item_copied.append(document.createTextNode('无'));
                // new_second_list_item_copied.append(document.createTextNode('foooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo'));
            }

            new_second_list.append(new_second_list_item_copied);
        } else {
            let new_second_list_item = document.createElement('li');
            new_second_list_item.classList.add('brief_item');

            new_second_list_item.textContent += item_content;

            new_second_list.append(new_second_list_item);
        }

        let wrapper = document.createElement('a');
        wrapper.classList.add('item_link');

        wrapper.append(new_info_title, new_second_list);

        // 非勤工俭学添加订单号、分类
        if (item_content.toString() !== '[object Object]') {
            wrapper.dataset.id = order_id;
            wrapper.dataset.catagory = catagory;
        }

        new_info_item.append(wrapper);

        return new_info_item;
    }

    function clickBtnHandler(e) {
        if (e.target.tagName === 'BUTTON') {
            switch (e.target.id) {
                case 'prev_page_btn':
                    if (currentPage !== 1) {
                        currentPage--;
                        updateListAndPageSelection(last_time_catagory,
                            last_time_catagory === 'working' ? getKeyword() : undefined, false);
                    } else {
                        alert('已经是第一页了！');
                    }
                    break;
                case 'next_page_btn':
                    if (currentPage != totalPage) {
                        currentPage++;
                        updateListAndPageSelection(last_time_catagory,
                            last_time_catagory === 'working' ? getKeyword() : undefined, false);
                    } else {
                        alert('已经是最后一页了！');
                    }
                    break;
                default:
                    currentPage = e.target.dataset.page;
                    updateListAndPageSelection(last_time_catagory,
                        last_time_catagory === 'working' ? getKeyword() : undefined, false);
                    break;
            }
        }
    }

    function listenPageList() {
        const select_page_list = document.querySelector('.select_page_list');

        select_page_list.addEventListener('click', clickBtnHandler);
    }

    updateListAndPageSelection('shopping', undefined, true);
    listenSearchBtn();
}

function requestOrderContact(order_id) {
    const requestURL = '/order/contactUser';

    let urlParams = new URLSearchParams();

    urlParams.append('commNum', order_id);

    return fetch(requestURL, {
        method: 'POST',
        body: urlParams,
        credentials: 'same-origin'
    }).then(res => res.json()).catch(console.log);
}

function setDetailPanelContact(item, info_o) {
    const nickname = document.getElementById('customer_nickname');

    nickname.textContent = info_o['nickname'];

    const phone = document.getElementById('customer_phone');

    phone.textContent = info_o['phone'];

    const address = document.getElementById('customer_address');

    let item_address = item.children[1].children[0].textContent;

    address.textContent = item_address;
}

// expected get commCostReal, commInfo, commCostCoin, date, status
function requestOrderDetail(order_id) {
    const requestURL = '/order/showOneOrderForUserOrWorker';

    let urlParams = new URLSearchParams();

    urlParams.append('commNum', order_id);

    let getURL = requestURL + '?' + urlParams.toString();
    return fetch(getURL, {
        method: 'GET',
        credentials: 'same-origin'
    }).then(res => res.json()).catch(console.log);
}

function setDetailPanelContent(item, info_o) {
    switch (item.dataset.catagory) {
        case 'shopping':
            const buy_address = document.getElementById('buy_address');

            buy_address.textContent = item.children[0].textContent;

            const shopping_info_content = document.querySelector('.shopping_info_content');

            shopping_info_content.textContent = info_o['commInfo'];
            break;
        default:
            throw `unexpected param ${catagory}`;
    }

    const counter_content = document.querySelector('.counter_content');
    counter_content.textContent = info_o['commCostCoin'];
}

function bindOrderIdToButton(order_id) {
    const submit_btn = document.querySelector('.pick_btn');

    submit_btn.dataset.bindid = order_id;
}

function showDetailPanel(catagory) {
    const contact_wrapper = document.querySelector('.customer_wrapper');
    
    contact_wrapper.classList.remove('hide');

    const customer_wrapper_empty = document.querySelector('.customer_wrapper_empty');

    customer_wrapper_empty.classList.add('hide');

    const pick_bar = document.querySelector('.pick_bar')

    pick_bar.classList.remove('hide');

    switch (catagory) {
        case 'shopping':
            const shopping_wrapper = document.querySelector('.shopping_wrapper');

            shopping_wrapper.classList.remove('hide');

            break;
        default:
            throw `unexpected param ${catagory}`;
    }
}

function clickResultHandler() {
    const info_list = document.querySelector('.info_list');

    info_list.addEventListener('click', e => {
        if (e.target.tagName === 'A') {
            bindOrderIdToButton(e.target.dataset.id);
            if (e.target.catagory !== 'working') {
                showDetailPanel(e.target.dataset.catagory);
            }

            requestOrderDetail(e.target.dataset.id).then(data_obj => {
                if (data_obj['flag']) {
                    let info_array = data_obj['dataObj'];
                    setDetailPanelContent(e.target, info_array[0]);
                } else {
                    console.log('获取订单内容失败');
                    console.log(data_obj);
                }
            }).catch(console.log);

            requestOrderContact(e.target.dataset.id).then(data_obj => {
                if (data_obj['flag']) {
                    let info_o = data_obj['dataObj'];
                    setDetailPanelContact(e.target, info_o);
                } else {
                    console.log('获取订单内容失败');
                    console.log(data_obj);
                }
            }).catch(console.log);
        }
    });
}

function sendPickRequest(order_id) {
    const requestURL = '/order/pickOrder';

    let urlParams = new URLSearchParams();

    urlParams.append('commNum', order_id);

    return fetch(requestURL, {
        method: 'POST',
        body: urlParams,
        credentials: 'same-origin'
    }).then(res => res.json()).catch(console.log);
}

function listenOrderSubmit() {
    const pick_btn = document.querySelector('.pick_btn');

    pick_btn.addEventListener('click', e => {
        e.preventDefault();
        sendPickRequest(e.target.dataset.bindid)
        .then(data_obj => {
            if (data_obj['flag']) {
                if (window.confirm('接单成功。是否想要前往个人订单界面？')) {
                    location.assign('/me/order');
                } else {
                    console.log('出现了错误');
                    console.log(data_obj);
                }
            }
        }).catch(console.log);
    });
}

window.addEventListener('load', () => {
    filterHandler();
    // toTop();
    // mobi();
    pageBehaviourHandler();
    clickResultHandler();
    listenOrderSubmit();
});