function makeRequest() {
    const requestURL = '';

    const urlParams = new URLSearchParams();
    urlParams.append('id', '');
    urlParams.append('pw', '');

    return fetch(requestURL, {
        method: 'POST',
        body: urlParams,
        credentials: 'same-origin'
    }).then(res => res.json()).catch(console.log);
}