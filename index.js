var WPJS = {
        init: function(url) {
            this.base_url = url;
        },
        call: function (domain, endpoint, args, method) {
            if (typeof method !== 'string') {
                method = 'GET';
            }

            var url = [this.base_url, 'wp-json', domain+'/v2', endpoint].join('/');

            var promise = new Promise(function(resolve, reject) {
                var client = new XMLHttpRequest();
                var uri = url;
                if (args && (method === 'POST' || method === 'PUT')) {
                    uri += '?';
                    var argcount = 0;
                    for (var key in args) {
                        if (args.hasOwnProperty(key)) {
                            if (argcount++) {
                                uri += '&';
                            }
                            uri += encodeURIComponent(key) + '=' + encodeURIComponent(args[key]);
                        }
                    }
                }

                client.open(method, uri);
                client.send();
                client.onload = function () {
                    if (this.status >= 200 && this.status < 300) {
                        resolve(JSON.parse(this.response));
                    } else {
                        reject(this.statusText);
                    }
                };
                client.onerror = function () {
                    reject(this.statusText);
                };
            });
            return promise;
        },
        'Pages': {
            'list': (args) => WPJS.call('wp', 'pages', args),
        'get': (id) => WPJS.call('wp', 'pages/'+id.toString())
},
'Posts': {
    'list': (args) => WPJS.call('wp', 'posts', args),
        'get': (id) => WPJS.call('wp', 'posts'+id.toString())
}
}
module.exports = WPJS;


