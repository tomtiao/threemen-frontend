function submitHandler() {
    const form_self = document.querySelector('.form');
    const submit_btn = document.querySelector('.submit_btn');
    function submitCheck() { }
    function submit() {
        submitCheck();
        const requestURL = '/user/register';
        let form_data = new FormData(form_self);
        return fetch(requestURL, {
            method: 'POST',
            body: form_data
        })
            .then(res => res.json())
            .catch(console.log);
    };
    form_self.addEventListener('click', e => {
        if (e.target === submit_btn) {
            e.preventDefault();
            submit()
                .then(data => {
                    if (data['flag']) {
                        history.replaceState('/');
                    }
                }); // TODO: 处理返回值
        }
    });
}

function verificationCodeHandler() {
    function getVerificationCode(target) {
        const requestURL = '/checkCode' + '?' + new Date().getTime();
        target.src = requestURL;
    }
    const verificationCodeImg = document.querySelector('.securityCode_img');

    verificationCodeImg.addEventListener('click', e => {
        getVerificationCode(verificationCodeImg);
    });
    getVerificationCode(verificationCodeImg);
}

addEventListener('load', () => {
    submitHandler();
    verificationCodeHandler();
});