function setPageBtn(currentPage: number): void {
    // helper to find out if is swap page button
    function isArrowButton(list_item: HTMLElement): boolean {
        if (list_item.classList.contains('prev_page') || list_item.classList.contains('next_page')) {
            return true;
        } else {
            return false;
        }
    }
    const seletion_page = document.querySelector('.select_page_list') as HTMLUListElement;

    for (const li of seletion_page.children) {
        // first element child is button
        if (!li) {
            throw Error('empty list');
        }

        if (!isArrowButton(li as HTMLElement)) {
            if (!li.firstElementChild) {
                throw Error('no first element child');
            }

            const li_page = (li.firstElementChild as HTMLElement).dataset.page as string;

            if (parseInt(li_page) === currentPage) {
                li.firstElementChild.classList.add('active');
            }
        }
    }
}