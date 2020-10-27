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
                    } else {
                        updateListAndPageSelection(last_time_catagory, getKeyword(), false)
                    }
                }
            });
        });
        last_time_catagory = btns[0].dataset.catagory;
    }

    function requestPageAndInfo(catagory, currentPage, pageSize, content) {
        const requestURLs = {
            'shopping': '/order/showAllOrderForWorker',
            'working': '/workStudyServlet/showWorkStudy'
        };

        let urlParams = new URLSearchParams();
        urlParams.append('currentPage', currentPage);
        urlParams.append('pageSize', pageSize || 4);
        if (catagory === 'working') {
            urlParams.append('content', content || '');
        }

        return fetch(requestURLs[catagory], {
            method: 'POST',
            body: urlParams,
            credentials: 'same-origin'
        }).then(res => res.json()).catch(console.log);
    }

    let currentPage = 1;
    // if catagory isn't working, param content would be ingored.
    function updateListAndPageSelection(catagory, content, isInitial) {
        requestPageAndInfo(catagory, currentPage, null, content)
            .then(page_and_info_o => {
                // FOR TESTING BEGINS
                page_and_info_o = {
                    "info": {
                        "flag": true,
                        "errorMsg": "C@IH",
                        "dataObj": {
                            "currentPage": 1,
                            "pageSize": 5,
                            "totalPage": 10,
                            "totalCount": 49,
                            "list": [
                                {
                                    "commCostReal": 3848640217912097,
                                    "commAddress": "bqiJpX",
                                    "address": "o0mI"
                                },
                                {
                                    "commCostReal": -1421611053252940.5,
                                    "commAddress": "Qz25",
                                    "address": "S#3bQ"
                                },
                                {
                                    "commCostReal": -1875752327338940.5,
                                    "commAddress": "69RsC",
                                    "address": "LVw"
                                }
                            ]
                        }
                    }
                };
                // FOR TESTING ENDS
                let totalPage = page_and_info_o['info']['dataObj']['totalPage'];
                let info_array = page_and_info_o['info']['dataObj']['list'];

                initPageList(totalPage);
                updateList(info_array, catagory);

                if (isInitial) {
                    listenFilterList();
                    listenPageList();
                }
            });
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
                    info_list.append(createListItem(info_o['commAddress'], info_o['address']));
                });
                break;
            case 'working':
                info_array.forEach((info_o) => {
                    info_list.append(createListItem(info_o['position'], info_o));
                });
                break;
            default:
                console.log(`invalid param ${catagory}`);
                break;
        }
    }

    // item_content can be Array
    function createListItem(item_title, item_content) {
        let new_info_item = document.createElement('li');
        new_info_item.classList.add('list_item');

        let new_info_title = document.createElement('h1');
        new_info_title.classList.add('item_title');
        new_info_title.textContent = item_title;

        let new_second_list = document.createElement('ul');
        new_second_list.classList.add('item_brief');

        // pass plain object, is catagory working
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
            }

            new_second_list.append(new_second_list_item);

            let new_second_list_item_copied = new_second_list_item.cloneNode(false);

            let new_second_item_label_copied = new_second_item_label.cloneNode(false)
            new_second_item_label_copied.textContent = '临时岗位';

            new_second_list_item_copied.append(new_second_item_label_copied);

            if (item_content['temSeat'] !== undefined) {
                new_second_list_item_copied.append(document.createTextNode(item_content['temSeat']));
            } else {
                new_second_list_item_copied.append('无');
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
                            last_time_catagory === 'working' ? getKeyword() : null, false);
                    } else {
                        alert('已经是第一页了！');
                    }
                    break;
                case 'next_page_btn':
                    if (currentPage != totalPage) {
                        currentPage++;
                        updateListAndPageSelection(last_time_catagory,
                            last_time_catagory === 'working' ? getKeyword() : null, false);
                    } else {
                        setTimeout(alert('已经是最后一页了！'));
                    }
                    break;
                default:
                    currentPage = e.target.dataset.page;
                    updateListAndPageSelection(last_time_catagory,
                        last_time_catagory === 'working' ? getKeyword() : null, false);
                    break;
            }
        }
    }

    function listenPageList() {
        const select_page_list = document.querySelector('.select_page_list');

        select_page_list.addEventListener('click', clickBtnHandler);
    }

    updateListAndPageSelection('shopping', null, true);
}

// function displayResult() {

//     const list = document.querySelector('.select_page_list');


//     function changePage(info_array) {
//         const info_list = document.querySelector('.info_list');

//         // expected info object
//         function updateList(info_o) {
//             let new_info_item = document.createElement('li');
//             new_info_item.classList.add('list_item');

//             let new_info_title = document.createElement('h1');
//             new_info_title.classList.add('item_title');
//             new_info_title.textContent = info_o['position'];

//             let new_second_list = document.createElement('ul');
//             new_second_list.classList.add('item_brief');

//             let new_second_list_item = document.createElement('li');
//             new_second_list_item.classList.add('brief_item');

//             let new_second_item_label = document.createElement('span');
//             new_second_item_label.classList.add('item_label');
//             new_second_item_label.textContent = '固定岗位';

//             new_second_list_item.append(new_second_item_label);

//             if (info_o['fixSeat'] !== null) {
//                 new_second_list_item.textContent += info_o['fixSeat'];
//             } else {
//                 new_second_list_item.textContent += '空';
//             }

//             new_second_list.append(new_second_list_item);

//             let new_second_list_item_copied = new_second_list_item.cloneNode(true);

//             let new_second_item_label_copied = new_second_item_label.cloneNode(true)
//             new_second_item_label_copied.textContent = '临时岗位';

//             new_second_list_item_copied.append(new_second_item_label);

//             if (info_o['temSeat'] !== null) {
//                 new_second_list_item_copied.textContent += info_o['temSeat'];
//             } else {
//                 new_second_list_item_copied.textContent += '空';
//             }

//             new_second_list.append(new_second_list_item_copied);

//             new_info_item.append(new_info_title, new_second_list);

//             info_list.append(new_info_item);
//         }

//         function clearList() {
//             while (info_list.firstChild) {
//                 info_list.removeChild(info_list.firstChild);
//             }
//         }

//         clearList();
//         for (let info_o of info_array) {
//             updateList(info_o);
//         }
//     }

//     let currentPage = 1;
//     let totalPage;
//     function clickBtnHandler() {
//         function listenPageList() {
//             // param expects li
//             let activeBtn = (list_item) => {
//                 if (!list_item.classList.contains('prev_page')
//                     && !list_item.classList.contains('next_page')) {
//                     for (let ele of list.children) {
//                         if (ele.tagName === 'LI' && ele.firstElementChild.classList.contains('active')) {
//                             ele.firstElementChild.classList.remove('active');
//                         }
//                     }
//                     list_item.firstElementChild.classList.add('active');
//                 }
//             };

//             let findSpecificPageBtn = (page) => {
//                 let res;
//                 for (let ele of list.children) {
//                     if (ele.tagName === 'LI' && parseInt(ele.firstElementChild.dataset.page) === page) {
//                         res = ele;
//                         break;
//                     }
//                 }

//                 return res;
//             }

//             function resetList(list_item, keyword) {
//                 activeBtn(list_item);
//                 makeRequest(keyword).then(data_obj => {
//                     if (keyword !== '') {
//                         initPageList(data_obj['totalPage']);
//                     }
//                     changePage(data_obj['list']);
//                 });
//             }

//             let keyword;
//             list.addEventListener('click', e => {
//                 keyword = getKeyword();
//                 if (e.target.tagName === 'BUTTON') {
//                     switch (e.target.parentNode.className) {
//                         case 'list_item prev_page':
//                             if (currentPage !== 1) {
//                                 currentPage--;
//                                 resetList(findSpecificPageBtn(currentPage), keyword);
//                             } else {
//                                 setTimeout(alert('已经是首页了！'));
//                             }
//                             break;
//                         case 'list_item next_page':
//                             if (currentPage != totalPage) {
//                                 currentPage++;
//                                 resetList(findSpecificPageBtn(currentPage), keyword);
//                             } else {
//                                 setTimeout(alert('已经是尾页了！'));
//                             }
//                             break;
//                         default:
//                             currentPage = e.target.dataset.page;
//                             resetList(e.target.parentNode, keyword);
//                             break;
//                     }
//                 }
//             });
//         }

//         listenPageList();
//     }


//     function makeRequest(keyword) {
//         const requestURL = '/workStudyServlet/showWorkStudy';
//         let request = {
//             currentPage: currentPage,
//             pageSize: 5,
//             content: keyword || ""
//         };

//         let urlParams = new URLSearchParams();
//         let key = Object.keys(request);
//         key.forEach((key) => {
//             urlParams.append(key, request[key]);
//         })

//         return fetch(requestURL, {
//             method: 'POST',
//             body: urlParams,
//             credentials: "same-origin"
//         })
//             .then(res => res.json()).catch(console.log);
//     }

//     function getKeyword() {
//         return document.querySelector('.search_bar').value;
//     }

//     let data = makeRequest();
//     data.then(data_obj => {
//         totalPage = data_obj['totalPage'];
//         initPageList(totalPage);
//         // initPageList(10);
//         currentPage = data_obj['currentPage'];
//         changePage(data_obj['list']);
//         // 设置第一页按钮样式
//         document.querySelector('.select_page_list .list_item:not(.prev_page) .list_btn')
//             .classList.add('active');
//         clickBtnHandler();
//     });
// }

function clickResultHandler() {
    const info_list = document.querySelector('.info_list');


    // TODO
    info_list.addEventListener('click', e => {
        console.log(e.target.children);
    });
}

window.addEventListener('load', () => {
    filterHandler();
    // toTop();
    // mobi();
    // displayResult();
    pageBehaviourHandler();
    clickResultHandler();
});