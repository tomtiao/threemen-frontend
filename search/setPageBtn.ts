function setPageBtn(currentPage: number): void {
    const seletion_page = document.querySelector('select_page_list') as HTMLUListElement;

    for (const li of seletion_page.children) {
        // first element child is button
        if (parseInt((li.firstElementChild as HTMLButtonElement).dataset.page) === currentPage) {
            li.firstElementChild.classList.add('active');
        }
    }
}