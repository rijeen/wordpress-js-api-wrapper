var WPJSApiHTTP = function(url, args, method, reqOpts) {
    var promise = new Promise(function (resolve, reject) {
        var client = new XMLHttpRequest();
        var uri = url;

        var formData = new FormData();
        if (method == 'POST') {

            uri += '?_envelope=1';

            if (args) {
                for (var key in args) {
                    if (args.hasOwnProperty(key)) {
                        formData.append(key, args[key]);
                    }
                }
            }

        } else if (args) {

            if (reqOpts.softFail === true) {
                if (args) {
                    args._envelope = 1;
                } else {
                    args = {
                        _envelope: 1
                    }
                }
            }

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
        if (reqOpts.beforeSend) {
            client = reqOpts.beforeSend(client);
        }
        client.send(formData);
        client.onload = function () {
            if (this.status >= 200 && this.status < 300) {

                var rsp = this.response;
                if (reqOpts.onSuccess) {
                    rsp = reqOpts.onSuccess(rsp);
                }
                resolve(JSON.parse(rsp));

            } else {

                if (reqOpts.onFail) {
                    reqOpts.onFail(this.statusText);
                }
                reject(this.statusText);

            }
        };
        client.onerror = function () {

            if (reqOpts.onFail) {
                reqOpts.onFail(this.statusText);
            }
            reject(this.statusText);

        };
    });
    return promise;
}

var WPJSApiEndpoint = {
    create: function(domain, endpoint, version) {

        if (typeof version !== 'string') {
            version = 'v2';
        }

        return {
            domain: domain,
            endpoint: endpoint,
            version: version,
            listURL: function(args) { return [WPJSApi.base_url, WPJSApi.reqOpts.prefix, domain + '/' + version, endpoint].join('/') },
            getURL: function(id, args) { return [WPJSApi.base_url, WPJSApi.reqOpts.prefix, domain + '/' + version, endpoint, id, args].join('/') },
            'list': function(args) { return WPJSApi.call(domain, endpoint, args, 'GET', version) },
            'get': function(id, args) { return  WPJSApi.call(domain, [endpoint, id.toString()].join('/'), args, 'GET', version) },
            'post': function(args) { return WPJSApi.call(domain, endpoint, args, 'POST', version) }
        };
    }
}

var WPJSApi = {
    init: function (url, reqOpts) {
        this.base_url = url;
        this.reqOpts = {
            prefix: 'wp-json',
            softFail: false,
            beforeSend: null,
            onSuccess: null,
            onFail: null
        };

        if (reqOpts) {
            if (reqOpts.prefix)     { this.reqOpts.prefix = reqOpts.prefix; }
            if (reqOpts.softFail)   { this.reqOpts.softFail = reqOpts.softFail; }
            if (reqOpts.onSuccess)  { this.reqOpts.onSuccess = reqOpts.onSuccess; }
            if (reqOpts.onFail)     { this.reqOpts.onFail = reqOpts.onFail; }
            if (reqOpts.beforeSend) { this.reqOpts.beforeSend = reqOpts.beforeSend; }
        }
    },
    call: function (domain, endpoint, args, method, version) {
        if (typeof this.base_url !== 'string') {
            console.log('WPJSApi: No base url provided, please setup module with WPJSApi.init before usage.')
            return;
        }
        if (typeof method !== 'string') {
            method = 'GET';
        }
        var url = [this.base_url, this.reqOpts.prefix, domain + '/' + version, endpoint].join('/');
        return WPJSApiHTTP(url, args, method, this.reqOpts);
    },
    create: WPJSApiEndpoint.create
}



//Add Endpoints
WPJSApi.Pages       = WPJSApiEndpoint.create('wp', 'pages', 'v2');
WPJSApi.Posts       = WPJSApiEndpoint.create('wp', 'posts', 'v2');
WPJSApi.Media       = WPJSApiEndpoint.create('wp', 'media', 'v2');
WPJSApi.Types       = WPJSApiEndpoint.create('wp', 'types', 'v2');
WPJSApi.Statuses    = WPJSApiEndpoint.create('wp', 'statuses', 'v2');
WPJSApi.Comments    = WPJSApiEndpoint.create('wp', 'comments', 'v2');
WPJSApi.Taxonomies  = WPJSApiEndpoint.create('wp', 'taxonomies', 'v2');
WPJSApi.Categories  = WPJSApiEndpoint.create('wp', 'categories', 'v2');
WPJSApi.Tags        = WPJSApiEndpoint.create('wp', 'tags', 'v2');
WPJSApi.Users       = WPJSApiEndpoint.create('wp', 'users', 'v2');

module.exports = WPJSApi;
