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
            .then(res => res.json());
    };
    form_self.addEventListener('click', e => {
        if (e.target === submit_btn) {
            e.preventDefault();
            submit()
                .then(console.log) // TODO: 处理返回值
                .catch(console.log);
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