function success(rsp) {
    console.log('Success');
}

function error(error) {
    console.log('Error', error);
}

WPJSApi.init('http://hansogreta.acc.linkin.se./wp');

//Pages
WPJSApi.Pages.get(10).then(success, error);
WPJSApi.Pages.list().then(success, error);

//Posts
WPJSApi.Posts.list({ 
    per_page: 2 
}).then(success, error);;