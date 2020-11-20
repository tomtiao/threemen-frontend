"use strict";
function setPageBtn(currentPage) {
    // helper to find out if is swap page button
    function isArrowButton(list_item) {
        if (list_item.classList.contains('prev_page') || list_item.classList.contains('next_page')) {
            return true;
        }
        else {
            return false;
        }
    }
    const seletion_page = document.querySelector('.select_page_list');
    for (const li of seletion_page.children) {
        // first element child is button
        if (!li) {
            throw Error('empty list');
        }
        if (!isArrowButton(li)) {
            if (!li.firstElementChild) {
                throw Error('no first element child');
            }
            const li_page = li.firstElementChild.dataset.page;
            if (parseInt(li_page) === currentPage) {
                li.firstElementChild.classList.add('active');
            }
        }
    }
}
