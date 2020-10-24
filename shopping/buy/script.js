"use strict";

function siteCustomHandler() {
    const list = document.querySelector('.site_custom_choice_wrapper');
    const specific_address = document.querySelector('.info_item.site_choice');

    list.addEventListener('click', e => {
        if (e.target.tagName === 'INPUT') {
            switch (e.target.value) {
                case 'specific_address':
                    specific_address.classList.remove('hide');
                    specific_address.classList.add('show');
                    break;
                case 'nearby':
                    specific_address.classList.add('hide');
                    specific_address.classList.remove('show');
                    break;
                default:
                    console.log(`error handling param ${e.target.value}`);
                    break;
            }
        }
    });
    specific_address.classList.add('show');
}

function suggestionHandler() {
    const list = document.querySelector('.suggestion_list');
    const textarea = document.getElementById('note');

    list.addEventListener('click', e => {
        if (e.target.tagName === 'BUTTON') {
            textarea.textContent += e.target.textContent + " ";
        }
    });
}



window.addEventListener('load', () => {
    siteCustomHandler();
    suggestionHandler();
});