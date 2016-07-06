#Wordpress JS API Wrapper
A very simple promise-based javascript wrapper for the Wordpress REST API v2.
It was created to help the developer focus on getting data from the API and functionality, instead of having to read up on the url scheme for each endpoint when working.

##How to use
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

##Documentation
| Object | Available methods | Response |
| ------ | ----------------- | -------- |
| WPJSApi.Pages | list, get, getURL, listURL   | Array, Object, string, string    |
| WPJSApi.Posts | list, get, getURL, listURL   | Array, Object, string, string    |
| WPJSApi.Media | list, get, getURL, listURL   | Array, Object, string, string    |
| WPJSApi.Types | list, get, getURL, listURL   | Array, Object, string, string    |
| WPJSApi.Statuses | list, get, getURL, listURL   | Array, Object, string, string    |
| WPJSApi.Categories | list, get, getURL, listURL   | Array, Object, string, string    |
| WPJSApi.Taxonomies | list, get, getURL, listURL   | Array, Object, string, string   |
| WPJSApi.Comments | list, get, getURL, listURL   | Array, Object, string, string    |
| WPJSApi.Tags | list, get, getURL, listURL   | Array, Object, string, string    |
| WPJSApi.Users | list, get, getURL, listURL   | Array, Object, string, string   |


### Custom calls and endpoints
For custom calls (plugin endpoints etc.). There's a base method:
```javascript
//Method is http method, available: GET, POST, PUT, OPTIONS
WPJSApi.call(domain, endpoint, args, method);

//For example with Advanced custom fields plguin
WPJSApi.call('acf', 'user', {}, 'POST');
```

Or create a new custom endpoint:

```javascript
WPJSAPi.init('http://www.example.com');

let MyCustomEndpoint = WPJSApiEndpoint.create('domain', 'endpoint');
MyCustomEndpoint.list([ myarg: 1 ]); //calls base on the endpoint, usually the listing

//Real life example:
//Based on plugin https://wordpress.org/plugins/wp-api-menus/

let WPJSApiMenu = WPJSApiEndpoint.create('wp-api-menus', 'menus');
let WPJSApiMenuLocation = WPJSApiEndpoint.create('wp-api-menus', 'menus-locations');

console.log(WPJSApiMenu.getURL(3)); // returns string: http://example.com/wp-json/wp-api-menus/v2/menus/3

```

See WP REST API v2 for full reference and response schema:
[http://v2.wp-api.org/](http://v2.wp-api.org/)