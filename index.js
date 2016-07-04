var WPJS = {
    base_url,
    init: function(url) {
        this.base_url = url;
    },
    call: function (domain, endpoint, args, method) {
        if (method === null) {
            method = 'GET';
        }
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

            client.open(method, [this.base_url, domain, 'wp-json', endpoint].join('/'));
            client.send();
            client.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(this.response);
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
        'list': (args) => this.call('wp', 'pages', args),
        'get': (id) => this.call('wp', 'pages', args)
    },
    'Posts': {
        'list': (args) => this.call('wp', 'posts', args),
        'get': (id) => this.call('wp', 'posts', args)
    }
}
module.exports = WPJS;


