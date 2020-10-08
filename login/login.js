function submitHandler() {
    const form_self = document.querySelector('.form');
    const submit_btn = document.querySelector('.submit_btn');
    function submitCheck() {

    }
    function submit() {
        submitCheck();
        const requestURL = '/user/login';
        let form_data = new FormData(form_self);

        return fetch(requestURL, {
            method: 'POST',
            body: form_data
        })
            .then(res => res.json())
    }
    form_self.addEventListener('click', e => {
        if (e.target === submit_btn) {
            e.preventDefault();
            submit()
                .then(console.log)
                .catch(console.log);
        }
    });
}

window.addEventListener('load', () => {
    submitHandler();
});