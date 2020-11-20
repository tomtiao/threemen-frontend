function sendOrderHandler() {
    let gold = 0;
    function makeRequest() {
        const requestURL = '/order/saveOrder';
    
        const form_self = document.querySelector('form');
    
        let form_data = new FormData(form_self);
        let urlParams = new URLSearchParams();
    
        form_data.forEach((value, key) => {
            if (key === 'commCostCoin') {
                gold = Number(value);
            }
            urlParams.append(key, value);
        });
    
        let getURL = new URLSearchParams([['serviceType', 'deliveryService']]);
        return fetch(requestURL + '?' + getURL.toString(), {
            method: 'POST',
            body: urlParams,
            credentials: 'same-origin'
        }).then(res => res.json()).catch(console.log);
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

    function payOrder(gold, order_id, nonce, pubkey) {
        const requestURL = '/order/payOrder';
        let urlParams = new URLSearchParams();

        urlParams.append('commCostCoin', gold);
        urlParams.append('commNum', order_id);
        urlParams.append('commReward', 0)
        
        const pendingEncryptString = `${gold}&${0}&${order_id}&${nonce}`;
        urlParams.append('nonce', nonce);
        urlParams.append('sign', encryptString(pubkey, pendingEncryptString));

        return fetch(requestURL, {
            method: 'POST',
            body: urlParams,
            credentials: 'same-origin'
        }).then(res => res.json()).catch(console.log);
    }

    document.querySelector('.checkin_btn').addEventListener('click', e => {
        e.preventDefault();
        makeRequest()
        .then(data => {
            if (data['flag']) {
                alert('订单已发送！');
            } else {
                alert('很抱歉，出了一些问题');
            }

            return data['dataObj'];
        })
        .then(num => {
            return getNonceAndPubkey().then(res => [num, res]);
        })
        .then(([num, NonceAndPubKeyDataObj]) => {
            return payOrder(gold, num,
                NonceAndPubKeyDataObj['dataObj'][0],
                NonceAndPubKeyDataObj['dataObj'][1]);
        })
        .then(data => {
            if (data['flag']) {
                window.location.href = '/me/order';
            } else {
                console.log(data);
            }
        }).catch(console.log);
    });
}

function listenSizeChange() {
    const size_choice = document.querySelector('.size_choice_wrapper');

    function changeGold(value) {
        const total_content = document.getElementById('total_content');

        total_content.textContent = value;
    }

    size_choice.addEventListener('change', e => {
        changeGold(e.target.value);
    });
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        sendOrderHandler();
        listenSizeChange();
    });
} else {
    sendOrderHandler();
    listenSizeChange();
}