function submitHandler() {
    const form_self = document.querySelector('.form');
    const submit_btn = document.querySelector('.submit_btn');
    function submitCheck() {
        return true;
    }
    
    function submit() {
        if (submitCheck()) {
            const requestURL = '/user/login';
            let form_data = new FormData(form_self);
    
            return fetch(requestURL, {
                method: 'POST',
                body: form_data
            }).then(res => res.json()).catch(console.log);
        }
    }

    form_self.addEventListener('click', e => {
        if (e.target === submit_btn) {
            e.preventDefault();
            submit().then(console.log); // TODO: 处理返回值
        }
    });
}

window.addEventListener('load', () => {
    submitHandler();
});