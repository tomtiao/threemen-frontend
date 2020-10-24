"use strict";
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
                // TODO: 发送过滤条件
            }
        });
    }
}

function toTop() {
    let to_top_btn = document.querySelector('.to_top');
    to_top_btn.addEventListener('click', () => window.scroll({ top: 0, behavior: 'smooth' }));
}

function goBack() {
    let go_back_btn = document.querySelector('.go_back');
    go_back_btn.addEventListener('click', () => history.back());
}

function mobi() {
    document.querySelector('.catagory_btn')
        .addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            document.querySelector('.catagory_list.list')
                .classList.toggle('show');
        })
    document.querySelector('.catagory_list')
        .addEventListener('click', e => {
            e.stopPropagation();
        });
    document.body.addEventListener('click', e => {
        const list = document.querySelector('.catagory_list');
        if (list.classList.contains('show')) {
            list.classList.remove('show');
        }
    });
}


function displayResult() {

    const list = document.querySelector('.select_page_list');
    function initPageList(totalPage) {
        totalPage = totalPage || 1;

        const next_page_btn_item = document.querySelector('.select_page_list .list_item.next_page');
        let create_page_btn = (page) => {
            let new_list_item = document.createElement('li');
            new_list_item.classList.add('list_item');

            let new_page_btn = document.createElement('button');
            new_page_btn.classList.add('list_btn');
            new_page_btn.dataset.page = page;
            new_page_btn.textContent = page;
            new_list_item.append(new_page_btn);

            list.insertBefore(new_list_item, next_page_btn_item);
        };

        for (let i = 1; i <= totalPage; i++) {
            create_page_btn(i);
        }
    }

    function changePage(info_array) {
        const info_list = document.querySelector('.info_list');
        // expected info object
        function updateList(info_o) {
            let new_info_item = document.createElement('li');
            new_info_item.classList.add('list_item');

            let new_info_title = document.createElement('h1');
            new_info_title.classList.add('item_title');
            new_info_title.textContent = info_o['position'];

            let new_second_list = document.createElement('ul');
            new_second_list.classList.add('item_brief');

            let new_second_list_item = document.createElement('li');
            new_second_list_item.classList.add('brief_item');
            new_second_list_item.textContent = "固定岗位：" + info_o['fixSeat'];

            new_second_list.append(new_second_list_item);

            let new_second_list_item_copied = new_second_list_item.cloneNode(true);
            new_second_list_item_copied.textContent = "临时岗位：" + info_o['temSeat'];

            new_second_list.append(new_second_list_item_copied);

            new_info_item.append(new_info_title, new_second_list);

            info_list.append(new_info_item);
        }

        function clearList() {
            while (info_list.firstChild) {
                info_list.removeChild(info_list.firstChild);
            }
        }

        clearList();
        for (let info_o of info_array) {
            updateList(info_o);
        }
    }

    let currentPage = 1;
    let totalPage;
    function clickBtnHandler() {
        function listenPageList() {
            // param expects li
            let activeBtn = (list_item) => {
                if (!list_item.classList.contains('prev_page')
                    && !list_item.classList.contains('next_page')) {
                    for (let ele of list.children) {
                        if (ele.tagName === 'LI' && ele.firstElementChild.classList.contains('active')) {
                            ele.firstElementChild.classList.remove('active');
                        }
                    }
                    list_item.firstElementChild.classList.add('active');
                }
            };

            let findSpecificPageBtn = (page) => {
                let res;
                for (let ele of list.children) {
                    if (ele.tagName === 'LI' && parseInt(ele.firstElementChild.dataset.page) === page) {
                        res = ele;
                        break;
                    }
                }

                return res;
            }

            list.addEventListener('click', e => {
                if (e.target.tagName === 'BUTTON') {
                    switch (e.target.parentNode.className) {
                        case 'list_item prev_page':
                            if (currentPage !== 1) {
                                currentPage--;
                                activeBtn(findSpecificPageBtn(currentPage));
                                makeRequest().then(data_obj => {
                                    changePage(data_obj['list']);
                                });
                            } else {
                                setTimeout(alert('已经是首页了！'));
                            }
                            break;
                        case 'list_item next_page':
                            if (currentPage != totalPage) {
                                currentPage++;
                                activeBtn(findSpecificPageBtn(currentPage));
                                makeRequest().then(data_obj => {
                                    changePage(data_obj['list']);
                                });
                            } else {
                                setTimeout(alert('已经是尾页了！'));
                            }
                            break;
                        default:
                            currentPage = e.target.dataset.page;
                            activeBtn(e.target.parentNode);
                            makeRequest().then(data_obj => {
                                changePage(data_obj['list']);
                            });
                            break;
                    }
                }
            });
        }

        listenPageList();
    }


    function makeRequest() {
        const requestURL = '/workStudyServlet/showWorkStudy';
        let request = {
            currentPage: currentPage,
            pageSize: 5,
            content: ""
        };

        let urlParams = new URLSearchParams();
        let key = Object.keys(request);
        key.forEach((key) => {
            urlParams.append(key, request[key]);
        })

        return fetch(requestURL, {
            method: 'POST',
            body: urlParams,
            credentials: "same-origin"
        })
            .then(res => res.json()).catch(console.log);
    }

    let data = makeRequest();
    data.then(data_obj => {
        totalPage = data_obj['totalPage'];
        initPageList(totalPage);
        // initPageList(10);
        currentPage = data_obj['currentPage'];
        changePage(data_obj['list']);
        // 设置第一页按钮样式
        document.querySelector('.select_page_list .list_item:not(.prev_page) .list_btn')
            .classList.add('active');
        clickBtnHandler();
    });


}

// function displayResult() {
//     obj = makeRequest();
//     totalPage;
//     initPageList();
//     currentPage;
//     listenPageList();
//     changePage();
//     updateList();
// }

window.addEventListener('load', () => {
    // filterHandler();
    toTop();
    goBack();
    // mobi();
    displayResult();
});