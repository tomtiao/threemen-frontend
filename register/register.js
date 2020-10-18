function submitHandler() {
    const form_self = document.querySelector('.form');
    const submit_btn = document.querySelector('.submit_btn');
    function submitCheck() { }
    function submit() {
        submitCheck();
        const requestURL = '/user/register';
        let form_data = new FormData(form_self);
        let url_params = new URLSearchParams();

        for (let pair of form_data) {
            url_params.append(pair[0], pair[1]);
        }

        return fetch(requestURL, {
            method: 'POST',
            body: url_params
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
                        location.replace('/');
                        // TODO 重写提醒
                        alert('请打开邮箱进行账户验证。');
                    } else {
                        alert(data['errorMsg'] + " 请重试。")
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