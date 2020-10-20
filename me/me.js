function makeRequest(url, custom) {
    if (custom) {
        return fetch(url, custom);
    } else {
        return fetch(url, {
            method: 'POST'
        });
    }
}

function getUserInfo(url) {
    return makeRequest(url).then(res => res.json()).catch(console.log);
}

// 获取指定信息并修改DOM
function setUserInfo(target, url) {
    function changeDom(info, doms, obj_name) {
        const keys = Object.keys(doms);

        keys.forEach((key, index) => {
            doms[key].textContent = info[obj_name][key];
        });
    }
    getUserInfo(url).then(data => {
        let user_info = data;
        let doms;
        let obj_name;
        switch (target) {
            case '.content':
                doms = {
                    nickname: document.querySelector(target + ' ' + '.nickname'),
                    level: document.querySelector('.level'),
                    coin: document.querySelector('.coin'),
                    account: document.querySelector(target + ' ' + '.username'),
                    email: document.querySelector('.email'),
                    department: document.querySelector('.college'),
                    master: document.querySelector('.dept'),
                    address: document.querySelector('.dorm')
                };
                obj_name = 'userInfo';
                // ONLY FOR TESTING PURPOSE
                // DO NOT USE THIS IN PRODUCTION ENV

                user_info = JSON.parse(`{
            "userInfo": {
                "account": "*Tso",
                "email": "WJ4H",
                "nickname": "t^oyMl",
                "department": "Wm]Bx",
                "master": "Wg#W",
                "address": "vQ^Y%C",
                "level": 96,
                "coin": 5198869592642580
            }
        }`);
                // END
                break;
            case '.working_me':
                doms = {
                    mark: document.querySelector('.rating'),
                    goodCount: document.querySelector('.medal'),
                    account: document.querySelector(target + ' ' + '.username'),
                    stuId: document.querySelector('.id'),
                    realName: document.querySelector('.name'),
                    totalCount: document.querySelector('.total_count'),
                    badCount: document.querySelector('.bad_count')
                };
                obj_name = 'workerInfo';
                // ONLY FOR TESTING PURPOSE
                // DO NOT USE THIS IN PRODUCTION ENV

                user_info = JSON.parse(`{
            "workerInfo": {
                "account": "NrsaH",
                "realName": "&3^jn",
                "stuId": "mLRYaQ",
                "mark": 2947456174871664,
                "totalCount": 1096629050746072,
                "goodCount": 7570472144287696,
                "badCount": 6754223190597432
            }
        }`);
                // END
                break;
            case '.want_work':
                doms = {
                    stuId: document.querySelector(target + ' ' + '.id'),
                    realName: document.querySelector(target + ' ' + '.name')
                };
                obj_name = 'workerInfo';
                user_info = JSON.parse(`{
                    "workerInfo": {
                        "account": "NrsaH",
                        "realName": "&3^jn",
                        "stuId": "mLRYaQ",
                        "mark": 2947456174871664,
                        "totalCount": 1096629050746072,
                        "goodCount": 7570472144287696,
                        "badCount": 6754223190597432
                    }
                }`);
                break;
        }
        changeDom(user_info, doms, obj_name);
    }).catch(console.log);

}

// 进行信息的获取和DOM修改
function userInfoHandler() {
    const urls = {
        userURL: '/userInfo/showUserInfo',
        workerURL: '/workerInfo/showInfo'
    };


    // 页面加载即获取并显示信息
    setUserInfo('.content', urls['userURL']);

    (() => {
        let clicked = false;
        document.querySelector('.working_me')
            .addEventListener('click', () => {
                if (!clicked) {
                    setUserInfo('.working_me', urls['workerURL']);
                    clicked = true;
                }
            });
    })();
    (() => {
        let clicked = false;
        document.querySelector('.want_work')
            .addEventListener('click', () => {
                if (!clicked) {
                    setUserInfo('.want_work', urls['workerURL']);
                    clicked = true;
                }
            });
    })();
}

function uploadAvatar() {
    const form_self = document.querySelector('.upload_form');
    form_self.addEventListener('submit', e => {
        e.preventDefault();

        let form_data = new FormData(form_self);

        const uploadURL = '/userInfo/saveImg';
        makeRequest(uploadURL, {
            method: 'POST',
            body: form_data
        })
            .then(res => res.json())
            .catch(console.log);
    })
}

addEventListener('load', () => {
    userInfoHandler();
});


function goBack() {
    let go_back_btn = document.querySelector('.go_back');
    go_back_btn.addEventListener('click', () => history.back());
}

function resetPasswd() {
    const show_reset_btn = document.querySelector('.reset_passwd');
    show_reset_btn.addEventListener('click', e => {
        // TODO: show reset panel
        console.log(e.target)
    });
    const reset_submit_btn = document.querySelector('.reset_passwd_btn');
    reset_submit_btn.addEventListener('click', e => {
        // TODO: submit reset passwd
        e.preventDefault();
        console.log(e.target)
    });
}

function checkIfLogon() {

}

window.addEventListener('load', () => {
    goBack();
    resetPasswd();
    checkIfLogon();
});