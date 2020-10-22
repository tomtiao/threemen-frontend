"use strict";
function accountHandler() {
    // 已登录返回true，未登录返回false，错误返回undefined
    function checkIfLogon() {
        const requestURL = '/user/findUser';

        return fetch(requestURL, {
            method: "POST",
            credentials: "same-origin"
        })
            .then(res => res.json())
            .then(data => {
                if (data) {
                    return data['flag'] ? data['flag'] : console.log(data['errorMsg']);
                }
            }).catch(console.log);
    }

    function getUserImg() {
        const requestURL = '/userInfo/showImg';

        return fetch(requestURL, {
            method: "POST",
            credentials: "same-origin"
        }).then(res => res.json()).catch(console.log);
    }

    let swap_img = () => {
        return getUserImg().then(res => {
            let data;
            const avatar = document.querySelector('.avatar');
            if (res) {
                data = btoa(res['dataObj']); // 二进制数据转Base64
            } else { // fallback img
                data = 'iVBORw0KGgoAAAANSUhEUgAAADYAAAA2CAIAAAADJ/2KAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABbSURBVGhD7c6hAYAwEMDAh2U6ZkcHwwZEVNyZ2FzPXnO2++vBLBYsFiwWLBYsFiwWLBYsFiwWLBYsFiwWLBYsFiwWLBYsFiwWLBYsFiwWLBYsFiwWLBYs/jfzAu93AhFuA80CAAAAAElFTkSuQmCC';
            }
            avatar.src = 'data:image/png;base64,' + data;
        });
    };

    function setLogoutBtn() {
        const logout_btn = document.querySelector('.logout');

        let sendLogoutRequest = () => {
            const requestURL = '/user/exit';

            return fetch(requestURL, {
                method: "POST",
                credentials: "same-origin"
            })
                .then(res => res.json())
                .catch(console.log);
        };

        logout_btn.addEventListener('click', e => {
            e.preventDefault();
            sendLogoutRequest();
        });
    }

    const login_register = document.querySelector('.login_and_register');
    const with_avatar = document.querySelector('.with_avatar');
    checkIfLogon().then(flag => {
        if (flag) {
            swap_img().then(() => {
                login_register.classList.add('hidden');
                with_avatar.classList.remove('hidden');
                setLogoutBtn();
            });
        } else {
            login_register.classList.remove('hidden');
            with_avatar.classList.add('hidden');
        }
    });
}

window.addEventListener('load', e => {
    accountHandler();
});