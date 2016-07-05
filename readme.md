#Wordpress JS API Wrapper
A very simple promise-based javascript wrapper for the Wordpress REST API v2.
It was created to help the developer focus on getting data from the API and funcitonality, instead of having to read up on the url scheme for each endpoint when working.

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

##Documentation
| Object | Available methods | Response |
| ------ | ----------------- | -------- |
| WPJSApi.Pages | list, get   | Array, Object    |
| WPJSApi.Posts | list, get   | Array, Object    |
| WPJSApi.Media | list, get   | Array, Object    |
| WPJSApi.Types | list, get   | Array, Object    |
| WPJSApi.Statuses | list, get   | Array, Object    |


For custom calls (plugin endpoints etc.). There's a base method:
```javascript
//Method is http method, available: GET, POST, PUT, OPTIONS
WPJSApi.call(domain, endpoint, args, method);

//For example with Advanced custom fields plguin
WPJSApi.call('acf', 'user', {}, 'POST');
```

See WP REST API v2 for full reference and response schema:
[http://v2.wp-api.org/](http://v2.wp-api.org/)