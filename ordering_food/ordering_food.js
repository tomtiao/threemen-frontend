function filterHandler() {
    let lists = document.querySelectorAll('.list');
    let btns = document.querySelectorAll('.list_btn');
    // handle bubble from btn
    for (let list of lists) {
        list.addEventListener('click', e => {
            e.preventDefault();
            if (e.target.tagName === 'BUTTON') {
                if (!e.target.classList.contains('active')) {
                    e.target.classList.add('active');
                }
                for (let btn of btns) {
                    // remove class 'active' from other buttons in the same group
                    if (btn.classList.contains('active') &&
                        btn !== e.target &&
                        btn.parentNode.parentNode === e.target.parentNode.parentNode) {
                        btn.classList.remove('active');
                    }
                }
            }
        });
    }
}

function toTop() {
    let to_top_btn = document.querySelector('.to_top');
    to_top_btn.addEventListener('click', () => window.scroll({ top: 0, behavior: 'smooth' }));
}

function goBack() {
    let go_back_btn = document.querySelector('.go_back');
    go_back_btn.addEventListener('click', () => history.back());
}

function mobi() {
    document.querySelector('.catagory_btn')
    .addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        document.querySelector('.catagory_list.list')
        .classList.toggle('show');
    })
    document.querySelector('.catagory_list')
    .addEventListener('click', e => {
        e.stopPropagation();
    });
    document.body.addEventListener('click', e => {
        const list = document.querySelector('.catagory_list');
        if (list.classList.contains('show')) {
            list.classList.remove('show');
        }
    });
}

onload = () => {
    filterHandler();
    toTop();
    goBack();
    mobi();
};