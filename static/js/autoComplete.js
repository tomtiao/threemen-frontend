function autoCompleteUserInfo() {
    function fetchUserInfo() {
        const requestURL = '/order/preShowOrder';

        return fetch(requestURL, {
            method: "POST",
            credentials: "include"
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
    autoCompleteUserInfo();
});