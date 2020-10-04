function submit() {
    const form_obj = document.querySelector('.form');
    const submit_btn = document.querySelector('.submit_btn');
    form_obj.addEventListener('click', e => {
        if (e.target === submit_btn) {
            e.preventDefault();
            console.log(e.target);
        }
    })
}

window.addEventListener('load', () => {
    // submit();
});