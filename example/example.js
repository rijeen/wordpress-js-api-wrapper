
//Init
WPJS.init('my_wp_url');

//Pages
WPJS.Pages.list({ page: 2, per_page: 10 })
    .then(function(rsp) {
            console.log(rsp);
        }
        .catch(function() {
            //Error
        })
    );

//Custom
WPJS.call('acf', 'options').then(function(rsp) {
    //Went good
});