"use strict";
function submitHandler() {
    const form_self = document.querySelector('.form');
    if (!form_self) {
        throw Error(`could not found form_self`);
    }
    function submitCheck() {
        const username = document.getElementById('account');
        const password = document.getElementById('password');
        if (!username || !password) {
            throw Error(`could not found username or password`);
        }
        if (username.value != ''
            && password.value != '') {
            return true;
        }
        else {
            alert('账号和密码不能为空！');
            return false;
        }
    }
    function getNonceAndPubkey() {
        const requestURL = '/saveServlet/getNonceAndPublicKey';

        return fetch(requestURL, {
            credentials: 'same-origin'
        }).then(res => res.json()).catch(console.log);
    }

    // use JSEncrypt Library
    function encryptString(public_key, str) {
        // eslint-disable-next-line no-undef
        const encrypt = new JSEncrypt();

        encrypt.setPublicKey(public_key);

        return encrypt.encrypt(str);
    }

    function makeRequest(username, password, nonce, pubkey) {
        const requestURL = '/user/login';

        const urlParams = new URLSearchParams();

        urlParams.append('account', username);
        urlParams.append('password', password);
        urlParams.append('nonce', nonce);

        const stringPendingEncrypt = `${username}&${password}&${nonce}`;

        const sign = encryptString(pubkey, stringPendingEncrypt);

        urlParams.append('sign', sign);

        return fetch(requestURL, {
            method: 'POST',
            body: urlParams,
            credentials: 'same-origin'
        }).then(res => res.json()).catch(console.log);
    }

    form_self.addEventListener('submit', e => {
        e.preventDefault();
        if (submitCheck()) {
            const username = document.getElementById('account');
            const password = document.getElementById('password');
            getNonceAndPubkey().then(data_obj => {
                const nonce = data_obj['dataObj'][0];
                const pubkey = data_obj['dataObj'][1];

                makeRequest(username.value, password.value, nonce, pubkey).then(data => {
                    if (data['flag']) {
                        const autologin = document.getElementById('autologin');
                        if (!autologin) {
                            throw Error(`could not found autologin`);
                        }
                        // setTimeout(alert(data['errorMsg']));
                        if (autologin.checked) {
                            fetch('/user/saveLogin', { method: "POST", credentials: "same-origin" });
                        }
                        if (window.location.hash) {
                            window.location.replace(window.location.hash.substr(1));
                        } else {
                            window.location.replace('/');
                        }
                    }
                    else {
                        // TODO: 重做提醒
                        alert(data['errorMsg']);
                    }
                }).catch(console.log); // TODO: 处理返回值
            }).catch(console.log);
        }
    });
}

function animation() {
    const inputs = document.querySelectorAll('input');

    inputs.forEach(input => {
        const text = input.nextElementSibling;
        input.addEventListener('focus', () => {
            text.classList.add('active');
        });
        input.addEventListener('blur', () => {
            if (input.value === '') {
                text.classList.remove('active');
            }
        });
    });
}

function noLoginNote() {
    const no_login_note = `
    <style>
        @keyframes fadein {
            from {
                opacity: 0;
                transform: translateX(50px);
            }

            10% {
                transform: translateX(50px);
            }

            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    </style>
    <div class="no_login" style="display: flex; align-items: center; position: fixed; z-index: 2; top: 50px; right: 50px; padding: 0 0.5em; background-color: white; box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3); border-radius: 4px; animation-name: fadein; animation-duration: .5s;">
        <p><img src="/static/img/note.svg" alt="note" style="height: 1em; width: 1em; margin-right: 0.25em;">请先登录以便继续使用服务。</p>
    </div>`;

    if (window.location.hash) {
        document.body.innerHTML += no_login_note;
    }
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        submitHandler();
        animation();
        noLoginNote();
    });
}
else {
    animation();
    submitHandler();
    noLoginNote();
}
