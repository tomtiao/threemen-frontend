const list_item = {
    title: '',
    content: '',
    indicator: ''
};

function createListItem(customer_address, order_status, order_address) {
    let brief = document.createElement('ul');
    brief.classList.add('item_brief');

    let address_list_item = document.createElement('li');
    address_list_item.classList.add('brief_item');

    let item_label = document.createElement('span');
    item_label.classList.add('item_label');
    item_label.textContent = '送达地址';

    address_list_item.append(item_label);
    address_list_item.textContent += customer_address;

    let indicator_list_item = document.createElement('li');
    indicator_list_item.classList.add('brief_item', 'indicator');
    indicator_list_item.textContent = order_status;

    brief.append(address_list_item, indicator_list_item);

    let title = document.createElement('h1');
    title.classList.add('item_title');
    title.textContent = order_address;

    let wrapper = document.createElement('a');
    wrapper.classList.add('item_link');
    wrapper.append(title, brief);

    let list_item = document.createElement('li');
    list_item.classList.add('list_item');
    list_item.append(wrapper);

    return list_item;
}

/*
 ** isUser: 1 for user, 0 for worker
 ** requestStatus: 1, 2, 3, 4, 5
 */
function getUserInfo(isUser, requestStatus) {
    const requestURL = '/order/showMyOrderForUserOrWorker';
    
    const urlParams = new URLSearchParams();

    urlParams.append('isUser', isUser);
    urlParams.append('order_status', requestStatus);

    return fetch(requestURL, {
        method: 'POST',
        body: urlParams,
        credentials: 'same-origin'
    }).then(res => res.json()).catch(console.log);
}

function updateList() {
    const my_order_list = document.querySelector('.my_order_list');
    
    // update my user list
    getUserInfo(0, 0).then(data_obj => {
        if (data_obj['flag']) {
            for (let data of data_obj['dataObj']) {
                my_order_list.append(createListItem('南苑11栋', '待送达', '顺客隆'));
            }

        }

    });

}

const my_order_list = document.querySelector('.my_order_list');
my_order_list.append(createListItem('南苑11栋', '待送达', '顺客隆'));
const picked_order_list = document.querySelector('.picked_order_list');
picked_order_list.append(createListItem('南苑11栋', '待送达', '顺客隆'));
