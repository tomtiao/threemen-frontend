"use strict";
function submitHandler() {
    const form_self = document.querySelector('.form');
    const submit_btn = document.querySelector('.submit_btn');
    if (!form_self || !submit_btn) {
        throw Error(`could not found form_self or submit_btn`);
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
    function encryptString(public_key, str) {
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

    form_self.addEventListener('click', async e => {
        if (e.target === submit_btn) {
            e.preventDefault();
            if (submitCheck()) {
                const username = document.getElementById('account');
                const password = document.getElementById('password');
                const data_obj = await getNonceAndPubkey();
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
                        window.location.replace('/');
                    }
                    else {
                        // TODO: 重做提醒
                        alert(data['errorMsg']);
                    }
                }).catch(console.log); // TODO: 处理返回值
            }
        }
    });
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        submitHandler();
    });
}
else {
    submitHandler();
}
