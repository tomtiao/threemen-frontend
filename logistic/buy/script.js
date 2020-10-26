function sendOrderHandler() {
    function makeRequest() {
        const requestURL = '/order/saveOrder';
        const estimatedPriceInput = document.getElementById('estimated_price');
    
        const form_self = document.querySelector('form');
    
        let form_data = new FormData(form_self);
        let urlParams = new URLSearchParams();
    
        form_data.forEach((value, key) => {
            urlParams.append(key, value);
        });
        
        // delete radio group value
        urlParams.delete('site_custom_choice');
    
        // add estimated gold
        urlParams.append('commCostCoin', parseInt(estimatedPriceInput.value) * 10);
    
        return fetch(requestURL, {
            method: 'POST',
            body: urlParams,
            credentials: 'same-origin'
        }).then(res => res.json()).catch(console.log);
    }

    document.querySelector('.checkin_btn').addEventListener('click', e => {
        e.preventDefault();
        makeRequest().then(data => {
            if (data['flag']) {
                alert('订单已发送！');
                location.replace(location.pathname);
            } else {
                alert('很抱歉，出了一些问题');
            }
        });
    });
}

window.addEventListener('load', () => {
    sendOrderHandler();
});