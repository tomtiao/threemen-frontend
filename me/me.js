"use strict";
function getUserInfo(url) {
    return fetch(url, {
        method: "POST",
        credentials: "include"
    }).then(res => res.json()).catch(console.log);
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
                break;
            case '.want_work':
                doms = {
                    stuId: document.querySelector(target + ' ' + '.id'),
                    realName: document.querySelector(target + ' ' + '.name')
                };
                obj_name = 'workerInfo';
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

function uploadAvatarHandler() {
    function listenUploadImg() {
        const preview = document.getElementById('preview');
        const input = document.getElementById('upload');

        input.addEventListener('change', e => {
            preview.src = URL.createObjectURL(input.files[0]);
        });
    }

    listenUploadImg();

    function uploadAvatar() {
        const form_self = document.querySelector('.upload_form');
        form_self.addEventListener('submit', e => {
            e.preventDefault();

            const uploadURL = '/userInfo/saveImg';
            let form_data = new FormData(form_self);
            if (form_data.get('upload') !== '') {
                return fetch(uploadURL, {
                    method: 'POST',
                    body: form_data,
                    credentials: 'same-origin'
                })
                    .then(res => res.json())
                    .then(obj => {
                        if (obj['flag']) {
                            alert('上传成功！');
                            location.replace(location.href);
                        } else {
                            alert('发生错误');
                        }
                    })
                    .catch(console.log);
            } else {
                alert('没有选择图片！');
            }
        });

        const change_img_link = document.querySelector('.mask');
        const chanage_img_panel = document.querySelector('.upload_avatar');

        change_img_link.addEventListener('click', e => {
            e.preventDefault();
            chanage_img_panel.classList.toggle('show');
        });

        chanage_img_panel.addEventListener('click', e => {
            e.stopPropagation();
        })

        document.body.addEventListener('click', e => {
            if (e.target !== change_img_link && chanage_img_panel.classList.contains('show')) {
                chanage_img_panel.classList.remove('show');
            }
        });
    }

    uploadAvatar();
}

function changePasswordHandler() {
    const show_change_btn = document.querySelector('.reset_passwd');
    const change_pw_panel = document.querySelector('.change_pw_panel');
    show_change_btn.addEventListener('click', e => {
        change_pw_panel.classList.toggle('show');
    });

    change_pw_panel.addEventListener('click', e => {
        e.stopPropagation();
    });

    document.body.addEventListener('click', e => {
        if (e.target !== show_change_btn && change_pw_panel.classList.contains('show')) {
            change_pw_panel.classList.remove('show');
        }
    });

    const change_pw_form = document.getElementById('change_pw');
    const new_pw_input = document.getElementById('new');
    const new_pw_repeat_input = document.getElementById('new_repeat');

    function makeRequest() {
        const requestURL = '/userInfo/updatePassword';

        let form_data = new FormData(change_pw_form);
        let urlParams = new URLSearchParams();
        for (let data of form_data) {
            if (data[0] === 'old' || data[0] === 'new') {
                urlParams.append(data[0], data[1]);
            }
        }

        return fetch(requestURL, {
            method: 'POST',
            body: urlParams,
            credentials: 'same-origin'
        }).then(res => res.json()).catch(console.log);
    }

    change_pw_form.addEventListener('submit', e => {
        e.preventDefault();
        if (new_pw_input.value !== new_pw_repeat_input.value) {
            alert('两次输入的密码不相同！');
        } else {
            makeRequest().then(obj => {
                if (obj['flag']) {
                    alert(data['errorMsg']);
                    location.replace(location.pathname);
                } else {
                    alert(data['errorMsg']);
                }
            });
        }
    });
}

window.addEventListener('load', () => {
    // userInfoHandler();
    uploadAvatarHandler();
    changePasswordHandler();
});
