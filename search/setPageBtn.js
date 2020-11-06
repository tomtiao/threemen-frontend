function setPageBtn(currentPage) {
    const seletion_page = document.querySelector('select_page_list');
    for (const li of seletion_page.children) {
        // first element child is button
        if (parseInt(li.firstElementChild.dataset.page) === currentPage) {
            li.firstElementChild.classList.add('active');
        }
    }
}
