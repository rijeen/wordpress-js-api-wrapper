# Wordpress JS API Wrapper
A very simple promise-based javascript wrapper for the Wordpress REST API v2.
It was created to help the developer focus on getting data from the API and functionality, instead of having to read up on the url scheme for each endpoint when working.

## 1.7.0
- Added urlbuilder and append options.

## v1.4.0
- Using method "POST" now properly use FormData.

## v1.3.1
- softFail now properly uses _envelope-flag, see: https://developer.wordpress.org/rest-api/using-the-rest-api/global-parameters/#_envelope thus changing the response format.

## v1.3
- Added post() method. Available on all endpoints like .post({ args.. }). Useful for creating custom endpoints that handles input.
- Better configuration capabilities
- Default prefix now easily set with requestOption.prefix
- Global onSuccess and onFail callbacks has been added
- New option "softFail" has been added. When softFail is set to true all requests will be resolved in the promise-object, meaning you have to take care of statuscodes inside your own callbacks.
- Ability to add version, e.g. "v2", to custom endpoints. It keeps "v2" as default fallback incase no third parameter is supplied.


## How to use
Installation with npm
```
npm install wordpress-js-api-wrapper
```

```javascript
import WPJSApi from 'wordpress-js-api-wrapper';

//Init the wrapper with the base url for your wordpress-installation.
WPJSApi.init('http://www.example.com');

//List all pages
WPJSApi.Pages.list().then(function(rsp) {
    console.log(rsp);
}).catch(function(error) {
    console.log('something went wrong', error);
});

//All "list" methods accepts an argument-object
let args = { per_page: 10, page: 3 };
WPJSApi.Pages.list(args);

//All "get" methods accepts an id (integer)
WPJSApi.Pages.get(3);

//Both type of methods returns a Promise-object, on which you can use then / catch for callbacks.
WPJSApi.Posts.list({ per_page: 10 }).then(onSuccess, onError);
```
### Use with your own ajax function with getURL and listURL

```javascript
WPJSApi.init('http://www.example.com');

//jQuery
// Get all pages
$.get(WPJSApi.Pages.listURL(), function(rsp) {
    console.log(rsp);
})

// Get a single media
$.get(WPJSApi.Media.getURL(3), function(rsp) {
    console.log(rsp);
});
```

### post()
The post() method uses the same url as  list() and works the same with the argument object. The difference is that post() uses HTTP-POST instead of GET.
It always use softFail = true no matter global setting. So take care of those statuscodes!

```javascript
WPJSApi.init('http://www.example.com');

//Insert a post
WPJSApi.Pages.post({ args... }).then(function(rsp) {
    if (rsp.code) {
        console.log('We most likely occured an error code from the API: ', rsp.code);
    } else {
        console.log(rsp);
    }
});
```

## Documentation

### Methods
Following methods are available for all endpoints:

| Method | Parameters | Response | ... |
| ------ | ----------------- | -------- |-------- |
| list(args)  | args object | Array of objects | |
| get(id, args)     | id int, args array | Object | Pass extra parameters using the args array, will be appended to end of url-string. |
| listURL(args)     | args object | String (url) | |
| getURL(id, args)  | id int, args array | String (url) | Pass extra parameters using the args array, will be appended to end of url-string.|
| post(args)  | args object | Object | Using HTTP-POST instead of GET. When using .post() we resolve all responses from the API, meaning you have to take care of status in your then-callback. Only throws errors on network-problems. Pass extra parameters using the args array. |

### Options
Passed as default global parameters to WPJSApi.init.

| Parameter | Default | ... |
| ------ | -------- |  -------- |
| prefix | 'wp-json' | Set a custom prefix  |
| appendParams | false | If set to true, append url parameters to the end of the uri. Eg test1=1 will become /myurl/test1  |
| appendURL | null | A callback triggered to make custom request uri, has to return a string. urlBuilder(this.base_url, domain, endpoint)  |
| urlbuilder | null | Append string to the end of the url. Eg .json will become /myurl.json  |
| softFail | false | If set to true all requests will be resolved in the promise-object, meaning you have to take care of statuscodes inside your own callbacks.  |
| beforeSend | null | Used to modify the XMLHTTPRequest object, must return the same request object |
| onSuccess  | null | A callback triggered everytime on a successful response, onSuccess(response) |
| onFail  | null | A callback triggered everytime there is a failed request / response, onFail(reason) |

## beforeSend: Modifying XMLHTTPRequest
Its possible to modify the built in XMLHTTPRequest by passing a second argument to init-method.
It accepts an object with the field "beforeSend".

Adding a HTTP Basic Authentication:
```javascript
WPJSApi.init('http://myurlhere.com', {
    beforeSend: (req) => {
        //Lets modify the request object and return it.
        req.withCredentials = "true",
        req.setRequestHeader("Authorization", "Basic " + btoa("user:pass"));
        return req;
    }
});
```

## prefix: Changing the default prefix (Added v1.3)
Its possible to change the default "wp-json" prefix within Wordpress. If you've done this you have to change the default prefix in this module.
```javascript
//I have a custom prefix for my API
WPJSApi.init('http://myurlhere.com', {
    prefix: 'my-own-prefix'
});

console.log(WPJSApi.Pages.listURL()); // http://myurlhere.com/my-own-prefix/wp/v2/pages
```

## onSuccess and onFail: global callbacks (Added v1.3)
```javascript
//Do something for all successful responses, and log all errors
WPJSApi.init('http://myurlhere.com', {
    onSuccess: function(rsp) {
        //I can modify rsp here if I want to.
        //Atleast we need to return a rsp object.
        AlertTheApp('new data incoming');
        return rsp;
    },
    onFail: function(reason) {
        myTriggerFunction(reason, new Date().now())
    }
});
```

## softFail (v1.3)
The option softFail appends the _envelope-flag to the request. This changes the response format and always returning a HTTP 200 OK. See more: https://developer.wordpress.org/rest-api/using-the-rest-api/global-parameters/#_envelope
```javascript
WPJSApi.init('http://myurlhere.com', {
    softFail: true
});

//Now we better check if the request was successful
WPJSApi.Posts.list().then(function(rsp) {
    //Check the response status
    if (rsp.status == 200) {
        console.log(rsp.body);
    } else {
        //Most likely something failed, could be missing-parameter or unknown endpoint etc.
    }

}, function(reason) {
    //Now we failed completely, network problems or similar
});
```

### Custom calls and endpoints
For custom calls (plugin endpoints etc.). There's a base method:
```javascript
//Method is http method, available: GET, POST, PUT, OPTIONS
WPJSApi.call(domain, endpoint, args, method, version);

//For example with Advanced custom fields plguin
WPJSApi.call('acf', 'user', {}, 'POST', 'v2');
```

Or create a new custom endpoint:

```javascript
WPJSAPi.init('http://www.example.com');

//Third parameter "version" is optional and falls back to v2 when nothing is supplied
let MyCustomEndpoint = WPJSApi.create('domain', 'endpoint', 'v1');
MyCustomEndpoint.list([ myarg: 1 ]); //calls base on the endpoint, usually the listing

//Real life example:
//Based on plugin https://wordpress.org/plugins/wp-api-menus/

let WPJSApiMenu = WPJSApi.create('wp-api-menus', 'menus');
let WPJSApiMenuLocation = WPJSApi.create('wp-api-menus', 'menus-locations');

console.log(WPJSApiMenu.getURL(3)); // returns string: http://example.com/wp-json/wp-api-menus/v2/menus/3
```

See WP REST API v2 for full reference and response schema:
[https://developer.wordpress.org/rest-api/](https://developer.wordpress.org/rest-api/)
