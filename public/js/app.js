(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["/js/app"],{

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");
var btoa = (typeof window !== 'undefined' && window.btoa && window.btoa.bind(window)) || __webpack_require__(/*! ./../helpers/btoa */ "./node_modules/axios/lib/helpers/btoa.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();
    var loadEvent = 'onreadystatechange';
    var xDomain = false;

    // For IE 8/9 CORS support
    // Only supports POST and GET calls and doesn't returns the response headers.
    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
    if ( true &&
        typeof window !== 'undefined' &&
        window.XDomainRequest && !('withCredentials' in request) &&
        !isURLSameOrigin(config.url)) {
      request = new window.XDomainRequest();
      loadEvent = 'onload';
      xDomain = true;
      request.onprogress = function handleProgress() {};
      request.ontimeout = function handleTimeout() {};
    }

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request[loadEvent] = function handleLoad() {
      if (!request || (request.readyState !== 4 && !xDomain)) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        // IE sends 1223 instead of 204 (https://github.com/axios/axios/issues/201)
        status: request.status === 1223 ? 204 : request.status,
        statusText: request.status === 1223 ? 'No Content' : request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js");

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
          cookies.read(config.xsrfCookieName) :
          undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (config.withCredentials) {
      request.withCredentials = true;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(utils.merge(defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/Cancel.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/cancel/Cancel.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var defaults = __webpack_require__(/*! ./../defaults */ "./node_modules/axios/lib/defaults.js");
var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = utils.merge({
      url: arguments[0]
    }, arguments[1]);
  }

  config = utils.merge(defaults, {method: 'get'}, this.defaults, config);
  config.method = config.method.toLowerCase();

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "./node_modules/axios/lib/core/createError.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/createError.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");
var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults.js");
var isAbsoluteURL = __webpack_require__(/*! ./../helpers/isAbsoluteURL */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
var combineURLs = __webpack_require__(/*! ./../helpers/combineURLs */ "./node_modules/axios/lib/helpers/combineURLs.js");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/core/enhanceError.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/enhanceError.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }
  error.request = request;
  error.response = response;
  return error;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/axios/lib/core/createError.js");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  // Note: status is not exposed by XDomainRequest
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/axios/lib/defaults.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/defaults.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__(/*! ./helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ./adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/axios/lib/adapters/xhr.js");
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/btoa.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/btoa.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function E() {
  this.message = 'String contains an invalid character';
}
E.prototype = new Error;
E.prototype.code = 5;
E.prototype.name = 'InvalidCharacterError';

function btoa(input) {
  var str = String(input);
  var output = '';
  for (
    // initialize result and counter
    var block, charCode, idx = 0, map = chars;
    // if the next str index does not exist:
    //   change the mapping table to "="
    //   check if d has no fractional digits
    str.charAt(idx | 0) || (map = '=', idx % 1);
    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
  ) {
    charCode = str.charCodeAt(idx += 3 / 4);
    if (charCode > 0xFF) {
      throw new E();
    }
    block = block << 8 | charCode;
  }
  return output;
}

module.exports = btoa;


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
  (function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        var cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));

        if (utils.isNumber(expires)) {
          cookie.push('expires=' + new Date(expires).toGMTString());
        }

        if (utils.isString(path)) {
          cookie.push('path=' + path);
        }

        if (utils.isString(domain)) {
          cookie.push('domain=' + domain);
        }

        if (secure === true) {
          cookie.push('secure');
        }

        document.cookie = cookie.join('; ');
      },

      read: function read(name) {
        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },

      remove: function remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    };
  })() :

  // Non standard browser env (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return {
      write: function write() {},
      read: function read() { return null; },
      remove: function remove() {}
    };
  })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    var msie = /(msie|trident)/i.test(navigator.userAgent);
    var urlParsingNode = document.createElement('a');
    var originURL;

    /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      var href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                  urlParsingNode.pathname :
                  '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var isBuffer = __webpack_require__(/*! is-buffer */ "./node_modules/is-buffer/index.js");

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim
};


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/Home.vue?vue&type=script&lang=js&":
/*!***************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/Home.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var xkeditor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! xkeditor */ "./node_modules/xkeditor/src/index.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  name: "Home",
  components: {
    "xk-editor": xkeditor__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  data: function data() {
    return {
      setting: "/static/setting.json",
      content: "/static/md_content.md"
    };
  },
  methods: {},
  mounted: function mounted() {}
});

/***/ }),

/***/ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/xkeditor/src/components/ACE_Editor.vue?vue&type=style&index=0&id=fa22aaa2&scoped=true&lang=css&":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader??ref--6-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--6-2!./node_modules/vue-loader/lib??vue-loader-options!./node_modules/xkeditor/src/components/ACE_Editor.vue?vue&type=style&index=0&id=fa22aaa2&scoped=true&lang=css& ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "\nth[data-v-fa22aaa2] {\n  text-align: left;\n}\n.help[data-v-fa22aaa2] {\n  overflow-y: auto;\n  height: 50vh;\n}\n.info[data-v-fa22aaa2] {\n  overflow-y: auto;\n}\n.info p[data-v-fa22aaa2] {\n  font-size: 0.9em;\n}\n.info *[data-v-fa22aaa2] {\n  margin: 5px;\n}\n.show[data-v-fa22aaa2] {\n  display: block;\n}\n.hide[data-v-fa22aaa2] {\n  display: none;\n}\n.ace-container[data-v-fa22aaa2] {\n  position: relative;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  height: 100%;\n}\n.ace-container .bookmarklet[data-v-fa22aaa2] {\n  position: absolute;\n  right: 0;\n  bottom: 0;\n  width: 20px;\n  height: 20px;\n  z-index: 2;\n  cursor: pointer;\n  border-width: 9px;\n  border-style: solid;\n  border-color: lightblue gray gray rgb(206, 173, 230);\n  -o-border-image: initial;\n     border-image: initial;\n}\n.ace-toolbar[data-v-fa22aaa2] {\n  background: #fff;\n}\n.ace-toolbar span[data-v-fa22aaa2] {\n  padding: 0px;\n}\n.ace-toolbar-modal .xk-input[data-v-fa22aaa2] {\n  margin-top: 5px;\n  margin-bottom: 10px;\n}\n.ace-editor[data-v-fa22aaa2] {\n  -webkit-box-flex: 1;\n      -ms-flex: 1;\n          flex: 1;\n}\n.xk-button[data-v-fa22aaa2] {\n  display: inline-block;\n  padding: 6px 16px;\n  outline: 0;\n  font-size: 0.85em;\n  line-height: 1.5;\n  text-align: center;\n  white-space: nowrap;\n  border: 1px solid #C5D9E8;\n  border-radius: 4px;\n  background-color: #FFF;\n  -webkit-transition: background 0.2s;\n  transition: background 0.2s;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  cursor: pointer;\n}\n.xk-button-primary[data-v-fa22aaa2] {\n  color: #fff;\n  background: #6190e8;\n}\n.ace-toolbar .xk-button[data-v-fa22aaa2] {\n  background: none;\n  color: #6190E8;\n  color: #3F536E;\n  border: none;\n  font-size: 1em;\n  padding: 0.6em;\n}\n.xk-input[data-v-fa22aaa2] {\n  position: relative;\n  font-size: 0.85em;\n  line-height: 1.5;\n  outline: 0;\n}\n.xk-input input[data-v-fa22aaa2] {\n  display: block;\n  width: 100%;\n  padding: 6px 32px 6px 12px;\n  color: #3F536E;\n  font-size: 12px;\n  background-color: #FFF;\n  border: 1px solid #C5D9E8;\n  border-radius: 4px;\n  -webkit-transition: border .2s;\n  transition: border .2s;\n  outline: none;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n}\n.xk-input input[data-v-fa22aaa2]:hover {\n  border-color: #79A1EB;\n}\n.xk-input i[data-v-fa22aaa2] {\n  position: absolute;\n  top: 0;\n  right: 0;\n  margin: 0 6px 0 0;\n  width: 20px;\n  height: 100%;\n  color: #C5D9E8;\n  font-size: 15px;\n  text-align: center;\n}\n.xk-radio[data-v-fa22aaa2] {\n  display: inline-block;\n  padding: 2px 5px;\n}\n.xk-radio input[data-v-fa22aaa2] {\n  display: none;\n}\n.xk-radio input + label[data-v-fa22aaa2] {\n  font-size: 1.1em;\n}\n.xk-radio input + label svg[data-v-fa22aaa2] {\n  vertical-align: middle;\n}\n.xk-radio input[type=\"radio\"] + label .advice[data-v-fa22aaa2] {\n  width: 1.1em;\n  height: 1.1em;\n  border: 1px solid #c5d9e8;\n  border-radius: 50%;\n  background-color: #fff;\n  -webkit-transition: border .2s;\n  transition: border .2s;\n  display: inline-block;\n  vertical-align: middle;\n  margin: 5px;\n}\n.xk-radio input[type=\"radio\"]:checked + label .advice[data-v-fa22aaa2] {\n  background: #79a1eb;\n}\n.xk-modal-wrapper[data-v-fa22aaa2] {\n  position: fixed;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  outline: 0;\n  z-index: 1000;\n}\n.xk-modal[data-v-fa22aaa2] {\n  position: relative;\n  top: 100px;\n  width: 520px;\n  margin: 0 auto 0 10%;\n  border: none;\n  border-radius: 4px;\n  background-color: #FFF;\n  outline: none;\n}\n.xk-modal-header[data-v-fa22aaa2] {\n  padding: 12px 16px;\n  color: #2C405A;\n  font-size: 14px;\n  font-weight: bold;\n  line-height: 1.5;\n  border-bottom: 1px solid #ECECEC;\n}\n.xk-modal-header p[data-v-fa22aaa2], .xk-modal-header .xk-modal-title[data-v-fa22aaa2] {\n  display: inline-block;\n  max-width: 100%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  word-wrap: normal;\n  vertical-align: middle;\n}\n.xk-modal-body[data-v-fa22aaa2] {\n  padding: 16px;\n  font-size: 13px;\n  line-height: 1.5;\n}\n.xk-modal-footer[data-v-fa22aaa2] {\n  padding: 12px 16px;\n  border-top: 1px solid #ECECEC;\n  text-align: right;\n}\n.xk-modal-close[data-v-fa22aaa2] {\n  position: absolute;\n  top: 16px;\n  right: 16px;\n  font-size: 13px;\n  line-height: 1;\n  overflow: hidden;\n  cursor: pointer;\n}\n.xk-row[data-v-fa22aaa2] {\n  display: block;\n  width: 100%;\n}\n.xk-col-12[data-v-fa22aaa2] {\n  width: 50%;\n  float: left;\n}\n.xk-clear[data-v-fa22aaa2] {\n  clear: both;\n}\n.img-upload-sub[data-v-fa22aaa2] {\n  padding-left: 10px;\n}\n@media (max-width: 991px) {\n.xk-modal[data-v-fa22aaa2] {\n    width: 80%;\n}\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/xkeditor/src/components/TinyMCE_Editor.vue?vue&type=style&index=0&id=37f1337a&scoped=true&lang=css&":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader??ref--6-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--6-2!./node_modules/vue-loader/lib??vue-loader-options!./node_modules/xkeditor/src/components/TinyMCE_Editor.vue?vue&type=style&index=0&id=37f1337a&scoped=true&lang=css& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "\n.tinymce[data-v-37f1337a] {\n  height: 100%;\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/xkeditor/src/components/XK_Editor.vue?vue&type=style&index=0&lang=css&":
/*!****************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader??ref--6-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--6-2!./node_modules/vue-loader/lib??vue-loader-options!./node_modules/xkeditor/src/components/XK_Editor.vue?vue&type=style&index=0&lang=css& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "\n.xkeditor {\n  height: 100%;\n    overflow-x: hidden;\n    overflow-y: hidden;\n}\n.xkeditor .row {\n  height: 100%;\n  -webkit-transform:translate(0,0);\n          transform:translate(0,0);\n}\n.xkeditor .row .xk-col-12 {\n  height: 100%;\n}\n#previewHtml {\n  overflow: auto;\n  max-height: 100%;\n  padding: 15px 15px;\n  word-break: break-word;\n  white-space: normal;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n}\n.xk-col-24 #previewHtml {\n  float: left;\n  width: 80%;\n}\n.toc,\n#toc {\n  word-break: break-word;\n  white-space: normal;\n  overflow-y: auto;\n  height: 100%;\n}\n.toc ul,\n#toc ul {\n  margin: 0px;\n  padding-left: 20px;\n}\n.toc li,\n#toc li {\n  list-style: none;\n  padding-left: 5px;\n}\n.toc li img,\n#toc li img {\n  display: inline-block;\n  width: 14px;\n  vertical-align: middle;\n  padding-right: 5px;\n}\n.toc a,\n#toc a {\n  color: #0366d6;\n  text-decoration: none;\n  font-size: 1.05em;\n}\n.row {\n  margin: 0px;\n}\n.row .xk-col-12 {\n  float: left;\n  border-left: 1px solid #ddd;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n}\n.xk-col-24 {\n  padding: 0px;\n  width: 100%;\n  height: 100%;\n}\n.xk-col-12 {\n  padding: 0px;\n  width: 50%;\n  height: 100%;\n}\n.close-preview-full {\n  position: fixed;\n  right: 20px;\n  top: 20px;\n  z-index: 1000;\n}\n#toc {\n  position: fixed;\n  top: 0px;\n  right: 0px;\n  width: 20%;\n  background: #f5f5f5;\n  border-left: 1px solid #ddd;\n  z-index: 999;\n  padding: 20px;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n}\n#toc-button {\n  position: fixed;\n  right: 20px;\n  bottom: 20px;\n  width: 20px;\n  height: 20px;\n  padding: 6px;\n  z-index: 1000;\n  -webkit-box-sizing: content-box;\n          box-sizing: content-box;\n}\n.xk-button {\n  display: inline-block;\n  padding: 6px 16px;\n  outline: 0;\n  font-size: 0.85em;\n  line-height: 1.5;\n  text-align: center;\n  white-space: nowrap;\n  border: 1px solid #C5D9E8;\n  border-radius: 4px;\n  background-color: #FFF;\n  -webkit-transition: background 0.2s;\n  transition: background 0.2s;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  cursor: pointer;\n}\n@media (max-width: 991px) {\n.xk-col-24 #previewHtml {\n    float: left;\n    width: 100%;\n}\n#toc {\n    width: 80%;\n}\n}\n\n/* 可以设置不同的进入和离开动画 */\n/* 设置持续时间和动画函数 */\n.slide-fade-enter-active {\n  -webkit-transition: all .3s ease;\n  transition: all .3s ease;\n}\n.slide-fade-leave-active {\n  -webkit-transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);\n  transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);\n}\n.slide-fade-enter, .slide-fade-leave-to\n/* .slide-fade-leave-active for below version 2.1.8 */ {\n  -webkit-transform: translateX(10px);\n          transform: translateX(10px);\n  opacity: 0;\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/Home.vue?vue&type=style&index=0&lang=css&":
/*!**********************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader??ref--6-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--6-2!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/Home.vue?vue&type=style&index=0&lang=css& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "\nbody {\n  background-color: #fff;\n  color: #3f536e;\n  line-height: 1.5;\n  font-family: -apple-system, BlinkMacSystemFont, \"Helvetica Neue\", Helvetica,\n    \"PingFang SC\", \"Hiragino Sans GB\", \"Microsoft YaHei\", \"\\5FAE\\8F6F\\96C5\\9ED1\",\n    Arial, sans-serif;\n  font-size: 14px;\n  -webkit-font-smoothing: antialiased;\n}\nhtml,\nbody {\n  width: 100%;\n  height: 100%;\n}\nbody {\n  margin: 0;\n}\np {\n  margin: 0;\n}\n/* 滚动槽 */\n::-webkit-scrollbar {\n  width: 6px;\n  height: 6px;\n}\n::-webkit-scrollbar-track {\n  border-radius: 3px;\n  background: rgba(0, 0, 0, 0.06);\n  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.08);\n}\n/* 滚动条滑块 */\n::-webkit-scrollbar-thumb {\n  border-radius: 3px;\n  background: rgba(0, 0, 0, 0.12);\n  -webkit-box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);\n}\n#app {\n  width: 100%;\n  height: 100%;\n}\n.home {\n  height: 100%;\n}\n#xknote-menu {\n  height: 65px;\n  margin: 0px;\n}\n#xknote-menu .xknote-menu-inner {\n  -webkit-transform: translateY(-50%);\n          transform: translateY(-50%);\n  top: 50%;\n  position: relative;\n}\n#xknote-editor {\n  height: calc(100% - 65px);\n  border: 1px solid #ddd;\n  padding: 0px;\n}\n.dropdown-menu {\n    background: #fff !important;\n}\n.xknote-new {\n  margin-top: 5px;\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/lib/css-base.js":
/*!*************************************************!*\
  !*** ./node_modules/css-loader/lib/css-base.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),

/***/ "./node_modules/is-buffer/index.js":
/*!*****************************************!*\
  !*** ./node_modules/is-buffer/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}


/***/ }),

/***/ "./node_modules/marked/lib/marked.js":
/*!*******************************************!*\
  !*** ./node_modules/marked/lib/marked.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * marked - a markdown parser
 * Copyright (c) 2011-2018, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/markedjs/marked
 */

;(function(root) {
'use strict';

/**
 * Block-Level Grammar
 */

var block = {
  newline: /^\n+/,
  code: /^( {4}[^\n]+\n*)+/,
  fences: noop,
  hr: /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/,
  heading: /^ *(#{1,6}) *([^\n]+?) *(?:#+ *)?(?:\n+|$)/,
  nptable: noop,
  blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
  list: /^( {0,3})(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
  html: '^ {0,3}(?:' // optional indentation
    + '<(script|pre|style)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)' // (1)
    + '|comment[^\\n]*(\\n+|$)' // (2)
    + '|<\\?[\\s\\S]*?\\?>\\n*' // (3)
    + '|<![A-Z][\\s\\S]*?>\\n*' // (4)
    + '|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>\\n*' // (5)
    + '|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:\\n{2,}|$)' // (6)
    + '|<(?!script|pre|style)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$)' // (7) open tag
    + '|</(?!script|pre|style)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$)' // (7) closing tag
    + ')',
  def: /^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/,
  table: noop,
  lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
  paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading| {0,3}>|<\/?(?:tag)(?: +|\n|\/?>)|<(?:script|pre|style|!--))[^\n]+)*)/,
  text: /^[^\n]+/
};

block._label = /(?!\s*\])(?:\\[\[\]]|[^\[\]])+/;
block._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;
block.def = edit(block.def)
  .replace('label', block._label)
  .replace('title', block._title)
  .getRegex();

block.bullet = /(?:[*+-]|\d{1,9}\.)/;
block.item = /^( *)(bull) ?[^\n]*(?:\n(?!\1bull ?)[^\n]*)*/;
block.item = edit(block.item, 'gm')
  .replace(/bull/g, block.bullet)
  .getRegex();

block.list = edit(block.list)
  .replace(/bull/g, block.bullet)
  .replace('hr', '\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))')
  .replace('def', '\\n+(?=' + block.def.source + ')')
  .getRegex();

block._tag = 'address|article|aside|base|basefont|blockquote|body|caption'
  + '|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption'
  + '|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe'
  + '|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option'
  + '|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr'
  + '|track|ul';
block._comment = /<!--(?!-?>)[\s\S]*?-->/;
block.html = edit(block.html, 'i')
  .replace('comment', block._comment)
  .replace('tag', block._tag)
  .replace('attribute', / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/)
  .getRegex();

block.paragraph = edit(block.paragraph)
  .replace('hr', block.hr)
  .replace('heading', block.heading)
  .replace('lheading', block.lheading)
  .replace('tag', block._tag) // pars can be interrupted by type (6) html blocks
  .getRegex();

block.blockquote = edit(block.blockquote)
  .replace('paragraph', block.paragraph)
  .getRegex();

/**
 * Normal Block Grammar
 */

block.normal = merge({}, block);

/**
 * GFM Block Grammar
 */

block.gfm = merge({}, block.normal, {
  fences: /^ {0,3}(`{3,}|~{3,})([^`\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?:\n+|$)|$)/,
  paragraph: /^/,
  heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/
});

block.gfm.paragraph = edit(block.paragraph)
  .replace('(?!', '(?!'
    + block.gfm.fences.source.replace('\\1', '\\2') + '|'
    + block.list.source.replace('\\1', '\\3') + '|')
  .getRegex();

/**
 * GFM + Tables Block Grammar
 */

block.tables = merge({}, block.gfm, {
  nptable: /^ *([^|\n ].*\|.*)\n *([-:]+ *\|[-| :]*)(?:\n((?:.*[^>\n ].*(?:\n|$))*)\n*|$)/,
  table: /^ *\|(.+)\n *\|?( *[-:]+[-| :]*)(?:\n((?: *[^>\n ].*(?:\n|$))*)\n*|$)/
});

/**
 * Pedantic grammar
 */

block.pedantic = merge({}, block.normal, {
  html: edit(
    '^ *(?:comment *(?:\\n|\\s*$)'
    + '|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)' // closed tag
    + '|<tag(?:"[^"]*"|\'[^\']*\'|\\s[^\'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))')
    .replace('comment', block._comment)
    .replace(/tag/g, '(?!(?:'
      + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub'
      + '|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)'
      + '\\b)\\w+(?!:|[^\\w\\s@]*@)\\b')
    .getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/
});

/**
 * Block Lexer
 */

function Lexer(options) {
  this.tokens = [];
  this.tokens.links = Object.create(null);
  this.options = options || marked.defaults;
  this.rules = block.normal;

  if (this.options.pedantic) {
    this.rules = block.pedantic;
  } else if (this.options.gfm) {
    if (this.options.tables) {
      this.rules = block.tables;
    } else {
      this.rules = block.gfm;
    }
  }
}

/**
 * Expose Block Rules
 */

Lexer.rules = block;

/**
 * Static Lex Method
 */

Lexer.lex = function(src, options) {
  var lexer = new Lexer(options);
  return lexer.lex(src);
};

/**
 * Preprocessing
 */

Lexer.prototype.lex = function(src) {
  src = src
    .replace(/\r\n|\r/g, '\n')
    .replace(/\t/g, '    ')
    .replace(/\u00a0/g, ' ')
    .replace(/\u2424/g, '\n');

  return this.token(src, true);
};

/**
 * Lexing
 */

Lexer.prototype.token = function(src, top) {
  src = src.replace(/^ +$/gm, '');
  var next,
      loose,
      cap,
      bull,
      b,
      item,
      listStart,
      listItems,
      t,
      space,
      i,
      tag,
      l,
      isordered,
      istask,
      ischecked;

  while (src) {
    // newline
    if (cap = this.rules.newline.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[0].length > 1) {
        this.tokens.push({
          type: 'space'
        });
      }
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      cap = cap[0].replace(/^ {4}/gm, '');
      this.tokens.push({
        type: 'code',
        text: !this.options.pedantic
          ? rtrim(cap, '\n')
          : cap
      });
      continue;
    }

    // fences (gfm)
    if (cap = this.rules.fences.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'code',
        lang: cap[2] ? cap[2].trim() : cap[2],
        text: cap[3] || ''
      });
      continue;
    }

    // heading
    if (cap = this.rules.heading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[1].length,
        text: cap[2]
      });
      continue;
    }

    // table no leading pipe (gfm)
    if (cap = this.rules.nptable.exec(src)) {
      item = {
        type: 'table',
        header: splitCells(cap[1].replace(/^ *| *\| *$/g, '')),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3] ? cap[3].replace(/\n$/, '').split('\n') : []
      };

      if (item.header.length === item.align.length) {
        src = src.substring(cap[0].length);

        for (i = 0; i < item.align.length; i++) {
          if (/^ *-+: *$/.test(item.align[i])) {
            item.align[i] = 'right';
          } else if (/^ *:-+: *$/.test(item.align[i])) {
            item.align[i] = 'center';
          } else if (/^ *:-+ *$/.test(item.align[i])) {
            item.align[i] = 'left';
          } else {
            item.align[i] = null;
          }
        }

        for (i = 0; i < item.cells.length; i++) {
          item.cells[i] = splitCells(item.cells[i], item.header.length);
        }

        this.tokens.push(item);

        continue;
      }
    }

    // hr
    if (cap = this.rules.hr.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'hr'
      });
      continue;
    }

    // blockquote
    if (cap = this.rules.blockquote.exec(src)) {
      src = src.substring(cap[0].length);

      this.tokens.push({
        type: 'blockquote_start'
      });

      cap = cap[0].replace(/^ *> ?/gm, '');

      // Pass `top` to keep the current
      // "toplevel" state. This is exactly
      // how markdown.pl works.
      this.token(cap, top);

      this.tokens.push({
        type: 'blockquote_end'
      });

      continue;
    }

    // list
    if (cap = this.rules.list.exec(src)) {
      src = src.substring(cap[0].length);
      bull = cap[2];
      isordered = bull.length > 1;

      listStart = {
        type: 'list_start',
        ordered: isordered,
        start: isordered ? +bull : '',
        loose: false
      };

      this.tokens.push(listStart);

      // Get each top-level item.
      cap = cap[0].match(this.rules.item);

      listItems = [];
      next = false;
      l = cap.length;
      i = 0;

      for (; i < l; i++) {
        item = cap[i];

        // Remove the list item's bullet
        // so it is seen as the next token.
        space = item.length;
        item = item.replace(/^ *([*+-]|\d+\.) */, '');

        // Outdent whatever the
        // list item contains. Hacky.
        if (~item.indexOf('\n ')) {
          space -= item.length;
          item = !this.options.pedantic
            ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
            : item.replace(/^ {1,4}/gm, '');
        }

        // Determine whether the next list item belongs here.
        // Backpedal if it does not belong in this list.
        if (i !== l - 1) {
          b = block.bullet.exec(cap[i + 1])[0];
          if (bull.length > 1 ? b.length === 1
            : (b.length > 1 || (this.options.smartLists && b !== bull))) {
            src = cap.slice(i + 1).join('\n') + src;
            i = l - 1;
          }
        }

        // Determine whether item is loose or not.
        // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
        // for discount behavior.
        loose = next || /\n\n(?!\s*$)/.test(item);
        if (i !== l - 1) {
          next = item.charAt(item.length - 1) === '\n';
          if (!loose) loose = next;
        }

        if (loose) {
          listStart.loose = true;
        }

        // Check for task list items
        istask = /^\[[ xX]\] /.test(item);
        ischecked = undefined;
        if (istask) {
          ischecked = item[1] !== ' ';
          item = item.replace(/^\[[ xX]\] +/, '');
        }

        t = {
          type: 'list_item_start',
          task: istask,
          checked: ischecked,
          loose: loose
        };

        listItems.push(t);
        this.tokens.push(t);

        // Recurse.
        this.token(item, false);

        this.tokens.push({
          type: 'list_item_end'
        });
      }

      if (listStart.loose) {
        l = listItems.length;
        i = 0;
        for (; i < l; i++) {
          listItems[i].loose = true;
        }
      }

      this.tokens.push({
        type: 'list_end'
      });

      continue;
    }

    // html
    if (cap = this.rules.html.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: this.options.sanitize
          ? 'paragraph'
          : 'html',
        pre: !this.options.sanitizer
          && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
        text: cap[0]
      });
      continue;
    }

    // def
    if (top && (cap = this.rules.def.exec(src))) {
      src = src.substring(cap[0].length);
      if (cap[3]) cap[3] = cap[3].substring(1, cap[3].length - 1);
      tag = cap[1].toLowerCase().replace(/\s+/g, ' ');
      if (!this.tokens.links[tag]) {
        this.tokens.links[tag] = {
          href: cap[2],
          title: cap[3]
        };
      }
      continue;
    }

    // table (gfm)
    if (cap = this.rules.table.exec(src)) {
      item = {
        type: 'table',
        header: splitCells(cap[1].replace(/^ *| *\| *$/g, '')),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3] ? cap[3].replace(/\n$/, '').split('\n') : []
      };

      if (item.header.length === item.align.length) {
        src = src.substring(cap[0].length);

        for (i = 0; i < item.align.length; i++) {
          if (/^ *-+: *$/.test(item.align[i])) {
            item.align[i] = 'right';
          } else if (/^ *:-+: *$/.test(item.align[i])) {
            item.align[i] = 'center';
          } else if (/^ *:-+ *$/.test(item.align[i])) {
            item.align[i] = 'left';
          } else {
            item.align[i] = null;
          }
        }

        for (i = 0; i < item.cells.length; i++) {
          item.cells[i] = splitCells(
            item.cells[i].replace(/^ *\| *| *\| *$/g, ''),
            item.header.length);
        }

        this.tokens.push(item);

        continue;
      }
    }

    // lheading
    if (cap = this.rules.lheading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[2] === '=' ? 1 : 2,
        text: cap[1]
      });
      continue;
    }

    // top-level paragraph
    if (top && (cap = this.rules.paragraph.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'paragraph',
        text: cap[1].charAt(cap[1].length - 1) === '\n'
          ? cap[1].slice(0, -1)
          : cap[1]
      });
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      // Top-level should never reach here.
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'text',
        text: cap[0]
      });
      continue;
    }

    if (src) {
      throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return this.tokens;
};

/**
 * Inline-Level Grammar
 */

var inline = {
  escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
  autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
  url: noop,
  tag: '^comment'
    + '|^</[a-zA-Z][\\w:-]*\\s*>' // self-closing tag
    + '|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>' // open tag
    + '|^<\\?[\\s\\S]*?\\?>' // processing instruction, e.g. <?php ?>
    + '|^<![a-zA-Z]+\\s[\\s\\S]*?>' // declaration, e.g. <!DOCTYPE html>
    + '|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>', // CDATA section
  link: /^!?\[(label)\]\(href(?:\s+(title))?\s*\)/,
  reflink: /^!?\[(label)\]\[(?!\s*\])((?:\\[\[\]]?|[^\[\]\\])+)\]/,
  nolink: /^!?\[(?!\s*\])((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\](?:\[\])?/,
  strong: /^__([^\s_])__(?!_)|^\*\*([^\s*])\*\*(?!\*)|^__([^\s][\s\S]*?[^\s])__(?!_)|^\*\*([^\s][\s\S]*?[^\s])\*\*(?!\*)/,
  em: /^_([^\s_])_(?!_)|^\*([^\s*"<\[])\*(?!\*)|^_([^\s][\s\S]*?[^\s_])_(?!_|[^\spunctuation])|^_([^\s_][\s\S]*?[^\s])_(?!_|[^\spunctuation])|^\*([^\s"<\[][\s\S]*?[^\s*])\*(?!\*)|^\*([^\s*"<\[][\s\S]*?[^\s])\*(?!\*)/,
  code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
  br: /^( {2,}|\\)\n(?!\s*$)/,
  del: noop,
  text: /^(`+|[^`])(?:[\s\S]*?(?:(?=[\\<!\[`*]|\b_|$)|[^ ](?= {2,}\n))|(?= {2,}\n))/
};

// list of punctuation marks from common mark spec
// without ` and ] to workaround Rule 17 (inline code blocks/links)
inline._punctuation = '!"#$%&\'()*+,\\-./:;<=>?@\\[^_{|}~';
inline.em = edit(inline.em).replace(/punctuation/g, inline._punctuation).getRegex();

inline._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g;

inline._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
inline._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;
inline.autolink = edit(inline.autolink)
  .replace('scheme', inline._scheme)
  .replace('email', inline._email)
  .getRegex();

inline._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/;

inline.tag = edit(inline.tag)
  .replace('comment', block._comment)
  .replace('attribute', inline._attribute)
  .getRegex();

inline._label = /(?:\[[^\[\]]*\]|\\[\[\]]?|`[^`]*`|`(?!`)|[^\[\]\\`])*?/;
inline._href = /\s*(<(?:\\[<>]?|[^\s<>\\])*>|[^\s\x00-\x1f]*)/;
inline._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;

inline.link = edit(inline.link)
  .replace('label', inline._label)
  .replace('href', inline._href)
  .replace('title', inline._title)
  .getRegex();

inline.reflink = edit(inline.reflink)
  .replace('label', inline._label)
  .getRegex();

/**
 * Normal Inline Grammar
 */

inline.normal = merge({}, inline);

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = merge({}, inline.normal, {
  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/,
  link: edit(/^!?\[(label)\]\((.*?)\)/)
    .replace('label', inline._label)
    .getRegex(),
  reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/)
    .replace('label', inline._label)
    .getRegex()
});

/**
 * GFM Inline Grammar
 */

inline.gfm = merge({}, inline.normal, {
  escape: edit(inline.escape).replace('])', '~|])').getRegex(),
  _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
  url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
  _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
  del: /^~+(?=\S)([\s\S]*?\S)~+/,
  text: /^(`+|[^`])(?:[\s\S]*?(?:(?=[\\<!\[`*~]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))|(?= {2,}\n|[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))/
});

inline.gfm.url = edit(inline.gfm.url, 'i')
  .replace('email', inline.gfm._extended_email)
  .getRegex();
/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = merge({}, inline.gfm, {
  br: edit(inline.br).replace('{2,}', '*').getRegex(),
  text: edit(inline.gfm.text).replace(/\{2,\}/g, '*').getRegex()
});

/**
 * Inline Lexer & Compiler
 */

function InlineLexer(links, options) {
  this.options = options || marked.defaults;
  this.links = links;
  this.rules = inline.normal;
  this.renderer = this.options.renderer || new Renderer();
  this.renderer.options = this.options;

  if (!this.links) {
    throw new Error('Tokens array requires a `links` property.');
  }

  if (this.options.pedantic) {
    this.rules = inline.pedantic;
  } else if (this.options.gfm) {
    if (this.options.breaks) {
      this.rules = inline.breaks;
    } else {
      this.rules = inline.gfm;
    }
  }
}

/**
 * Expose Inline Rules
 */

InlineLexer.rules = inline;

/**
 * Static Lexing/Compiling Method
 */

InlineLexer.output = function(src, links, options) {
  var inline = new InlineLexer(links, options);
  return inline.output(src);
};

/**
 * Lexing/Compiling
 */

InlineLexer.prototype.output = function(src) {
  var out = '',
      link,
      text,
      href,
      title,
      cap,
      prevCapZero;

  while (src) {
    // escape
    if (cap = this.rules.escape.exec(src)) {
      src = src.substring(cap[0].length);
      out += escape(cap[1]);
      continue;
    }

    // tag
    if (cap = this.rules.tag.exec(src)) {
      if (!this.inLink && /^<a /i.test(cap[0])) {
        this.inLink = true;
      } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
        this.inLink = false;
      }
      if (!this.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
        this.inRawBlock = true;
      } else if (this.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
        this.inRawBlock = false;
      }

      src = src.substring(cap[0].length);
      out += this.options.sanitize
        ? this.options.sanitizer
          ? this.options.sanitizer(cap[0])
          : escape(cap[0])
        : cap[0];
      continue;
    }

    // link
    if (cap = this.rules.link.exec(src)) {
      var lastParenIndex = findClosingBracket(cap[2], '()');
      if (lastParenIndex > -1) {
        var linkLen = cap[0].length - (cap[2].length - lastParenIndex) - (cap[3] || '').length;
        cap[2] = cap[2].substring(0, lastParenIndex);
        cap[0] = cap[0].substring(0, linkLen).trim();
        cap[3] = '';
      }
      src = src.substring(cap[0].length);
      this.inLink = true;
      href = cap[2];
      if (this.options.pedantic) {
        link = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(href);

        if (link) {
          href = link[1];
          title = link[3];
        } else {
          title = '';
        }
      } else {
        title = cap[3] ? cap[3].slice(1, -1) : '';
      }
      href = href.trim().replace(/^<([\s\S]*)>$/, '$1');
      out += this.outputLink(cap, {
        href: InlineLexer.escapes(href),
        title: InlineLexer.escapes(title)
      });
      this.inLink = false;
      continue;
    }

    // reflink, nolink
    if ((cap = this.rules.reflink.exec(src))
        || (cap = this.rules.nolink.exec(src))) {
      src = src.substring(cap[0].length);
      link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
      link = this.links[link.toLowerCase()];
      if (!link || !link.href) {
        out += cap[0].charAt(0);
        src = cap[0].substring(1) + src;
        continue;
      }
      this.inLink = true;
      out += this.outputLink(cap, link);
      this.inLink = false;
      continue;
    }

    // strong
    if (cap = this.rules.strong.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.strong(this.output(cap[4] || cap[3] || cap[2] || cap[1]));
      continue;
    }

    // em
    if (cap = this.rules.em.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.em(this.output(cap[6] || cap[5] || cap[4] || cap[3] || cap[2] || cap[1]));
      continue;
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.codespan(escape(cap[2].trim(), true));
      continue;
    }

    // br
    if (cap = this.rules.br.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.br();
      continue;
    }

    // del (gfm)
    if (cap = this.rules.del.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.del(this.output(cap[1]));
      continue;
    }

    // autolink
    if (cap = this.rules.autolink.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[2] === '@') {
        text = escape(this.mangle(cap[1]));
        href = 'mailto:' + text;
      } else {
        text = escape(cap[1]);
        href = text;
      }
      out += this.renderer.link(href, null, text);
      continue;
    }

    // url (gfm)
    if (!this.inLink && (cap = this.rules.url.exec(src))) {
      if (cap[2] === '@') {
        text = escape(cap[0]);
        href = 'mailto:' + text;
      } else {
        // do extended autolink path validation
        do {
          prevCapZero = cap[0];
          cap[0] = this.rules._backpedal.exec(cap[0])[0];
        } while (prevCapZero !== cap[0]);
        text = escape(cap[0]);
        if (cap[1] === 'www.') {
          href = 'http://' + text;
        } else {
          href = text;
        }
      }
      src = src.substring(cap[0].length);
      out += this.renderer.link(href, null, text);
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      src = src.substring(cap[0].length);
      if (this.inRawBlock) {
        out += this.renderer.text(cap[0]);
      } else {
        out += this.renderer.text(escape(this.smartypants(cap[0])));
      }
      continue;
    }

    if (src) {
      throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return out;
};

InlineLexer.escapes = function(text) {
  return text ? text.replace(InlineLexer.rules._escapes, '$1') : text;
};

/**
 * Compile Link
 */

InlineLexer.prototype.outputLink = function(cap, link) {
  var href = link.href,
      title = link.title ? escape(link.title) : null;

  return cap[0].charAt(0) !== '!'
    ? this.renderer.link(href, title, this.output(cap[1]))
    : this.renderer.image(href, title, escape(cap[1]));
};

/**
 * Smartypants Transformations
 */

InlineLexer.prototype.smartypants = function(text) {
  if (!this.options.smartypants) return text;
  return text
    // em-dashes
    .replace(/---/g, '\u2014')
    // en-dashes
    .replace(/--/g, '\u2013')
    // opening singles
    .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
    // closing singles & apostrophes
    .replace(/'/g, '\u2019')
    // opening doubles
    .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
    // closing doubles
    .replace(/"/g, '\u201d')
    // ellipses
    .replace(/\.{3}/g, '\u2026');
};

/**
 * Mangle Links
 */

InlineLexer.prototype.mangle = function(text) {
  if (!this.options.mangle) return text;
  var out = '',
      l = text.length,
      i = 0,
      ch;

  for (; i < l; i++) {
    ch = text.charCodeAt(i);
    if (Math.random() > 0.5) {
      ch = 'x' + ch.toString(16);
    }
    out += '&#' + ch + ';';
  }

  return out;
};

/**
 * Renderer
 */

function Renderer(options) {
  this.options = options || marked.defaults;
}

Renderer.prototype.code = function(code, infostring, escaped) {
  var lang = (infostring || '').match(/\S*/)[0];
  if (this.options.highlight) {
    var out = this.options.highlight(code, lang);
    if (out != null && out !== code) {
      escaped = true;
      code = out;
    }
  }

  if (!lang) {
    return '<pre><code>'
      + (escaped ? code : escape(code, true))
      + '</code></pre>';
  }

  return '<pre><code class="'
    + this.options.langPrefix
    + escape(lang, true)
    + '">'
    + (escaped ? code : escape(code, true))
    + '</code></pre>\n';
};

Renderer.prototype.blockquote = function(quote) {
  return '<blockquote>\n' + quote + '</blockquote>\n';
};

Renderer.prototype.html = function(html) {
  return html;
};

Renderer.prototype.heading = function(text, level, raw, slugger) {
  if (this.options.headerIds) {
    return '<h'
      + level
      + ' id="'
      + this.options.headerPrefix
      + slugger.slug(raw)
      + '">'
      + text
      + '</h'
      + level
      + '>\n';
  }
  // ignore IDs
  return '<h' + level + '>' + text + '</h' + level + '>\n';
};

Renderer.prototype.hr = function() {
  return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
};

Renderer.prototype.list = function(body, ordered, start) {
  var type = ordered ? 'ol' : 'ul',
      startatt = (ordered && start !== 1) ? (' start="' + start + '"') : '';
  return '<' + type + startatt + '>\n' + body + '</' + type + '>\n';
};

Renderer.prototype.listitem = function(text) {
  return '<li>' + text + '</li>\n';
};

Renderer.prototype.checkbox = function(checked) {
  return '<input '
    + (checked ? 'checked="" ' : '')
    + 'disabled="" type="checkbox"'
    + (this.options.xhtml ? ' /' : '')
    + '> ';
};

Renderer.prototype.paragraph = function(text) {
  return '<p>' + text + '</p>\n';
};

Renderer.prototype.table = function(header, body) {
  if (body) body = '<tbody>' + body + '</tbody>';

  return '<table>\n'
    + '<thead>\n'
    + header
    + '</thead>\n'
    + body
    + '</table>\n';
};

Renderer.prototype.tablerow = function(content) {
  return '<tr>\n' + content + '</tr>\n';
};

Renderer.prototype.tablecell = function(content, flags) {
  var type = flags.header ? 'th' : 'td';
  var tag = flags.align
    ? '<' + type + ' align="' + flags.align + '">'
    : '<' + type + '>';
  return tag + content + '</' + type + '>\n';
};

// span level renderer
Renderer.prototype.strong = function(text) {
  return '<strong>' + text + '</strong>';
};

Renderer.prototype.em = function(text) {
  return '<em>' + text + '</em>';
};

Renderer.prototype.codespan = function(text) {
  return '<code>' + text + '</code>';
};

Renderer.prototype.br = function() {
  return this.options.xhtml ? '<br/>' : '<br>';
};

Renderer.prototype.del = function(text) {
  return '<del>' + text + '</del>';
};

Renderer.prototype.link = function(href, title, text) {
  href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
  if (href === null) {
    return text;
  }
  var out = '<a href="' + escape(href) + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += '>' + text + '</a>';
  return out;
};

Renderer.prototype.image = function(href, title, text) {
  href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
  if (href === null) {
    return text;
  }

  var out = '<img src="' + href + '" alt="' + text + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += this.options.xhtml ? '/>' : '>';
  return out;
};

Renderer.prototype.text = function(text) {
  return text;
};

/**
 * TextRenderer
 * returns only the textual part of the token
 */

function TextRenderer() {}

// no need for block level renderers

TextRenderer.prototype.strong =
TextRenderer.prototype.em =
TextRenderer.prototype.codespan =
TextRenderer.prototype.del =
TextRenderer.prototype.text = function (text) {
  return text;
};

TextRenderer.prototype.link =
TextRenderer.prototype.image = function(href, title, text) {
  return '' + text;
};

TextRenderer.prototype.br = function() {
  return '';
};

/**
 * Parsing & Compiling
 */

function Parser(options) {
  this.tokens = [];
  this.token = null;
  this.options = options || marked.defaults;
  this.options.renderer = this.options.renderer || new Renderer();
  this.renderer = this.options.renderer;
  this.renderer.options = this.options;
  this.slugger = new Slugger();
}

/**
 * Static Parse Method
 */

Parser.parse = function(src, options) {
  var parser = new Parser(options);
  return parser.parse(src);
};

/**
 * Parse Loop
 */

Parser.prototype.parse = function(src) {
  this.inline = new InlineLexer(src.links, this.options);
  // use an InlineLexer with a TextRenderer to extract pure text
  this.inlineText = new InlineLexer(
    src.links,
    merge({}, this.options, {renderer: new TextRenderer()})
  );
  this.tokens = src.reverse();

  var out = '';
  while (this.next()) {
    out += this.tok();
  }

  return out;
};

/**
 * Next Token
 */

Parser.prototype.next = function() {
  return this.token = this.tokens.pop();
};

/**
 * Preview Next Token
 */

Parser.prototype.peek = function() {
  return this.tokens[this.tokens.length - 1] || 0;
};

/**
 * Parse Text Tokens
 */

Parser.prototype.parseText = function() {
  var body = this.token.text;

  while (this.peek().type === 'text') {
    body += '\n' + this.next().text;
  }

  return this.inline.output(body);
};

/**
 * Parse Current Token
 */

Parser.prototype.tok = function() {
  switch (this.token.type) {
    case 'space': {
      return '';
    }
    case 'hr': {
      return this.renderer.hr();
    }
    case 'heading': {
      return this.renderer.heading(
        this.inline.output(this.token.text),
        this.token.depth,
        unescape(this.inlineText.output(this.token.text)),
        this.slugger);
    }
    case 'code': {
      return this.renderer.code(this.token.text,
        this.token.lang,
        this.token.escaped);
    }
    case 'table': {
      var header = '',
          body = '',
          i,
          row,
          cell,
          j;

      // header
      cell = '';
      for (i = 0; i < this.token.header.length; i++) {
        cell += this.renderer.tablecell(
          this.inline.output(this.token.header[i]),
          { header: true, align: this.token.align[i] }
        );
      }
      header += this.renderer.tablerow(cell);

      for (i = 0; i < this.token.cells.length; i++) {
        row = this.token.cells[i];

        cell = '';
        for (j = 0; j < row.length; j++) {
          cell += this.renderer.tablecell(
            this.inline.output(row[j]),
            { header: false, align: this.token.align[j] }
          );
        }

        body += this.renderer.tablerow(cell);
      }
      return this.renderer.table(header, body);
    }
    case 'blockquote_start': {
      body = '';

      while (this.next().type !== 'blockquote_end') {
        body += this.tok();
      }

      return this.renderer.blockquote(body);
    }
    case 'list_start': {
      body = '';
      var ordered = this.token.ordered,
          start = this.token.start;

      while (this.next().type !== 'list_end') {
        body += this.tok();
      }

      return this.renderer.list(body, ordered, start);
    }
    case 'list_item_start': {
      body = '';
      var loose = this.token.loose;
      var checked = this.token.checked;
      var task = this.token.task;

      if (this.token.task) {
        body += this.renderer.checkbox(checked);
      }

      while (this.next().type !== 'list_item_end') {
        body += !loose && this.token.type === 'text'
          ? this.parseText()
          : this.tok();
      }
      return this.renderer.listitem(body, task, checked);
    }
    case 'html': {
      // TODO parse inline content if parameter markdown=1
      return this.renderer.html(this.token.text);
    }
    case 'paragraph': {
      return this.renderer.paragraph(this.inline.output(this.token.text));
    }
    case 'text': {
      return this.renderer.paragraph(this.parseText());
    }
    default: {
      var errMsg = 'Token with "' + this.token.type + '" type was not found.';
      if (this.options.silent) {
        console.log(errMsg);
      } else {
        throw new Error(errMsg);
      }
    }
  }
};

/**
 * Slugger generates header id
 */

function Slugger () {
  this.seen = {};
}

/**
 * Convert string to unique id
 */

Slugger.prototype.slug = function (value) {
  var slug = value
    .toLowerCase()
    .trim()
    .replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, '')
    .replace(/\s/g, '-');

  if (this.seen.hasOwnProperty(slug)) {
    var originalSlug = slug;
    do {
      this.seen[originalSlug]++;
      slug = originalSlug + '-' + this.seen[originalSlug];
    } while (this.seen.hasOwnProperty(slug));
  }
  this.seen[slug] = 0;

  return slug;
};

/**
 * Helpers
 */

function escape(html, encode) {
  if (encode) {
    if (escape.escapeTest.test(html)) {
      return html.replace(escape.escapeReplace, function (ch) { return escape.replacements[ch]; });
    }
  } else {
    if (escape.escapeTestNoEncode.test(html)) {
      return html.replace(escape.escapeReplaceNoEncode, function (ch) { return escape.replacements[ch]; });
    }
  }

  return html;
}

escape.escapeTest = /[&<>"']/;
escape.escapeReplace = /[&<>"']/g;
escape.replacements = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

escape.escapeTestNoEncode = /[<>"']|&(?!#?\w+;)/;
escape.escapeReplaceNoEncode = /[<>"']|&(?!#?\w+;)/g;

function unescape(html) {
  // explicitly match decimal, hex, and named HTML entities
  return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, function(_, n) {
    n = n.toLowerCase();
    if (n === 'colon') return ':';
    if (n.charAt(0) === '#') {
      return n.charAt(1) === 'x'
        ? String.fromCharCode(parseInt(n.substring(2), 16))
        : String.fromCharCode(+n.substring(1));
    }
    return '';
  });
}

function edit(regex, opt) {
  regex = regex.source || regex;
  opt = opt || '';
  return {
    replace: function(name, val) {
      val = val.source || val;
      val = val.replace(/(^|[^\[])\^/g, '$1');
      regex = regex.replace(name, val);
      return this;
    },
    getRegex: function() {
      return new RegExp(regex, opt);
    }
  };
}

function cleanUrl(sanitize, base, href) {
  if (sanitize) {
    try {
      var prot = decodeURIComponent(unescape(href))
        .replace(/[^\w:]/g, '')
        .toLowerCase();
    } catch (e) {
      return null;
    }
    if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
      return null;
    }
  }
  if (base && !originIndependentUrl.test(href)) {
    href = resolveUrl(base, href);
  }
  try {
    href = encodeURI(href).replace(/%25/g, '%');
  } catch (e) {
    return null;
  }
  return href;
}

function resolveUrl(base, href) {
  if (!baseUrls[' ' + base]) {
    // we can ignore everything in base after the last slash of its path component,
    // but we might need to add _that_
    // https://tools.ietf.org/html/rfc3986#section-3
    if (/^[^:]+:\/*[^/]*$/.test(base)) {
      baseUrls[' ' + base] = base + '/';
    } else {
      baseUrls[' ' + base] = rtrim(base, '/', true);
    }
  }
  base = baseUrls[' ' + base];

  if (href.slice(0, 2) === '//') {
    return base.replace(/:[\s\S]*/, ':') + href;
  } else if (href.charAt(0) === '/') {
    return base.replace(/(:\/*[^/]*)[\s\S]*/, '$1') + href;
  } else {
    return base + href;
  }
}
var baseUrls = {};
var originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;

function noop() {}
noop.exec = noop;

function merge(obj) {
  var i = 1,
      target,
      key;

  for (; i < arguments.length; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }

  return obj;
}

function splitCells(tableRow, count) {
  // ensure that every cell-delimiting pipe has a space
  // before it to distinguish it from an escaped pipe
  var row = tableRow.replace(/\|/g, function (match, offset, str) {
        var escaped = false,
            curr = offset;
        while (--curr >= 0 && str[curr] === '\\') escaped = !escaped;
        if (escaped) {
          // odd number of slashes means | is escaped
          // so we leave it alone
          return '|';
        } else {
          // add space before unescaped |
          return ' |';
        }
      }),
      cells = row.split(/ \|/),
      i = 0;

  if (cells.length > count) {
    cells.splice(count);
  } else {
    while (cells.length < count) cells.push('');
  }

  for (; i < cells.length; i++) {
    // leading or trailing whitespace is ignored per the gfm spec
    cells[i] = cells[i].trim().replace(/\\\|/g, '|');
  }
  return cells;
}

// Remove trailing 'c's. Equivalent to str.replace(/c*$/, '').
// /c*$/ is vulnerable to REDOS.
// invert: Remove suffix of non-c chars instead. Default falsey.
function rtrim(str, c, invert) {
  if (str.length === 0) {
    return '';
  }

  // Length of suffix matching the invert condition.
  var suffLen = 0;

  // Step left until we fail to match the invert condition.
  while (suffLen < str.length) {
    var currChar = str.charAt(str.length - suffLen - 1);
    if (currChar === c && !invert) {
      suffLen++;
    } else if (currChar !== c && invert) {
      suffLen++;
    } else {
      break;
    }
  }

  return str.substr(0, str.length - suffLen);
}

function findClosingBracket(str, b) {
  if (str.indexOf(b[1]) === -1) {
    return -1;
  }
  var level = 0;
  for (var i = 0; i < str.length; i++) {
    if (str[i] === '\\') {
      i++;
    } else if (str[i] === b[0]) {
      level++;
    } else if (str[i] === b[1]) {
      level--;
      if (level < 0) {
        return i;
      }
    }
  }
  return -1;
}

/**
 * Marked
 */

function marked(src, opt, callback) {
  // throw error in case of non string input
  if (typeof src === 'undefined' || src === null) {
    throw new Error('marked(): input parameter is undefined or null');
  }
  if (typeof src !== 'string') {
    throw new Error('marked(): input parameter is of type '
      + Object.prototype.toString.call(src) + ', string expected');
  }

  if (callback || typeof opt === 'function') {
    if (!callback) {
      callback = opt;
      opt = null;
    }

    opt = merge({}, marked.defaults, opt || {});

    var highlight = opt.highlight,
        tokens,
        pending,
        i = 0;

    try {
      tokens = Lexer.lex(src, opt);
    } catch (e) {
      return callback(e);
    }

    pending = tokens.length;

    var done = function(err) {
      if (err) {
        opt.highlight = highlight;
        return callback(err);
      }

      var out;

      try {
        out = Parser.parse(tokens, opt);
      } catch (e) {
        err = e;
      }

      opt.highlight = highlight;

      return err
        ? callback(err)
        : callback(null, out);
    };

    if (!highlight || highlight.length < 3) {
      return done();
    }

    delete opt.highlight;

    if (!pending) return done();

    for (; i < tokens.length; i++) {
      (function(token) {
        if (token.type !== 'code') {
          return --pending || done();
        }
        return highlight(token.text, token.lang, function(err, code) {
          if (err) return done(err);
          if (code == null || code === token.text) {
            return --pending || done();
          }
          token.text = code;
          token.escaped = true;
          --pending || done();
        });
      })(tokens[i]);
    }

    return;
  }
  try {
    if (opt) opt = merge({}, marked.defaults, opt);
    return Parser.parse(Lexer.lex(src, opt), opt);
  } catch (e) {
    e.message += '\nPlease report this to https://github.com/markedjs/marked.';
    if ((opt || marked.defaults).silent) {
      return '<p>An error occurred:</p><pre>'
        + escape(e.message + '', true)
        + '</pre>';
    }
    throw e;
  }
}

/**
 * Options
 */

marked.options =
marked.setOptions = function(opt) {
  merge(marked.defaults, opt);
  return marked;
};

marked.getDefaults = function () {
  return {
    baseUrl: null,
    breaks: false,
    gfm: true,
    headerIds: true,
    headerPrefix: '',
    highlight: null,
    langPrefix: 'language-',
    mangle: true,
    pedantic: false,
    renderer: new Renderer(),
    sanitize: false,
    sanitizer: null,
    silent: false,
    smartLists: false,
    smartypants: false,
    tables: true,
    xhtml: false
  };
};

marked.defaults = marked.getDefaults();

/**
 * Expose
 */

marked.Parser = Parser;
marked.parser = Parser.parse;

marked.Renderer = Renderer;
marked.TextRenderer = TextRenderer;

marked.Lexer = Lexer;
marked.lexer = Lexer.lex;

marked.InlineLexer = InlineLexer;
marked.inlineLexer = InlineLexer.output;

marked.Slugger = Slugger;

marked.parse = marked;

if (true) {
  module.exports = marked;
} else {}
})(this || (typeof window !== 'undefined' ? window : global));

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/qs/lib/formats.js":
/*!****************************************!*\
  !*** ./node_modules/qs/lib/formats.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var replace = String.prototype.replace;
var percentTwenties = /%20/g;

module.exports = {
    'default': 'RFC3986',
    formatters: {
        RFC1738: function (value) {
            return replace.call(value, percentTwenties, '+');
        },
        RFC3986: function (value) {
            return value;
        }
    },
    RFC1738: 'RFC1738',
    RFC3986: 'RFC3986'
};


/***/ }),

/***/ "./node_modules/qs/lib/index.js":
/*!**************************************!*\
  !*** ./node_modules/qs/lib/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var stringify = __webpack_require__(/*! ./stringify */ "./node_modules/qs/lib/stringify.js");
var parse = __webpack_require__(/*! ./parse */ "./node_modules/qs/lib/parse.js");
var formats = __webpack_require__(/*! ./formats */ "./node_modules/qs/lib/formats.js");

module.exports = {
    formats: formats,
    parse: parse,
    stringify: stringify
};


/***/ }),

/***/ "./node_modules/qs/lib/parse.js":
/*!**************************************!*\
  !*** ./node_modules/qs/lib/parse.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/qs/lib/utils.js");

var has = Object.prototype.hasOwnProperty;

var defaults = {
    allowDots: false,
    allowPrototypes: false,
    arrayLimit: 20,
    charset: 'utf-8',
    charsetSentinel: false,
    comma: false,
    decoder: utils.decode,
    delimiter: '&',
    depth: 5,
    ignoreQueryPrefix: false,
    interpretNumericEntities: false,
    parameterLimit: 1000,
    parseArrays: true,
    plainObjects: false,
    strictNullHandling: false
};

var interpretNumericEntities = function (str) {
    return str.replace(/&#(\d+);/g, function ($0, numberStr) {
        return String.fromCharCode(parseInt(numberStr, 10));
    });
};

// This is what browsers will submit when the ✓ character occurs in an
// application/x-www-form-urlencoded body and the encoding of the page containing
// the form is iso-8859-1, or when the submitted form has an accept-charset
// attribute of iso-8859-1. Presumably also with other charsets that do not contain
// the ✓ character, such as us-ascii.
var isoSentinel = 'utf8=%26%2310003%3B'; // encodeURIComponent('&#10003;')

// These are the percent-encoded utf-8 octets representing a checkmark, indicating that the request actually is utf-8 encoded.
var charsetSentinel = 'utf8=%E2%9C%93'; // encodeURIComponent('✓')

var parseValues = function parseQueryStringValues(str, options) {
    var obj = {};
    var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, '') : str;
    var limit = options.parameterLimit === Infinity ? undefined : options.parameterLimit;
    var parts = cleanStr.split(options.delimiter, limit);
    var skipIndex = -1; // Keep track of where the utf8 sentinel was found
    var i;

    var charset = options.charset;
    if (options.charsetSentinel) {
        for (i = 0; i < parts.length; ++i) {
            if (parts[i].indexOf('utf8=') === 0) {
                if (parts[i] === charsetSentinel) {
                    charset = 'utf-8';
                } else if (parts[i] === isoSentinel) {
                    charset = 'iso-8859-1';
                }
                skipIndex = i;
                i = parts.length; // The eslint settings do not allow break;
            }
        }
    }

    for (i = 0; i < parts.length; ++i) {
        if (i === skipIndex) {
            continue;
        }
        var part = parts[i];

        var bracketEqualsPos = part.indexOf(']=');
        var pos = bracketEqualsPos === -1 ? part.indexOf('=') : bracketEqualsPos + 1;

        var key, val;
        if (pos === -1) {
            key = options.decoder(part, defaults.decoder, charset);
            val = options.strictNullHandling ? null : '';
        } else {
            key = options.decoder(part.slice(0, pos), defaults.decoder, charset);
            val = options.decoder(part.slice(pos + 1), defaults.decoder, charset);
        }

        if (val && options.interpretNumericEntities && charset === 'iso-8859-1') {
            val = interpretNumericEntities(val);
        }

        if (val && options.comma && val.indexOf(',') > -1) {
            val = val.split(',');
        }

        if (has.call(obj, key)) {
            obj[key] = utils.combine(obj[key], val);
        } else {
            obj[key] = val;
        }
    }

    return obj;
};

var parseObject = function (chain, val, options) {
    var leaf = val;

    for (var i = chain.length - 1; i >= 0; --i) {
        var obj;
        var root = chain[i];

        if (root === '[]' && options.parseArrays) {
            obj = [].concat(leaf);
        } else {
            obj = options.plainObjects ? Object.create(null) : {};
            var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
            var index = parseInt(cleanRoot, 10);
            if (!options.parseArrays && cleanRoot === '') {
                obj = { 0: leaf };
            } else if (
                !isNaN(index)
                && root !== cleanRoot
                && String(index) === cleanRoot
                && index >= 0
                && (options.parseArrays && index <= options.arrayLimit)
            ) {
                obj = [];
                obj[index] = leaf;
            } else {
                obj[cleanRoot] = leaf;
            }
        }

        leaf = obj;
    }

    return leaf;
};

var parseKeys = function parseQueryStringKeys(givenKey, val, options) {
    if (!givenKey) {
        return;
    }

    // Transform dot notation to bracket notation
    var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey;

    // The regex chunks

    var brackets = /(\[[^[\]]*])/;
    var child = /(\[[^[\]]*])/g;

    // Get the parent

    var segment = brackets.exec(key);
    var parent = segment ? key.slice(0, segment.index) : key;

    // Stash the parent if it exists

    var keys = [];
    if (parent) {
        // If we aren't using plain objects, optionally prefix keys that would overwrite object prototype properties
        if (!options.plainObjects && has.call(Object.prototype, parent)) {
            if (!options.allowPrototypes) {
                return;
            }
        }

        keys.push(parent);
    }

    // Loop through children appending to the array until we hit depth

    var i = 0;
    while ((segment = child.exec(key)) !== null && i < options.depth) {
        i += 1;
        if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
            if (!options.allowPrototypes) {
                return;
            }
        }
        keys.push(segment[1]);
    }

    // If there's a remainder, just add whatever is left

    if (segment) {
        keys.push('[' + key.slice(segment.index) + ']');
    }

    return parseObject(keys, val, options);
};

var normalizeParseOptions = function normalizeParseOptions(opts) {
    if (!opts) {
        return defaults;
    }

    if (opts.decoder !== null && opts.decoder !== undefined && typeof opts.decoder !== 'function') {
        throw new TypeError('Decoder has to be a function.');
    }

    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
        throw new Error('The charset option must be either utf-8, iso-8859-1, or undefined');
    }
    var charset = typeof opts.charset === 'undefined' ? defaults.charset : opts.charset;

    return {
        allowDots: typeof opts.allowDots === 'undefined' ? defaults.allowDots : !!opts.allowDots,
        allowPrototypes: typeof opts.allowPrototypes === 'boolean' ? opts.allowPrototypes : defaults.allowPrototypes,
        arrayLimit: typeof opts.arrayLimit === 'number' ? opts.arrayLimit : defaults.arrayLimit,
        charset: charset,
        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
        comma: typeof opts.comma === 'boolean' ? opts.comma : defaults.comma,
        decoder: typeof opts.decoder === 'function' ? opts.decoder : defaults.decoder,
        delimiter: typeof opts.delimiter === 'string' || utils.isRegExp(opts.delimiter) ? opts.delimiter : defaults.delimiter,
        depth: typeof opts.depth === 'number' ? opts.depth : defaults.depth,
        ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
        interpretNumericEntities: typeof opts.interpretNumericEntities === 'boolean' ? opts.interpretNumericEntities : defaults.interpretNumericEntities,
        parameterLimit: typeof opts.parameterLimit === 'number' ? opts.parameterLimit : defaults.parameterLimit,
        parseArrays: opts.parseArrays !== false,
        plainObjects: typeof opts.plainObjects === 'boolean' ? opts.plainObjects : defaults.plainObjects,
        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
    };
};

module.exports = function (str, opts) {
    var options = normalizeParseOptions(opts);

    if (str === '' || str === null || typeof str === 'undefined') {
        return options.plainObjects ? Object.create(null) : {};
    }

    var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
    var obj = options.plainObjects ? Object.create(null) : {};

    // Iterate over the keys and setup the new object

    var keys = Object.keys(tempObj);
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var newObj = parseKeys(key, tempObj[key], options);
        obj = utils.merge(obj, newObj, options);
    }

    return utils.compact(obj);
};


/***/ }),

/***/ "./node_modules/qs/lib/stringify.js":
/*!******************************************!*\
  !*** ./node_modules/qs/lib/stringify.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/qs/lib/utils.js");
var formats = __webpack_require__(/*! ./formats */ "./node_modules/qs/lib/formats.js");
var has = Object.prototype.hasOwnProperty;

var arrayPrefixGenerators = {
    brackets: function brackets(prefix) { // eslint-disable-line func-name-matching
        return prefix + '[]';
    },
    comma: 'comma',
    indices: function indices(prefix, key) { // eslint-disable-line func-name-matching
        return prefix + '[' + key + ']';
    },
    repeat: function repeat(prefix) { // eslint-disable-line func-name-matching
        return prefix;
    }
};

var isArray = Array.isArray;
var push = Array.prototype.push;
var pushToArray = function (arr, valueOrArray) {
    push.apply(arr, isArray(valueOrArray) ? valueOrArray : [valueOrArray]);
};

var toISO = Date.prototype.toISOString;

var defaults = {
    addQueryPrefix: false,
    allowDots: false,
    charset: 'utf-8',
    charsetSentinel: false,
    delimiter: '&',
    encode: true,
    encoder: utils.encode,
    encodeValuesOnly: false,
    formatter: formats.formatters[formats['default']],
    // deprecated
    indices: false,
    serializeDate: function serializeDate(date) { // eslint-disable-line func-name-matching
        return toISO.call(date);
    },
    skipNulls: false,
    strictNullHandling: false
};

var stringify = function stringify( // eslint-disable-line func-name-matching
    object,
    prefix,
    generateArrayPrefix,
    strictNullHandling,
    skipNulls,
    encoder,
    filter,
    sort,
    allowDots,
    serializeDate,
    formatter,
    encodeValuesOnly,
    charset
) {
    var obj = object;
    if (typeof filter === 'function') {
        obj = filter(prefix, obj);
    } else if (obj instanceof Date) {
        obj = serializeDate(obj);
    } else if (generateArrayPrefix === 'comma' && isArray(obj)) {
        obj = obj.join(',');
    }

    if (obj === null) {
        if (strictNullHandling) {
            return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder, charset) : prefix;
        }

        obj = '';
    }

    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean' || utils.isBuffer(obj)) {
        if (encoder) {
            var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset);
            return [formatter(keyValue) + '=' + formatter(encoder(obj, defaults.encoder, charset))];
        }
        return [formatter(prefix) + '=' + formatter(String(obj))];
    }

    var values = [];

    if (typeof obj === 'undefined') {
        return values;
    }

    var objKeys;
    if (isArray(filter)) {
        objKeys = filter;
    } else {
        var keys = Object.keys(obj);
        objKeys = sort ? keys.sort(sort) : keys;
    }

    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (skipNulls && obj[key] === null) {
            continue;
        }

        if (isArray(obj)) {
            pushToArray(values, stringify(
                obj[key],
                typeof generateArrayPrefix === 'function' ? generateArrayPrefix(prefix, key) : prefix,
                generateArrayPrefix,
                strictNullHandling,
                skipNulls,
                encoder,
                filter,
                sort,
                allowDots,
                serializeDate,
                formatter,
                encodeValuesOnly,
                charset
            ));
        } else {
            pushToArray(values, stringify(
                obj[key],
                prefix + (allowDots ? '.' + key : '[' + key + ']'),
                generateArrayPrefix,
                strictNullHandling,
                skipNulls,
                encoder,
                filter,
                sort,
                allowDots,
                serializeDate,
                formatter,
                encodeValuesOnly,
                charset
            ));
        }
    }

    return values;
};

var normalizeStringifyOptions = function normalizeStringifyOptions(opts) {
    if (!opts) {
        return defaults;
    }

    if (opts.encoder !== null && opts.encoder !== undefined && typeof opts.encoder !== 'function') {
        throw new TypeError('Encoder has to be a function.');
    }

    var charset = opts.charset || defaults.charset;
    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
        throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
    }

    var format = formats['default'];
    if (typeof opts.format !== 'undefined') {
        if (!has.call(formats.formatters, opts.format)) {
            throw new TypeError('Unknown format option provided.');
        }
        format = opts.format;
    }
    var formatter = formats.formatters[format];

    var filter = defaults.filter;
    if (typeof opts.filter === 'function' || isArray(opts.filter)) {
        filter = opts.filter;
    }

    return {
        addQueryPrefix: typeof opts.addQueryPrefix === 'boolean' ? opts.addQueryPrefix : defaults.addQueryPrefix,
        allowDots: typeof opts.allowDots === 'undefined' ? defaults.allowDots : !!opts.allowDots,
        charset: charset,
        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
        delimiter: typeof opts.delimiter === 'undefined' ? defaults.delimiter : opts.delimiter,
        encode: typeof opts.encode === 'boolean' ? opts.encode : defaults.encode,
        encoder: typeof opts.encoder === 'function' ? opts.encoder : defaults.encoder,
        encodeValuesOnly: typeof opts.encodeValuesOnly === 'boolean' ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
        filter: filter,
        formatter: formatter,
        serializeDate: typeof opts.serializeDate === 'function' ? opts.serializeDate : defaults.serializeDate,
        skipNulls: typeof opts.skipNulls === 'boolean' ? opts.skipNulls : defaults.skipNulls,
        sort: typeof opts.sort === 'function' ? opts.sort : null,
        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
    };
};

module.exports = function (object, opts) {
    var obj = object;
    var options = normalizeStringifyOptions(opts);

    var objKeys;
    var filter;

    if (typeof options.filter === 'function') {
        filter = options.filter;
        obj = filter('', obj);
    } else if (isArray(options.filter)) {
        filter = options.filter;
        objKeys = filter;
    }

    var keys = [];

    if (typeof obj !== 'object' || obj === null) {
        return '';
    }

    var arrayFormat;
    if (opts && opts.arrayFormat in arrayPrefixGenerators) {
        arrayFormat = opts.arrayFormat;
    } else if (opts && 'indices' in opts) {
        arrayFormat = opts.indices ? 'indices' : 'repeat';
    } else {
        arrayFormat = 'indices';
    }

    var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];

    if (!objKeys) {
        objKeys = Object.keys(obj);
    }

    if (options.sort) {
        objKeys.sort(options.sort);
    }

    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (options.skipNulls && obj[key] === null) {
            continue;
        }
        pushToArray(keys, stringify(
            obj[key],
            key,
            generateArrayPrefix,
            options.strictNullHandling,
            options.skipNulls,
            options.encode ? options.encoder : null,
            options.filter,
            options.sort,
            options.allowDots,
            options.serializeDate,
            options.formatter,
            options.encodeValuesOnly,
            options.charset
        ));
    }

    var joined = keys.join(options.delimiter);
    var prefix = options.addQueryPrefix === true ? '?' : '';

    if (options.charsetSentinel) {
        if (options.charset === 'iso-8859-1') {
            // encodeURIComponent('&#10003;'), the "numeric entity" representation of a checkmark
            prefix += 'utf8=%26%2310003%3B&';
        } else {
            // encodeURIComponent('✓')
            prefix += 'utf8=%E2%9C%93&';
        }
    }

    return joined.length > 0 ? prefix + joined : '';
};


/***/ }),

/***/ "./node_modules/qs/lib/utils.js":
/*!**************************************!*\
  !*** ./node_modules/qs/lib/utils.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = Object.prototype.hasOwnProperty;
var isArray = Array.isArray;

var hexTable = (function () {
    var array = [];
    for (var i = 0; i < 256; ++i) {
        array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
    }

    return array;
}());

var compactQueue = function compactQueue(queue) {
    while (queue.length > 1) {
        var item = queue.pop();
        var obj = item.obj[item.prop];

        if (isArray(obj)) {
            var compacted = [];

            for (var j = 0; j < obj.length; ++j) {
                if (typeof obj[j] !== 'undefined') {
                    compacted.push(obj[j]);
                }
            }

            item.obj[item.prop] = compacted;
        }
    }
};

var arrayToObject = function arrayToObject(source, options) {
    var obj = options && options.plainObjects ? Object.create(null) : {};
    for (var i = 0; i < source.length; ++i) {
        if (typeof source[i] !== 'undefined') {
            obj[i] = source[i];
        }
    }

    return obj;
};

var merge = function merge(target, source, options) {
    if (!source) {
        return target;
    }

    if (typeof source !== 'object') {
        if (isArray(target)) {
            target.push(source);
        } else if (target && typeof target === 'object') {
            if ((options && (options.plainObjects || options.allowPrototypes)) || !has.call(Object.prototype, source)) {
                target[source] = true;
            }
        } else {
            return [target, source];
        }

        return target;
    }

    if (!target || typeof target !== 'object') {
        return [target].concat(source);
    }

    var mergeTarget = target;
    if (isArray(target) && !isArray(source)) {
        mergeTarget = arrayToObject(target, options);
    }

    if (isArray(target) && isArray(source)) {
        source.forEach(function (item, i) {
            if (has.call(target, i)) {
                var targetItem = target[i];
                if (targetItem && typeof targetItem === 'object' && item && typeof item === 'object') {
                    target[i] = merge(targetItem, item, options);
                } else {
                    target.push(item);
                }
            } else {
                target[i] = item;
            }
        });
        return target;
    }

    return Object.keys(source).reduce(function (acc, key) {
        var value = source[key];

        if (has.call(acc, key)) {
            acc[key] = merge(acc[key], value, options);
        } else {
            acc[key] = value;
        }
        return acc;
    }, mergeTarget);
};

var assign = function assignSingleSource(target, source) {
    return Object.keys(source).reduce(function (acc, key) {
        acc[key] = source[key];
        return acc;
    }, target);
};

var decode = function (str, decoder, charset) {
    var strWithoutPlus = str.replace(/\+/g, ' ');
    if (charset === 'iso-8859-1') {
        // unescape never throws, no try...catch needed:
        return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
    }
    // utf-8
    try {
        return decodeURIComponent(strWithoutPlus);
    } catch (e) {
        return strWithoutPlus;
    }
};

var encode = function encode(str, defaultEncoder, charset) {
    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
    // It has been adapted here for stricter adherence to RFC 3986
    if (str.length === 0) {
        return str;
    }

    var string = typeof str === 'string' ? str : String(str);

    if (charset === 'iso-8859-1') {
        return escape(string).replace(/%u[0-9a-f]{4}/gi, function ($0) {
            return '%26%23' + parseInt($0.slice(2), 16) + '%3B';
        });
    }

    var out = '';
    for (var i = 0; i < string.length; ++i) {
        var c = string.charCodeAt(i);

        if (
            c === 0x2D // -
            || c === 0x2E // .
            || c === 0x5F // _
            || c === 0x7E // ~
            || (c >= 0x30 && c <= 0x39) // 0-9
            || (c >= 0x41 && c <= 0x5A) // a-z
            || (c >= 0x61 && c <= 0x7A) // A-Z
        ) {
            out += string.charAt(i);
            continue;
        }

        if (c < 0x80) {
            out = out + hexTable[c];
            continue;
        }

        if (c < 0x800) {
            out = out + (hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        if (c < 0xD800 || c >= 0xE000) {
            out = out + (hexTable[0xE0 | (c >> 12)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        i += 1;
        c = 0x10000 + (((c & 0x3FF) << 10) | (string.charCodeAt(i) & 0x3FF));
        out += hexTable[0xF0 | (c >> 18)]
            + hexTable[0x80 | ((c >> 12) & 0x3F)]
            + hexTable[0x80 | ((c >> 6) & 0x3F)]
            + hexTable[0x80 | (c & 0x3F)];
    }

    return out;
};

var compact = function compact(value) {
    var queue = [{ obj: { o: value }, prop: 'o' }];
    var refs = [];

    for (var i = 0; i < queue.length; ++i) {
        var item = queue[i];
        var obj = item.obj[item.prop];

        var keys = Object.keys(obj);
        for (var j = 0; j < keys.length; ++j) {
            var key = keys[j];
            var val = obj[key];
            if (typeof val === 'object' && val !== null && refs.indexOf(val) === -1) {
                queue.push({ obj: obj, prop: key });
                refs.push(val);
            }
        }
    }

    compactQueue(queue);

    return value;
};

var isRegExp = function isRegExp(obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
};

var isBuffer = function isBuffer(obj) {
    if (!obj || typeof obj !== 'object') {
        return false;
    }

    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
};

var combine = function combine(a, b) {
    return [].concat(a, b);
};

module.exports = {
    arrayToObject: arrayToObject,
    assign: assign,
    combine: combine,
    compact: compact,
    decode: decode,
    encode: encode,
    isBuffer: isBuffer,
    isRegExp: isRegExp,
    merge: merge
};


/***/ }),

/***/ "./node_modules/setimmediate/setImmediate.js":
/*!***************************************************!*\
  !*** ./node_modules/setimmediate/setImmediate.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js"), __webpack_require__(/*! ./../process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/xkeditor/src/components/ACE_Editor.vue?vue&type=style&index=0&id=fa22aaa2&scoped=true&lang=css&":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader??ref--6-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--6-2!./node_modules/vue-loader/lib??vue-loader-options!./node_modules/xkeditor/src/components/ACE_Editor.vue?vue&type=style&index=0&id=fa22aaa2&scoped=true&lang=css& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../css-loader??ref--6-1!../../../vue-loader/lib/loaders/stylePostLoader.js!../../../postcss-loader/src??ref--6-2!../../../vue-loader/lib??vue-loader-options!./ACE_Editor.vue?vue&type=style&index=0&id=fa22aaa2&scoped=true&lang=css& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/xkeditor/src/components/ACE_Editor.vue?vue&type=style&index=0&id=fa22aaa2&scoped=true&lang=css&");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/xkeditor/src/components/TinyMCE_Editor.vue?vue&type=style&index=0&id=37f1337a&scoped=true&lang=css&":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader??ref--6-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--6-2!./node_modules/vue-loader/lib??vue-loader-options!./node_modules/xkeditor/src/components/TinyMCE_Editor.vue?vue&type=style&index=0&id=37f1337a&scoped=true&lang=css& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../css-loader??ref--6-1!../../../vue-loader/lib/loaders/stylePostLoader.js!../../../postcss-loader/src??ref--6-2!../../../vue-loader/lib??vue-loader-options!./TinyMCE_Editor.vue?vue&type=style&index=0&id=37f1337a&scoped=true&lang=css& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/xkeditor/src/components/TinyMCE_Editor.vue?vue&type=style&index=0&id=37f1337a&scoped=true&lang=css&");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/xkeditor/src/components/XK_Editor.vue?vue&type=style&index=0&lang=css&":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader??ref--6-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--6-2!./node_modules/vue-loader/lib??vue-loader-options!./node_modules/xkeditor/src/components/XK_Editor.vue?vue&type=style&index=0&lang=css& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../css-loader??ref--6-1!../../../vue-loader/lib/loaders/stylePostLoader.js!../../../postcss-loader/src??ref--6-2!../../../vue-loader/lib??vue-loader-options!./XK_Editor.vue?vue&type=style&index=0&lang=css& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/xkeditor/src/components/XK_Editor.vue?vue&type=style&index=0&lang=css&");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/Home.vue?vue&type=style&index=0&lang=css&":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader??ref--6-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--6-2!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/Home.vue?vue&type=style&index=0&lang=css& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../node_modules/css-loader??ref--6-1!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src??ref--6-2!../../../node_modules/vue-loader/lib??vue-loader-options!./Home.vue?vue&type=style&index=0&lang=css& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/Home.vue?vue&type=style&index=0&lang=css&");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./node_modules/style-loader/lib/addStyles.js":
/*!****************************************************!*\
  !*** ./node_modules/style-loader/lib/addStyles.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getTarget = function (target, parent) {
  if (parent){
    return parent.querySelector(target);
  }
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target, parent) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target, parent);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(/*! ./urls */ "./node_modules/style-loader/lib/urls.js");

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
        if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertAt.before, target);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}

	if(options.attrs.nonce === undefined) {
		var nonce = getNonce();
		if (nonce) {
			options.attrs.nonce = nonce;
		}
	}

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function getNonce() {
	if (false) {}

	return __webpack_require__.nc;
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = typeof options.transform === 'function'
		 ? options.transform(obj.css) 
		 : options.transform.default(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),

/***/ "./node_modules/style-loader/lib/urls.js":
/*!***********************************************!*\
  !*** ./node_modules/style-loader/lib/urls.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),

/***/ "./node_modules/timers-browserify/main.js":
/*!************************************************!*\
  !*** ./node_modules/timers-browserify/main.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var scope = (typeof global !== "undefined" && global) ||
            (typeof self !== "undefined" && self) ||
            window;
var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, scope, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, scope, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(scope, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(/*! setimmediate */ "./node_modules/setimmediate/setImmediate.js");
// On some exotic environments, it's not clear which object `setimmediate` was
// able to install onto.  Search each possibility in the same order as the
// `setimmediate` library.
exports.setImmediate = (typeof self !== "undefined" && self.setImmediate) ||
                       (typeof global !== "undefined" && global.setImmediate) ||
                       (this && this.setImmediate);
exports.clearImmediate = (typeof self !== "undefined" && self.clearImmediate) ||
                         (typeof global !== "undefined" && global.clearImmediate) ||
                         (this && this.clearImmediate);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/turndown-plugin-gfm/lib/turndown-plugin-gfm.es.js":
/*!************************************************************************!*\
  !*** ./node_modules/turndown-plugin-gfm/lib/turndown-plugin-gfm.es.js ***!
  \************************************************************************/
/*! exports provided: gfm, highlightedCodeBlock, strikethrough, tables, taskListItems */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "gfm", function() { return gfm; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "highlightedCodeBlock", function() { return highlightedCodeBlock; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "strikethrough", function() { return strikethrough; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tables", function() { return tables; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "taskListItems", function() { return taskListItems; });
var highlightRegExp = /highlight-(?:text|source)-([a-z0-9]+)/;

function highlightedCodeBlock (turndownService) {
  turndownService.addRule('highlightedCodeBlock', {
    filter: function (node) {
      var firstChild = node.firstChild;
      return (
        node.nodeName === 'DIV' &&
        highlightRegExp.test(node.className) &&
        firstChild &&
        firstChild.nodeName === 'PRE'
      )
    },
    replacement: function (content, node, options) {
      var className = node.className || '';
      var language = (className.match(highlightRegExp) || [null, ''])[1];

      return (
        '\n\n' + options.fence + language + '\n' +
        node.firstChild.textContent +
        '\n' + options.fence + '\n\n'
      )
    }
  });
}

function strikethrough (turndownService) {
  turndownService.addRule('strikethrough', {
    filter: ['del', 's', 'strike'],
    replacement: function (content) {
      return '~' + content + '~'
    }
  });
}

var indexOf = Array.prototype.indexOf;
var every = Array.prototype.every;
var rules = {};

rules.tableCell = {
  filter: ['th', 'td'],
  replacement: function (content, node) {
    return cell(content, node)
  }
};

rules.tableRow = {
  filter: 'tr',
  replacement: function (content, node) {
    var borderCells = '';
    var alignMap = { left: ':--', right: '--:', center: ':-:' };

    if (isHeadingRow(node)) {
      for (var i = 0; i < node.childNodes.length; i++) {
        var border = '---';
        var align = (
          node.childNodes[i].getAttribute('align') || ''
        ).toLowerCase();

        if (align) border = alignMap[align] || border;

        borderCells += cell(border, node.childNodes[i]);
      }
    }
    return '\n' + content + (borderCells ? '\n' + borderCells : '')
  }
};

rules.table = {
  // Only convert tables with a heading row.
  // Tables with no heading row are kept using `keep` (see below).
  filter: function (node) {
    return node.nodeName === 'TABLE' && isHeadingRow(node.rows[0])
  },

  replacement: function (content) {
    // Ensure there are no blank lines
    content = content.replace('\n\n', '\n');
    return '\n\n' + content + '\n\n'
  }
};

rules.tableSection = {
  filter: ['thead', 'tbody', 'tfoot'],
  replacement: function (content) {
    return content
  }
};

// A tr is a heading row if:
// - the parent is a THEAD
// - or if its the first child of the TABLE or the first TBODY (possibly
//   following a blank THEAD)
// - and every cell is a TH
function isHeadingRow (tr) {
  var parentNode = tr.parentNode;
  return (
    parentNode.nodeName === 'THEAD' ||
    (
      parentNode.firstChild === tr &&
      (parentNode.nodeName === 'TABLE' || isFirstTbody(parentNode)) &&
      every.call(tr.childNodes, function (n) { return n.nodeName === 'TH' })
    )
  )
}

function isFirstTbody (element) {
  var previousSibling = element.previousSibling;
  return (
    element.nodeName === 'TBODY' && (
      !previousSibling ||
      (
        previousSibling.nodeName === 'THEAD' &&
        /^\s*$/i.test(previousSibling.textContent)
      )
    )
  )
}

function cell (content, node) {
  var index = indexOf.call(node.parentNode.childNodes, node);
  var prefix = ' ';
  if (index === 0) prefix = '| ';
  return prefix + content + ' |'
}

function tables (turndownService) {
  turndownService.keep(function (node) {
    return node.nodeName === 'TABLE' && !isHeadingRow(node.rows[0])
  });
  for (var key in rules) turndownService.addRule(key, rules[key]);
}

function taskListItems (turndownService) {
  turndownService.addRule('taskListItems', {
    filter: function (node) {
      return node.type === 'checkbox' && node.parentNode.nodeName === 'LI'
    },
    replacement: function (content, node) {
      return (node.checked ? '[x]' : '[ ]') + ' '
    }
  });
}

function gfm (turndownService) {
  turndownService.use([
    highlightedCodeBlock,
    strikethrough,
    tables,
    taskListItems
  ]);
}




/***/ }),

/***/ "./node_modules/turndown/lib/turndown.es.js":
/*!**************************************************!*\
  !*** ./node_modules/turndown/lib/turndown.es.js ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function extend (destination) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      if (source.hasOwnProperty(key)) destination[key] = source[key];
    }
  }
  return destination
}

function repeat (character, count) {
  return Array(count + 1).join(character)
}

var blockElements = [
  'address', 'article', 'aside', 'audio', 'blockquote', 'body', 'canvas',
  'center', 'dd', 'dir', 'div', 'dl', 'dt', 'fieldset', 'figcaption',
  'figure', 'footer', 'form', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'header', 'hgroup', 'hr', 'html', 'isindex', 'li', 'main', 'menu', 'nav',
  'noframes', 'noscript', 'ol', 'output', 'p', 'pre', 'section', 'table',
  'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'ul'
];

function isBlock (node) {
  return blockElements.indexOf(node.nodeName.toLowerCase()) !== -1
}

var voidElements = [
  'area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input',
  'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'
];

function isVoid (node) {
  return voidElements.indexOf(node.nodeName.toLowerCase()) !== -1
}

var voidSelector = voidElements.join();
function hasVoid (node) {
  return node.querySelector && node.querySelector(voidSelector)
}

var rules = {};

rules.paragraph = {
  filter: 'p',

  replacement: function (content) {
    return '\n\n' + content + '\n\n'
  }
};

rules.lineBreak = {
  filter: 'br',

  replacement: function (content, node, options) {
    return options.br + '\n'
  }
};

rules.heading = {
  filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],

  replacement: function (content, node, options) {
    var hLevel = Number(node.nodeName.charAt(1));

    if (options.headingStyle === 'setext' && hLevel < 3) {
      var underline = repeat((hLevel === 1 ? '=' : '-'), content.length);
      return (
        '\n\n' + content + '\n' + underline + '\n\n'
      )
    } else {
      return '\n\n' + repeat('#', hLevel) + ' ' + content + '\n\n'
    }
  }
};

rules.blockquote = {
  filter: 'blockquote',

  replacement: function (content) {
    content = content.replace(/^\n+|\n+$/g, '');
    content = content.replace(/^/gm, '> ');
    return '\n\n' + content + '\n\n'
  }
};

rules.list = {
  filter: ['ul', 'ol'],

  replacement: function (content, node) {
    var parent = node.parentNode;
    if (parent.nodeName === 'LI' && parent.lastElementChild === node) {
      return '\n' + content
    } else {
      return '\n\n' + content + '\n\n'
    }
  }
};

rules.listItem = {
  filter: 'li',

  replacement: function (content, node, options) {
    content = content
      .replace(/^\n+/, '') // remove leading newlines
      .replace(/\n+$/, '\n') // replace trailing newlines with just a single one
      .replace(/\n/gm, '\n    '); // indent
    var prefix = options.bulletListMarker + '   ';
    var parent = node.parentNode;
    if (parent.nodeName === 'OL') {
      var start = parent.getAttribute('start');
      var index = Array.prototype.indexOf.call(parent.children, node);
      prefix = (start ? Number(start) + index : index + 1) + '.  ';
    }
    return (
      prefix + content + (node.nextSibling && !/\n$/.test(content) ? '\n' : '')
    )
  }
};

rules.indentedCodeBlock = {
  filter: function (node, options) {
    return (
      options.codeBlockStyle === 'indented' &&
      node.nodeName === 'PRE' &&
      node.firstChild &&
      node.firstChild.nodeName === 'CODE'
    )
  },

  replacement: function (content, node, options) {
    return (
      '\n\n    ' +
      node.firstChild.textContent.replace(/\n/g, '\n    ') +
      '\n\n'
    )
  }
};

rules.fencedCodeBlock = {
  filter: function (node, options) {
    return (
      options.codeBlockStyle === 'fenced' &&
      node.nodeName === 'PRE' &&
      node.firstChild &&
      node.firstChild.nodeName === 'CODE'
    )
  },

  replacement: function (content, node, options) {
    var className = node.firstChild.className || '';
    var language = (className.match(/language-(\S+)/) || [null, ''])[1];

    return (
      '\n\n' + options.fence + language + '\n' +
      node.firstChild.textContent +
      '\n' + options.fence + '\n\n'
    )
  }
};

rules.horizontalRule = {
  filter: 'hr',

  replacement: function (content, node, options) {
    return '\n\n' + options.hr + '\n\n'
  }
};

rules.inlineLink = {
  filter: function (node, options) {
    return (
      options.linkStyle === 'inlined' &&
      node.nodeName === 'A' &&
      node.getAttribute('href')
    )
  },

  replacement: function (content, node) {
    var href = node.getAttribute('href');
    var title = node.title ? ' "' + node.title + '"' : '';
    return '[' + content + '](' + href + title + ')'
  }
};

rules.referenceLink = {
  filter: function (node, options) {
    return (
      options.linkStyle === 'referenced' &&
      node.nodeName === 'A' &&
      node.getAttribute('href')
    )
  },

  replacement: function (content, node, options) {
    var href = node.getAttribute('href');
    var title = node.title ? ' "' + node.title + '"' : '';
    var replacement;
    var reference;

    switch (options.linkReferenceStyle) {
      case 'collapsed':
        replacement = '[' + content + '][]';
        reference = '[' + content + ']: ' + href + title;
        break
      case 'shortcut':
        replacement = '[' + content + ']';
        reference = '[' + content + ']: ' + href + title;
        break
      default:
        var id = this.references.length + 1;
        replacement = '[' + content + '][' + id + ']';
        reference = '[' + id + ']: ' + href + title;
    }

    this.references.push(reference);
    return replacement
  },

  references: [],

  append: function (options) {
    var references = '';
    if (this.references.length) {
      references = '\n\n' + this.references.join('\n') + '\n\n';
      this.references = []; // Reset references
    }
    return references
  }
};

rules.emphasis = {
  filter: ['em', 'i'],

  replacement: function (content, node, options) {
    if (!content.trim()) return ''
    return options.emDelimiter + content + options.emDelimiter
  }
};

rules.strong = {
  filter: ['strong', 'b'],

  replacement: function (content, node, options) {
    if (!content.trim()) return ''
    return options.strongDelimiter + content + options.strongDelimiter
  }
};

rules.code = {
  filter: function (node) {
    var hasSiblings = node.previousSibling || node.nextSibling;
    var isCodeBlock = node.parentNode.nodeName === 'PRE' && !hasSiblings;

    return node.nodeName === 'CODE' && !isCodeBlock
  },

  replacement: function (content) {
    if (!content.trim()) return ''

    var delimiter = '`';
    var leadingSpace = '';
    var trailingSpace = '';
    var matches = content.match(/`+/gm);
    if (matches) {
      if (/^`/.test(content)) leadingSpace = ' ';
      if (/`$/.test(content)) trailingSpace = ' ';
      while (matches.indexOf(delimiter) !== -1) delimiter = delimiter + '`';
    }

    return delimiter + leadingSpace + content + trailingSpace + delimiter
  }
};

rules.image = {
  filter: 'img',

  replacement: function (content, node) {
    var alt = node.alt || '';
    var src = node.getAttribute('src') || '';
    var title = node.title || '';
    var titlePart = title ? ' "' + title + '"' : '';
    return src ? '![' + alt + ']' + '(' + src + titlePart + ')' : ''
  }
};

/**
 * Manages a collection of rules used to convert HTML to Markdown
 */

function Rules (options) {
  this.options = options;
  this._keep = [];
  this._remove = [];

  this.blankRule = {
    replacement: options.blankReplacement
  };

  this.keepReplacement = options.keepReplacement;

  this.defaultRule = {
    replacement: options.defaultReplacement
  };

  this.array = [];
  for (var key in options.rules) this.array.push(options.rules[key]);
}

Rules.prototype = {
  add: function (key, rule) {
    this.array.unshift(rule);
  },

  keep: function (filter) {
    this._keep.unshift({
      filter: filter,
      replacement: this.keepReplacement
    });
  },

  remove: function (filter) {
    this._remove.unshift({
      filter: filter,
      replacement: function () {
        return ''
      }
    });
  },

  forNode: function (node) {
    if (node.isBlank) return this.blankRule
    var rule;

    if ((rule = findRule(this.array, node, this.options))) return rule
    if ((rule = findRule(this._keep, node, this.options))) return rule
    if ((rule = findRule(this._remove, node, this.options))) return rule

    return this.defaultRule
  },

  forEach: function (fn) {
    for (var i = 0; i < this.array.length; i++) fn(this.array[i], i);
  }
};

function findRule (rules, node, options) {
  for (var i = 0; i < rules.length; i++) {
    var rule = rules[i];
    if (filterValue(rule, node, options)) return rule
  }
  return void 0
}

function filterValue (rule, node, options) {
  var filter = rule.filter;
  if (typeof filter === 'string') {
    if (filter === node.nodeName.toLowerCase()) return true
  } else if (Array.isArray(filter)) {
    if (filter.indexOf(node.nodeName.toLowerCase()) > -1) return true
  } else if (typeof filter === 'function') {
    if (filter.call(rule, node, options)) return true
  } else {
    throw new TypeError('`filter` needs to be a string, array, or function')
  }
}

/**
 * The collapseWhitespace function is adapted from collapse-whitespace
 * by Luc Thevenard.
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Luc Thevenard <lucthevenard@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * collapseWhitespace(options) removes extraneous whitespace from an the given element.
 *
 * @param {Object} options
 */
function collapseWhitespace (options) {
  var element = options.element;
  var isBlock = options.isBlock;
  var isVoid = options.isVoid;
  var isPre = options.isPre || function (node) {
    return node.nodeName === 'PRE'
  };

  if (!element.firstChild || isPre(element)) return

  var prevText = null;
  var prevVoid = false;

  var prev = null;
  var node = next(prev, element, isPre);

  while (node !== element) {
    if (node.nodeType === 3 || node.nodeType === 4) { // Node.TEXT_NODE or Node.CDATA_SECTION_NODE
      var text = node.data.replace(/[ \r\n\t]+/g, ' ');

      if ((!prevText || / $/.test(prevText.data)) &&
          !prevVoid && text[0] === ' ') {
        text = text.substr(1);
      }

      // `text` might be empty at this point.
      if (!text) {
        node = remove(node);
        continue
      }

      node.data = text;

      prevText = node;
    } else if (node.nodeType === 1) { // Node.ELEMENT_NODE
      if (isBlock(node) || node.nodeName === 'BR') {
        if (prevText) {
          prevText.data = prevText.data.replace(/ $/, '');
        }

        prevText = null;
        prevVoid = false;
      } else if (isVoid(node)) {
        // Avoid trimming space around non-block, non-BR void elements.
        prevText = null;
        prevVoid = true;
      }
    } else {
      node = remove(node);
      continue
    }

    var nextNode = next(prev, node, isPre);
    prev = node;
    node = nextNode;
  }

  if (prevText) {
    prevText.data = prevText.data.replace(/ $/, '');
    if (!prevText.data) {
      remove(prevText);
    }
  }
}

/**
 * remove(node) removes the given node from the DOM and returns the
 * next node in the sequence.
 *
 * @param {Node} node
 * @return {Node} node
 */
function remove (node) {
  var next = node.nextSibling || node.parentNode;

  node.parentNode.removeChild(node);

  return next
}

/**
 * next(prev, current, isPre) returns the next node in the sequence, given the
 * current and previous nodes.
 *
 * @param {Node} prev
 * @param {Node} current
 * @param {Function} isPre
 * @return {Node}
 */
function next (prev, current, isPre) {
  if ((prev && prev.parentNode === current) || isPre(current)) {
    return current.nextSibling || current.parentNode
  }

  return current.firstChild || current.nextSibling || current.parentNode
}

/*
 * Set up window for Node.js
 */

var root = (typeof window !== 'undefined' ? window : {});

/*
 * Parsing HTML strings
 */

function canParseHTMLNatively () {
  var Parser = root.DOMParser;
  var canParse = false;

  // Adapted from https://gist.github.com/1129031
  // Firefox/Opera/IE throw errors on unsupported types
  try {
    // WebKit returns null on unsupported types
    if (new Parser().parseFromString('', 'text/html')) {
      canParse = true;
    }
  } catch (e) {}

  return canParse
}

function createHTMLParser () {
  var Parser = function () {};

  {
    var JSDOM = __webpack_require__(/*! jsdom */ 1).JSDOM;
    Parser.prototype.parseFromString = function (string) {
      return new JSDOM(string).window.document
    };
  }
  return Parser
}

var HTMLParser = canParseHTMLNatively() ? root.DOMParser : createHTMLParser();

function RootNode (input) {
  var root;
  if (typeof input === 'string') {
    var doc = htmlParser().parseFromString(
      // DOM parsers arrange elements in the <head> and <body>.
      // Wrapping in a custom element ensures elements are reliably arranged in
      // a single element.
      '<x-turndown id="turndown-root">' + input + '</x-turndown>',
      'text/html'
    );
    root = doc.getElementById('turndown-root');
  } else {
    root = input.cloneNode(true);
  }
  collapseWhitespace({
    element: root,
    isBlock: isBlock,
    isVoid: isVoid
  });

  return root
}

var _htmlParser;
function htmlParser () {
  _htmlParser = _htmlParser || new HTMLParser();
  return _htmlParser
}

function Node (node) {
  node.isBlock = isBlock(node);
  node.isCode = node.nodeName.toLowerCase() === 'code' || node.parentNode.isCode;
  node.isBlank = isBlank(node);
  node.flankingWhitespace = flankingWhitespace(node);
  return node
}

function isBlank (node) {
  return (
    ['A', 'TH', 'TD', 'IFRAME', 'SCRIPT', 'AUDIO', 'VIDEO'].indexOf(node.nodeName) === -1 &&
    /^\s*$/i.test(node.textContent) &&
    !isVoid(node) &&
    !hasVoid(node)
  )
}

function flankingWhitespace (node) {
  var leading = '';
  var trailing = '';

  if (!node.isBlock) {
    var hasLeading = /^[ \r\n\t]/.test(node.textContent);
    var hasTrailing = /[ \r\n\t]$/.test(node.textContent);

    if (hasLeading && !isFlankedByWhitespace('left', node)) {
      leading = ' ';
    }
    if (hasTrailing && !isFlankedByWhitespace('right', node)) {
      trailing = ' ';
    }
  }

  return { leading: leading, trailing: trailing }
}

function isFlankedByWhitespace (side, node) {
  var sibling;
  var regExp;
  var isFlanked;

  if (side === 'left') {
    sibling = node.previousSibling;
    regExp = / $/;
  } else {
    sibling = node.nextSibling;
    regExp = /^ /;
  }

  if (sibling) {
    if (sibling.nodeType === 3) {
      isFlanked = regExp.test(sibling.nodeValue);
    } else if (sibling.nodeType === 1 && !isBlock(sibling)) {
      isFlanked = regExp.test(sibling.textContent);
    }
  }
  return isFlanked
}

var reduce = Array.prototype.reduce;
var leadingNewLinesRegExp = /^\n*/;
var trailingNewLinesRegExp = /\n*$/;
var escapes = [
  [/\\/g, '\\\\'],
  [/\*/g, '\\*'],
  [/^-/g, '\\-'],
  [/^\+ /g, '\\+ '],
  [/^(=+)/g, '\\$1'],
  [/^(#{1,6}) /g, '\\$1 '],
  [/`/g, '\\`'],
  [/^~~~/g, '\\~~~'],
  [/\[/g, '\\['],
  [/\]/g, '\\]'],
  [/^>/g, '\\>'],
  [/_/g, '\\_'],
  [/^(\d+)\. /g, '$1\\. ']
];

function TurndownService (options) {
  if (!(this instanceof TurndownService)) return new TurndownService(options)

  var defaults = {
    rules: rules,
    headingStyle: 'setext',
    hr: '* * *',
    bulletListMarker: '*',
    codeBlockStyle: 'indented',
    fence: '```',
    emDelimiter: '_',
    strongDelimiter: '**',
    linkStyle: 'inlined',
    linkReferenceStyle: 'full',
    br: '  ',
    blankReplacement: function (content, node) {
      return node.isBlock ? '\n\n' : ''
    },
    keepReplacement: function (content, node) {
      return node.isBlock ? '\n\n' + node.outerHTML + '\n\n' : node.outerHTML
    },
    defaultReplacement: function (content, node) {
      return node.isBlock ? '\n\n' + content + '\n\n' : content
    }
  };
  this.options = extend({}, defaults, options);
  this.rules = new Rules(this.options);
}

TurndownService.prototype = {
  /**
   * The entry point for converting a string or DOM node to Markdown
   * @public
   * @param {String|HTMLElement} input The string or DOM node to convert
   * @returns A Markdown representation of the input
   * @type String
   */

  turndown: function (input) {
    if (!canConvert(input)) {
      throw new TypeError(
        input + ' is not a string, or an element/document/fragment node.'
      )
    }

    if (input === '') return ''

    var output = process.call(this, new RootNode(input));
    return postProcess.call(this, output)
  },

  /**
   * Add one or more plugins
   * @public
   * @param {Function|Array} plugin The plugin or array of plugins to add
   * @returns The Turndown instance for chaining
   * @type Object
   */

  use: function (plugin) {
    if (Array.isArray(plugin)) {
      for (var i = 0; i < plugin.length; i++) this.use(plugin[i]);
    } else if (typeof plugin === 'function') {
      plugin(this);
    } else {
      throw new TypeError('plugin must be a Function or an Array of Functions')
    }
    return this
  },

  /**
   * Adds a rule
   * @public
   * @param {String} key The unique key of the rule
   * @param {Object} rule The rule
   * @returns The Turndown instance for chaining
   * @type Object
   */

  addRule: function (key, rule) {
    this.rules.add(key, rule);
    return this
  },

  /**
   * Keep a node (as HTML) that matches the filter
   * @public
   * @param {String|Array|Function} filter The unique key of the rule
   * @returns The Turndown instance for chaining
   * @type Object
   */

  keep: function (filter) {
    this.rules.keep(filter);
    return this
  },

  /**
   * Remove a node that matches the filter
   * @public
   * @param {String|Array|Function} filter The unique key of the rule
   * @returns The Turndown instance for chaining
   * @type Object
   */

  remove: function (filter) {
    this.rules.remove(filter);
    return this
  },

  /**
   * Escapes Markdown syntax
   * @public
   * @param {String} string The string to escape
   * @returns A string with Markdown syntax escaped
   * @type String
   */

  escape: function (string) {
    return escapes.reduce(function (accumulator, escape) {
      return accumulator.replace(escape[0], escape[1])
    }, string)
  }
};

/**
 * Reduces a DOM node down to its Markdown string equivalent
 * @private
 * @param {HTMLElement} parentNode The node to convert
 * @returns A Markdown representation of the node
 * @type String
 */

function process (parentNode) {
  var self = this;
  return reduce.call(parentNode.childNodes, function (output, node) {
    node = new Node(node);

    var replacement = '';
    if (node.nodeType === 3) {
      replacement = node.isCode ? node.nodeValue : self.escape(node.nodeValue);
    } else if (node.nodeType === 1) {
      replacement = replacementForNode.call(self, node);
    }

    return join(output, replacement)
  }, '')
}

/**
 * Appends strings as each rule requires and trims the output
 * @private
 * @param {String} output The conversion output
 * @returns A trimmed version of the ouput
 * @type String
 */

function postProcess (output) {
  var self = this;
  this.rules.forEach(function (rule) {
    if (typeof rule.append === 'function') {
      output = join(output, rule.append(self.options));
    }
  });

  return output.replace(/^[\t\r\n]+/, '').replace(/[\t\r\n\s]+$/, '')
}

/**
 * Converts an element node to its Markdown equivalent
 * @private
 * @param {HTMLElement} node The node to convert
 * @returns A Markdown representation of the node
 * @type String
 */

function replacementForNode (node) {
  var rule = this.rules.forNode(node);
  var content = process.call(this, node);
  var whitespace = node.flankingWhitespace;
  if (whitespace.leading || whitespace.trailing) content = content.trim();
  return (
    whitespace.leading +
    rule.replacement(content, node, this.options) +
    whitespace.trailing
  )
}

/**
 * Determines the new lines between the current output and the replacement
 * @private
 * @param {String} output The current conversion output
 * @param {String} replacement The string to append to the output
 * @returns The whitespace to separate the current output and the replacement
 * @type String
 */

function separatingNewlines (output, replacement) {
  var newlines = [
    output.match(trailingNewLinesRegExp)[0],
    replacement.match(leadingNewLinesRegExp)[0]
  ].sort();
  var maxNewlines = newlines[newlines.length - 1];
  return maxNewlines.length < 2 ? maxNewlines : '\n\n'
}

function join (string1, string2) {
  var separator = separatingNewlines(string1, string2);

  // Remove trailing/leading newlines and replace with separator
  string1 = string1.replace(trailingNewLinesRegExp, '');
  string2 = string2.replace(leadingNewLinesRegExp, '');

  return string1 + separator + string2
}

/**
 * Determines whether an input can be converted
 * @private
 * @param {String|HTMLElement} input Describe this parameter
 * @returns Describe what it returns
 * @type String|Object|Array|Boolean|Number
 */

function canConvert (input) {
  return (
    input != null && (
      typeof input === 'string' ||
      (input.nodeType && (
        input.nodeType === 1 || input.nodeType === 9 || input.nodeType === 11
      ))
    )
  )
}

/* harmony default export */ __webpack_exports__["default"] = (TurndownService);


/***/ }),

/***/ "./node_modules/vue-loader/lib/index.js?!./node_modules/xkeditor/src/components/ACE_Editor.vue?vue&type=script&lang=js&":
/*!****************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib??vue-loader-options!./node_modules/xkeditor/src/components/ACE_Editor.vue?vue&type=script&lang=js& ***!
  \****************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _fortawesome_fontawesome_svg_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @fortawesome/fontawesome-svg-core */ "./node_modules/@fortawesome/fontawesome-svg-core/index.es.js");
/* harmony import */ var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons */ "./node_modules/@fortawesome/free-solid-svg-icons/index.es.js");
/* harmony import */ var _fortawesome_vue_fontawesome__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @fortawesome/vue-fontawesome */ "./node_modules/@fortawesome/vue-fontawesome/index.es.js");
/* harmony import */ var _utils_switchContent__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/switchContent */ "./node_modules/xkeditor/src/utils/switchContent.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

// import ace from "ace-builds"
// import "ace-builds/webpack-resolver" // 在 webpack 环境中使用必须要导入
// import "ace-builds/src-noconflict/theme-solarized_light" // 默认设置的主题
// import "ace-builds/src-noconflict/mode-markdown"
// import "ace-builds/src-noconflict/snippets/markdown"
// import "ace-builds/src-noconflict/mode-html"
// import "ace-builds/src-noconflict/snippets/html"
// import "ace-builds/src-noconflict/ext-language_tools"

//fa icon



_fortawesome_fontawesome_svg_core__WEBPACK_IMPORTED_MODULE_0__["library"].add(_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_1__["fas"])

//switch markdown and html


/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    "fa-icon": _fortawesome_vue_fontawesome__WEBPACK_IMPORTED_MODULE_2__["FontAwesomeIcon"]
  },
  props: {
    value: String,
    setting: Object
  },
  data() {
    return {
      aceEditor: null,
      isMarkdownMode: true,
      aceToolbarShow: true,
      aceToolbarHtmlShow: true,
      typewriterMode: false,
      aceToolbarModal: {
        base: {
          isShowModal: false
        },
        data: {
          modalTitle: ' ',
          allLine: 1,
        },
        link: false,
        image: false,
        video: false,
        toLine: false,
        search: false,
        table: false,
        info: false,
        help: false,
        setLocalStorage: false,
        getLocalStorage: false
      },
      aceToolbarButtons: [
        {
          title: "",
          operate: "|",
          icon: "|"
        },
        {
          title: "粗体",
          operate: "bold",
          icon: "bold"
        },
        {
          title: "斜体",
          operate: "italic",
          icon: "italic"
        },
        {
          title: "下划线",
          operate: "underline",
          icon: "underline"
        },
        {
          title: "删除线",
          operate: "strikethrough",
          icon: "strikethrough"
        },
        {
          title: "引用",
          operate: "quote",
          icon: "quote-left"
        },
        {
          title: "标记块",
          operate: "mark",
          icon: "code"
        },
        {
          title: "代码块",
          operate: "code",
          icon: "terminal"
        },
        {
          title: "",
          operate: "|",
          icon: "|"
        },
        {
          title: "上标",
          operate: "sup",
          icon: "superscript"
        },
        {
          title: "下标",
          operate: "sub",
          icon: "subscript"
        },
        {
          title: "添加行内公式",
          operate: "tex-$",
          icon: "dollar-sign"
        },
        {
          title: "添加块公式",
          operate: "tex-math",
          icon: "divide"
        },
        {
          title: "",
          operate: "|",
          icon: "|"
        },
        {
          title: "添加流程图",
          operate: "flow",
          icon: "ellipsis-h"
        },
        {
          title: "添加时序图",
          operate: "seq",
          icon: "circle"
        },
        {
          title: "添加甘特图",
          operate: "gantt",
          icon: "square"
        },
        {
          title: "添加图",
          operate: "mermaid",
          icon: "cubes"
        },
        {
          title: "",
          operate: "|",
          icon: "|"
        },
        {
          title: "无序列表",
          operate: "ul",
          icon: "list-ul"
        },
        {
          title: "有序列表",
          operate: "ol",
          icon: "list-ol"
        },
        {
          title: "分割线",
          operate: "minus",
          icon: "minus"
        },
        {
          title: "表格",
          operate: "table",
          icon: "table"
        },
        {
          title: "时间",
          operate: "time",
          icon: "clock"
        },
        {
          title: "",
          operate: "|",
          icon: "|"
        },
        {
          title: "链接",
          operate: "link",
          icon: "link"
        },
        {
          title: "图片",
          operate: "image",
          icon: "image"
        },
        {
          title: "媒体",
          operate: "video",
          icon: "video"
        },
        {
          title: "",
          operate: "|",
          icon: "|"
        },
        {
          title: "跳转到指定行",
          operate: "toLine",
          icon: "level-down-alt"
        },
        {
          title: "搜索",
          operate: "search",
          icon: "search"
        },
        {
          title: "显示/隐藏目录",
          operate: "toc",
          icon: "bars"
        },
        {
          title: "开启/关闭打字机模式",
          operate: "typewriter",
          icon: "i-cursor"
        },
        {
          title: "切换实时预览",
          operate: "switchPreview",
          icon: "eye"
        },
        {
          title: "全窗口预览",
          operate: "fullPreview",
          icon: "tv"
        },
        {
          title: "全屏",
          operate: "fullScreen",
          icon: "arrows-alt"
        },
        {
          title: "转换为HTML编辑",
          operate: "toHtmlEditor",
          icon: "file-code"
        },
        {
          title: "转换为TinyMCE编辑器",
          operate: "toTinyMCE",
          icon: "sync-alt"
        },
        {
          title: "清空",
          operate: "empty",
          icon: "eraser"
        },
        {
          title: "设置",
          operate: "setting",
          icon: "cog"
        },
        {
          title: "",
          operate: "|",
          icon: "|"
        },
        {
          title: "撤销",
          operate: "undo",
          icon: "undo"
        },
        {
          title: "重做",
          operate: "redo",
          icon: "redo"
        },
        {
          title: "",
          operate: "|",
          icon: "|"
        },
        {
          title: "保存到本地",
          operate: "setLocalStorage",
          icon: "box"
        },
        {
          title: "从本地读取",
          operate: "getLocalStorage",
          icon: "box-open"
        },
        {
          title: "删除本地存储",
          operate: "removeLocalStorage",
          icon: "trash-alt"
        },
        {
          title: "",
          operate: "|",
          icon: "|"
        },
        {
          title: "帮助",
          operate: "help",
          icon: "question-circle"
        },
        {
          title: "关于",
          operate: "info",
          icon: "info-circle"
        }
      ]
    }
  },
  computed: {
    openImgUpload() {
      return this.$parent.setting.xkSetting.imgUpload ? true : false
    }
  },
  mounted() {
    //初始化Value
    this.setting.value = this.value ? this.value : ""
    ace.config.set('basePath', 'https://cdn.jsdelivr.net/npm/ace-builds@1.4.4/src-noconflict/')
    this.aceEditor = ace.edit(this.$refs.ace,
      this.setting
    )
    this.aceEditor.getSession().on('change', this.updateValue)
    if(window.isMobile) {
      this.execCommand('switchPreview')
    }
    this.initKey()
  },
  methods: {
    initKey() {
      var _this = this
      var keys = [
        {
          name: 'toHtmlEditor',
          win: 'F1',
          mac: 'F1',
          exec: function() {
            _this.toolbarClick('toHtmlEditor')
          }
        },
        {
          name: 'toTinyMCE',
          win: 'F2',
          mac: 'F2',
          exec: function() {
            _this.toolbarClick('toTinyMCE')
          }
        },
        {
          name: 'toc',
          win: 'F7',
          mac: 'F7',
          exec: function() {
            _this.toolbarClick('toc')
          }
        },
        {
          name: 'typewriter',
          win: 'F8',
          mac: 'F8',
          exec: function() {
            _this.toolbarClick('typewriter')
          }
        },
        {
          name: 'switchPreview',
          win: 'F9',
          mac: 'F9',
          exec: function() {
            _this.toolbarClick('switchPreview')
          }
        },
        {
          name: 'fullPreview',
          win: 'F10',
          mac: 'F10',
          exec: function() {
            _this.toolbarClick('fullPreview')
          }
        },
        {
          name: 'fullScreen',
          win: 'F11',
          mac: 'F11',
          exec: function() {
            _this.toolbarClick('fullScreen')
          }
        },
        {
          name: 'H1',
          win: 'Ctrl-1',
          mac: 'Command-1',
          exec: function() {
            _this.toolbarClick('h1')
          }
        },
        {
          name: 'H2',
          win: 'Ctrl-2',
          mac: 'Command-2',
          exec: function() {
            _this.toolbarClick('h2')
          }
        },
        {
          name: 'H3',
          win: 'Ctrl-3',
          mac: 'Command-3',
          exec: function() {
            _this.toolbarClick('h3')
          }
        },
        {
          name: 'H4',
          win: 'Ctrl-4',
          mac: 'Command-4',
          exec: function() {
            _this.toolbarClick('h4')
          }
        },
        {
          name: 'H5',
          win: 'Ctrl-5',
          mac: 'Command-5',
          exec: function() {
            _this.toolbarClick('h5')
          }
        },
        {
          name: 'H6',
          win: 'Ctrl-6',
          mac: 'Command-6',
          exec: function() {
            _this.toolbarClick('h6')
          }
        },
        {
          name: 'bold',
          win: 'Ctrl-B',
          mac: 'Command-B',
          exec: function() {
            _this.toolbarClick('bold')
          }
        },
        {
          name: 'time',
          win: 'Ctrl-D',
          mac: 'Command-D',
          exec: function() {
            _this.toolbarClick('time')
          }
        },
        {
          name: 'minus',
          win: 'Ctrl-H',
          mac: 'Command-H',
          exec: function() {
            _this.toolbarClick('minus')
          }
        },
        {
          name: 'italic',
          win: 'Ctrl-I',
          mac: 'Command-I',
          exec: function() {
            _this.toolbarClick('italic')
          }
        },
        {
          name: 'mark',
          win: 'Ctrl-K',
          mac: 'Command-K',
          exec: function() {
            _this.toolbarClick('mark')
          }
        },
        {
          name: 'link',
          win: 'Ctrl-L',
          mac: 'Command-L',
          exec: function() {
            _this.toolbarClick('link')
          }
        },
        {
          name: 'ul',
          win: 'Ctrl-U',
          mac: 'Command-U',
          exec: function() {
            _this.toolbarClick('ul')
          }
        },
        {
          name: 'image',
          win: 'Ctrl-Shift-I',
          mac: 'Command-Shift-I',
          exec: function() {
            _this.toolbarClick('image')
          }
        },
        {
          name: 'tex-$',
          win: 'Ctrl-Shift-K',
          mac: 'Command-Shift-K',
          exec: function() {
            _this.toolbarClick('tex-$')
          }
        },
        {
          name: 'ol',
          win: 'Ctrl-Shift-O',
          mac: 'Command-Shift-O',
          exec: function() {
            _this.toolbarClick('ol')
          }
        },
        {
          name: 'code',
          win: 'Ctrl-Shift-P',
          mac: 'Command-Shift-P',
          exec: function() {
            _this.toolbarClick('code')
          }
        },
        {
          name: 'quote',
          win: 'Ctrl-Shift-Q',
          mac: 'Command-Shift-Q',
          exec: function() {
            _this.toolbarClick('quote')
          }
        },
        {
          name: 'strikethrough',
          win: 'Ctrl-Shift-S',
          mac: 'Command-Shift-S',
          exec: function() {
            _this.toolbarClick('strikethrough')
          }
        },
        {
          name: 'table',
          win: 'Ctrl-Shift-T',
          mac: 'Command-Shift-T',
          exec: function() {
            _this.toolbarClick('table')
          }
        },
        {
          name: 'help',
          win: 'Ctrl-Shift-H',
          mac: 'Command-Shift-H',
          exec: function() {
            _this.toolbarClick('help')
          }
        },
        {
          name: 'toLine',
          win: 'Ctrl-Shift-G',
          mac: 'Command-Shift-G',
          exec: function() {
            _this.toolbarClick('toLine')
          }
        }
      ]
      this.execCommand('addKeys', keys)
    },
    setValue(val) {
      this.aceEditor.setValue(val)
    },
    updateValue() {
      this.$emit("input", this.aceEditor.getSession().getValue())
    },
    switchEditorMode() {
      if(this.isMarkdownMode) {
        this.switchToHtml()
      } else {
        this.switchToMarkdown()
      }
    },
    switchToHtml() {
      if (this.isMarkdownMode) {
        this.aceEditor.session.setMode("ace/mode/html")
        this.aceEditor.getSession().setValue(Object(_utils_switchContent__WEBPACK_IMPORTED_MODULE_3__["toHtml"])(this.aceEditor.getSession().getValue(), false))
        this.isMarkdownMode = false
      }
    },
    switchToMarkdown() {
      if (!this.isMarkdownMode) {
        this.aceEditor.session.setMode("ace/mode/markdown")
        this.aceEditor.getSession().setValue(Object(_utils_switchContent__WEBPACK_IMPORTED_MODULE_3__["toMarkdown"])(this.aceEditor.getSession().getValue(), true))
        this.isMarkdownMode = true
      }
    },
    toolbarClick(operate) {
      this.aceToolbarModal.data.operate = operate
      let str = ''
      let isStart = false
      let toLeft = 0
      let selectText = this.aceEditor.getSelectedText()
      if (operate.match(/^h(\d)/)) {
        str = "#".repeat(operate.substring(1)) + " "
        isStart = true
      } else if (operate === "bold") {
        str = "**" + selectText + "**"
        toLeft = 2
      } else if (operate === "italic") {
        str = "*" + selectText + "*"
        toLeft = 1
      } else if (operate === "underline") {
        str = '<span style="text-decoration: underline">' + selectText + "</span>"
        toLeft = 7
      } else if (operate === "strikethrough") {
        str = "~" + selectText + "~"
        toLeft = 1
      } else if (operate === "quote") {
        str = "> "
        isStart = true
      } else if (operate === "mark") {
        str = "`" + selectText + "`"
        toLeft = 1
      } else if (operate === "code") {
        str = "```\n```"
        toLeft = 4
      } else if(operate === "sup") {
        str = "<sup>" + selectText + "</sup>"
        toLeft = 6
      } else if(operate === "sub") {
        str = "<sub>" + selectText + "</sub>"
        toLeft = 6
      } else if(operate === "tex-$") {
        str = "$$" + selectText + "$$"
        toLeft = 2
      } else if(operate === "tex-math") {
        str = "```math\n\n```"
        toLeft = 4
      } else if(operate === "flow") {
        str = "```flow\n```"
        toLeft = 4
      } else if(operate === "seq") {
        str = "```seq\n\n```"
        toLeft = 4
      } else if(operate === "gantt") {
        str = "```gantt\n\n```"
        toLeft = 4
      } else if(operate === "mermaid") {
        str = "```mermaid\n\n```"
        toLeft = 4
      } else if (operate === "ul") {
        str = "- "
        isStart = true
      } else if (operate === "ol") {
        str = "1. "
        isStart = true
      } else if (operate === "minus") {
        str = "\n---\n\n"
        isStart = true
      } else if (operate === "table") {
        this.operateModal(operate, true, '添加表格')
        return
      } else if (operate === "time") {
        str = new Date().toLocaleString()
      } else if (operate === "link") {
        this.operateModal(operate, true, '添加链接')
        return
      } else if (operate === "image") {
        this.operateModal(operate, true, '添加图片')
        return
      } else if (operate === "video") {
        this.operateModal(operate, true, '添加视频')
        return
      } else if (/(toLine|search|toc|switchPreview|fullPreview|fullScreen|toHtmlEditor|toTinyMCE|empty|setting|undo|redo)/g.test(operate)) {
        this.execCommand(operate)
      } else if (operate === "typewriter") {
        this.execCommand(operate)
      } else if(operate === 'setLocalStorage') {
        this.operateModal('localStorage', true, '保存到本地')
        return
      } else if(operate === 'getLocalStorage') {
        this.operateModal('localStorage', true, '从本地读取')
        return
      } else if(operate === 'removeLocalStorage') {
        this.operateModal('localStorage', true, '删除本地存储')
        return
      } else if(operate === 'help') {
        this.operateModal(operate, true, '帮助')
        return
      } else if(operate === 'info') {
        this.operateModal(operate, true, '关于')
        return
      }
      this.operateAceContent(isStart, toLeft, str)
    },
    operateModal(operate, isShow, title = '') {
      if(!isShow) {
        this.aceToolbarModal[operate] = false
        return
      }
      this.aceToolbarModal[operate] = true
      this.aceToolbarModal.data.modalTitle = title
      this.aceToolbarModal.base.isShowModal = true
    },
    operateAceContent(isStart, toLeft, str) {
      let range = this.aceEditor.getSelectionRange()
      if (isStart) {
        for (let i = range.start.row; i <= range.end.row; i++) {
          this.aceEditor.session.replace(new ace.Range(i, 0, i, 0), str)
        }
      } else {
        this.aceEditor.session.replace(range, str)
      }
      if (toLeft) {
        this.aceEditor.navigateLeft(toLeft)
      }
      this.aceEditor.focus()
    },
    aceToolbarSubmit() {
      let str = ''
      let data = this.aceToolbarModal.data
      if(data.operate === 'table') {
        if(data.row > 1) {
          data.row = parseInt(data.row) + 1
        }
        for (let i = 0; i < data.row; i++) {
          for (let j = 0; j < data.column; j++) {
            str += '| '
            if(i == 1) {
              if(data.type === 'left' || data.type === 'center') {
                str += ':'
              }
              str += '----------'
              if(data.type === 'right' || data.type === 'center') {
                str += ':'
              }
            }
            str += ' '
          }
          str += '|\n'
        }
      } else if(data.operate === 'link') {
        str = '[' + data.title + '](' + data.href + ')'
      } else if(data.operate === 'image') {
        str = '![' + data.art + '](' + data.src + ')'
      } else if(data.operate === 'video') {
        if(!/\w+\.(\w+)$/.test(data.src)) {
          //TODO: 移除AT-UI后的依赖
          this.$Message.error('地址输入有误！请重新输入(无法识别扩展名)')
          return
        }
        let type = data.src.match(/\w+\.(\w+)$/)
        str = '<video controls="controls" width="' + data.width + '" height="' + data.height + '"><source src="' + data.src + '" type="video/' + type[1] + '" /></video>'
      } else if(data.operate === 'toLine') {
        this.aceEditor.gotoLine(data.line)
        this.aceEditor.focus()
        this.operateModal(data.operate, false)
        this.aceToolbarCancer()
        return
      } else if(data.operate === 'setLocalStorage') {
        window.XKEditor.setLocalStorage(this.aceToolbarModal.data.locationStorage)
        this.aceToolbarCancer()
        return
      } else if(data.operate === 'getLocalStorage') {
        str = window.XKEditor.getLocalStorage(this.aceToolbarModal.data.locationStorage)
        this.setValue(str)
        this.aceToolbarCancer()
        return
      } else if(data.operate === 'removeLocalStorage') {
        window.XKEditor.removeLocalStorage(this.aceToolbarModal.data.locationStorage)
        this.aceToolbarCancer()
        return
      }
      this.operateModal(data.operate, false)
      this.operateAceContent(false, 0, str)
      this.aceToolbarCancer()
    },
    aceToolbarCancer() {
      this.aceToolbarModal.link =  false
      this.aceToolbarModal.image = false
      this.aceToolbarModal.video = false
      this.aceToolbarModal.toLine = false
      this.aceToolbarModal.search = false
      this.aceToolbarModal.table = false
      this.aceToolbarModal.help = false
      this.aceToolbarModal.info = false
      this.aceToolbarModal.localStorage = false
      this.aceToolbarModal.base.isShowModal = false
    },
    operateFullScreen() {
      if(document.fullscreenElement || document.msFullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement) {
        if(document.exitFullscreen) {
          return document.exitFullscreen()
        } else if(document.webkitExitFullscreen) {
          return document.webkitExitFullscreen()
        } else if(document.mozCancelFullScreen) {
          return document.mozCancelFullScreen()
        } else if(document.msExitFullscreen) {
          return document.msExitFullscreen()
        }
      } else {
        var root = document.documentElement
        if(root.requestFullscreen) {
          return root.requestFullscreen()
        } else if(root.webkitRequestFullscreen) {
          return root.webkitRequestFullscreen()
        } else if(root.mozRequestFullScreen) {
          return root.mozRequestFullScreen()
        } else if(root.msRequestFullscreen) {
          return root.msRequestFullscreen()
        }
      }
    },
    imgUpload() {
      var _this = this
      if(document.getElementById('img-upload').files.length > 0) {
        let file = document.getElementById('img-upload').files[0]
        window.XKEditorAPI.imgUpload(file, function(response) {
          _this.$set(_this.aceToolbarModal.data, 'src', response.path)
          //TODO: 上传成功提示
        }, function(error) {
          //TODO: 上传失败提示
          console.log(error)
        })
      } else {
        //TODO: 未选择文件提示
        console.log('error')
      }
    },
    execCommand(command, data = null) {
      if (command === "toLine") {
        this.aceToolbarModal.data.allLine = this.aceEditor.session.getLength()
        this.operateModal(command, true, '跳转到指定行')
        return
      } else if (command === "search") {
        this.aceEditor.commands.commands.find.exec(this.aceEditor)
        return
      } else if(command === "toc") {
        this.$parent.switchToc()
        return
      } else if(command === "switchPreview") {
        this.$parent.switchPreviewShow()
        this.$nextTick(function() {
          this.aceEditor.resize(this.aceEditor)
        })
        return
      } else if(command === "fullPreview") {
        this.$parent.switchPreviewFull()
        this.$nextTick(function() {
          this.aceEditor.resize(this.aceEditor)
        })
        return
      } else if(command === "fullScreen") {
        this.operateFullScreen()
        return
      } else if (command === "toHtmlEditor") {
        this.switchEditorMode()
        this.aceToolbarShow = false
        return
      } else if(command === "toTinyMCE") {
        window.$switchEditor()
        return
      } else if (command === "empty") {
        this.aceEditor.setValue("")
        return
      } else if (command === "setting") {
        this.aceEditor.commands.commands.showSettingsMenu.exec(this.aceEditor)
        return
      } else if(command === "undo") {
        this.aceEditor.undo()
        return
      } else if(command === "redo") {
        this.aceEditor.redo()
        return
      } else if(command === "toolbar") {
        this.aceToolbarShow = !this.aceToolbarShow
        this.aceToolbarHtmlShow = !this.aceToolbarHtmlShow
        return
      } else if(command === "resize") {
        this.$nextTick(function() {
          this.aceEditor.resize(this.aceEditor)
        })
        return
      } else if(command === "addKeys") {
        for(let i = 0; i < data.length; i++) {
          this.aceEditor.commands.addCommand({
            name: data[i].name,
            bindKey: {win: data[i].win,  mac: data[i].mac},
            exec: data[i].exec,
            readOnly: true
          })
        }
      } else if(command === "removeKeys") {
        for(let i = 0; i < data.length; i++) {
          this.aceEditor.commands.removeCommand(data[i])
        }
      } else if(command === "typewriter") {
        var isOne = true
        var lastRow = window.$ace.selection.getCursor().row
        if(!window.$typewriter) {
          window.$typewriter = function() {
            if(event && event.type && !/(mousedown|mouseup|touchstart|touchend|touchmove)/g.test(event.type)) {
              var nowRow = window.$ace.selection.getCursor().row
              let scroll = 0
              if(isOne) {
                scroll = window.$ace.session.getScrollTop() + (parseFloat(document.getElementsByClassName('ace_cursor')[0].style.top.replace('px', ''))
                          - document.getElementsByClassName('ace-editor')[0].offsetHeight/3)
                isOne = false
              } else {
                let rows = nowRow - lastRow
                if(rows === 0) {
                  if(event.key === 'ArrowDown') {
                    rows = 1
                  } else if(event.key === 'ArrowUp') {
                    rows = -1
                  }
                }
                scroll = window.$ace.session.getScrollTop() + rows * window.$ace.renderer.lineHeight
              }
              if(scroll != 0) {
                window.$ace.session.setScrollTop(scroll)
              }
              lastRow = nowRow
            }
          }
        }
        if(!this.typewriterMode) {
          window.$ace.selection.on('changeCursor', window.$typewriter)
        } else {
          window.$ace.selection.off('changeCursor', window.$typewriter)
        }
        this.typewriterMode = !this.typewriterMode
        return
      }
    }
  }
});


/***/ }),

/***/ "./node_modules/vue-loader/lib/index.js?!./node_modules/xkeditor/src/components/TinyMCE_Editor.vue?vue&type=script&lang=js&":
/*!********************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib??vue-loader-options!./node_modules/xkeditor/src/components/TinyMCE_Editor.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

// import tinyMCE from 'tinymce/tinymce'
// import 'tinymce/themes/silver'
// import Editor from '@tinymce/tinymce-vue'
// import 'tinymce/plugins/print'
// import 'tinymce/plugins/preview'
// import 'tinymce/plugins/fullpage'
// import 'tinymce/plugins/searchreplace'
// import 'tinymce/plugins/autolink'
// import 'tinymce/plugins/directionality'
// import 'tinymce/plugins/code'
// import 'tinymce/plugins/visualblocks'
// import 'tinymce/plugins/visualchars'
// import 'tinymce/plugins/fullscreen'
// import 'tinymce/plugins/image'
// import 'tinymce/plugins/link'
// import 'tinymce/plugins/media'
// import 'tinymce/plugins/template'
// import 'tinymce/plugins/codesample'
// import 'tinymce/plugins/table'
// import 'tinymce/plugins/charmap'
// import 'tinymce/plugins/hr'
// import 'tinymce/plugins/pagebreak'
// import 'tinymce/plugins/nonbreaking'
// import 'tinymce/plugins/anchor'
// import 'tinymce/plugins/toc'
// import 'tinymce/plugins/insertdatetime'
// import 'tinymce/plugins/advlist'
// import 'tinymce/plugins/lists'
// import 'tinymce/plugins/wordcount'
// import 'tinymce/plugins/imagetools'
// import 'tinymce/plugins/textpattern'
/* harmony default export */ __webpack_exports__["default"] = ({
  // components: {
  //   'editor': Editor
  // },
  props: {
    value: String,
    setting: Object
  },
  data() {
    return {
      tinymceValue: '',
      init: this.setting
    }
  },
  created() {
    //设置目标div
    this.init.selector = '#tinymce-textarea'
    //上传功能
    if(this.$parent.setting.xkSetting.imgUpload) {
      this.init.images_upload_handler = function(blobInfo, success, failure) {
        window.XKEditorAPI.imgUpload(blobInfo.blob(), function(response) {
          success(response.path)
          //TODO: 上传成功之后的提示
        }, function(error) {
          //TODO: 上传失败后的提示
          failure(error)
        })
      }
    }
    //添加自定义按钮
    this.init.setup = function (editor) {
      editor.ui.registry.addButton('tex-$', {
        text: '行内公式',
        onAction(_) {
          editor.insertContent('<p>$$$$</p>')
        }
      })
      editor.ui.registry.addButton('tex-math', {
        text: '块公式',
        onAction(_) {
          editor.insertContent('<pre>&nbsp;```math&nbsp;```&nbsp;</pre>')
        }
      })
      editor.ui.registry.addButton('flow', {
        text: '流程图',
        onAction(_) {
          editor.insertContent('<pre class="xkeditor-mermaid">graph </pre>')
        }
      })
      editor.ui.registry.addButton('seq', {
        text: '时序图',
        onAction(_) {
          editor.insertContent('<pre class="xkeditor-mermaid">sequenceDiagram&nbsp;</pre>')
        }
      })
      editor.ui.registry.addButton('gantt', {
        text: '甘特图',
        onAction(_) {
          editor.insertContent('<pre class="xkeditor-mermaid">gantt&nbsp;</pre>')
        }
      })
      editor.ui.registry.addButton('mermaid', {
        text: '添加图',
        onAction(_) {
          editor.insertContent('<pre class="xkeditor-mermaid">&nbsp;</pre>')
        }
      })
      editor.ui.registry.addButton('prismjs', {
        text: '代码块',
        onAction(_) {
          editor.insertContent('<pre><code class="line-numbers language-javascript">&nbsp;</code></pre>')
        }
      })
      editor.ui.registry.addButton('toMarkdownEditor', {
        text: '切换编辑器',
        onAction(_) {
          window.$switchEditor()
        }
      })
    }
  },
  mounted () {
    var _this = this
    //初始化tinymce编辑器
    tinyMCE.init(this.init)
    //赋初值
    this.tinymceValue = this.value
    tinyMCE.editors['tinymce-textarea'].setContent(this.tinymceValue)
    tinyMCE.editors['tinymce-textarea'].on('Change', function (e) {
      _this.tinymceValue = tinyMCE.editors['tinymce-textarea'].getContent()
    })
  },
  methods: {
    setValue(val) {
      this.tinymceValue = val
      tinyMCE.editors['tinymce-textarea'].setContent(this.tinymceValue)
    },
    updateValue() {
      tinyMCE.editors['tinymce-textarea'].setContent(this.tinymceValue)
      this.$emit('input', this.tinymceValue)
    }
  },
  watch: {
    tinymceValue() {
      this.updateValue()
    }
  }
});


/***/ }),

/***/ "./node_modules/vue-loader/lib/index.js?!./node_modules/xkeditor/src/components/XK_Editor.vue?vue&type=script&lang=js&":
/*!***************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib??vue-loader-options!./node_modules/xkeditor/src/components/XK_Editor.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_dialogDrag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/dialogDrag.js */ "./node_modules/xkeditor/src/utils/dialogDrag.js");
/* harmony import */ var _ACE_Editor_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ACE_Editor.vue */ "./node_modules/xkeditor/src/components/ACE_Editor.vue");
/* harmony import */ var _TinyMCE_Editor_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TinyMCE_Editor.vue */ "./node_modules/xkeditor/src/components/TinyMCE_Editor.vue");
/* harmony import */ var _utils_axiosPro_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/axiosPro.js */ "./node_modules/xkeditor/src/utils/axiosPro.js");
/* harmony import */ var _utils_switchContent_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/switchContent.js */ "./node_modules/xkeditor/src/utils/switchContent.js");
/* harmony import */ var _fortawesome_fontawesome_svg_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @fortawesome/fontawesome-svg-core */ "./node_modules/@fortawesome/fontawesome-svg-core/index.es.js");
/* harmony import */ var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons */ "./node_modules/@fortawesome/free-solid-svg-icons/index.es.js");
/* harmony import */ var _fortawesome_vue_fontawesome__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @fortawesome/vue-fontawesome */ "./node_modules/@fortawesome/vue-fontawesome/index.es.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

//导入基础组件





//HTML和Markdown互转


// import katex from "katex"
// import "katex/dist/katex.min.css"
// import renderMathInElement from "katex/dist/contrib/auto-render"
// import mermaid from "mermaid"

//fa icon



_fortawesome_fontawesome_svg_core__WEBPACK_IMPORTED_MODULE_5__["library"].add(_fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_6__["fas"])

/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'XK_Editor',
  components: {
    'ace': _ACE_Editor_vue__WEBPACK_IMPORTED_MODULE_1__["default"],
    'tinymce': _TinyMCE_Editor_vue__WEBPACK_IMPORTED_MODULE_2__["default"],
    "fa-icon": _fortawesome_vue_fontawesome__WEBPACK_IMPORTED_MODULE_7__["FontAwesomeIcon"]
  },
  props: {
    settingApi: String,
    contentApi: String,
    settingProps: Object,
    contentProps: String
  },
  data () {
    return {
      isRenderEditor: false,
      markdownContent: '',
      htmlContent: '',
      htmlViewContent: '',
      toc: '',
      showToc: false,
      editorMode: "ace",
      previewShow: 'show',
      aceDivClass: "xk-col-12",
      delayToHtml: null,
      setting: {
        tinymceSetting: {
          language_url: '/static/tinymce/langs/zh_CN.js',
          language: 'zh_CN',
          skin_url: '/static/tinymce/skins/ui/oxide',
          body_class: 'markdown-body',
          content_css: '/static/github-markdown.css',
          plugins: 'print preview fullpage searchreplace autolink directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern',
          toolbar: 'formatselect | fontsizeselect | bold italic underline strikethrough blockquote forecolor backcolor prismjs | link image media pageembed | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent | tex-$ tex-math flow seq gantt mermaid | removeformat code toMarkdownEditor | undo redo',
          image_advtab: true,
          importcss_append: true,
          height: '100%',
          template_cdate_format: '[CDATE: %m/%d/%Y : %H:%M:%S]',
          template_mdate_format: '[MDATE: %m/%d/%Y : %H:%M:%S]',
          image_caption: true,
          spellchecker_dialog: true,
          spellchecker_whitelist: ['Ephox', 'Moxiecode']
        },
        aceSetting: {
          minLines: 10,
          fontSize: 14,
          theme: "ace/theme/solarized_light",
          mode: "ace/mode/markdown",
          tabSize: 4,
          fontSize: "17px",
          wrap: true,
          enableSnippets: true,
          enableLiveAutocompletion: true,
          enableBasicAutocompletion: true
        },
        xkSetting: {
          apiBaseUrl: "",
          previewCss: "/static/github-markdown.css",
          previewClass: "markdown-body",
          delayToHtml: 500,
          scrollBind: 'both',
          imgUpload: true,
          scrollMode: 'anchor',
          pasteFormat: true,
          pasteImageUpload: true
        }
      }
    }
  },
  computed: {
    editorModeShow() {
      if(this.editorMode === 'ace') {
        return true
      } else if(this.editorMode === 'tinymce') {
        return false
      }
    },
    isMobile() {
      return window.isMobile
    }
  },
  async mounted() {
    window.isMobile = /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i.test(navigator.userAgent)
    await this.load()
    this.htmlViewContent = Object(_utils_switchContent_js__WEBPACK_IMPORTED_MODULE_4__["toHtml"])(this.markdownContent, true)
    this.$nextTick(function() {
      this.initEditor()
    })
    this.setInterface()
  },
  methods: {
    async load() {
      let md = null
      let setting = null
      if(!this.contentProps) {
        md = await _utils_axiosPro_js__WEBPACK_IMPORTED_MODULE_3__["axiosPro"].get(this.contentApi)
      } else {
        md = this.contentProps
      }
      if(!this.settingProps) {
        setting = await _utils_axiosPro_js__WEBPACK_IMPORTED_MODULE_3__["axiosPro"].get(this.settingApi)
      } else {
        setting = this.settingProps
      }
      this.markdownContent = md
      this.setting = setting
      this.loadCss(setting.xkSetting.previewCss)
      this.isRenderEditor = true
    },
    loadCss(url) {
      let css = document.createElement('link')
      css.href = url
      css.rel = 'stylesheet'
      css.type = 'text/css'
      document.head.appendChild(css)
    },
    initEditor() {
      var _this = this
      mermaid.initialize({startOnLoad:true})
      window.$ace = this.$refs.ace.aceEditor
      window.$switchEditor = this.switchEditor
      window.scrollBind = function(operate = null, bindType = 'both') {
        var currentTab = 1
        var editorDom = document.querySelector('.ace-editor')
        var previewHtmlDom = document.querySelector('#previewHtml')
        var aceContentHeight =  window.$ace.renderer.scrollBarV.scrollHeight - editorDom.offsetHeight
        var previewHtmlHeight = previewHtmlDom.scrollHeight - previewHtmlDom.offsetHeight
        window.scale = previewHtmlHeight/aceContentHeight
        if(operate === 'init') {
          if(bindType === 'left') {
            currentTab = 1
          } else if(bindType === 'right') {
            currentTab = 2
          } else {
            editorDom.addEventListener('mouseover', function() {
              currentTab = 1
            })
            previewHtmlDom.addEventListener('mouseover', function() {
              currentTab = 2
            })
            //兼容触摸设备
            editorDom.addEventListener('touchstart', function() {
              currentTab = 1
            })
            previewHtmlDom.addEventListener('touchstart', function() {
              currentTab = 2
            })
          }
          window.$ace.session.on("changeScrollTop", function(data) {
            if(currentTab === 1) {
              previewHtmlDom.scrollTop = data * window.scale
            }
          })
          previewHtmlDom.addEventListener('scroll', function() {
            if (currentTab === 2) {
              window.$ace.session.setScrollTop(previewHtmlDom.scrollTop / window.scale)
            }
          })
          //兼容触摸设备
          previewHtmlDom.addEventListener('touchmove', function() {
            if (currentTab === 2) {
              window.$ace.session.setScrollTop(previewHtmlDom.scrollTop / window.scale)
            }
          })
          //惯性滚动
          var inertiaScrollTime = null
          editorDom.addEventListener('touchstart', function(event) {
            clearTimeout(inertiaScrollTime)
            var startY = event.changedTouches[0].pageY
            var endY = 0
            var startTime = Date.now()
            var endTime = 0
            editorDom.addEventListener('touchend', function(event) {
              endY = event.changedTouches[0].pageY
              endTime = Date.now()
              var _v = (endY - startY) / (endTime - startTime) * 1.5
              function scrollToTop(v, sTime, contentY) {
                var dir = v > 0 ? -1 : 1
                var deceleration = dir*0.0018
                var duration = v / deceleration
                function inertiaMove() {
                  // if(stopInertia) return
                  var nowTime = Date.now()
                  var t = nowTime - sTime
                  var nowV = v + t*deceleration
                  // 速度方向变化表示速度达到0了
                  if(dir*nowV > 0) {
                    return
                  }
                  var moveY = - (v + nowV)/2 * t
                  window.$ace.session.setScrollTop(contentY + moveY)
                  inertiaScrollTime = setTimeout(inertiaMove, 10)
                }
                inertiaMove()
              }
              scrollToTop(_v, endTime, window.$ace.session.getScrollTop())
            })
          })
        }
      }
      // 模拟锚点
      window.scrollMode = this.setting.xkSetting.scrollMode
      window.sta = function(anchorName) {
        if (anchorName) {
          let anchorElement = document.getElementById(anchorName);
          if(anchorElement) {
            anchorElement.scrollIntoView(true);
          }
        }
      }
      //初始化滚动绑定
      this.$nextTick(function() {
        setTimeout(function() {
          window.scrollBind('init', _this.setting.xkSetting.scrollBind)
        }, 1000)
      })
      //初始化TOC
      this.initTocTree()
      window.toggleToc = this.toggleToc
      //注册TOC按钮
      document.getElementById('toc-button').addEventListener('click', function() {
        _this.switchToc()
      })
      //粘贴格式化
      if (this.setting.xkSetting.pasteFormat) {
        window.$ace.on("paste", function(e) {
          if (e.event.clipboardData.getData('text/html')) {
            e.text = Object(_utils_switchContent_js__WEBPACK_IMPORTED_MODULE_4__["toMarkdown"])(e.event.clipboardData.getData('text/html'), false)
          }
        })
      }
      //图片粘贴上传
      if (this.setting.xkSetting.pasteImageUpload && this.setting.xkSetting.imageUpload) {
        document.getElementsByClassName('ace-container')[0].addEventListener("paste", function (e){
          if ( !(e.clipboardData && e.clipboardData.items) ) {
            return
          }
          for (var i = 0, len = e.clipboardData.items.length; i < len; i++) {
            var item = e.clipboardData.items[i]
            if (item.kind === "file") {
              var pasteFile = item.getAsFile()
              window.XKEditorAPI.imgUpload(pasteFile, function(response) {
                window.$ace.insert("[](" + response.path + ")")
                //TODO: 上传成功提示
              }, function(error) {
                //TODO: 上传失败提示
                console.log(error)
              })
            }
          }
        });
      }
    },
    switchEditor() {
      if(this.editorMode !== 'ace') {
        this.markdownContent = Object(_utils_switchContent_js__WEBPACK_IMPORTED_MODULE_4__["toMarkdown"])(this.htmlContent, true)
        this.$refs.ace.setValue(this.markdownContent)
        this.editorMode = 'ace'
      } else if(this.editorMode !== 'tinymce') {
        this.htmlContent = Object(_utils_switchContent_js__WEBPACK_IMPORTED_MODULE_4__["toHtml"])(this.markdownContent, false)
        this.$refs.tinymce.setValue(this.htmlContent)
        this.editorMode = 'tinymce'
      }
    },
    switchPreviewShow() {
      if(this.previewShow == 'show') {
        this.previewShow = 'hide'
        this.aceDivClass = "xk-col-24"
      } else {
        this.previewShow = 'show'
        this.aceDivClass = "xk-col-12"
      }
    },
    switchPreviewFull() {
      if(this.previewShow == 'full') {
        this.previewShow = 'show'
        this.aceDivClass = "xk-col-12"
        document.getElementById('toc-button').style.display = 'block'
        this.showToc = false
      } else {
        this.previewShow = 'full'
        this.aceDivClass = "xk-col-24"
        this.$nextTick(function() {
          var preEle = document.getElementById('previewHtml')
          if (Math.round(preEle.offsetWidth / preEle.parentElement.offsetWidth * 100) <= 80) {
            document.getElementById('toc-button').style.display = 'none'
            this.showToc = true
          }
        })
      }
    },
    renderNextTick() {
      this.$nextTick(function() {
        //制作TOC
        var tocHtml = Object(_utils_switchContent_js__WEBPACK_IMPORTED_MODULE_4__["getTocHtml"])();
        document.getElementById('toc').innerHTML = tocHtml
        //制作文章内TOC
        for (let i = 0; i < document.getElementsByClassName('toc').length; i++) {
          document.getElementsByClassName('toc')[i].innerHTML = tocHtml
        }
        //更新TOC icon
        this.initTocTree()
        //转换Tex公式
        renderMathInElement(document.getElementById('previewHtml'), {
          delimiters: [
            {left: "$$", right: "$$"},
            {left: "```math", right: "```"},
            {left: "```tex", right: "```"}
          ],
          ignoredTags: ["script", "noscript", "style", "textarea", "code"]
        })
        //转换Mermaid图
        try {
          mermaid.init({noteMargin: 10}, ".xkeditor-mermaid")
        } catch (error) {
          console.log("May have errors")
        }
        //更新滚动绑定
        if(window.scrollBind) {
          window.scrollBind()
        }
      })
    },
    switchToc() {
      this.showToc = (!this.showToc)
    },
    initTocTree() {
      var items = document.querySelectorAll('#toc .toc-img ~ ul,.toc .toc-img ~ ul')
      for (let i = 0; i < items.length; i++) {
        items[i].parentNode.children[0].setAttribute('src', '/static/svg/minus-square.svg')
        items[i].parentNode.children[0].setAttribute('onclick', 'toggleToc(this)')
      }
    },
    toggleToc(ele) {
      var display = ele.nextElementSibling.nextElementSibling.style.display
      if(display === '' || display === 'block') {
        ele.nextElementSibling.nextElementSibling.style.display = 'none'
        ele.setAttribute('src', '/static/svg/plus-square.svg')
      } else {
        ele.nextElementSibling.nextElementSibling.style.display = 'block'
        ele.setAttribute('src', '/static/svg/minus-square.svg')
      }
    },
    setInterface() {
      var _this = this
      var downloadFun = function(filename, data, type) {
        var aLink = document.createElement('a')
        var evt = document.createEvent("MouseEvents")
        evt.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
        aLink.download = filename + '.'+type
        aLink.href = URL.createObjectURL(new Blob([data], {type: 'text/'+type}))
        aLink.dispatchEvent(evt)
      }
      window.XKEditorAPI = {
        //response: {"error":false,"path":"img url"}
        imgUpload: function(file, success, failure) {
          if(_this.setting.xkSetting.imgUpload) {
            let param = new FormData()
            param.append('file', file)
            let config = {
              headers:{'Content-Type':'multipart/form-data'}
            }
            // success({"error":false,"path":"https://img.url"})
            _utils_axiosPro_js__WEBPACK_IMPORTED_MODULE_3__["axios"].post(_this.setting.xkSetting.imgUpload, param, config)
              .then(function(response){
                success(response)
              })
              .catch(function(error) {
                failure(error)
              })
          } else {
            //TODO: 上传关闭提示
          }
        }
      }
      window.XKEditor = {
        getMarkdown: function() {
          return _this.markdownContent
        },
        getHTML: function() {
          return _this.htmlViewContent
        },
        setMarkdown: function(val, valueType = 'markdown') { //默认设置时在ACE编辑界面
          if(_this.editorMode !== 'ace') {
            //TODO: 提示不可设置，因为不在ACE状态
            return
          }
          if(valueType !== 'markdown') {
            val = Object(_utils_switchContent_js__WEBPACK_IMPORTED_MODULE_4__["toMarkdown"])(val, true)
          }
          _this.markdownContent = val
          _this.$refs.ace.setValue(val)
        },
        setHTML: function(val, valueType = 'html') { //默认设置时在TinyMCE编辑界面
          if(_this.editorMode !== 'tinymce') {
            //TODO: 提示不可设置，因为不在TinyMCE状态
            return
          }
          if(valueType !== 'html') {
            val = Object(_utils_switchContent_js__WEBPACK_IMPORTED_MODULE_4__["toHtml"])(val, false)
          }
          _this.htmlContent = val
          _this.$refs.tinymce.setValue(val)
        },
        switchEditor: function() {
          _this.switchEditor()
        },
        switchPreview: function() {
          _this.$refs.ace.execCommand('switchPreview')
        },
        switchFullPreview: function() {
          _this.$refs.ace.execCommand('fullPreview')
        },
        switchFullScreen: function() {
          _this.$refs.ace.execCommand('fullScreen')
        },
        toLine: function() {
          _this.$refs.ace.execCommand('toLine')
        },
        toc: function() {
          _this.$refs.ace.execCommand('toc')
        },
        toolbar: function() {
          _this.$refs.ace.execCommand('toolbar')
        },
        resize: function() {
          _this.$refs.ace.execCommand('resize')
        },
        addKeys: function(keys) { // keys = [{name,win,mac,exec},{name,win,mac,exec}]
          _this.$refs.ace.execCommand('addKeys', keys)
        },
        removeKeys: function(keys) { // keys = [name, name]
          _this.$refs.ace.execCommand('removeKeys', keys)
        },
        getEditor: function(name) {
          if(name === 'ace') {
            return window.$ace
          } else if(name === 'tinymce') {
            return window.tinymce
          }
        },
        switchTypewriter: function(data) {
          _this.$refs.ace.execCommand('typewriter', true)
        },
        setLocalStorage: function(filename) {
          window.localStorage.setItem('xkeditor_' + filename, window.XKEditor.getMarkdown())
        },
        getLocalStorage: function(filename) {
          return window.localStorage.getItem('xkeditor_' + filename)
        },
        listLocalStorage: function() {
          var list = {}
          for (const key in window.localStorage) {
            if(key.indexOf('xkeditor_') != -1) {
              list[key.substring(9)] = window.localStorage.getItem(key)
            }
          }
          return list
        },
        removeLocalStorage: function(filename) {
          window.localStorage.removeItem('xkeditor_' + filename)
        },
        download: async function(filename, type = 'markdown') {
          var data = ''
          if(type === 'markdown') {
            data = _this.markdownContent
            type = 'md'
          } else if(type === 'html') {
            data = _this.htmlViewContent
          } else if(type === 'fullhtml') {
            var d_t1 = '<!DOCTYPE html><html lang="zh"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="ie=edge"><title>'
            var d_t2 = '</title>'
            var d_t3 = '</head><body>'
            var d_t4 = '</body></html>'
            var style = await _utils_axiosPro_js__WEBPACK_IMPORTED_MODULE_3__["axiosPro"].get(_this.setting.xkSetting.previewCss)
            style += await _utils_axiosPro_js__WEBPACK_IMPORTED_MODULE_3__["axiosPro"].get('/static/prism-okaidia.css')
            style += await _utils_axiosPro_js__WEBPACK_IMPORTED_MODULE_3__["axiosPro"].get('/static/prism-line-numbers.css')
            style += await _utils_axiosPro_js__WEBPACK_IMPORTED_MODULE_3__["axiosPro"].get('/static/prism-toolbar.css')
            data = d_t1+filename+d_t2+'<style>'+style+'</style>'+d_t3+'<div class="markdown-body editormd-html-preview">'+_this.htmlViewContent+'</div>'+d_t4
            type = 'html'
            downloadFun(filename, data, type)
            return
          }
          downloadFun(filename, data, type)
        },
      }
    }
  },
  watch: {
    markdownContent (val) {
      var _this = this
      //最少延迟250ms转换为html以保证性能，否则会造成输入卡顿
      var delay = _this.setting.xkSetting.delayToHtml >= 250 ? _this.setting.xkSetting.delayToHtml : 250
      if(_this.delayToHtml) {
        clearTimeout(_this.delayToHtml)
      }
      _this.delayToHtml = setTimeout(function() {
        _this.htmlViewContent = Object(_utils_switchContent_js__WEBPACK_IMPORTED_MODULE_4__["toHtml"])(val, true)
        _this.renderNextTick()
      }, delay)
    },
    htmlContent(val) {
      this.htmlViewContent = val
      this.renderNextTick()
      this.$nextTick(function() {
        Prism.highlightAll()
      })
    }
  }
});


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/xkeditor/src/components/ACE_Editor.vue?vue&type=template&id=fa22aaa2&scoped=true&":
/*!**************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./node_modules/xkeditor/src/components/ACE_Editor.vue?vue&type=template&id=fa22aaa2&scoped=true& ***!
  \**************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "ace-container" }, [
    _c(
      "div",
      {
        directives: [
          {
            name: "show",
            rawName: "v-show",
            value: _vm.aceToolbarShow,
            expression: "aceToolbarShow"
          }
        ],
        staticClass: "ace-toolbar"
      },
      [
        _vm._l(6, function(num) {
          return [
            _c(
              "button",
              {
                key: num.id,
                staticClass: "xk-button",
                attrs: { type: "text", title: "标题" + num },
                on: {
                  click: function($event) {
                    return _vm.toolbarClick("h" + num)
                  }
                }
              },
              [_c("b", [_vm._v("H" + _vm._s(num))])]
            )
          ]
        }),
        _vm._v(" "),
        _vm._l(_vm.aceToolbarButtons, function(item) {
          return [
            item.icon === "|"
              ? [_c("span", { key: item.id }, [_vm._v("|")])]
              : [
                  _c(
                    "button",
                    {
                      key: item.id,
                      staticClass: "xk-button",
                      attrs: { type: "text", title: item.title },
                      on: {
                        click: function($event) {
                          return _vm.toolbarClick(item.operate)
                        }
                      }
                    },
                    [_c("fa-icon", { attrs: { icon: item.icon } })],
                    1
                  )
                ]
          ]
        })
      ],
      2
    ),
    _vm._v(" "),
    _c(
      "div",
      {
        directives: [
          {
            name: "show",
            rawName: "v-show",
            value: !_vm.aceToolbarShow && _vm.aceToolbarHtmlShow,
            expression: "!aceToolbarShow&&aceToolbarHtmlShow"
          }
        ],
        staticClass: "ace-toolbar-html ace-toolbar"
      },
      [
        _c(
          "button",
          {
            staticClass: "xk-button",
            attrs: { type: "text", title: "转换为Markdown模式" },
            on: {
              click: function() {
                _vm.aceToolbarShow = true
                _vm.switchEditorMode()
              }
            }
          },
          [
            _c("fa-icon", { attrs: { icon: "file-code" } }),
            _vm._v(" 转换为Markdown模式")
          ],
          1
        )
      ]
    ),
    _vm._v(" "),
    _c("div", { ref: "ace", staticClass: "ace-editor" }),
    _vm._v(" "),
    _c(
      "div",
      {
        directives: [
          {
            name: "show",
            rawName: "v-show",
            value: _vm.aceToolbarModal.base.isShowModal,
            expression: "aceToolbarModal.base.isShowModal"
          },
          { name: "dialogDrag", rawName: "v-dialogDrag" }
        ],
        staticClass: "ace-toolbar-modal"
      },
      [
        _c("div", { staticClass: "xk-modal-wrapper" }, [
          _c("div", { staticClass: "xk-modal" }, [
            _c("div", { staticClass: "xk-modal-header" }, [
              _c("div", { staticClass: "xk-modal-title" }, [
                _c("p", [_vm._v(_vm._s(_vm.aceToolbarModal.data.modalTitle))])
              ])
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "xk-modal-body" }, [
              _c(
                "div",
                {
                  directives: [
                    {
                      name: "show",
                      rawName: "v-show",
                      value: _vm.aceToolbarModal.link,
                      expression: "aceToolbarModal.link"
                    }
                  ]
                },
                [
                  _c("label", [_vm._v("链接")]),
                  _vm._v(" "),
                  _c("div", { staticClass: "xk-input" }, [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.aceToolbarModal.data.href,
                          expression: "aceToolbarModal.data.href"
                        }
                      ],
                      attrs: { placeholder: "请输入链接", autofocus: "" },
                      domProps: { value: _vm.aceToolbarModal.data.href },
                      on: {
                        input: function($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(
                            _vm.aceToolbarModal.data,
                            "href",
                            $event.target.value
                          )
                        }
                      }
                    })
                  ]),
                  _vm._v(" "),
                  _c("label", [_vm._v("标题")]),
                  _vm._v(" "),
                  _c("div", { staticClass: "xk-input" }, [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.aceToolbarModal.data.title,
                          expression: "aceToolbarModal.data.title"
                        }
                      ],
                      attrs: { placeholder: "请输入标题" },
                      domProps: { value: _vm.aceToolbarModal.data.title },
                      on: {
                        input: function($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(
                            _vm.aceToolbarModal.data,
                            "title",
                            $event.target.value
                          )
                        }
                      }
                    })
                  ])
                ]
              ),
              _vm._v(" "),
              _c(
                "div",
                {
                  directives: [
                    {
                      name: "show",
                      rawName: "v-show",
                      value: _vm.aceToolbarModal.image,
                      expression: "aceToolbarModal.image"
                    }
                  ]
                },
                [
                  _c("label", [_vm._v("图片链接")]),
                  _vm._v(" "),
                  _c("div", { staticClass: "xk-input" }, [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.aceToolbarModal.data.src,
                          expression: "aceToolbarModal.data.src"
                        }
                      ],
                      attrs: { placeholder: "请输入图片链接", autofocus: "" },
                      domProps: { value: _vm.aceToolbarModal.data.src },
                      on: {
                        input: function($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(
                            _vm.aceToolbarModal.data,
                            "src",
                            $event.target.value
                          )
                        }
                      }
                    })
                  ]),
                  _vm._v(" "),
                  _c("label", [_vm._v("图片描述")]),
                  _vm._v(" "),
                  _c("div", { staticClass: "xk-input" }, [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.aceToolbarModal.data.art,
                          expression: "aceToolbarModal.data.art"
                        }
                      ],
                      attrs: { placeholder: "请输入图片描述" },
                      domProps: { value: _vm.aceToolbarModal.data.art },
                      on: {
                        input: function($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(
                            _vm.aceToolbarModal.data,
                            "art",
                            $event.target.value
                          )
                        }
                      }
                    })
                  ]),
                  _vm._v(" "),
                  _vm.openImgUpload
                    ? [
                        _vm._m(0),
                        _vm._v(" "),
                        _c(
                          "div",
                          { staticClass: "xk-input xk-col-12 img-upload-sub" },
                          [
                            _c(
                              "button",
                              {
                                staticClass: "xk-button",
                                on: { click: _vm.imgUpload }
                              },
                              [_vm._v("上传")]
                            )
                          ]
                        )
                      ]
                    : _vm._e()
                ],
                2
              ),
              _vm._v(" "),
              _c(
                "div",
                {
                  directives: [
                    {
                      name: "show",
                      rawName: "v-show",
                      value: _vm.aceToolbarModal.video,
                      expression: "aceToolbarModal.video"
                    }
                  ]
                },
                [
                  _c("label", [_vm._v("视频链接")]),
                  _vm._v(" "),
                  _c("div", { staticClass: "xk-input" }, [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.aceToolbarModal.data.src,
                          expression: "aceToolbarModal.data.src"
                        }
                      ],
                      attrs: { placeholder: "请输入视频链接", autofocus: "" },
                      domProps: { value: _vm.aceToolbarModal.data.src },
                      on: {
                        input: function($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(
                            _vm.aceToolbarModal.data,
                            "src",
                            $event.target.value
                          )
                        }
                      }
                    })
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "xk-row" }, [
                    _c("div", { staticClass: "xk-input xk-col-12" }, [
                      _c("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.aceToolbarModal.data.width,
                            expression: "aceToolbarModal.data.width"
                          }
                        ],
                        attrs: { placeholder: "请输入宽" },
                        domProps: { value: _vm.aceToolbarModal.data.width },
                        on: {
                          input: function($event) {
                            if ($event.target.composing) {
                              return
                            }
                            _vm.$set(
                              _vm.aceToolbarModal.data,
                              "width",
                              $event.target.value
                            )
                          }
                        }
                      })
                    ]),
                    _vm._v(" "),
                    _c("div", { staticClass: "xk-input xk-col-12" }, [
                      _c("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.aceToolbarModal.data.height,
                            expression: "aceToolbarModal.data.height"
                          }
                        ],
                        attrs: { placeholder: "请输入高" },
                        domProps: { value: _vm.aceToolbarModal.data.height },
                        on: {
                          input: function($event) {
                            if ($event.target.composing) {
                              return
                            }
                            _vm.$set(
                              _vm.aceToolbarModal.data,
                              "height",
                              $event.target.value
                            )
                          }
                        }
                      })
                    ])
                  ])
                ]
              ),
              _vm._v(" "),
              _c(
                "div",
                {
                  directives: [
                    {
                      name: "show",
                      rawName: "v-show",
                      value: _vm.aceToolbarModal.toLine,
                      expression: "aceToolbarModal.toLine"
                    }
                  ]
                },
                [
                  _c("label", [
                    _vm._v(
                      "行号(1-" + _vm._s(_vm.aceToolbarModal.data.allLine) + ")"
                    )
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "xk-input" }, [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.aceToolbarModal.data.line,
                          expression: "aceToolbarModal.data.line"
                        }
                      ],
                      attrs: { placeholder: "请输入行号", autofocus: "" },
                      domProps: { value: _vm.aceToolbarModal.data.line },
                      on: {
                        input: function($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(
                            _vm.aceToolbarModal.data,
                            "line",
                            $event.target.value
                          )
                        }
                      }
                    })
                  ])
                ]
              ),
              _vm._v(" "),
              _c(
                "div",
                {
                  directives: [
                    {
                      name: "show",
                      rawName: "v-show",
                      value: _vm.aceToolbarModal.localStorage,
                      expression: "aceToolbarModal.localStorage"
                    }
                  ]
                },
                [
                  _c("label", [_vm._v("保存的标记(Filename)")]),
                  _vm._v(" "),
                  _c("div", { staticClass: "xk-input" }, [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.aceToolbarModal.data.locationStorage,
                          expression: "aceToolbarModal.data.locationStorage"
                        }
                      ],
                      attrs: { placeholder: "请输入保存的标记", autofocus: "" },
                      domProps: {
                        value: _vm.aceToolbarModal.data.locationStorage
                      },
                      on: {
                        input: function($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(
                            _vm.aceToolbarModal.data,
                            "locationStorage",
                            $event.target.value
                          )
                        }
                      }
                    })
                  ])
                ]
              ),
              _vm._v(" "),
              _c(
                "div",
                {
                  directives: [
                    {
                      name: "show",
                      rawName: "v-show",
                      value: _vm.aceToolbarModal.table,
                      expression: "aceToolbarModal.table"
                    }
                  ]
                },
                [
                  _c("label", [_vm._v("单元格数")]),
                  _vm._v(" "),
                  _c("div", { staticClass: "xk-row" }, [
                    _c("div", { staticClass: "xk-input xk-col-12" }, [
                      _c("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.aceToolbarModal.data.row,
                            expression: "aceToolbarModal.data.row"
                          }
                        ],
                        attrs: { placeholder: "请输入行数", autofocus: "" },
                        domProps: { value: _vm.aceToolbarModal.data.row },
                        on: {
                          input: function($event) {
                            if ($event.target.composing) {
                              return
                            }
                            _vm.$set(
                              _vm.aceToolbarModal.data,
                              "row",
                              $event.target.value
                            )
                          }
                        }
                      })
                    ]),
                    _vm._v(" "),
                    _c("div", { staticClass: "xk-input xk-col-12" }, [
                      _c("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.aceToolbarModal.data.column,
                            expression: "aceToolbarModal.data.column"
                          }
                        ],
                        attrs: { placeholder: "请输入列数" },
                        domProps: { value: _vm.aceToolbarModal.data.column },
                        on: {
                          input: function($event) {
                            if ($event.target.composing) {
                              return
                            }
                            _vm.$set(
                              _vm.aceToolbarModal.data,
                              "column",
                              $event.target.value
                            )
                          }
                        }
                      })
                    ])
                  ]),
                  _vm._v(" "),
                  _c("label", [_vm._v("对齐方式")]),
                  _vm._v(" "),
                  _c("div", [
                    _c("div", { staticClass: "xk-radio-group" }, [
                      _c("div", { staticClass: "xk-radio" }, [
                        _c("input", {
                          directives: [
                            {
                              name: "model",
                              rawName: "v-model",
                              value: _vm.aceToolbarModal.data.type,
                              expression: "aceToolbarModal.data.type"
                            }
                          ],
                          attrs: {
                            type: "radio",
                            value: "normal",
                            id: "xk-type-normal"
                          },
                          domProps: {
                            checked: _vm._q(
                              _vm.aceToolbarModal.data.type,
                              "normal"
                            )
                          },
                          on: {
                            change: function($event) {
                              return _vm.$set(
                                _vm.aceToolbarModal.data,
                                "type",
                                "normal"
                              )
                            }
                          }
                        }),
                        _vm._v(" "),
                        _c(
                          "label",
                          { attrs: { for: "xk-type-normal" } },
                          [
                            _c("div", { staticClass: "advice" }),
                            _c("fa-icon", { attrs: { icon: "align-justify" } })
                          ],
                          1
                        )
                      ]),
                      _vm._v(" "),
                      _c("div", { staticClass: "xk-radio" }, [
                        _c("input", {
                          directives: [
                            {
                              name: "model",
                              rawName: "v-model",
                              value: _vm.aceToolbarModal.data.type,
                              expression: "aceToolbarModal.data.type"
                            }
                          ],
                          attrs: {
                            type: "radio",
                            value: "left",
                            id: "xk-type-left"
                          },
                          domProps: {
                            checked: _vm._q(
                              _vm.aceToolbarModal.data.type,
                              "left"
                            )
                          },
                          on: {
                            change: function($event) {
                              return _vm.$set(
                                _vm.aceToolbarModal.data,
                                "type",
                                "left"
                              )
                            }
                          }
                        }),
                        _vm._v(" "),
                        _c(
                          "label",
                          { attrs: { for: "xk-type-left" } },
                          [
                            _c("div", { staticClass: "advice" }),
                            _c("fa-icon", { attrs: { icon: "align-left" } })
                          ],
                          1
                        )
                      ]),
                      _vm._v(" "),
                      _c("div", { staticClass: "xk-radio" }, [
                        _c("input", {
                          directives: [
                            {
                              name: "model",
                              rawName: "v-model",
                              value: _vm.aceToolbarModal.data.type,
                              expression: "aceToolbarModal.data.type"
                            }
                          ],
                          attrs: {
                            type: "radio",
                            value: "center",
                            id: "xk-type-center"
                          },
                          domProps: {
                            checked: _vm._q(
                              _vm.aceToolbarModal.data.type,
                              "center"
                            )
                          },
                          on: {
                            change: function($event) {
                              return _vm.$set(
                                _vm.aceToolbarModal.data,
                                "type",
                                "center"
                              )
                            }
                          }
                        }),
                        _vm._v(" "),
                        _c(
                          "label",
                          { attrs: { for: "xk-type-center" } },
                          [
                            _c("div", { staticClass: "advice" }),
                            _c("fa-icon", { attrs: { icon: "align-center" } })
                          ],
                          1
                        )
                      ]),
                      _vm._v(" "),
                      _c("div", { staticClass: "xk-radio" }, [
                        _c("input", {
                          directives: [
                            {
                              name: "model",
                              rawName: "v-model",
                              value: _vm.aceToolbarModal.data.type,
                              expression: "aceToolbarModal.data.type"
                            }
                          ],
                          attrs: {
                            type: "radio",
                            value: "right",
                            id: "xk-type-right"
                          },
                          domProps: {
                            checked: _vm._q(
                              _vm.aceToolbarModal.data.type,
                              "right"
                            )
                          },
                          on: {
                            change: function($event) {
                              return _vm.$set(
                                _vm.aceToolbarModal.data,
                                "type",
                                "right"
                              )
                            }
                          }
                        }),
                        _vm._v(" "),
                        _c(
                          "label",
                          { attrs: { for: "xk-type-right" } },
                          [
                            _c("div", { staticClass: "advice" }),
                            _c("fa-icon", { attrs: { icon: "align-right" } })
                          ],
                          1
                        )
                      ])
                    ])
                  ])
                ]
              ),
              _vm._v(" "),
              _c(
                "div",
                {
                  directives: [
                    {
                      name: "show",
                      rawName: "v-show",
                      value: _vm.aceToolbarModal.help,
                      expression: "aceToolbarModal.help"
                    }
                  ],
                  staticClass: "markdown-body help"
                },
                [
                  _c("h3", [_vm._v("Markdown语法")]),
                  _vm._v(" "),
                  _vm._m(1),
                  _vm._v(" "),
                  _c("h3", [_vm._v("XK-Editor独有的语法")]),
                  _vm._v(" "),
                  _vm._m(2),
                  _vm._v(" "),
                  _c("h3", [_vm._v("键盘快捷键")]),
                  _vm._v(" "),
                  _c("blockquote", [
                    _vm._v("当编辑器取得焦点的时候才能使用快捷键")
                  ]),
                  _vm._v(" "),
                  _vm._m(3),
                  _vm._v(" "),
                  _c("h3", [_vm._v("Emoji表情")]),
                  _vm._v(" "),
                  _c(
                    "a",
                    {
                      attrs: {
                        href: "https://www.webfx.com/tools/emoji-cheat-sheet/"
                      }
                    },
                    [_vm._v("EMOJI CHEAT SHEET")]
                  ),
                  _vm._v(" "),
                  _c("h3", [_vm._v("流程图/时序图/甘特图")]),
                  _vm._v(" "),
                  _c("a", { attrs: { href: "https://mermaidjs.github.io/" } }, [
                    _vm._v("mermaid - GitBook")
                  ]),
                  _vm._v(" "),
                  _c("h3", [_vm._v("Tex数学公式")]),
                  _vm._v(" "),
                  _c(
                    "a",
                    {
                      attrs: {
                        href: "https://juejin.im/post/5af93ec6518825428b38e7f4"
                      }
                    },
                    [_vm._v("markdown 数学公式Latex语法 - 掘金")]
                  )
                ]
              ),
              _vm._v(" "),
              _c(
                "div",
                {
                  directives: [
                    {
                      name: "show",
                      rawName: "v-show",
                      value: _vm.aceToolbarModal.info,
                      expression: "aceToolbarModal.info"
                    }
                  ],
                  staticClass: "markdown-body info"
                },
                [
                  _c("h2", [_vm._v("XK-Editor")]),
                  _vm._v(" "),
                  _c("p", [
                    _vm._v("开源的Markdown和富文本编辑器。基于Vue开发")
                  ]),
                  _vm._v(" "),
                  _c("p", [_vm._v("支持Markdown和HTML互转")]),
                  _vm._v(" "),
                  _vm._m(4),
                  _vm._v(" "),
                  _vm._m(5),
                  _vm._v(" "),
                  _vm._m(6),
                  _vm._v(" "),
                  _c("p", { staticStyle: { "font-size": "0.8em" } }, [
                    _vm._v(
                      "Copyright © 2019 Otstar Lin, 根据 Apache License 2.0 许可证开源。"
                    )
                  ])
                ]
              )
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "xk-clear" }),
            _vm._v(" "),
            _c("div", { staticClass: "xk-modal-footer" }, [
              _c(
                "button",
                {
                  staticClass: "xk-button",
                  on: { click: _vm.aceToolbarCancer }
                },
                [_vm._v("取消")]
              ),
              _vm._v(" "),
              _c(
                "button",
                {
                  staticClass: "xk-button xk-button-primary",
                  on: { click: _vm.aceToolbarSubmit }
                },
                [_vm._v("确定")]
              )
            ]),
            _vm._v(" "),
            _c(
              "span",
              {
                staticClass: "xk-modal-close",
                on: { click: _vm.aceToolbarCancer }
              },
              [_c("fa-icon", { attrs: { icon: "times" } })],
              1
            )
          ])
        ])
      ]
    )
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "xk-input xk-col-12" }, [
      _c("input", { attrs: { id: "img-upload", type: "file" } })
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("ul", [
      _c("li", [
        _c("a", { attrs: { href: "http://www.markdown.cn/" } }, [
          _vm._v("Markdown 语法说明")
        ])
      ]),
      _vm._v(" "),
      _c("li", [
        _c(
          "a",
          {
            attrs: {
              href: "https://help.github.com/articles/github-flavored-markdown/"
            }
          },
          [_vm._v("GitHub Flavored Markdown")]
        )
      ])
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("table", [
      _c("tr", [
        _c("th", [_vm._v("语法格式")]),
        _vm._v(" "),
        _c("th", [_vm._v("参数")]),
        _vm._v(" "),
        _c("th", [_vm._v("样例")])
      ]),
      _vm._v(" "),
      _c("tr", [
        _c("td", [_vm._v("[text]{style|label}")]),
        _vm._v(" "),
        _c("td", [
          _vm._v(
            "text:内容，style:样式(css)，label:包裹的标签(span,p,font)默认为p"
          )
        ]),
        _vm._v(" "),
        _c("td", [
          _vm._v("[这是蓝色的字]{color:blue} [灰色背景]{background:#ddd|span}")
        ])
      ]),
      _vm._v(" "),
      _c("tr", [
        _c("td", [_vm._v("[TOC]")]),
        _vm._v(" "),
        _c("td", [_vm._v("null")]),
        _vm._v(" "),
        _c("td", [_vm._v("在[TOC]位置填充目录")])
      ])
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("table", [
      _c("tr", [
        _c("th", [_vm._v("快捷键")]),
        _vm._v(" "),
        _c("th", [_vm._v("说明")])
      ]),
      _vm._v(" "),
      _c("tr", [
        _c("td", [_vm._v("F1")]),
        _vm._v(" "),
        _c("td", [_vm._v("转换为HTML编辑")])
      ]),
      _vm._v(" "),
      _c("tr", [
        _c("td", [_vm._v("F2")]),
        _vm._v(" "),
        _c("td", [_vm._v("转换为TinyMCE")])
      ]),
      _vm._v(" "),
      _c("tr", [
        _c("td", [_vm._v("F7")]),
        _vm._v(" "),
        _c("td", [_vm._v("显示隐藏目录")])
      ]),
      _vm._v(" "),
      _c("tr", [
        _c("td", [_vm._v("F8")]),
        _vm._v(" "),
        _c("td", [_vm._v("开启/关闭打字机模式")])
      ]),
      _vm._v(" "),
      _c("tr", [
        _c("td", [_vm._v("F9")]),
        _vm._v(" "),
        _c("td", [_vm._v("开启/关闭实时预览")])
      ]),
      _vm._v(" "),
      _c("tr", [
        _c("td", [_vm._v("F10")]),
        _vm._v(" "),
        _c("td", [_vm._v("切换全窗口预览")])
      ]),
      _vm._v(" "),
      _c("tr", [
        _c("td", [_vm._v("F11")]),
        _vm._v(" "),
        _c("td", [_vm._v("切换全屏")])
      ]),
      _vm._v(" "),
      _c("tr", [
        _c("td", [_vm._v("Ctrl + 1~6 / Command + 1~6")]),
        _vm._v(" "),
        _c("td", [_vm._v("插入标题1~6")])
      ]),
      _vm._v(" "),
      _c("tr", [
        _c("td", [_vm._v("Ctrl + A / Command + A")]),
        _vm._v(" "),
        _c("td", [_vm._v("全选")])
      ]),
      _vm._v(" "),
      _c("tr", [
        _c("td", [_vm._v("Ctrl + B / Command + B")]),
        _vm._v(" "),
        _c("td", [_vm._v("粗体")])
      ]),
      _vm._v(" "),
      _c("tr", [
        _c("td", [_vm._v("Ctrl + D / Command + D")]),
        _vm._v(" "),
        _c("td", [_vm._v("插入时间")])
      ]),
      _vm._v(" "),
      _c("tr", [
        _c("td", [_vm._v("Ctrl + F / Command + F")]),
        _vm._v(" "),
        _c("td", [_vm._v("搜索")])
      ]),
      _vm._v(" "),
      _c("tr", [
        _c("td", [_vm._v("Ctrl + G / Command + G")]),
        _vm._v(" "),
        _c("td", [_vm._v("匹配下一项")])
      ]),
      _vm._v(" "),
      _c("tr", [
        _c("td", [_vm._v("Ctrl + H / Command + H")]),
        _vm._v(" "),
        _c("td", [_vm._v("插入水平线")])
      ]),
      _vm._v(" "),
      _c("tr", [
        _c("td", [_vm._v("Ctrl + I / Command + I")]),
        _vm._v(" "),
        _c("td", [_vm._v("斜体")])
      ]),
      _vm._v(" "),
      _c("tr", [
        _c("td", [_vm._v("Ctrl + K / Command + K")]),
        _vm._v(" "),
        _c("td", [_vm._v("插入行内代码")])
      ]),
      _vm._v(" "),
      _c("tr", [
        _c("td", [_vm._v("Ctrl + L / Command + L")]),
        _vm._v(" "),
        _c("td", [_vm._v("插入链接")])
      ]),
      _vm._v(" "),
      _c("tr", [
        _c("td", [_vm._v("Ctrl + U / Command + U")]),
        _vm._v(" "),
        _c("td", [_vm._v("插入无序列表")])
      ]),
      _vm._v(" "),
      _c("tr", [
        _c("td", [_vm._v("Ctrl + Z / Command + Z")]),
        _vm._v(" "),
        _c("td", [_vm._v("撤销")])
      ]),
      _vm._v(" "),
      _c("tr", [
        _c("td", [_vm._v("Ctrl + Y / Command + Y")]),
        _vm._v(" "),
        _c("td", [_vm._v("重做")])
      ]),
      _vm._v(" "),
      _c("tr", [
        _c("td", [_vm._v("Ctrl + Shift + I")]),
        _vm._v(" "),
        _c("td", [_vm._v("插入图片")])
      ]),
      _vm._v(" "),
      _c("tr", [
        _c("td", [_vm._v("Ctrl + Shift + K")]),
        _vm._v(" "),
        _c("td", [_vm._v("插入TeX(KaTeX)公式符号")])
      ]),
      _vm._v(" "),
      _c("tr", [
        _c("td", [_vm._v("Ctrl + Shift + O")]),
        _vm._v(" "),
        _c("td", [_vm._v("插入有序列表")])
      ]),
      _vm._v(" "),
      _c("tr", [
        _c("td", [_vm._v("Ctrl + Shift + P")]),
        _vm._v(" "),
        _c("td", [_vm._v("插入Code块")])
      ]),
      _vm._v(" "),
      _c("tr", [
        _c("td", [_vm._v("Ctrl + Shift + Q")]),
        _vm._v(" "),
        _c("td", [_vm._v("插入引用")])
      ]),
      _vm._v(" "),
      _c("tr", [
        _c("td", [_vm._v("Ctrl + Shift + S")]),
        _vm._v(" "),
        _c("td", [_vm._v("插入删除线")])
      ]),
      _vm._v(" "),
      _c("tr", [
        _c("td", [_vm._v("Ctrl + Shift + T")]),
        _vm._v(" "),
        _c("td", [_vm._v("插入表格")])
      ]),
      _vm._v(" "),
      _c("tr", [
        _c("td", [_vm._v("Shift + Shift + H")]),
        _vm._v(" "),
        _c("td", [_vm._v("打开使用帮助对话框")])
      ]),
      _vm._v(" "),
      _c("tr", [
        _c("td", [_vm._v("Ctrl + Shift + G")]),
        _vm._v(" "),
        _c("td", [_vm._v("跳转到指定的行")])
      ])
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("p", [
      _c("strong", [_vm._v("项目地址：")]),
      _c("a", { attrs: { href: "https://github.com/syfxlin/xkeditor" } }, [
        _vm._v("https://github.com/syfxlin/xkeditor")
      ])
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("p", [
      _c("a", { attrs: { href: "https://github.com/syfxlin/xkeditor" } }, [
        _vm._v("XK-Editor")
      ]),
      _vm._v(" 由 "),
      _c("a", { attrs: { href: "https://github.com/syfxlin" } }, [
        _vm._v("Otstar Lin")
      ]),
      _vm._v("和下列"),
      _c(
        "a",
        {
          attrs: {
            href: "https://github.com/syfxlin/xkeditor/graphs/contributors"
          }
        },
        [_vm._v("贡献者")]
      ),
      _vm._v("的帮助下撰写和维护。")
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("blockquote", [
      _vm._v("Otstar Lin - "),
      _c("a", { attrs: { href: "https://ixk.me/" } }, [
        _vm._v("Personal Website")
      ]),
      _vm._v(" · "),
      _c("a", { attrs: { href: "https://blog.ixk.me/" } }, [_vm._v("Blog")]),
      _vm._v(" · "),
      _c("a", { attrs: { href: "https://github.com/syfxlin" } }, [
        _vm._v("Github")
      ])
    ])
  }
]
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/xkeditor/src/components/TinyMCE_Editor.vue?vue&type=template&id=37f1337a&scoped=true&":
/*!******************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./node_modules/xkeditor/src/components/TinyMCE_Editor.vue?vue&type=template&id=37f1337a&scoped=true& ***!
  \******************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "tinymce" }, [
    _c("textarea", {
      directives: [
        {
          name: "model",
          rawName: "v-model",
          value: _vm.tinymceValue,
          expression: "tinymceValue"
        }
      ],
      attrs: { id: "tinymce-textarea" },
      domProps: { value: _vm.tinymceValue },
      on: {
        input: function($event) {
          if ($event.target.composing) {
            return
          }
          _vm.tinymceValue = $event.target.value
        }
      }
    })
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/xkeditor/src/components/XK_Editor.vue?vue&type=template&id=ea0545fa&":
/*!*************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./node_modules/xkeditor/src/components/XK_Editor.vue?vue&type=template&id=ea0545fa& ***!
  \*************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "xkeditor" },
    [
      _vm.isRenderEditor
        ? [
            _c(
              "div",
              { staticClass: "row" },
              [
                _c(
                  "div",
                  {
                    directives: [
                      {
                        name: "show",
                        rawName: "v-show",
                        value: _vm.editorModeShow && _vm.previewShow != "full",
                        expression: "editorModeShow&&previewShow!='full'"
                      }
                    ],
                    class: _vm.aceDivClass
                  },
                  [
                    _c("ace", {
                      ref: "ace",
                      attrs: { setting: _vm.setting.aceSetting },
                      model: {
                        value: _vm.markdownContent,
                        callback: function($$v) {
                          _vm.markdownContent = $$v
                        },
                        expression: "markdownContent"
                      }
                    })
                  ],
                  1
                ),
                _vm._v(" "),
                _c(
                  "div",
                  {
                    directives: [
                      {
                        name: "show",
                        rawName: "v-show",
                        value: _vm.editorModeShow && _vm.previewShow != "hide",
                        expression: "editorModeShow&&previewShow!='hide'"
                      }
                    ],
                    class: _vm.aceDivClass
                  },
                  [
                    _c("div", {
                      ref: "htmlView",
                      class: _vm.setting.xkSetting.previewClass,
                      attrs: { id: "previewHtml" },
                      domProps: { innerHTML: _vm._s(_vm.htmlViewContent) }
                    })
                  ]
                ),
                _vm._v(" "),
                _c(
                  "div",
                  {
                    directives: [
                      {
                        name: "show",
                        rawName: "v-show",
                        value: !_vm.editorModeShow,
                        expression: "!editorModeShow"
                      }
                    ],
                    staticClass: "xk-col-24"
                  },
                  [
                    _c("tinymce", {
                      ref: "tinymce",
                      attrs: { setting: _vm.setting.tinymceSetting },
                      model: {
                        value: _vm.htmlContent,
                        callback: function($$v) {
                          _vm.htmlContent = $$v
                        },
                        expression: "htmlContent"
                      }
                    })
                  ],
                  1
                ),
                _vm._v(" "),
                _c(
                  "button",
                  {
                    directives: [
                      {
                        name: "show",
                        rawName: "v-show",
                        value: _vm.editorModeShow && _vm.previewShow == "full",
                        expression: "editorModeShow&&previewShow=='full'"
                      }
                    ],
                    staticClass: "xk-button close-preview-full",
                    on: {
                      click: function($event) {
                        return _vm.switchPreviewFull()
                      }
                    }
                  },
                  [_vm._v("关闭")]
                ),
                _vm._v(" "),
                _c("transition", { attrs: { name: "slide-fade" } }, [
                  _c("div", {
                    directives: [
                      {
                        name: "show",
                        rawName: "v-show",
                        value: _vm.showToc,
                        expression: "showToc"
                      }
                    ],
                    attrs: { id: "toc" }
                  })
                ]),
                _vm._v(" "),
                _c(
                  "div",
                  { staticClass: "xk-button", attrs: { id: "toc-button" } },
                  [_c("fa-icon", { attrs: { icon: "bars" } })],
                  1
                )
              ],
              1
            )
          ]
        : _vm._e()
    ],
    2
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/Home.vue?vue&type=template&id=f2b6376c&":
/*!*******************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/Home.vue?vue&type=template&id=f2b6376c& ***!
  \*******************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("main", { staticClass: "home" }, [
    _vm._m(0),
    _vm._v(" "),
    _c("aside", { staticClass: "col-md-2", attrs: { id: "xknote-sidebar" } }),
    _vm._v(" "),
    _c(
      "section",
      { staticClass: "col-md-10", attrs: { id: "xknote-editor" } },
      [
        _c("xk-editor", {
          attrs: { settingApi: _vm.setting, contentApi: _vm.content }
        })
      ],
      1
    )
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c(
      "nav",
      {
        staticClass: "col-md-12 navbar",
        attrs: { id: "xknote-menu", role: "navigation" }
      },
      [
        _c("div", { staticClass: "container-fluid xknote-menu-inner" }, [
          _c("div", { staticClass: "collapse navbar-collapse" }, [
            _c("ul", { staticClass: "nav navbar-nav" }, [
              _c("li", { staticClass: "active" }, [
                _c("a", { attrs: { href: "" } }, [_vm._v("项目")])
              ]),
              _vm._v(" "),
              _c("li", [_c("a", { attrs: { href: "" } }, [_vm._v("需求")])])
            ]),
            _vm._v(" "),
            _c("ul", { staticClass: "nav navbar-nav navbar-right" }, [
              _c("div", { staticClass: "btn-group xknote-new" }, [
                _c(
                  "button",
                  { staticClass: "btn btn-primary", attrs: { type: "button" } },
                  [_vm._v("新建MD笔记")]
                ),
                _vm._v(" "),
                _c("div", { staticClass: "btn-group" }, [
                  _c(
                    "button",
                    {
                      staticClass: "btn btn-primary dropdown-toggle",
                      attrs: { type: "button", "data-toggle": "dropdown" }
                    },
                    [
                      _c("span", { staticClass: "caret" }),
                      _vm._v(" "),
                      _c("span", { staticClass: "sr-only" }, [
                        _vm._v("新建MD笔记")
                      ])
                    ]
                  ),
                  _vm._v(" "),
                  _c(
                    "ul",
                    { staticClass: "dropdown-menu", attrs: { role: "menu" } },
                    [
                      _c("li", [
                        _c("a", { attrs: { href: "#" } }, [
                          _vm._v("新建文件夹")
                        ])
                      ])
                    ]
                  )
                ])
              ]),
              _vm._v(" "),
              _c("li", [
                _c("a", { attrs: { href: "" } }, [_vm._v("写作模式")])
              ]),
              _vm._v(" "),
              _c("li", [
                _c("a", { attrs: { href: "" } }, [_vm._v("阅读模式")])
              ]),
              _vm._v(" "),
              _c("li", { staticClass: "dropdown" }, [
                _c(
                  "a",
                  {
                    staticClass: "dropdown-toggle",
                    attrs: { href: "", "data-toggle": "dropdown" }
                  },
                  [_vm._v("{ name } "), _c("b", { staticClass: "caret" })]
                ),
                _vm._v(" "),
                _c(
                  "ul",
                  { staticClass: "dropdown-menu", attrs: { role: "menu" } },
                  [
                    _c("li", [
                      _c("a", { attrs: { href: "" } }, [_vm._v("个人中心")])
                    ]),
                    _vm._v(" "),
                    _c("li", [
                      _c("a", { attrs: { href: "" } }, [_vm._v("用户设置")])
                    ]),
                    _vm._v(" "),
                    _c("li", [
                      _c("a", { attrs: { href: "" } }, [_vm._v("Git设置")])
                    ]),
                    _vm._v(" "),
                    _c("li", [
                      _c("a", { attrs: { href: "" } }, [_vm._v("系统管理")])
                    ]),
                    _vm._v(" "),
                    _c("li", { staticClass: "divider" }),
                    _vm._v(" "),
                    _c("li", [
                      _c("a", { attrs: { href: "" } }, [_vm._v("登出")])
                    ])
                  ]
                )
              ])
            ])
          ])
        ])
      ]
    )
  }
]
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js":
/*!********************************************************************!*\
  !*** ./node_modules/vue-loader/lib/runtime/componentNormalizer.js ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./node_modules/webpack/buildin/module.js":
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ "./node_modules/xkeditor/src/components/ACE_Editor.vue":
/*!*************************************************************!*\
  !*** ./node_modules/xkeditor/src/components/ACE_Editor.vue ***!
  \*************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ACE_Editor_vue_vue_type_template_id_fa22aaa2_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ACE_Editor.vue?vue&type=template&id=fa22aaa2&scoped=true& */ "./node_modules/xkeditor/src/components/ACE_Editor.vue?vue&type=template&id=fa22aaa2&scoped=true&");
/* harmony import */ var _ACE_Editor_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ACE_Editor.vue?vue&type=script&lang=js& */ "./node_modules/xkeditor/src/components/ACE_Editor.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _ACE_Editor_vue_vue_type_style_index_0_id_fa22aaa2_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ACE_Editor.vue?vue&type=style&index=0&id=fa22aaa2&scoped=true&lang=css& */ "./node_modules/xkeditor/src/components/ACE_Editor.vue?vue&type=style&index=0&id=fa22aaa2&scoped=true&lang=css&");
/* harmony import */ var _vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _ACE_Editor_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _ACE_Editor_vue_vue_type_template_id_fa22aaa2_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _ACE_Editor_vue_vue_type_template_id_fa22aaa2_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "fa22aaa2",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "node_modules/xkeditor/src/components/ACE_Editor.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./node_modules/xkeditor/src/components/ACE_Editor.vue?vue&type=script&lang=js&":
/*!**************************************************************************************!*\
  !*** ./node_modules/xkeditor/src/components/ACE_Editor.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _vue_loader_lib_index_js_vue_loader_options_ACE_Editor_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../vue-loader/lib??vue-loader-options!./ACE_Editor.vue?vue&type=script&lang=js& */ "./node_modules/vue-loader/lib/index.js?!./node_modules/xkeditor/src/components/ACE_Editor.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_vue_loader_lib_index_js_vue_loader_options_ACE_Editor_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./node_modules/xkeditor/src/components/ACE_Editor.vue?vue&type=style&index=0&id=fa22aaa2&scoped=true&lang=css&":
/*!**********************************************************************************************************************!*\
  !*** ./node_modules/xkeditor/src/components/ACE_Editor.vue?vue&type=style&index=0&id=fa22aaa2&scoped=true&lang=css& ***!
  \**********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _style_loader_index_js_css_loader_index_js_ref_6_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_src_index_js_ref_6_2_vue_loader_lib_index_js_vue_loader_options_ACE_Editor_vue_vue_type_style_index_0_id_fa22aaa2_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../style-loader!../../../css-loader??ref--6-1!../../../vue-loader/lib/loaders/stylePostLoader.js!../../../postcss-loader/src??ref--6-2!../../../vue-loader/lib??vue-loader-options!./ACE_Editor.vue?vue&type=style&index=0&id=fa22aaa2&scoped=true&lang=css& */ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/xkeditor/src/components/ACE_Editor.vue?vue&type=style&index=0&id=fa22aaa2&scoped=true&lang=css&");
/* harmony import */ var _style_loader_index_js_css_loader_index_js_ref_6_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_src_index_js_ref_6_2_vue_loader_lib_index_js_vue_loader_options_ACE_Editor_vue_vue_type_style_index_0_id_fa22aaa2_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_style_loader_index_js_css_loader_index_js_ref_6_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_src_index_js_ref_6_2_vue_loader_lib_index_js_vue_loader_options_ACE_Editor_vue_vue_type_style_index_0_id_fa22aaa2_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _style_loader_index_js_css_loader_index_js_ref_6_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_src_index_js_ref_6_2_vue_loader_lib_index_js_vue_loader_options_ACE_Editor_vue_vue_type_style_index_0_id_fa22aaa2_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _style_loader_index_js_css_loader_index_js_ref_6_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_src_index_js_ref_6_2_vue_loader_lib_index_js_vue_loader_options_ACE_Editor_vue_vue_type_style_index_0_id_fa22aaa2_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_style_loader_index_js_css_loader_index_js_ref_6_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_src_index_js_ref_6_2_vue_loader_lib_index_js_vue_loader_options_ACE_Editor_vue_vue_type_style_index_0_id_fa22aaa2_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./node_modules/xkeditor/src/components/ACE_Editor.vue?vue&type=template&id=fa22aaa2&scoped=true&":
/*!********************************************************************************************************!*\
  !*** ./node_modules/xkeditor/src/components/ACE_Editor.vue?vue&type=template&id=fa22aaa2&scoped=true& ***!
  \********************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _vue_loader_lib_loaders_templateLoader_js_vue_loader_options_vue_loader_lib_index_js_vue_loader_options_ACE_Editor_vue_vue_type_template_id_fa22aaa2_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../vue-loader/lib??vue-loader-options!./ACE_Editor.vue?vue&type=template&id=fa22aaa2&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/xkeditor/src/components/ACE_Editor.vue?vue&type=template&id=fa22aaa2&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _vue_loader_lib_loaders_templateLoader_js_vue_loader_options_vue_loader_lib_index_js_vue_loader_options_ACE_Editor_vue_vue_type_template_id_fa22aaa2_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _vue_loader_lib_loaders_templateLoader_js_vue_loader_options_vue_loader_lib_index_js_vue_loader_options_ACE_Editor_vue_vue_type_template_id_fa22aaa2_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./node_modules/xkeditor/src/components/TinyMCE_Editor.vue":
/*!*****************************************************************!*\
  !*** ./node_modules/xkeditor/src/components/TinyMCE_Editor.vue ***!
  \*****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _TinyMCE_Editor_vue_vue_type_template_id_37f1337a_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TinyMCE_Editor.vue?vue&type=template&id=37f1337a&scoped=true& */ "./node_modules/xkeditor/src/components/TinyMCE_Editor.vue?vue&type=template&id=37f1337a&scoped=true&");
/* harmony import */ var _TinyMCE_Editor_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TinyMCE_Editor.vue?vue&type=script&lang=js& */ "./node_modules/xkeditor/src/components/TinyMCE_Editor.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _TinyMCE_Editor_vue_vue_type_style_index_0_id_37f1337a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TinyMCE_Editor.vue?vue&type=style&index=0&id=37f1337a&scoped=true&lang=css& */ "./node_modules/xkeditor/src/components/TinyMCE_Editor.vue?vue&type=style&index=0&id=37f1337a&scoped=true&lang=css&");
/* harmony import */ var _vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _TinyMCE_Editor_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _TinyMCE_Editor_vue_vue_type_template_id_37f1337a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _TinyMCE_Editor_vue_vue_type_template_id_37f1337a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "37f1337a",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "node_modules/xkeditor/src/components/TinyMCE_Editor.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./node_modules/xkeditor/src/components/TinyMCE_Editor.vue?vue&type=script&lang=js&":
/*!******************************************************************************************!*\
  !*** ./node_modules/xkeditor/src/components/TinyMCE_Editor.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _vue_loader_lib_index_js_vue_loader_options_TinyMCE_Editor_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../vue-loader/lib??vue-loader-options!./TinyMCE_Editor.vue?vue&type=script&lang=js& */ "./node_modules/vue-loader/lib/index.js?!./node_modules/xkeditor/src/components/TinyMCE_Editor.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_vue_loader_lib_index_js_vue_loader_options_TinyMCE_Editor_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./node_modules/xkeditor/src/components/TinyMCE_Editor.vue?vue&type=style&index=0&id=37f1337a&scoped=true&lang=css&":
/*!**************************************************************************************************************************!*\
  !*** ./node_modules/xkeditor/src/components/TinyMCE_Editor.vue?vue&type=style&index=0&id=37f1337a&scoped=true&lang=css& ***!
  \**************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _style_loader_index_js_css_loader_index_js_ref_6_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_src_index_js_ref_6_2_vue_loader_lib_index_js_vue_loader_options_TinyMCE_Editor_vue_vue_type_style_index_0_id_37f1337a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../style-loader!../../../css-loader??ref--6-1!../../../vue-loader/lib/loaders/stylePostLoader.js!../../../postcss-loader/src??ref--6-2!../../../vue-loader/lib??vue-loader-options!./TinyMCE_Editor.vue?vue&type=style&index=0&id=37f1337a&scoped=true&lang=css& */ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/xkeditor/src/components/TinyMCE_Editor.vue?vue&type=style&index=0&id=37f1337a&scoped=true&lang=css&");
/* harmony import */ var _style_loader_index_js_css_loader_index_js_ref_6_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_src_index_js_ref_6_2_vue_loader_lib_index_js_vue_loader_options_TinyMCE_Editor_vue_vue_type_style_index_0_id_37f1337a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_style_loader_index_js_css_loader_index_js_ref_6_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_src_index_js_ref_6_2_vue_loader_lib_index_js_vue_loader_options_TinyMCE_Editor_vue_vue_type_style_index_0_id_37f1337a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _style_loader_index_js_css_loader_index_js_ref_6_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_src_index_js_ref_6_2_vue_loader_lib_index_js_vue_loader_options_TinyMCE_Editor_vue_vue_type_style_index_0_id_37f1337a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _style_loader_index_js_css_loader_index_js_ref_6_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_src_index_js_ref_6_2_vue_loader_lib_index_js_vue_loader_options_TinyMCE_Editor_vue_vue_type_style_index_0_id_37f1337a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_style_loader_index_js_css_loader_index_js_ref_6_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_src_index_js_ref_6_2_vue_loader_lib_index_js_vue_loader_options_TinyMCE_Editor_vue_vue_type_style_index_0_id_37f1337a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./node_modules/xkeditor/src/components/TinyMCE_Editor.vue?vue&type=template&id=37f1337a&scoped=true&":
/*!************************************************************************************************************!*\
  !*** ./node_modules/xkeditor/src/components/TinyMCE_Editor.vue?vue&type=template&id=37f1337a&scoped=true& ***!
  \************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _vue_loader_lib_loaders_templateLoader_js_vue_loader_options_vue_loader_lib_index_js_vue_loader_options_TinyMCE_Editor_vue_vue_type_template_id_37f1337a_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../vue-loader/lib??vue-loader-options!./TinyMCE_Editor.vue?vue&type=template&id=37f1337a&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/xkeditor/src/components/TinyMCE_Editor.vue?vue&type=template&id=37f1337a&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _vue_loader_lib_loaders_templateLoader_js_vue_loader_options_vue_loader_lib_index_js_vue_loader_options_TinyMCE_Editor_vue_vue_type_template_id_37f1337a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _vue_loader_lib_loaders_templateLoader_js_vue_loader_options_vue_loader_lib_index_js_vue_loader_options_TinyMCE_Editor_vue_vue_type_template_id_37f1337a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./node_modules/xkeditor/src/components/XK_Editor.vue":
/*!************************************************************!*\
  !*** ./node_modules/xkeditor/src/components/XK_Editor.vue ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _XK_Editor_vue_vue_type_template_id_ea0545fa___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./XK_Editor.vue?vue&type=template&id=ea0545fa& */ "./node_modules/xkeditor/src/components/XK_Editor.vue?vue&type=template&id=ea0545fa&");
/* harmony import */ var _XK_Editor_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./XK_Editor.vue?vue&type=script&lang=js& */ "./node_modules/xkeditor/src/components/XK_Editor.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _XK_Editor_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./XK_Editor.vue?vue&type=style&index=0&lang=css& */ "./node_modules/xkeditor/src/components/XK_Editor.vue?vue&type=style&index=0&lang=css&");
/* harmony import */ var _vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _XK_Editor_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _XK_Editor_vue_vue_type_template_id_ea0545fa___WEBPACK_IMPORTED_MODULE_0__["render"],
  _XK_Editor_vue_vue_type_template_id_ea0545fa___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "node_modules/xkeditor/src/components/XK_Editor.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./node_modules/xkeditor/src/components/XK_Editor.vue?vue&type=script&lang=js&":
/*!*************************************************************************************!*\
  !*** ./node_modules/xkeditor/src/components/XK_Editor.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _vue_loader_lib_index_js_vue_loader_options_XK_Editor_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../vue-loader/lib??vue-loader-options!./XK_Editor.vue?vue&type=script&lang=js& */ "./node_modules/vue-loader/lib/index.js?!./node_modules/xkeditor/src/components/XK_Editor.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_vue_loader_lib_index_js_vue_loader_options_XK_Editor_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./node_modules/xkeditor/src/components/XK_Editor.vue?vue&type=style&index=0&lang=css&":
/*!*********************************************************************************************!*\
  !*** ./node_modules/xkeditor/src/components/XK_Editor.vue?vue&type=style&index=0&lang=css& ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _style_loader_index_js_css_loader_index_js_ref_6_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_src_index_js_ref_6_2_vue_loader_lib_index_js_vue_loader_options_XK_Editor_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../style-loader!../../../css-loader??ref--6-1!../../../vue-loader/lib/loaders/stylePostLoader.js!../../../postcss-loader/src??ref--6-2!../../../vue-loader/lib??vue-loader-options!./XK_Editor.vue?vue&type=style&index=0&lang=css& */ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/xkeditor/src/components/XK_Editor.vue?vue&type=style&index=0&lang=css&");
/* harmony import */ var _style_loader_index_js_css_loader_index_js_ref_6_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_src_index_js_ref_6_2_vue_loader_lib_index_js_vue_loader_options_XK_Editor_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_style_loader_index_js_css_loader_index_js_ref_6_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_src_index_js_ref_6_2_vue_loader_lib_index_js_vue_loader_options_XK_Editor_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _style_loader_index_js_css_loader_index_js_ref_6_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_src_index_js_ref_6_2_vue_loader_lib_index_js_vue_loader_options_XK_Editor_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _style_loader_index_js_css_loader_index_js_ref_6_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_src_index_js_ref_6_2_vue_loader_lib_index_js_vue_loader_options_XK_Editor_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_style_loader_index_js_css_loader_index_js_ref_6_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_src_index_js_ref_6_2_vue_loader_lib_index_js_vue_loader_options_XK_Editor_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./node_modules/xkeditor/src/components/XK_Editor.vue?vue&type=template&id=ea0545fa&":
/*!*******************************************************************************************!*\
  !*** ./node_modules/xkeditor/src/components/XK_Editor.vue?vue&type=template&id=ea0545fa& ***!
  \*******************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _vue_loader_lib_loaders_templateLoader_js_vue_loader_options_vue_loader_lib_index_js_vue_loader_options_XK_Editor_vue_vue_type_template_id_ea0545fa___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../vue-loader/lib??vue-loader-options!./XK_Editor.vue?vue&type=template&id=ea0545fa& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/xkeditor/src/components/XK_Editor.vue?vue&type=template&id=ea0545fa&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _vue_loader_lib_loaders_templateLoader_js_vue_loader_options_vue_loader_lib_index_js_vue_loader_options_XK_Editor_vue_vue_type_template_id_ea0545fa___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _vue_loader_lib_loaders_templateLoader_js_vue_loader_options_vue_loader_lib_index_js_vue_loader_options_XK_Editor_vue_vue_type_template_id_ea0545fa___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./node_modules/xkeditor/src/index.js":
/*!********************************************!*\
  !*** ./node_modules/xkeditor/src/index.js ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_XK_Editor_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/XK_Editor.vue */ "./node_modules/xkeditor/src/components/XK_Editor.vue");


// XK_Editor.install = Vue => Vue.component(XK_Editor.name, XK_Editor);

/* harmony default export */ __webpack_exports__["default"] = (_components_XK_Editor_vue__WEBPACK_IMPORTED_MODULE_0__["default"]);


/***/ }),

/***/ "./node_modules/xkeditor/src/utils/axiosPro.js":
/*!*****************************************************!*\
  !*** ./node_modules/xkeditor/src/utils/axiosPro.js ***!
  \*****************************************************/
/*! exports provided: axiosPro, axios */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "axiosPro", function() { return axiosPro; });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (default from non-harmony) */ __webpack_require__.d(__webpack_exports__, "axios", function() { return axios__WEBPACK_IMPORTED_MODULE_0___default.a; });

const qs = __webpack_require__(/*! qs */ "./node_modules/qs/lib/index.js")
const axiosPro = {
  async get (url, data) {
    try {
      let res = await axios__WEBPACK_IMPORTED_MODULE_0___default.a.get(url, {params: data})
      res = res.data
      return new Promise((resolve) => {
        if (res.code === 0) {
          resolve(res)
        } else {
          resolve(res)
        }
      })
    } catch (err) {
      alert('服务器出错')
      console.log(err)
    }
  },
  async post (url, data) {
    try {
      let res = await axios__WEBPACK_IMPORTED_MODULE_0___default.a.post(url, qs.stringify(data))
      res = res.data
      return new Promise((resolve, reject) => {
        if (res.code === 0) {
          resolve(res)
        } else {
          reject(res)
        }
      })
    } catch (err) {
      // return (e.message)
      alert('服务器出错')
      console.log(err)
    }
  },
}


/***/ }),

/***/ "./node_modules/xkeditor/src/utils/dialogDrag.js":
/*!*******************************************************!*\
  !*** ./node_modules/xkeditor/src/utils/dialogDrag.js ***!
  \*******************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.common.js");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vue__WEBPACK_IMPORTED_MODULE_0__);

vue__WEBPACK_IMPORTED_MODULE_0___default.a.directive("dialogDrag", {
  bind(el, binding, vnode, oldVnode) {
    const dialogHeaderEl = el.querySelector(".xk-modal-header");
    const dragDom = el.querySelector(".xk-modal");
    //dialogHeaderEl.style.cursor = 'move';
    dialogHeaderEl.style.cssText += ";cursor:move;";
    dragDom.style.cssText += ";top:100px;";

    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const sty = (function() {
      if (window.document.currentStyle) {
        return (dom, attr) => dom.currentStyle[attr];
      } else {
        return (dom, attr) => getComputedStyle(dom, false)[attr];
      }
    })();

    dialogHeaderEl.onmousedown = e => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - dialogHeaderEl.offsetLeft;
      const disY = e.clientY - dialogHeaderEl.offsetTop;

      const screenWidth = document.body.clientWidth; // body当前宽度
      const screenHeight = document.documentElement.clientHeight; // 可见区域高度(应为body高度，可某些环境下无法获取)

      const dragDomWidth = dragDom.offsetWidth; // 对话框宽度
      const dragDomheight = dragDom.offsetHeight; // 对话框高度

      const minDragDomLeft = dragDom.offsetLeft;
      const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth;

      const minDragDomTop = dragDom.offsetTop;
      const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomheight;

      // 获取到的值带px 正则匹配替换
      let styL = sty(dragDom, "left");
      let styT = sty(dragDom, "top");

      // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
      if (styL.includes("%")) {
        styL = +document.body.clientWidth * (+styL.replace(/\%/g, "") / 100);
        styT = +document.body.clientHeight * (+styT.replace(/\%/g, "") / 100);
      } else {
        styL = +styL.replace(/\px/g, "");
        styT = +styT.replace(/\px/g, "");
      }

      document.onmousemove = function(e) {
        // 通过事件委托，计算移动的距离
        let left = e.clientX - disX;
        let top = e.clientY - disY;

        // 边界处理
        if (-left > minDragDomLeft) {
          left = -minDragDomLeft;
        } else if (left > maxDragDomLeft) {
          left = maxDragDomLeft;
        }

        if (-top > minDragDomTop) {
          top = -minDragDomTop;
        } else if (top > maxDragDomTop) {
          top = maxDragDomTop;
        }

        // 移动当前元素
        dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`;
      };

      document.onmouseup = function(e) {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  }
});

/***/ }),

/***/ "./node_modules/xkeditor/src/utils/switchContent.js":
/*!**********************************************************!*\
  !*** ./node_modules/xkeditor/src/utils/switchContent.js ***!
  \**********************************************************/
/*! exports provided: getTocHtml, toHtml, toMarkdown */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getTocHtml", function() { return getTocHtml; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toHtml", function() { return toHtml; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toMarkdown", function() { return toMarkdown; });
/* harmony import */ var marked__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! marked */ "./node_modules/marked/lib/marked.js");
/* harmony import */ var marked__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(marked__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var turndown__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! turndown */ "./node_modules/turndown/lib/turndown.es.js");
// "use strict";


var turndownGfm = __webpack_require__(/*! turndown-plugin-gfm */ "./node_modules/turndown-plugin-gfm/lib/turndown-plugin-gfm.es.js")

// import Prism from 'prismjs'
// import 'prismjs/themes/prism-okaidia.css'
// import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
// import 'prismjs/plugins/toolbar/prism-toolbar.css'
// import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.min'
// import EmojiConvertor from "emoji-js"

var emoji = new EmojiConvertor()
emoji.replace_mode = 'unified'

var tocContent = []
function getTocHtml() {
  var html = getTocHtmlTree(0, '')
  window.$toc = html
  return html
}
function getTocHtmlTree(index, str) {
  if(index >= tocContent.length) return str
  if(index == 0) {
    str += ''
  } else if(tocContent[index].level > tocContent[index-1].level) {
    for(let i = tocContent[index-1].level; i < tocContent[index].level; i++) {
      str += '<ul>'
    }
  } else if(tocContent[index].level < tocContent[index-1].level) {
    for(let i = tocContent[index].level; i < tocContent[index-1].level; i++) {
      str += '</ul></li>'
    }
  } else {
    str += '</li>'
  }
  var tocUrl = tocContent[index].title.toLowerCase().replace(/ /g, "-").replace(/[^\u4e00-\u9fa5a-zA-Z0-9-]/g, "")
  if (window.scrollMode === 'anchor') {
    tocUrl = '#' + tocUrl
  } else {
    tocUrl = 'javascript:sta(\'' + tocUrl + '\');'
  }
  str += '<li><img class="toc-img" src="/static/svg/disc.svg"><a href="' + tocUrl + '">' + tocContent[index].title + '</a>'
  return getTocHtmlTree(index+1, str)
}

var Languages = {
  "html":"HTML",
  "xml":"XML",
  "svg":"SVG",
  "mathml":"MathML",
  "css":"CSS",
  "clike":"C-like",
  "js":"JavaScript",
  "abap":"ABAP",
  "abnf":"Augmented Backus–Naur form",
  "apacheconf":"Apache Configuration",
  "apl":"APL",
  "arff":"ARFF",
  "asciidoc":"AsciiDoc",
  "adoc":"AsciiDoc",
  "asm6502":"6502 Assembly",
  "aspnet":"ASP.NET (C#)",
  "autohotkey":"AutoHotkey",
  "autoit":"AutoIt",
  "bash": "Bash",
  "shell":"Bash",
  "basic":"BASIC",
  "bnf":"Backus–Naur form",
  "rbnf":"Routing Backus–Naur form",
  "csharp":"C#",
  "dotnet":"C#",
  "cpp":"C++",
  "cil":"CIL",
  "coffee":"CoffeeScript",
  "cmake":"CMake",
  "csp":"Content-Security-Policy",
  "css-extras":"CSS Extras",
  "django":"Django/Jinja2",
  "jinja2":"Django/Jinja2",
  "dockerfile":"Docker",
  "ebnf":"Extended Backus–Naur form",
  "ejs":"EJS",
  "erb":"ERB",
  "fsharp":"F#",
  "gcode":"G-code",
  "gedcom":"GEDCOM",
  "glsl":"GLSL",
  "gml":"GameMaker Language",
  "gamemakerlanguage":"GameMaker Language",
  "graphql":"GraphQL",
  "hs":"Haskell",
  "hcl":"HCL",
  "http":"HTTP",
  "hpkp":"HTTP Public-Key-Pins",
  "hsts":"HTTP Strict-Transport-Security",
  "ichigojam":"IchigoJam",
  "inform7":"Inform 7",
  "javadoc":"JavaDoc",
  "javadoclike":"JavaDoc-like",
  "javastacktrace":"Java stack trace",
  "jsdoc":"JSDoc",
  "js-extras":"JS Extras",
  "json":"JSON",
  "jsonp":"JSONP",
  "json5":"JSON5",
  "latex":"LaTeX",
  "emacs":"Lisp",
  "elisp":"Lisp",
  "emacs-lisp":"Lisp",
  "lolcode":"LOLCODE",
  "md":"Markdown",
  "markup-templating":"Markup templating",
  "matlab":"MATLAB",
  "mel":"MEL",
  "n1ql":"N1QL",
  "n4js":"N4JS",
  "n4jsd":"N4JS",
  "nand2tetris-hdl":"Nand To Tetris HDL",
  "nasm":"NASM",
  "nginx":"nginx",
  "nsis":"NSIS",
  "objectivec":"Objective-C",
  "ocaml":"OCaml",
  "opencl":"OpenCL",
  "parigp":"PARI/GP",
  "objectpascal":"Object Pascal",
  "php":"PHP",
  "phpdoc":"PHPDoc",
  "php-extras":"PHP Extras",
  "plsql":"PL/SQL",
  "powershell":"PowerShell",
  "properties":".properties",
  "protobuf":"Protocol Buffers",
  "py":"Python",
  "q":"Q (kdb+ database)",
  "jsx":"React JSX",
  "tsx":"React TSX",
  "renpy":"Ren'py",
  "rest":"reST (reStructuredText)",
  "rb":"Ruby",
  "sas":"SAS",
  "sass":"Sass (Sass)",
  "scss":"Sass (Scss)",
  "sql":"SQL",
  "soy":"Soy (Closure Template)",
  "tap":"TAP",
  "toml":"TOML",
  "tt2":"Template Toolkit 2",
  "ts":"TypeScript",
  "t4-cs":"T4 Text Templates (C#)",
  "t4":"T4 Text Templates (C#)",
  "t4-vb":"T4 Text Templates (VB)",
  "t4-templating":"T4 templating",
  "vbnet":"VB.Net",
  "vhdl":"VHDL",
  "vim":"vim",
  "visual-basic":"Visual Basic",
  "vb":"Visual Basic",
  "wasm":"WebAssembly",
  "wiki":"Wiki markup",
  "xeoracube":"XeoraCube",
  "xojo":"Xojo (REALbasic)",
  "xquery":"XQuery",
  "yaml":"YAML",
  "yml":"YAML"
}

function toHtml(val, isFull) {
  tocContent = []
  var markedRenderer = new marked__WEBPACK_IMPORTED_MODULE_0___default.a.Renderer()
  markedRenderer.paragraph = function(text) {
    var args = arguments
    if(/\[(.*)]{(.*)}/g.test(text)) {
      args[0] = text.replace(/(\[([^\[\]]*)]{([^{}|]*)(\|span|\|p|\|font|\||)})/g, function($1, $2, $3, $4, $5) {
        if($5 == '|' || $5 == '' || $5 == null) {
          $5 = 'p'
        } else {
          $5 = $5.substring(1)
        }
        return '<' + $5 + ' style="' + $4 + '">' + $3 + '</' + $5 + '>'
      })
    }
    if(/\[TOC\]/g.test(text)) {
      args[0] = '<div class="toc"></div>'
    }
    if(/:(.*):/g.test(text)) {
      args[0] = text.replace(/(:.*:)/g, function($1, $2) {
        return emoji.replace_colons($2)
      })
    }
    return marked__WEBPACK_IMPORTED_MODULE_0___default.a.Renderer.prototype.paragraph.apply(this, args)
  }
  markedRenderer.heading = function(title, level) {
    var args = arguments
    tocContent.push({title: title, level: level})
    if(/:(.*):/g.test(title)) {
      args[0] = title.replace(/(:.*:)/g, function($1, $2) {
        return emoji.replace_colons($2)
      })
    }
    return marked__WEBPACK_IMPORTED_MODULE_0___default.a.Renderer.prototype.heading.apply(this, args)
  }
  markedRenderer.blockquote = function(quote) {
    var args = arguments
    if(/:(.*):/g.test(quote)) {
      args[0] = quote.replace(/(:.*:)/g, function($1, $2) {
        return emoji.replace_colons($2)
      })
    }
    return marked__WEBPACK_IMPORTED_MODULE_0___default.a.Renderer.prototype.blockquote.apply(this, args)
  }
  markedRenderer.code = function(code, language) {
    if(language === 'math' || language === "tex") {
      return '<pre class="xkeditor-tex">```' + language +'\n' + code + '\n```</pre>\n'
    }
    if(/flow(TB|BT|RL|LR|TD)$/.test(language)) {
      return '<pre class="xkeditor-mermaid">graph ' + language.substring(language.length-2) + '\n' + code + '</pre>'
    }
    if(language === 'seq') {
      return '<pre class="xkeditor-mermaid">sequenceDiagram\n' + code + '</pre>'
    }
    if(language === 'gantt') {
      return '<pre class="xkeditor-mermaid">gantt\n' + code + '</pre>'
    }
    if(language === 'mermaid') {
      return '<pre class="xkeditor-mermaid">' + code + '</pre>'
    }
    if(isFull) {
      var langTitle = Languages[language] || (language.substring(0, 1).toUpperCase() + language.substring(1)).replace(/s(?=cript)/, 'S')
      var lineNums = '<span></span>'.repeat(code.split('\n').length)
      if(Prism.languages[language] != null && Prism.languages[language] != undefined) {
        return '<div class="code-toolbar"><pre class="line-numbers language-' + language + '"><code class="language-' + language + '">' + Prism.highlight(code, Prism.languages[language], Prism.languages[language]) + '<span aria-hidden="true" class="line-numbers-rows">' + lineNums + '</code></pre><div class="toolbar"><div class="toolbar-item"><a>Copy</a></div><div class="toolbar-item"><span>' + langTitle + '</span></div></div></div>'
      } else {
        return '<pre class="line-numbers language- language-undefined"><code class="language- language-undefined">' + code + '<span aria-hidden="true" class="line-numbers-rows">' + lineNums + '</code></pre>'
      }
    }
    return marked__WEBPACK_IMPORTED_MODULE_0___default.a.Renderer.prototype.code.apply(this, arguments)
  }

  marked__WEBPACK_IMPORTED_MODULE_0___default.a.setOptions({
    langPrefix: "line-numbers language-",
    renderer: markedRenderer
  })
  return marked__WEBPACK_IMPORTED_MODULE_0___default()(val)
}

function toMarkdown(htmlVal, styleSwitch = true) {
  var turndownService = new turndown__WEBPACK_IMPORTED_MODULE_1__["default"]({
    headingStyle: "atx",
    hr: "---",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
    emDelimiter: "*"
  })
  turndownService.keep([
    "iframe",
    "style",
    "script",
    "title",
  ])
  turndownService.use(turndownGfm.gfm)
  turndownService.addRule('mermaid', {
    filter:  function (node) {
      return (node.nodeName === 'PRE')&&(node.classList.contains('xkeditor-mermaid'))
    },
    replacement: function (content, node) {
      return '\n\n```mermaid\n' + node.innerHTML.replace(/(<br \/>|<br>)/g, '\n') + '\n```\n'
    }
  })
  turndownService.addRule('math', {
    filter:  function (node) {
      return (node.nodeName === 'PRE')&&(node.classList.contains('xkeditor-tex'))
    },
    replacement: function (content, node) {
      return node.innerHTML.replace(/(<br \/>|<br>)/g, '\n')
    }
  })
  turndownService.addRule('prismjs', {
    filter:  function (node) {
      return (node.nodeName === 'PRE')&&(node.children.length > 0)&&(node.children[0].nodeName === 'CODE')&&(node.children[0].classList.length > 0)
    },
    replacement: function (content, node) {
      var lang = node.children[0].classList[1].substring(9)
      return '\n```' + lang + '\n' + content.replace(/(<br \/>|<br>)/g, '\n') + '\n```\n\n'
    }
  })
  turndownService.addRule('sup', {
    filter:  function (node) {
      return (node.nodeName === 'SUP')
    },
    replacement: function (content, node) {
      return '<sup>' + content + '</sup>'
    }
  })
  turndownService.addRule('sub', {
    filter:  function (node) {
      return (node.nodeName === 'SUB')
    },
    replacement: function (content, node) {
      return '<sub>' + content + '</sub>'
    }
  })
  if (styleSwitch) {
    turndownService.addRule('haveStyle', {
      filter:  function (node) {
        return (node.nodeName === 'FONT' || node.nodeName === 'P' || node.nodeName === 'SPAN')&&(node.getAttribute('style') !== null)
      },
      replacement: function (content, node) {
        var parseStyle = [
          'color',
          'font-size',
          'padding-left',
          'background-color',
          'text-align',
          'font-family'
        ]
        var out = node.outerHTML
        if(node.style.textDecoration === 'underline') {
          out = '<u>' + content + '</u>'
        } else if(node.style.textDecoration === 'line-through') {
          out = '~' + content + '~'
        } else {
          out = '[' + content + ']{'
          for(let i = 0; i < parseStyle.length; i++) {
            if(node.style[parseStyle[i]] !== '') {
              out += parseStyle[i] + ':' + node.style[parseStyle[i]] + ';'
            }
          }
          if(node.localName === 'p') {
            out += '}'
          } else {
            out += '|' + node.localName + '}'
          }
        }
        return out
      }
    })
  }
  return turndownService.turndown(htmlVal)
}


/***/ }),

/***/ "./resources/js/app.js":
/*!*****************************!*\
  !*** ./resources/js/app.js ***!
  \*****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _bootstrap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./bootstrap */ "./resources/js/bootstrap.js");
/* harmony import */ var _bootstrap__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_bootstrap__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.common.js");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(vue__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var vue_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vue-router */ "./node_modules/vue-router/dist/vue-router.esm.js");
/* harmony import */ var _routes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./routes */ "./resources/js/routes.js");



vue__WEBPACK_IMPORTED_MODULE_1___default.a.use(vue_router__WEBPACK_IMPORTED_MODULE_2__["default"]);

var router = new vue_router__WEBPACK_IMPORTED_MODULE_2__["default"]({
  routes: _routes__WEBPACK_IMPORTED_MODULE_3__["default"]
});
var app = new vue__WEBPACK_IMPORTED_MODULE_1___default.a({
  el: '#app',
  router: router
});

/***/ }),

/***/ "./resources/js/bootstrap.js":
/*!***********************************!*\
  !*** ./resources/js/bootstrap.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

window._ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

window.axios = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
/**
 * Next we will register the CSRF Token as a common header with Axios so that
 * all outgoing HTTP requests automatically have it attached. This is just
 * a simple convenience so we don't have to attach every token manually.
 */

var token = document.head.querySelector('meta[name="csrf-token"]');

if (token) {
  window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
  console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
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

/***/ }),

/***/ "./resources/js/components/Home.vue":
/*!******************************************!*\
  !*** ./resources/js/components/Home.vue ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Home_vue_vue_type_template_id_f2b6376c___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Home.vue?vue&type=template&id=f2b6376c& */ "./resources/js/components/Home.vue?vue&type=template&id=f2b6376c&");
/* harmony import */ var _Home_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Home.vue?vue&type=script&lang=js& */ "./resources/js/components/Home.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _Home_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Home.vue?vue&type=style&index=0&lang=css& */ "./resources/js/components/Home.vue?vue&type=style&index=0&lang=css&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _Home_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _Home_vue_vue_type_template_id_f2b6376c___WEBPACK_IMPORTED_MODULE_0__["render"],
  _Home_vue_vue_type_template_id_f2b6376c___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/Home.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/Home.vue?vue&type=script&lang=js&":
/*!*******************************************************************!*\
  !*** ./resources/js/components/Home.vue?vue&type=script&lang=js& ***!
  \*******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib??ref--4-0!../../../node_modules/vue-loader/lib??vue-loader-options!./Home.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/Home.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/Home.vue?vue&type=style&index=0&lang=css&":
/*!***************************************************************************!*\
  !*** ./resources/js/components/Home.vue?vue&type=style&index=0&lang=css& ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_6_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/style-loader!../../../node_modules/css-loader??ref--6-1!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src??ref--6-2!../../../node_modules/vue-loader/lib??vue-loader-options!./Home.vue?vue&type=style&index=0&lang=css& */ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/Home.vue?vue&type=style&index=0&lang=css&");
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_6_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_6_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_6_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_6_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_6_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./resources/js/components/Home.vue?vue&type=template&id=f2b6376c&":
/*!*************************************************************************!*\
  !*** ./resources/js/components/Home.vue?vue&type=template&id=f2b6376c& ***!
  \*************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_template_id_f2b6376c___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib??vue-loader-options!./Home.vue?vue&type=template&id=f2b6376c& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/Home.vue?vue&type=template&id=f2b6376c&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_template_id_f2b6376c___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_template_id_f2b6376c___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/routes.js":
/*!********************************!*\
  !*** ./resources/js/routes.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_Home_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/Home.vue */ "./resources/js/components/Home.vue");

var routes = [{
  path: '/',
  name: 'Home',
  component: _components_Home_vue__WEBPACK_IMPORTED_MODULE_0__["default"]
}];
/* harmony default export */ __webpack_exports__["default"] = (routes);

/***/ }),

/***/ "./resources/sass/app.scss":
/*!*********************************!*\
  !*** ./resources/sass/app.scss ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 0:
/*!*************************************************************!*\
  !*** multi ./resources/js/app.js ./resources/sass/app.scss ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! /home/coder/project/php/xknote/resources/js/app.js */"./resources/js/app.js");
module.exports = __webpack_require__(/*! /home/coder/project/php/xknote/resources/sass/app.scss */"./resources/sass/app.scss");


/***/ }),

/***/ 1:
/*!***********************!*\
  !*** jsdom (ignored) ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ })

},[[0,"/js/manifest","/js/vendor"]]]);