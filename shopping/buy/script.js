"use strict";

function siteCustomHandler() {
    const list = document.querySelector('.site_custom_choice_wrapper');
    const specific_address = document.querySelector('.info_item.site_choice');

    list.addEventListener('click', e => {
        if (e.target.tagName === 'INPUT') {
            switch (e.target.value) {
                case 'specific_address':
                    specific_address.classList.remove('hide');
                    specific_address.classList.add('show');
                    break;
                case 'nearby':
                    specific_address.classList.add('hide');
                    specific_address.classList.remove('show');
                    break;
                default:
                    console.log(`error handling param ${e.target.value}`);
                    break;
            }
        }
    });
    specific_address.classList.add('show');
}

function suggestionHandler() {
    const list = document.querySelector('.suggestion_list');
    const textarea = document.getElementById('note');

    list.addEventListener('click', e => {
        if (e.target.tagName === 'BUTTON') {
            textarea.textContent += e.target.textContent + " ";
        }
    });
}

function autoCompleteUserInfo() {
    function fetchUserInfo() {
        const requestURL = '/order/preShowOrder';

        return fetch(requestURL, {
            method: "POST",
            credentials: "same-origin"
        }).then(res => res.json()).catch(console.log);
    }

    function setUserInfo({ [0]: user, [1]: userInfo }) {
        let name_input = document.getElementById('name');
        let phone_input = document.getElementById('phone');
        let address_input = document.getElementById('address');

        name_input.value = user['nickname'];
        phone_input.value = userInfo['phone'];
        address_input.value = userInfo['address'];
    }

    let user_data = fetchUserInfo();
    user_data.then(setUserInfo);
}

window.addEventListener('load', () => {
    siteCustomHandler();
    suggestionHandler();
    autoCompleteUserInfo();
});