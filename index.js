"use strict";

const WPJSApiHTTP = {
    call: function(url, args, method) {
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
}

const WPJSApi = {
    init: function (url) {
        this.base_url = url;
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
        return WPJSApiHTTP.call(url, args, method);
    }
}

WPJSApi.Pages = {
    'list': (args) => WPJSApi.call('wp', 'pages', args),
    'get': (id) => WPJSApi.call('wp', 'pages/' + id.toString())
}
WPJSApi.Posts = {
    'list': (args) => WPJSApi.call('wp', 'posts', args),
    'get': (id) => WPJSApi.call('wp', 'posts/' + id.toString())
}
WPJSApi.Media = {
    'list': (args) => WPJSApi.call('wp', 'media', args),
    'get': (id) => WPJSApi.call('wp', 'media/' + id.toString())
}
WPJSApi.Types = {
    'list': (args) => WPJSApi.call('wp', 'types', args),
    'get': (id) => WPJSApi.call('wp', 'types/' + id.toString())
}
WPJSApi.Statuses = {
    'list': (args) => WPJSApi.call('wp', 'statuses', args),
    'get': (id) => WPJSApi.call('wp', 'statuses/' + id.toString())
}

module.exports = WPJSApi;