const status_str = {
    1: '待支付',
    2: '待接单',
    3: '待收货',
    4: '订单完成',
    5: '订单关闭'
};

function createListItem(customer_address, order_status, order_address, order_id, catagory) {
    let brief = document.createElement('ul');
    brief.classList.add('item_brief');

    let address_list_item = document.createElement('li');
    address_list_item.classList.add('brief_item');

    let item_label = document.createElement('span');
    item_label.classList.add('item_label');
    item_label.textContent = '送达地址';

    let address_text = document.createTextNode(customer_address);

    address_list_item.append(item_label, address_text);

    let indicator_list_item = document.createElement('li');
    indicator_list_item.classList.add('brief_item', 'indicator');
    indicator_list_item.textContent = status_str[order_status];

    brief.append(address_list_item, indicator_list_item);

    let title = document.createElement('h1');
    title.classList.add('item_title');
    title.textContent = order_address;

    let wrapper = document.createElement('a');
    wrapper.classList.add('item_link');
    wrapper.append(title, brief);
    // 标记是否可以取消
    switch (order_status) {
        case 1:
        case 2:
            wrapper.dataset.cancelable = true;
            break;
        default:
            wrapper.dataset.cancelable = false;
            break;
    }

    wrapper.dataset.id = order_id;
    wrapper.dataset.catagory = catagory;

    let list_item = document.createElement('li');
    list_item.classList.add('list_item');
    list_item.append(wrapper);

    return list_item;
}

/*
 ** isUser: 1 for user, 0 for worker
 ** requestStatus: 1, 2, 3, 4, 5
 */
function getUserOrder(isUser, requestStatus) {
    const requestURL = '/order/showMyOrderForUserOrWorker';

    const urlParams = new URLSearchParams();

    urlParams.append('isUser', isUser);
    urlParams.append('order_status', requestStatus);

    let getURL = requestURL + '?' + urlParams.toString();
    return fetch(getURL, {
        method: 'GET',
        credentials: 'same-origin'
    }).then(res => res.json()).catch(console.log);
}

function cleanList(target_list) {
    while (target_list.firstChild) {
        target_list.removeChild(target_list.firstChild);
    }
}
/*
 ** data_obj whole requested object
 ** isUser
 ** clean_list: boolean, whether remove childNodes from target_list
 */
function updateList(unwrapped_data_obj, target_list, clean_list) {
    if (clean_list) {
        cleanList(target_list);
    }

    // 遍历数组
    for (let data of unwrapped_data_obj['dataObj']) {
        switch (data['catagory']) {
            case 'shopping':
                let address_array = data['address'].split('#');
                let section = address_array[0] + '栋';
                let building = address_array[1] + '栋';
                let final_address = section + building
                target_list.append(createListItem(final_address, data['status'], data['commAddress'], data['commNum'], data['catagory']));
                break;
            default:
                throw `unexpected param ${catagory}`;
        }
    }
}

// additional 0 added, to show all kinds of list
function getNewOrder(isUser, requestStatus) {
    const picked_order_list = document.querySelector('.picked_order_list');
    const my_order_list = document.querySelector('.my_order_list');

    let target_list;
    switch (isUser) {
        case 0:
            target_list = picked_order_list;
            break;
        case 1:
            target_list = my_order_list;
            break;
        default:
            throw `unexpected param ${isUser}`;
    }

    switch (requestStatus) {
        // get all kinds of orders
        case 0:
            cleanList(target_list);
            const keys = Object.keys(status_str);
            keys.forEach((value) => {
                if (isUser === 0 && ((value !== '1') && (value !== '5'))) {
                    return;
                }
                getUserOrder(isUser, value).then(data_obj => {
                    if (data_obj['info']['flag']) {
                        updateList(data_obj['info'], target_list, false); // TODO
                    } else {
                        console.log(`获取${value}类型订单信息失败！`);
                        console.log(data_obj);
                    }
                });
            })
            break;
        // get specific kind of orders, not used yet
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
            getUserOrder(isUser, requestStatus).then(data_obj => {
                if (data_obj['info']['flag']) {
                    updateList(data_obj['info'], target_list, true);
                } else {
                    console.log(`获取${value}类型订单信息失败！`);
                    console.log(data_obj);
                }
            });
            break;
        default:
            throw `unexpected param ${requestStatus}`;
    }
}

function moveList(direction) {
    const order_flows = document.querySelectorAll('.order_flow');

    order_flows.forEach((ele) => {
        switch (direction) {
            case 'right':
                ele.style.transform = 'translateX(-100%)';
                break;
            case 'left':
                ele.style.transform = 'translateX(0)';
                break;
            default:
                throw `unexpected param ${direction}`;
        }
    });
}

function setActive(list, item_link) {
    for (let item of list.children) {
        item.firstElementChild.classList.remove('active');
    }

    item_link.classList.add('active');
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

function listenSwapper() {
    const swapper_list = document.querySelector('.swapper_list');

    swapper_list.addEventListener('click', e => {
        if (e.target.tagName === 'A' && !e.target.classList.contains('active')) {
            switch (e.target.id) {
                case 'my_order':
                    moveList('left');
                    getNewOrder(1, 0);
                    break;
                case 'picked_order':
                    moveList('right');
                    getNewOrder(0, 0);
                    break;
                default:
                    throw `unexpected param ${e.target.id}`;
            }
            setActive(swapper_list, e.target);
            hideDetailPanel();
        }
    });

    setActive(swapper_list, swapper_list.firstElementChild.firstElementChild);
}

function showDetailPanel(catagory) {
    const customer_wrapper_empty = document.querySelector('.customer_wrapper_empty');

    customer_wrapper_empty.classList.add('hide');

    const contact_wrapper = document.querySelector('.customer_wrapper');

    contact_wrapper.classList.remove('hide');

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

function bindOrderIdToButtonAndCheck(cancelable, order_id) {
    const submit_btn = document.querySelector('.pick_btn');

    if (cancelable) {
        submit_btn.removeAttribute('disabled');
        submit_btn.removeAttribute('hidden');
        submit_btn.dataset.bindid = order_id;
    } else {
        submit_btn.setAttribute('disabled', '');
        submit_btn.setAttribute('hidden', '');
    }
}

function setPickBar(cancelable, order_id) {
    const pick_bar = document.querySelector('.pick_bar');

    bindOrderIdToButtonAndCheck(cancelable, order_id);

    if (cancelable) {
        pick_bar.classList.remove('hide');
    } else {
        pick_bar.classList.add('hide');
    }
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
}

function setDetailPanelContact(item, info_o) {
    const nickname = document.getElementById('customer_nickname');

    nickname.textContent = info_o['nickname'];

    const phone = document.getElementById('customer_phone');

    phone.textContent = info_o['phone'];

    const address = document.getElementById('customer_address');

    let item_address = item.children[1].children[0].children[0].nextSibling.textContent;

    address.textContent = item_address;
}

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

function listenClickListItem() {
    const order_flows = document.querySelectorAll('.order_flow');

    order_flows.forEach((list) => {
        list.addEventListener('click', e => {
            if (e.target.tagName === 'A') {
                showDetailPanel(e.target.dataset.catagory);

                let cancelable = (e.target.dataset.cancelable === 'true');

                setPickBar(cancelable, e.target.dataset.id);

                requestOrderDetail(e.target.dataset.id).then(data_obj => {
                    if (data_obj['info']['flag']) {
                        let info_array = data_obj['info']['dataObj'];
                        setDetailPanelContent(e.target, info_array[0]);
                    } else {
                        console.log('获取订单内容失败');
                        console.log(data_obj);
                    }
                });

                requestOrderContact(e.target.dataset.id).then(data_obj => {
                    if (data_obj['info']['flag']) {
                        let info_o = data_obj['info']['dataObj'];
                        setDetailPanelContact(e.target, info_o);
                    } else {
                        console.log('获取订单内容失败');
                        console.log(data_obj);
                    }
                });
            }
        })
    })
}

function sendPickRequest(order_id) {
    const requestURL = '/order/pickOrder'; // TODO

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
                // TEST
                data_obj = {
                    "info": {
                        "flag": true,
                        "errorMsg": "cHwMK"
                    }
                };
                if (data_obj['info']['flag']) {
                    alert('取消订单成功。');
                    location.replace('/me/order');
                } else {
                    console.log('出现了错误');
                    console.log(data_obj);
                }
            });
    });
}

listenSwapper();
listenClickListItem();
listenOrderSubmit();
getNewOrder(1, 0);
