var WPJSApiHTTP = function(url, args, method, reqOpts) {
    var promise = new Promise(function (resolve, reject) {
        var client = new XMLHttpRequest();
        var uri = url;
        if (args) {
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
        if (reqOpts && reqOpts.beforeSend) {
            client = reqOpts.beforeSend(client);
        }
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
}

var WPJSApiEndpoint = {
    create: function(domain, endpoint) {
        return {
            domain: domain,
            endpoint: endpoint,
            listURL: function(args) { return [WPJSApi.base_url, 'wp-json', domain + '/v2', endpoint].join('/') },
            getURL: function(id, args) { return [WPJSApi.base_url, 'wp-json', domain + '/v2', endpoint, id, args].join('/') },
            'list': function(args) { return WPJSApi.call(domain, endpoint, args) },
            'get': function(id, args) { return  WPJSApi.call(domain, [endpoint, id.toString(), args].join('/')) }
        };
    }
}

var WPJSApi = {
    init: function (url, reqOpts) {
        this.base_url = url;
        this.reqOpts = reqOpts;
    },
    call: function (domain, endpoint, args, method) {
        if (typeof this.base_url !== 'string') {
            console.log('WPJSApi: No base url provided, please use WPJSAPI.init prior to calling this method.')
            return;
        }
        if (typeof method !== 'string') {
            method = 'GET';
        }
        var url = [this.base_url, 'wp-json', domain + '/v2', endpoint].join('/');
        return WPJSApiHTTP(url, args, method, this.reqOpts);
    },
    create: WPJSApiEndpoint.create
}



//Add Endpoints
WPJSApi.Pages       = WPJSApiEndpoint.create('wp', 'pages');
WPJSApi.Posts       = WPJSApiEndpoint.create('wp', 'posts');
WPJSApi.Media       = WPJSApiEndpoint.create('wp', 'media');
WPJSApi.Types       = WPJSApiEndpoint.create('wp', 'types');
WPJSApi.Statuses    = WPJSApiEndpoint.create('wp', 'statuses');
WPJSApi.Comments    = WPJSApiEndpoint.create('wp', 'comments');
WPJSApi.Taxonomies  = WPJSApiEndpoint.create('wp', 'taxonomies');
WPJSApi.Categories  = WPJSApiEndpoint.create('wp', 'categories');
WPJSApi.Tags        = WPJSApiEndpoint.create('wp', 'tags');
WPJSApi.Users       = WPJSApiEndpoint.create('wp', 'users');

module.exports = WPJSApi;
