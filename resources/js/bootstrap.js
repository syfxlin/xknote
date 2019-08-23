window._ = require("lodash");

/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

window.axios = require("axios");

window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

/**
 * Next we will register the CSRF Token as a common header with Axios so that
 * all outgoing HTTP requests automatically have it attached. This is just
 * a simple convenience so we don't have to attach every token manually.
 */

window.$getCookie = function(name) {
  var arr,
    reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
  if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
  else return null;
};

window.$clearCookie = function(name) {
  window.$setCookie(name, '', -1);
};

window.$setCookie = function(name, value, seconds) {
  seconds = seconds || 0;
  var expires = '';
  if (seconds != 0) {
    var date = new Date();
    date.setTime(date.getTime() + seconds * 1000);
    expires = '; expires=' + date.toGMTString();
  }
  document.cookie = name + '=' + escape(value) + expires + '; path=/';
};

let token = document.head.querySelector('meta[name="csrf-token"]');
let apiToken = window.$getCookie("api_token");

if (token) {
    window.axios.defaults.headers.common["X-CSRF-TOKEN"] = token.content;
} else {
    console.error(
        "CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token"
    );
}
if (apiToken) {
    window.axios.defaults.headers.common["Authorization"] =
        "Bearer " + apiToken;
} else {
    console.error("API token not fond");
}

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

// import Echo from 'laravel-echo'

// window.Pusher = require('pusher-js');

// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: process.env.MIX_PUSHER_APP_KEY,
//     cluster: process.env.MIX_PUSHER_APP_CLUSTER,
//     encrypted: true
// });
