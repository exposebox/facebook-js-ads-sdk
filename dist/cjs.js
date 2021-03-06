'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get$1 = function get$1(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get$1(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};



var set$1 = function set$1(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set$1(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};















var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

/**
 * Isomorphic Http Promise Requests Class
 */

var Http = function () {
  function Http() {
    classCallCheck(this, Http);
  }

  createClass(Http, null, [{
    key: 'request',


    /**
     * Request
     * @param   {String}  method
     * @param   {String}  url
     * @param   {Object}  [data]
     * @param   {Object}  options
     * @return  {Promise}
     */
    value: function request(method, url, data) {
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

      var requestOnce = function requestOnce(method, url, data) {
        if (typeof window !== 'undefined' && window.XMLHttpRequest) {
          return Http.xmlHttpRequest(method, url, data);
        }
        return Http.requestPromise(method, url, data);
      };

      if (options.retry != null) {
        var requestOnceRetry = function requestOnceRetry(numberOfRetries) {
          return requestOnce(method, url, data).catch(function (err) {
            if (err.code !== 'ETIMEDOUT' || numberOfRetries === options.retry) {
              throw err;
            }

            var exponentialBackoffDelay = Math.pow(2, numberOfRetries) * 500 + Math.floor(Math.random() * 500);

            return new Promise(function (resolve, reject) {
              setTimeout(resolve, exponentialBackoffDelay);
            }).then(function () {
              return requestOnceRetry(numberOfRetries + 1);
            });
          });
        };

        return requestOnceRetry(0);
      } else {
        return requestOnce(method, url, data);
      }
    }

    /**
     * XmlHttpRequest request
     * @param   {String}  method
     * @param   {String}  url
     * @param   {Object}  [data]
     * @return  {Promise}
     */

  }, {
    key: 'xmlHttpRequest',
    value: function xmlHttpRequest(method, url, data) {
      return new Promise(function (resolve, reject) {
        var request = new window.XMLHttpRequest();
        request.open(method, url);
        request.onload = function () {
          try {
            var response = JSON.parse(request.response);

            if (request.status === 200) {
              resolve(response);
            } else {
              reject({
                body: response,
                status: request.status
              });
            }
          } catch (e) {
            reject({
              body: request.responseText,
              status: request.status
            });
          }
        };
        request.onerror = function () {
          reject({
            body: { error: { message: 'An unknown error occurred during the request.' } },
            status: request.status
          });
        };
        request.setRequestHeader('Content-Type', 'application/json');
        request.setRequestHeader('Accept', 'application/json');
        request.send(JSON.stringify(data));
      });
    }

    /**
     * Request Promise
     * @param   {String}  method
     * @param   {String}  url
     * @param   {Object}  [data]
     * @return  {Promise}
     */

  }, {
    key: 'requestPromise',
    value: function requestPromise(method, url, data) {
      var rp = require('request-promise');
      var options = {
        method: method,
        uri: url,
        json: true,
        headers: { 'User-Agent': 'Facebook-JS-Ads-SDK/' + FacebookAdsApi.VERSION }
      };
      if (data) {
        options.body = data;
      }
      return rp(options).catch(function (response) {
        response = {
          body: response.error ? response.error : response,
          status: response.statusCode
        };
        throw response;
      });
    }
  }]);
  return Http;
}();

function FacebookError(error) {
  this.name = 'FacebookError';
  this.message = error.message;
  this.stack = new Error().stack;
}
FacebookError.prototype = Object.create(Error.prototype);
FacebookError.prototype.constructor = FacebookError;

/**
 * Raised when an api request fails.
 */
var FacebookRequestError = function (_FacebookError) {
  inherits(FacebookRequestError, _FacebookError);

  /**
   * @param  {[Object}  response
   * @param  {String}   method
   * @param  {String}   url
   * @param  {Object}   data
   */
  function FacebookRequestError(response, method, url, data) {
    classCallCheck(this, FacebookRequestError);

    var error = response.body.error || response.body;
    var message = error.error_user_msg ? error.error_user_title + ': ' + error.error_user_msg : error.message;

    var _this = possibleConstructorReturn(this, (FacebookRequestError.__proto__ || Object.getPrototypeOf(FacebookRequestError)).call(this, message));

    _this.name = 'FacebookRequestError';
    _this.message = message;
    _this.status = response.status;
    _this.response = response.body;
    _this.method = method;
    _this.url = url;
    if (data) _this.data = data;
    return _this;
  }

  return FacebookRequestError;
}(FacebookError);

/**
 * Facebook Ads API
 */

var FacebookAdsApi = function () {
  createClass(FacebookAdsApi, null, [{
    key: 'VERSION',
    get: function get() {
      return 'v2.10';
    }
  }, {
    key: 'GRAPH',
    get: function get() {
      return 'https://graph.facebook.com';
    }

    /**
     * @param {String} accessToken
     * @param {String} [locale]
     */

  }]);

  function FacebookAdsApi(accessToken) {
    var locale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'en_US';
    classCallCheck(this, FacebookAdsApi);

    if (!accessToken) {
      throw new Error('Access token required');
    }
    this.accessToken = accessToken;
    this.locale = locale;
    this._debug = false;
  }

  /**
   * Instantiate an API and store it as the default
   * @param  {String} accessToken
   * @param  {String} [locale]
   * @return {FacebookAdsApi}
   */


  createClass(FacebookAdsApi, [{
    key: 'setDebug',
    value: function setDebug(flag) {
      this._debug = flag;
      return this;
    }

    /**
     * Http Request
     * @param  {String} method
     * @param  {String} path
     * @param  {Object} [params]
     * @return {Promise}
     */

  }, {
    key: 'call',
    value: function call(method, path) {
      var _this = this;

      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var url;
      if (method === 'POST' || method === 'PUT') {
        var data = params;
        params = {};
      }
      if (typeof path !== 'string' && !(path instanceof String)) {
        url = [FacebookAdsApi.GRAPH, FacebookAdsApi.VERSION].concat(toConsumableArray(path)).join('/');
        params['access_token'] = this.accessToken;
        url += '?' + FacebookAdsApi._encodeParams(params);
      } else {
        url = path;
      }

      return Http.request(method, url, data, { retry: 4 }).then(function (response) {
        if (_this._debug) console.log('200 ' + method + ' ' + url + ' ' + (data ? JSON.stringify(data) : ''));
        return Promise.resolve(response);
      }).catch(function (response) {
        if (_this._debug) {
          console.log(response.status + ' ' + method + ' ' + url + ' ' + (data ? JSON.stringify(data) : ''));
        }

        throw new FacebookRequestError(response, method, url, data);
      });
    }
  }], [{
    key: 'init',
    value: function init(accessToken, locale) {
      var api = new this(accessToken, locale);
      this.setDefaultApi(api);
      return api;
    }
  }, {
    key: 'setDefaultApi',
    value: function setDefaultApi(api) {
      this._defaultApi = api;
    }
  }, {
    key: 'getDefaultApi',
    value: function getDefaultApi() {
      return this._defaultApi;
    }
  }, {
    key: '_encodeParams',
    value: function _encodeParams(params) {
      return Object.keys(params).map(function (key) {
        var param = params[key];
        if ((typeof param === 'undefined' ? 'undefined' : _typeof(param)) === 'object') {
          param = param ? JSON.stringify(param) : '';
        }
        return encodeURIComponent(key) + '=' + encodeURIComponent(param);
      }).join('&');
    }
  }]);
  return FacebookAdsApi;
}();

/**
 * Abstract Object
 * Manages object data fields and provides matching properties
 */
var AbstractObject = function () {
  function AbstractObject(data) {
    var _this = this;

    classCallCheck(this, AbstractObject);

    this._data = {};
    if (this.constructor.Field === undefined) {
      throw new Error('A "Field" frozen object must be defined in the object class');
    }
    this._fields = Object.keys(this.constructor.Field);
    this._fields.forEach(function (field) {
      _this._defineProperty(field);
    });
    if (data) {
      this.setData(data);
    }
  }

  /**
   * Define data getter and setter field
   * @param {String} field
   */


  createClass(AbstractObject, [{
    key: '_defineProperty',
    value: function _defineProperty(field) {
      var _this2 = this;

      Object.defineProperty(this, field, {
        get: function get() {
          return _this2._data[field];
        },
        set: function set(value) {
          _this2._data[field] = value;
        },
        enumerable: true
      });
    }

    /**
     * Set data field
     * @param {String} field
     * @param {Mixed} value
     * @return this
     */

  }, {
    key: 'set',
    value: function set(field, value) {
      if (this._fields.indexOf(field) < 0) {
        this._defineProperty(field);
      }
      this[field] = value;
      return this;
    }

    /**
     * Set multiple data fields
     * @param {Object} data
     * @return this
     */

  }, {
    key: 'setData',
    value: function setData(data) {
      var _this3 = this;

      Object.keys(data).forEach(function (key) {
        _this3.set(key, data[key]);
      });
      return this;
    }

    /**
     * Export object data
     * @return {Object}
     */

  }, {
    key: 'exportData',
    value: function exportData() {
      return this._data;
    }
  }]);
  return AbstractObject;
}();

/**
 * Abstract Crud Object
 * Facebook Object basic persistence functions
 * @extends AbstractObject
 */
var AbstractCrudObject = function (_AbstractObject) {
  inherits(AbstractCrudObject, _AbstractObject);

  /**
   * @param  {Object} data Initial data
   * @param  {String} parentId
   * @param  {FacebookAdApi} [api]
   */
  function AbstractCrudObject(data, parentId, api) {
    classCallCheck(this, AbstractCrudObject);

    var _this4 = possibleConstructorReturn(this, (AbstractCrudObject.__proto__ || Object.getPrototypeOf(AbstractCrudObject)).call(this, data));

    _this4._parentId = parentId;
    _this4._api = api || FacebookAdsApi.getDefaultApi();
    if (data) {
      get$1(AbstractCrudObject.prototype.__proto__ || Object.getPrototypeOf(AbstractCrudObject.prototype), 'setData', _this4).call(_this4, data);
    }
    return _this4;
  }

  /**
   * Define data getter and setter recording changes
   * @param {String} field
   */


  createClass(AbstractCrudObject, [{
    key: '_defineProperty',
    value: function _defineProperty(field) {
      var _this5 = this;

      if (this._changes === undefined) {
        this._changes = {};
      }
      Object.defineProperty(this, field, {
        get: function get() {
          return _this5._data[field];
        },
        set: function set(value) {
          _this5._changes[field] = value;
          _this5._data[field] = value;
        },
        enumerable: true
      });
    }

    /**
     * Set object data as if it were read from the server. Wipes related changes
     * @param {Object} data
     * @return this
     */

  }, {
    key: 'setData',
    value: function setData(data) {
      var _this6 = this;

      get$1(AbstractCrudObject.prototype.__proto__ || Object.getPrototypeOf(AbstractCrudObject.prototype), 'setData', this).call(this, data);
      Object.keys(data).forEach(function (key) {
        delete _this6._changes[key];
      });
      return this;
    }

    /**
     * Export changed object data
     * @return {Object}
     */

  }, {
    key: 'exportData',
    value: function exportData() {
      return this._changes;
    }

    /**
     * Export object data
     * @return {Object}
     */

  }, {
    key: 'exportAllData',
    value: function exportAllData() {
      return this._data;
    }

    /**
     * Clear change history
     * @return this
     */

  }, {
    key: 'clearHistory',
    value: function clearHistory() {
      this._changes = {};
      return this;
    }

    /**
     * @throws {Error} if object has no id
     * @return {String}
     */

  }, {
    key: 'getId',
    value: function getId() {
      if (!this.id) {
        throw new Error(this.constructor.name + ' Id not defined');
      }
      return this.id;
    }

    /**
     * @throws {Error} if object has no parent id
     * @return {String}
     */

  }, {
    key: 'getParentId',
    value: function getParentId() {
      if (!this._parentId) {
        throw new Error(this.constructor.name + ' parentId not defined');
      }
      return this._parentId;
    }

    /**
     * @return {String}
     */

  }, {
    key: 'getNodePath',
    value: function getNodePath() {
      return this.getId();
    }

    /**
     * Return object API instance
     * @throws {Error} if object doesn't hold an API
     * @return {FacebookAdsApi}
     */

  }, {
    key: 'getApi',
    value: function getApi() {
      var api = this._api;
      if (!api) {
        throw new Error(this.constructor.name + ' does not yet have an associated api object.\n\n        Did you forget to instantiate an API session with: "FacebookAdsApi.init"?');
      }
      return api;
    }

    /**
     * Read object data
     * @param   {Array}   [fields]
     * @param   {Object}  [params]
     * @return  {Promise}
     */

  }, {
    key: 'read',
    value: function read(fields) {
      var _this7 = this;

      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var api = this.getApi();
      var path = [this.getNodePath()];
      if (fields) params['fields'] = fields.join(',');
      return new Promise(function (resolve, reject) {
        api.call('GET', path, params).then(function (data) {
          return resolve(_this7.setData(data));
        }).catch(reject);
      });
    }

    /**
     * Create object
     * @param   {Object}  [params]
     * @return  {Promise}
     */

  }, {
    key: 'create',
    value: function create() {
      var _this8 = this;

      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var api = this.getApi();
      var path = [this.getParentId(), this.constructor.getEndpoint()];
      params = Object.assign(params, this.exportData());
      return new Promise(function (resolve, reject) {
        api.call('POST', path, params).then(function (data) {
          if (path.indexOf('adimages') > -1) {
            data = data.images[params.name];
          }
          resolve(_this8.setData(data));
        }).catch(reject);
      });
    }

    /**
     * Update object
     * @param   {Object}  [params]
     * @return  {Promise}
     */

  }, {
    key: 'update',
    value: function update() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var api = this.getApi();
      var path = [this.getNodePath()];
      params = Object.assign(params, this.exportData());
      return new Promise(function (resolve, reject) {
        api.call('POST', path, params).then(function (data) {
          return resolve(data);
        }).catch(reject);
      });
    }

    /**
     * Delete object
     * @param   {Object}  [params]
     * @return  {Promise}
     */

  }, {
    key: 'delete',
    value: function _delete() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var api = this.getApi();
      var path = [this.getNodePath()];
      params = Object.assign(params, this.exportData());
      return new Promise(function (resolve, reject) {
        api.call('DELETE', path, params).then(function (data) {
          return resolve(data);
        }).catch(reject);
      });
    }

    /**
     * Create or Update object
     * @param   {Object}  [params]
     * @return  {Promise}
     */

  }, {
    key: 'save',
    value: function save(params) {
      if (this.id) return this.update(params);
      return this.create(params);
    }

    /**
     * Initialize Cursor to paginate on edges
     * @param  {Object}  targetClass
     * @param  {Array}   [fields]
     * @param  {Object}  [params]
     * @param  {String}  [endpoint]
     * @return {Cursor}
     */

  }, {
    key: 'getEdge',
    value: function getEdge(targetClass, fields) {
      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var enpoint = arguments[3];

      if (fields) params['fields'] = fields.join(',');
      var sourceObject = this;
      var cursor = new Cursor(sourceObject, targetClass, params, enpoint);
      return cursor.next();
    }

    /**
     * Read Objects by Ids
     * @param  {Array}          ids
     * @param  {Array}          [fields]
     * @param  {Object}         [params]
     * @param  {FacebookAdsApi} [api]
     * @return {Promise}
     */

  }], [{
    key: 'getByIds',
    value: function getByIds(ids, fields) {
      var _this9 = this;

      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var api = arguments[3];

      api = api || FacebookAdsApi.getDefaultApi();
      if (fields) params['fields'] = fields.join(',');
      params['ids'] = ids.join(',');
      return new Promise(function (resolve, reject) {
        return api.call('GET', [''], params).then(function (response) {
          var result = [];
          for (var id in response) {
            var data = response[id];
            var object = new _this9(data);
            result.push(object);
          }
          resolve(result);
        }).catch(reject);
      });
    }
  }]);
  return AbstractCrudObject;
}(AbstractObject);

/**
 * Cursor
 * Iterates over edge objects and controls pagination
 */
var Cursor = function (_Array) {
  inherits(Cursor, _Array);

  /**
   * @param  {Object} sourceObject
   * @param  {Object} targetClass
   * @param  {Object} [params]
   * @param  {String} [endpoint]
   */
  function Cursor(sourceObject, targetClass, params, endpoint) {
    classCallCheck(this, Cursor);

    var _this10 = possibleConstructorReturn(this, (Cursor.__proto__ || Object.getPrototypeOf(Cursor)).call(this, 0));

    var next = [sourceObject.getId()];
    next.push(endpoint || targetClass.getEndpoint());
    _this10._api = sourceObject.getApi();
    _this10._targetClass = targetClass;
    _this10.paging = { next: next };
    _this10.summary;

    _this10.clear = function () {
      _this10.length = 0;
    };

    _this10.set = function (array) {
      _this10.clear();
      _this10.push.apply(_this10, toConsumableArray(array));
    };

    _this10.next = function () {
      if (!_this10.hasNext()) {
        return Promise.reject(new RangeError('end of pagination'));
      }
      return _this10._loadPage(_this10.paging.next);
    };

    _this10.hasNext = function () {
      return Boolean(_this10.paging) && Boolean(_this10.paging.next);
    };

    _this10.previous = function () {
      if (!_this10.hasPrevious()) {
        return Promise.reject(new RangeError('start of pagination'));
      }
      return _this10._loadPage(_this10.paging.previous);
    };

    _this10.hasPrevious = function () {
      return Boolean(_this10.paging) && Boolean(_this10.paging.previous);
    };

    _this10._loadPage = function (path) {
      var promise = new Promise(function (resolve, reject) {
        _this10._api.call('GET', path, params).then(function (response) {
          var objects = _this10._buildObjectsFromResponse(response);
          _this10.set(objects);
          _this10.paging = response.paging;
          _this10.summary = response.summary;
          resolve(_this10);
        }).catch(reject);
      });
      if (params) params = undefined;
      return promise;
    };

    _this10._buildObjectsFromResponse = function (response) {
      return response.data.map(function (item) {
        return new _this10._targetClass(item, undefined, _this10._api);
      });
    };
    return _this10;
  }

  return Cursor;
}(Array);

var AdPreview = function (_AbstractObject) {
  inherits(AdPreview, _AbstractObject);

  function AdPreview() {
    classCallCheck(this, AdPreview);
    return possibleConstructorReturn(this, (AdPreview.__proto__ || Object.getPrototypeOf(AdPreview)).apply(this, arguments));
  }

  createClass(AdPreview, null, [{
    key: 'getEndpoint',
    value: function getEndpoint() {
      return 'previews';
    }
  }, {
    key: 'Field',
    get: function get() {
      return Object.freeze({
        body: 'body'
      });
    }
  }, {
    key: 'AdFormat',
    get: function get() {
      return Object.freeze({
        audience_network_outstream_video: 'AUDIENCE_NETWORK_OUTSTREAM_VIDEO',
        desktop_feed_standard: 'DESKTOP_FEED_STANDARD',
        instagram_standard: 'INSTAGRAM_STANDARD',
        instant_article_standard: 'INSTANT_ARTICLE_STANDARD',
        instream_video_desktop: 'INSTREAM_VIDEO_DESKTOP',
        instream_video_mobile: 'INSTREAM_VIDEO_MOBILE',
        mobile_banner: 'MOBILE_BANNER',
        mobile_feed_basic: 'MOBILE_FEED_BASIC',
        mobile_feed_standard: 'MOBILE_FEED_STANDARD',
        mobile_fullwidth: 'MOBILE_FULLWIDTH',
        mobile_interstitial: 'MOBILE_INTERSTITIAL',
        mobile_medium_rectangle: 'MOBILE_MEDIUM_RECTANGLE',
        mobile_native: 'MOBILE_NATIVE',
        right_column_standard: 'RIGHT_COLUMN_STANDARD'
      });
    }
  }]);
  return AdPreview;
}(AbstractObject);

var AdCreative = function (_AbstractCrudObject) {
  inherits(AdCreative, _AbstractCrudObject);

  function AdCreative() {
    classCallCheck(this, AdCreative);
    return possibleConstructorReturn(this, (AdCreative.__proto__ || Object.getPrototypeOf(AdCreative)).apply(this, arguments));
  }

  createClass(AdCreative, [{
    key: 'getPreviews',
    value: function getPreviews(fields, params) {
      return this.getEdge(AdPreview, fields, params, 'previews');
    }
  }], [{
    key: 'getEndpoint',
    value: function getEndpoint() {
      return 'adcreatives';
    }
  }, {
    key: 'Field',
    get: function get() {
      return Object.freeze({
        account_id: 'account_id',
        actor_id: 'actor_id',
        adlabels: 'adlabels',
        applink_treatment: 'applink_treatment',
        body: 'body',
        call_to_action: 'call_to_action',
        call_to_action_type: 'call_to_action_type',
        dynamic_ad_voice: 'dynamic_ad_voice',
        effective_instagram_story_id: 'effective_instagram_story_id',
        effective_object_story_id: 'effective_object_story_id',
        id: 'id',
        image_crops: 'image_crops',
        image_file: 'image_file',
        image_hash: 'image_hash',
        image_url: 'image_url',
        instagram_actor_id: 'instagram_actor_id',
        instagram_permalink_url: 'instagram_permalink_url',
        instagram_story_id: 'instagram_story_id',
        link_og_id: 'link_og_id',
        link_url: 'link_url',
        name: 'name',
        object_id: 'object_id',
        object_story_id: 'object_story_id',
        object_story_spec: 'object_story_spec',
        object_type: 'object_type',
        object_url: 'object_url',
        platform_customizations: 'platform_customizations',
        product_set_id: 'product_set_id',
        status: 'status',
        template_url: 'template_url',
        template_url_spec: 'template_url_spec',
        thumbnail_url: 'thumbnail_url',
        title: 'title',
        url_tags: 'url_tags',
        use_page_actor_override: 'use_page_actor_override',
        video_id: 'video_id'
      });
    }
  }, {
    key: 'ApplinkTreatment',
    get: function get() {
      return Object.freeze({
        deeplink_with_appstore_fallback: 'deeplink_with_appstore_fallback',
        deeplink_with_web_fallback: 'deeplink_with_web_fallback',
        web_only: 'web_only'
      });
    }
  }, {
    key: 'CallToActionType',
    get: function get() {
      return Object.freeze({
        apply_now: 'APPLY_NOW',
        book_travel: 'BOOK_TRAVEL',
        buy_now: 'BUY_NOW',
        call_now: 'CALL_NOW',
        contact_us: 'CONTACT_US',
        donate_now: 'DONATE_NOW',
        download: 'DOWNLOAD',
        get_directions: 'GET_DIRECTIONS',
        get_offer: 'GET_OFFER',
        get_offer_view: 'GET_OFFER_VIEW',
        get_quote: 'GET_QUOTE',
        install_app: 'INSTALL_APP',
        install_mobile_app: 'INSTALL_MOBILE_APP',
        learn_more: 'LEARN_MORE',
        like_page: 'LIKE_PAGE',
        listen_music: 'LISTEN_MUSIC',
        message_page: 'MESSAGE_PAGE',
        message_user: 'MESSAGE_USER',
        no_button: 'NO_BUTTON',
        open_link: 'OPEN_LINK',
        open_movies: 'OPEN_MOVIES',
        play_game: 'PLAY_GAME',
        record_now: 'RECORD_NOW',
        register_now: 'REGISTER_NOW',
        request_time: 'REQUEST_TIME',
        see_menu: 'SEE_MENU',
        sell_now: 'SELL_NOW',
        shop_now: 'SHOP_NOW',
        sign_up: 'SIGN_UP',
        subscribe: 'SUBSCRIBE',
        use_app: 'USE_APP',
        use_mobile_app: 'USE_MOBILE_APP',
        vote_now: 'VOTE_NOW',
        watch_more: 'WATCH_MORE'
      });
    }
  }, {
    key: 'ObjectType',
    get: function get() {
      return Object.freeze({
        application: 'APPLICATION',
        domain: 'DOMAIN',
        event: 'EVENT',
        invalid: 'INVALID',
        offer: 'OFFER',
        page: 'PAGE',
        photo: 'PHOTO',
        share: 'SHARE',
        status: 'STATUS',
        store_item: 'STORE_ITEM',
        video: 'VIDEO'
      });
    }
  }, {
    key: 'Status',
    get: function get() {
      return Object.freeze({
        active: 'ACTIVE',
        deleted: 'DELETED'
      });
    }
  }, {
    key: 'DynamicAdVoice',
    get: function get() {
      return Object.freeze({
        dynamic: 'DYNAMIC',
        story_owner: 'STORY_OWNER'
      });
    }
  }, {
    key: 'Operator',
    get: function get() {
      return Object.freeze({
        all: 'ALL',
        any: 'ANY'
      });
    }
  }]);
  return AdCreative;
}(AbstractCrudObject);

var AdKeywordStats = function (_AbstractCrudObject) {
  inherits(AdKeywordStats, _AbstractCrudObject);

  function AdKeywordStats() {
    classCallCheck(this, AdKeywordStats);
    return possibleConstructorReturn(this, (AdKeywordStats.__proto__ || Object.getPrototypeOf(AdKeywordStats)).apply(this, arguments));
  }

  createClass(AdKeywordStats, null, [{
    key: 'getEndpoint',
    value: function getEndpoint() {
      return 'keywordstats';
    }
  }, {
    key: 'Field',
    get: function get() {
      return Object.freeze({
        actions: 'actions',
        clicks: 'clicks',
        cost_per_total_action: 'cost_per_total_action',
        cost_per_unique_click: 'cost_per_unique_click',
        cpc: 'cpc',
        cpm: 'cpm',
        cpp: 'cpp',
        ctr: 'ctr',
        frequency: 'frequency',
        id: 'id',
        impressions: 'impressions',
        name: 'name',
        reach: 'reach',
        spend: 'spend',
        total_actions: 'total_actions',
        total_unique_actions: 'total_unique_actions',
        unique_actions: 'unique_actions',
        unique_clicks: 'unique_clicks',
        unique_ctr: 'unique_ctr',
        unique_impressions: 'unique_impressions'
      });
    }
  }]);
  return AdKeywordStats;
}(AbstractCrudObject);

var AdsInsights = function (_AbstractObject) {
  inherits(AdsInsights, _AbstractObject);

  function AdsInsights() {
    classCallCheck(this, AdsInsights);
    return possibleConstructorReturn(this, (AdsInsights.__proto__ || Object.getPrototypeOf(AdsInsights)).apply(this, arguments));
  }

  createClass(AdsInsights, null, [{
    key: 'getEndpoint',
    value: function getEndpoint() {
      return 'insights';
    }
  }, {
    key: 'Field',
    get: function get() {
      return Object.freeze({
        account_id: 'account_id',
        account_name: 'account_name',
        action_values: 'action_values',
        actions: 'actions',
        ad_id: 'ad_id',
        ad_name: 'ad_name',
        adset_id: 'adset_id',
        adset_name: 'adset_name',
        age: 'age',
        app_store_clicks: 'app_store_clicks',
        buying_type: 'buying_type',
        call_to_action_asset: 'call_to_action_asset',
        call_to_action_clicks: 'call_to_action_clicks',
        campaign_id: 'campaign_id',
        campaign_name: 'campaign_name',
        canvas_avg_view_percent: 'canvas_avg_view_percent',
        canvas_avg_view_time: 'canvas_avg_view_time',
        canvas_component_avg_pct_view: 'canvas_component_avg_pct_view',
        clicks: 'clicks',
        cost_per_10_sec_video_view: 'cost_per_10_sec_video_view',
        cost_per_action_type: 'cost_per_action_type',
        cost_per_estimated_ad_recallers: 'cost_per_estimated_ad_recallers',
        cost_per_inline_link_click: 'cost_per_inline_link_click',
        cost_per_inline_post_engagement: 'cost_per_inline_post_engagement',
        cost_per_total_action: 'cost_per_total_action',
        cost_per_unique_action_type: 'cost_per_unique_action_type',
        cost_per_unique_click: 'cost_per_unique_click',
        cost_per_unique_inline_link_click: 'cost_per_unique_inline_link_click',
        country: 'country',
        cpc: 'cpc',
        cpm: 'cpm',
        cpp: 'cpp',
        ctr: 'ctr',
        date_start: 'date_start',
        date_stop: 'date_stop',
        deeplink_clicks: 'deeplink_clicks',
        device_platform: 'device_platform',
        dma: 'dma',
        estimated_ad_recall_rate: 'estimated_ad_recall_rate',
        estimated_ad_recallers: 'estimated_ad_recallers',
        frequency: 'frequency',
        frequency_value: 'frequency_value',
        gender: 'gender',
        hourly_stats_aggregated_by_advertiser_time_zone: 'hourly_stats_aggregated_by_advertiser_time_zone',
        hourly_stats_aggregated_by_audience_time_zone: 'hourly_stats_aggregated_by_audience_time_zone',
        impression_device: 'impression_device',
        impressions: 'impressions',
        impressions_dummy: 'impressions_dummy',
        inline_link_click_ctr: 'inline_link_click_ctr',
        inline_link_clicks: 'inline_link_clicks',
        inline_post_engagement: 'inline_post_engagement',
        objective: 'objective',
        place_page_id: 'place_page_id',
        place_page_name: 'place_page_name',
        placement: 'placement',
        product_id: 'product_id',
        reach: 'reach',
        region: 'region',
        relevance_score: 'relevance_score',
        social_clicks: 'social_clicks',
        social_impressions: 'social_impressions',
        social_reach: 'social_reach',
        social_spend: 'social_spend',
        spend: 'spend',
        total_action_value: 'total_action_value',
        total_actions: 'total_actions',
        total_unique_actions: 'total_unique_actions',
        unique_actions: 'unique_actions',
        unique_clicks: 'unique_clicks',
        unique_ctr: 'unique_ctr',
        unique_inline_link_click_ctr: 'unique_inline_link_click_ctr',
        unique_inline_link_clicks: 'unique_inline_link_clicks',
        unique_link_clicks_ctr: 'unique_link_clicks_ctr',
        unique_social_clicks: 'unique_social_clicks',
        video_10_sec_watched_actions: 'video_10_sec_watched_actions',
        video_15_sec_watched_actions: 'video_15_sec_watched_actions',
        video_30_sec_watched_actions: 'video_30_sec_watched_actions',
        video_avg_percent_watched_actions: 'video_avg_percent_watched_actions',
        video_avg_time_watched_actions: 'video_avg_time_watched_actions',
        video_p100_watched_actions: 'video_p100_watched_actions',
        video_p25_watched_actions: 'video_p25_watched_actions',
        video_p50_watched_actions: 'video_p50_watched_actions',
        video_p75_watched_actions: 'video_p75_watched_actions',
        video_p95_watched_actions: 'video_p95_watched_actions',
        website_clicks: 'website_clicks',
        website_ctr: 'website_ctr'
      });
    }
  }, {
    key: 'ActionAttributionWindows',
    get: function get() {
      return Object.freeze({
        value_1d_click: '1d_click',
        value_1d_view: '1d_view',
        value_28d_click: '28d_click',
        value_28d_view: '28d_view',
        value_7d_click: '7d_click',
        value_7d_view: '7d_view',
        value_default: 'default'
      });
    }
  }, {
    key: 'ActionBreakdowns',
    get: function get() {
      return Object.freeze({
        action_canvas_component_name: 'action_canvas_component_name',
        action_carousel_card_id: 'action_carousel_card_id',
        action_carousel_card_name: 'action_carousel_card_name',
        action_destination: 'action_destination',
        action_device: 'action_device',
        action_reaction: 'action_reaction',
        action_target_id: 'action_target_id',
        action_type: 'action_type',
        action_video_sound: 'action_video_sound',
        action_video_type: 'action_video_type'
      });
    }
  }, {
    key: 'ActionReportTime',
    get: function get() {
      return Object.freeze({
        conversion: 'conversion',
        impression: 'impression'
      });
    }
  }, {
    key: 'Breakdowns',
    get: function get() {
      return Object.freeze({
        age: 'age',
        country: 'country',
        device_platform: 'device_platform',
        dma: 'dma',
        frequency_value: 'frequency_value',
        gender: 'gender',
        hourly_stats_aggregated_by_advertiser_time_zone: 'hourly_stats_aggregated_by_advertiser_time_zone',
        hourly_stats_aggregated_by_audience_time_zone: 'hourly_stats_aggregated_by_audience_time_zone',
        impression_device: 'impression_device',
        place_page_id: 'place_page_id',
        platform_position: 'platform_position',
        product_id: 'product_id',
        publisher_platform: 'publisher_platform',
        region: 'region'
      });
    }
  }, {
    key: 'DatePreset',
    get: function get() {
      return Object.freeze({
        last_14d: 'last_14d',
        last_28d: 'last_28d',
        last_30d: 'last_30d',
        last_3d: 'last_3d',
        last_7d: 'last_7d',
        last_90d: 'last_90d',
        last_month: 'last_month',
        last_quarter: 'last_quarter',
        last_week_mon_sun: 'last_week_mon_sun',
        last_week_sun_sat: 'last_week_sun_sat',
        last_year: 'last_year',
        lifetime: 'lifetime',
        this_month: 'this_month',
        this_quarter: 'this_quarter',
        this_week_mon_today: 'this_week_mon_today',
        this_week_sun_today: 'this_week_sun_today',
        this_year: 'this_year',
        today: 'today',
        yesterday: 'yesterday'
      });
    }
  }, {
    key: 'Level',
    get: function get() {
      return Object.freeze({
        account: 'account',
        ad: 'ad',
        adset: 'adset',
        campaign: 'campaign'
      });
    }
  }, {
    key: 'SummaryActionBreakdowns',
    get: function get() {
      return Object.freeze({
        action_canvas_component_name: 'action_canvas_component_name',
        action_carousel_card_id: 'action_carousel_card_id',
        action_carousel_card_name: 'action_carousel_card_name',
        action_destination: 'action_destination',
        action_device: 'action_device',
        action_reaction: 'action_reaction',
        action_target_id: 'action_target_id',
        action_type: 'action_type',
        action_video_sound: 'action_video_sound',
        action_video_type: 'action_video_type'
      });
    }
  }, {
    key: 'Summary',
    get: function get() {
      return Object.freeze({
        account_id: 'account_id',
        async_percent_completion: 'async_percent_completion',
        async_status: 'async_status',
        date_start: 'date_start',
        date_stop: 'date_stop',
        emails: 'emails',
        friendly_name: 'friendly_name',
        id: 'id',
        is_bookmarked: 'is_bookmarked',
        is_running: 'is_running',
        schedule_id: 'schedule_id',
        time_completed: 'time_completed',
        time_ref: 'time_ref'
      });
    }
  }]);
  return AdsInsights;
}(AbstractObject);

var AdReportRun = function (_AbstractCrudObject) {
  inherits(AdReportRun, _AbstractCrudObject);

  function AdReportRun() {
    classCallCheck(this, AdReportRun);
    return possibleConstructorReturn(this, (AdReportRun.__proto__ || Object.getPrototypeOf(AdReportRun)).apply(this, arguments));
  }

  createClass(AdReportRun, [{
    key: 'getInsights',
    value: function getInsights(fields, params) {
      return this.getEdge(AdsInsights, fields, params, 'insights');
    }
  }], [{
    key: 'getEndpoint',
    value: function getEndpoint() {
      return 'insights';
    }
  }, {
    key: 'Field',
    get: function get() {
      return Object.freeze({
        account_id: 'account_id',
        action_attribution_windows: 'action_attribution_windows',
        action_breakdowns: 'action_breakdowns',
        action_report_time: 'action_report_time',
        async_percent_completion: 'async_percent_completion',
        async_status: 'async_status',
        breakdowns: 'breakdowns',
        date_preset: 'date_preset',
        date_start: 'date_start',
        date_stop: 'date_stop',
        default_summary: 'default_summary',
        emails: 'emails',
        export_columns: 'export_columns',
        export_format: 'export_format',
        export_name: 'export_name',
        fields: 'fields',
        filtering: 'filtering',
        friendly_name: 'friendly_name',
        id: 'id',
        is_bookmarked: 'is_bookmarked',
        is_running: 'is_running',
        level: 'level',
        product_id_limit: 'product_id_limit',
        schedule_id: 'schedule_id',
        sort: 'sort',
        summary: 'summary',
        summary_action_breakdowns: 'summary_action_breakdowns',
        time_completed: 'time_completed',
        time_increment: 'time_increment',
        time_range: 'time_range',
        time_ranges: 'time_ranges',
        time_ref: 'time_ref'
      });
    }
  }]);
  return AdReportRun;
}(AbstractCrudObject);

var Lead = function (_AbstractCrudObject) {
  inherits(Lead, _AbstractCrudObject);

  function Lead() {
    classCallCheck(this, Lead);
    return possibleConstructorReturn(this, (Lead.__proto__ || Object.getPrototypeOf(Lead)).apply(this, arguments));
  }

  createClass(Lead, null, [{
    key: 'getEndpoint',
    value: function getEndpoint() {
      return 'leads';
    }
  }, {
    key: 'Field',
    get: function get() {
      return Object.freeze({
        ad_id: 'ad_id',
        ad_name: 'ad_name',
        adset_id: 'adset_id',
        adset_name: 'adset_name',
        campaign_id: 'campaign_id',
        campaign_name: 'campaign_name',
        created_time: 'created_time',
        custom_disclaimer_responses: 'custom_disclaimer_responses',
        field_data: 'field_data',
        form_id: 'form_id',
        id: 'id',
        is_organic: 'is_organic',
        post: 'post',
        retailer_item_id: 'retailer_item_id'
      });
    }
  }]);
  return Lead;
}(AbstractCrudObject);

var TargetingSentenceLine = function (_AbstractCrudObject) {
  inherits(TargetingSentenceLine, _AbstractCrudObject);

  function TargetingSentenceLine() {
    classCallCheck(this, TargetingSentenceLine);
    return possibleConstructorReturn(this, (TargetingSentenceLine.__proto__ || Object.getPrototypeOf(TargetingSentenceLine)).apply(this, arguments));
  }

  createClass(TargetingSentenceLine, null, [{
    key: 'getEndpoint',
    value: function getEndpoint() {
      return 'targetingsentencelines';
    }
  }, {
    key: 'Field',
    get: function get() {
      return Object.freeze({
        id: 'id',
        params: 'params',
        targetingsentencelines: 'targetingsentencelines'
      });
    }
  }]);
  return TargetingSentenceLine;
}(AbstractCrudObject);

var Ad = function (_AbstractCrudObject) {
  inherits(Ad, _AbstractCrudObject);

  function Ad() {
    classCallCheck(this, Ad);
    return possibleConstructorReturn(this, (Ad.__proto__ || Object.getPrototypeOf(Ad)).apply(this, arguments));
  }

  createClass(Ad, [{
    key: 'getAdCreatives',
    value: function getAdCreatives(fields, params) {
      return this.getEdge(AdCreative, fields, params, 'adcreatives');
    }
  }, {
    key: 'getInsights',
    value: function getInsights(fields, params) {
      return this.getEdge(AdsInsights, fields, params, 'insights');
    }
  }, {
    key: 'getInsightsAsync',
    value: function getInsightsAsync(fields, params) {
      return this.getEdge(AdReportRun, fields, params, 'insights');
    }
  }, {
    key: 'getKeywordStats',
    value: function getKeywordStats(fields, params) {
      return this.getEdge(AdKeywordStats, fields, params, 'keywordstats');
    }
  }, {
    key: 'getLeads',
    value: function getLeads(fields, params) {
      return this.getEdge(Lead, fields, params, 'leads');
    }
  }, {
    key: 'getPreviews',
    value: function getPreviews(fields, params) {
      return this.getEdge(AdPreview, fields, params, 'previews');
    }
  }, {
    key: 'getTargetingSentenceLines',
    value: function getTargetingSentenceLines(fields, params) {
      return this.getEdge(TargetingSentenceLine, fields, params, 'targetingsentencelines');
    }
  }], [{
    key: 'getEndpoint',
    value: function getEndpoint() {
      return 'ads';
    }
  }, {
    key: 'Field',
    get: function get() {
      return Object.freeze({
        account_id: 'account_id',
        ad_review_feedback: 'ad_review_feedback',
        adlabels: 'adlabels',
        adset: 'adset',
        adset_id: 'adset_id',
        adset_spec: 'adset_spec',
        bid_amount: 'bid_amount',
        bid_info: 'bid_info',
        bid_type: 'bid_type',
        campaign: 'campaign',
        campaign_id: 'campaign_id',
        configured_status: 'configured_status',
        conversion_specs: 'conversion_specs',
        created_time: 'created_time',
        creative: 'creative',
        date_format: 'date_format',
        display_sequence: 'display_sequence',
        effective_status: 'effective_status',
        execution_options: 'execution_options',
        filename: 'filename',
        id: 'id',
        last_updated_by_app_id: 'last_updated_by_app_id',
        name: 'name',
        recommendations: 'recommendations',
        redownload: 'redownload',
        status: 'status',
        tracking_specs: 'tracking_specs',
        updated_time: 'updated_time'
      });
    }
  }, {
    key: 'BidType',
    get: function get() {
      return Object.freeze({
        absolute_ocpm: 'ABSOLUTE_OCPM',
        cpa: 'CPA',
        cpc: 'CPC',
        cpm: 'CPM',
        multi_premium: 'MULTI_PREMIUM'
      });
    }
  }, {
    key: 'ConfiguredStatus',
    get: function get() {
      return Object.freeze({
        active: 'ACTIVE',
        archived: 'ARCHIVED',
        deleted: 'DELETED',
        paused: 'PAUSED'
      });
    }
  }, {
    key: 'EffectiveStatus',
    get: function get() {
      return Object.freeze({
        active: 'ACTIVE',
        adset_paused: 'ADSET_PAUSED',
        archived: 'ARCHIVED',
        campaign_paused: 'CAMPAIGN_PAUSED',
        deleted: 'DELETED',
        disapproved: 'DISAPPROVED',
        paused: 'PAUSED',
        pending_billing_info: 'PENDING_BILLING_INFO',
        pending_review: 'PENDING_REVIEW',
        preapproved: 'PREAPPROVED'
      });
    }
  }, {
    key: 'Status',
    get: function get() {
      return Object.freeze({
        active: 'ACTIVE',
        archived: 'ARCHIVED',
        deleted: 'DELETED',
        paused: 'PAUSED'
      });
    }
  }, {
    key: 'DatePreset',
    get: function get() {
      return Object.freeze({
        last_14d: 'last_14d',
        last_28d: 'last_28d',
        last_30d: 'last_30d',
        last_3d: 'last_3d',
        last_7d: 'last_7d',
        last_90d: 'last_90d',
        last_month: 'last_month',
        last_quarter: 'last_quarter',
        last_week_mon_sun: 'last_week_mon_sun',
        last_week_sun_sat: 'last_week_sun_sat',
        last_year: 'last_year',
        lifetime: 'lifetime',
        this_month: 'this_month',
        this_quarter: 'this_quarter',
        this_week_mon_today: 'this_week_mon_today',
        this_week_sun_today: 'this_week_sun_today',
        this_year: 'this_year',
        today: 'today',
        yesterday: 'yesterday'
      });
    }
  }, {
    key: 'ExecutionOptions',
    get: function get() {
      return Object.freeze({
        include_recommendations: 'include_recommendations',
        synchronous_ad_review: 'synchronous_ad_review',
        validate_only: 'validate_only'
      });
    }
  }, {
    key: 'Operator',
    get: function get() {
      return Object.freeze({
        all: 'ALL',
        any: 'ANY'
      });
    }
  }]);
  return Ad;
}(AbstractCrudObject);

var AdAccountRoas = function (_AbstractObject) {
  inherits(AdAccountRoas, _AbstractObject);

  function AdAccountRoas() {
    classCallCheck(this, AdAccountRoas);
    return possibleConstructorReturn(this, (AdAccountRoas.__proto__ || Object.getPrototypeOf(AdAccountRoas)).apply(this, arguments));
  }

  createClass(AdAccountRoas, null, [{
    key: 'Field',
    get: function get() {
      return Object.freeze({
        adgroup_id: 'adgroup_id',
        arpu_180d: 'arpu_180d',
        arpu_1d: 'arpu_1d',
        arpu_30d: 'arpu_30d',
        arpu_365d: 'arpu_365d',
        arpu_3d: 'arpu_3d',
        arpu_7d: 'arpu_7d',
        arpu_90d: 'arpu_90d',
        campaign_group_id: 'campaign_group_id',
        campaign_id: 'campaign_id',
        date_start: 'date_start',
        date_stop: 'date_stop',
        installs: 'installs',
        revenue: 'revenue',
        revenue_180d: 'revenue_180d',
        revenue_1d: 'revenue_1d',
        revenue_30d: 'revenue_30d',
        revenue_365d: 'revenue_365d',
        revenue_3d: 'revenue_3d',
        revenue_7d: 'revenue_7d',
        revenue_90d: 'revenue_90d',
        spend: 'spend',
        yield_180d: 'yield_180d',
        yield_1d: 'yield_1d',
        yield_30d: 'yield_30d',
        yield_365d: 'yield_365d',
        yield_3d: 'yield_3d',
        yield_7d: 'yield_7d',
        yield_90d: 'yield_90d'
      });
    }
  }]);
  return AdAccountRoas;
}(AbstractObject);

var AdAccountTargetingUnified = function (_AbstractCrudObject) {
  inherits(AdAccountTargetingUnified, _AbstractCrudObject);

  function AdAccountTargetingUnified() {
    classCallCheck(this, AdAccountTargetingUnified);
    return possibleConstructorReturn(this, (AdAccountTargetingUnified.__proto__ || Object.getPrototypeOf(AdAccountTargetingUnified)).apply(this, arguments));
  }

  createClass(AdAccountTargetingUnified, null, [{
    key: 'Field',
    get: function get() {
      return Object.freeze({
        audience_size: 'audience_size',
        description: 'description',
        id: 'id',
        name: 'name',
        path: 'path',
        type: 'type',
        valid: 'valid'
      });
    }
  }, {
    key: 'LimitType',
    get: function get() {
      return Object.freeze({
        adgroup_id: 'adgroup_id',
        age_max: 'age_max',
        age_min: 'age_min',
        alternate_auto_targeting_option: 'alternate_auto_targeting_option',
        app_install_state: 'app_install_state',
        audience_network_positions: 'audience_network_positions',
        behaviors: 'behaviors',
        cities: 'cities',
        college_years: 'college_years',
        conjunctive_user_adclusters: 'conjunctive_user_adclusters',
        connections: 'connections',
        countries: 'countries',
        country: 'country',
        country_groups: 'country_groups',
        custom_audiences: 'custom_audiences',
        device_platforms: 'device_platforms',
        dynamic_audience_ids: 'dynamic_audience_ids',
        education_majors: 'education_majors',
        education_schools: 'education_schools',
        education_statuses: 'education_statuses',
        effective_audience_network_positions: 'effective_audience_network_positions',
        effective_device_platforms: 'effective_device_platforms',
        effective_facebook_positions: 'effective_facebook_positions',
        effective_instagram_positions: 'effective_instagram_positions',
        effective_messenger_positions: 'effective_messenger_positions',
        effective_publisher_platforms: 'effective_publisher_platforms',
        engagement_specs: 'engagement_specs',
        ethnic_affinity: 'ethnic_affinity',
        exclude_previous_days: 'exclude_previous_days',
        exclude_reached_since: 'exclude_reached_since',
        excluded_connections: 'excluded_connections',
        excluded_custom_audiences: 'excluded_custom_audiences',
        excluded_dynamic_audience_ids: 'excluded_dynamic_audience_ids',
        excluded_engagement_specs: 'excluded_engagement_specs',
        excluded_geo_locations: 'excluded_geo_locations',
        excluded_mobile_device_model: 'excluded_mobile_device_model',
        excluded_product_audience_specs: 'excluded_product_audience_specs',
        excluded_publisher_categories: 'excluded_publisher_categories',
        excluded_publisher_domains: 'excluded_publisher_domains',
        excluded_publisher_list_ids: 'excluded_publisher_list_ids',
        excluded_user_adclusters: 'excluded_user_adclusters',
        excluded_user_device: 'excluded_user_device',
        exclusions: 'exclusions',
        facebook_positions: 'facebook_positions',
        family_statuses: 'family_statuses',
        fb_deal_id: 'fb_deal_id',
        flexible_spec: 'flexible_spec',
        friends_of_connections: 'friends_of_connections',
        genders: 'genders',
        generation: 'generation',
        geo_locations: 'geo_locations',
        home_ownership: 'home_ownership',
        home_type: 'home_type',
        home_value: 'home_value',
        household_composition: 'household_composition',
        income: 'income',
        industries: 'industries',
        instagram_positions: 'instagram_positions',
        interest_defaults_source: 'interest_defaults_source',
        interested_in: 'interested_in',
        interests: 'interests',
        keywords: 'keywords',
        life_events: 'life_events',
        locales: 'locales',
        messenger_positions: 'messenger_positions',
        mobile_device_model: 'mobile_device_model',
        moms: 'moms',
        net_worth: 'net_worth',
        office_type: 'office_type',
        page_types: 'page_types',
        place_page_set_ids: 'place_page_set_ids',
        political_views: 'political_views',
        politics: 'politics',
        product_audience_specs: 'product_audience_specs',
        publisher_platforms: 'publisher_platforms',
        publisher_visibility_categories: 'publisher_visibility_categories',
        radius: 'radius',
        regions: 'regions',
        relationship_statuses: 'relationship_statuses',
        rtb_flag: 'rtb_flag',
        site_category: 'site_category',
        targeting_optimization: 'targeting_optimization',
        timezones: 'timezones',
        user_adclusters: 'user_adclusters',
        user_device: 'user_device',
        user_event: 'user_event',
        user_os: 'user_os',
        wireless_carrier: 'wireless_carrier',
        work_employers: 'work_employers',
        work_positions: 'work_positions',
        zips: 'zips'
      });
    }
  }]);
  return AdAccountTargetingUnified;
}(AbstractCrudObject);

var AdAccountUser = function (_AbstractCrudObject) {
  inherits(AdAccountUser, _AbstractCrudObject);

  function AdAccountUser() {
    classCallCheck(this, AdAccountUser);
    return possibleConstructorReturn(this, (AdAccountUser.__proto__ || Object.getPrototypeOf(AdAccountUser)).apply(this, arguments));
  }

  createClass(AdAccountUser, null, [{
    key: 'getEndpoint',
    value: function getEndpoint() {
      return 'users';
    }
  }, {
    key: 'Field',
    get: function get() {
      return Object.freeze({
        id: 'id',
        name: 'name',
        permissions: 'permissions',
        role: 'role'
      });
    }
  }]);
  return AdAccountUser;
}(AbstractCrudObject);

var AdActivity = function (_AbstractObject) {
  inherits(AdActivity, _AbstractObject);

  function AdActivity() {
    classCallCheck(this, AdActivity);
    return possibleConstructorReturn(this, (AdActivity.__proto__ || Object.getPrototypeOf(AdActivity)).apply(this, arguments));
  }

  createClass(AdActivity, null, [{
    key: 'Field',
    get: function get() {
      return Object.freeze({
        actor_id: 'actor_id',
        actor_name: 'actor_name',
        application_id: 'application_id',
        application_name: 'application_name',
        date_time_in_timezone: 'date_time_in_timezone',
        event_time: 'event_time',
        event_type: 'event_type',
        extra_data: 'extra_data',
        object_id: 'object_id',
        object_name: 'object_name',
        translated_event_type: 'translated_event_type'
      });
    }
  }, {
    key: 'EventType',
    get: function get() {
      return Object.freeze({
        account_spending_limit_reached: 'account_spending_limit_reached',
        ad_account_add_user_to_role: 'ad_account_add_user_to_role',
        ad_account_billing_charge: 'ad_account_billing_charge',
        ad_account_billing_charge_failed: 'ad_account_billing_charge_failed',
        ad_account_billing_chargeback: 'ad_account_billing_chargeback',
        ad_account_billing_chargeback_reversal: 'ad_account_billing_chargeback_reversal',
        ad_account_billing_decline: 'ad_account_billing_decline',
        ad_account_billing_refund: 'ad_account_billing_refund',
        ad_account_remove_spend_limit: 'ad_account_remove_spend_limit',
        ad_account_remove_user_from_role: 'ad_account_remove_user_from_role',
        ad_account_reset_spend_limit: 'ad_account_reset_spend_limit',
        ad_account_set_business_information: 'ad_account_set_business_information',
        ad_account_update_spend_limit: 'ad_account_update_spend_limit',
        ad_account_update_status: 'ad_account_update_status',
        ad_review_approved: 'ad_review_approved',
        ad_review_declined: 'ad_review_declined',
        add_funding_source: 'add_funding_source',
        add_images: 'add_images',
        billing_event: 'billing_event',
        campaign_spending_limit_reached: 'campaign_spending_limit_reached',
        create_ad: 'create_ad',
        create_ad_set: 'create_ad_set',
        create_audience: 'create_audience',
        create_campaign: 'create_campaign',
        create_campaign_group: 'create_campaign_group',
        create_campaign_legacy: 'create_campaign_legacy',
        delete_audience: 'delete_audience',
        delete_images: 'delete_images',
        edit_and_update_ad_creative: 'edit_and_update_ad_creative',
        edit_images: 'edit_images',
        first_delivery_event: 'first_delivery_event',
        funding_event_initiated: 'funding_event_initiated',
        funding_event_successful: 'funding_event_successful',
        lifetime_budget_spent: 'lifetime_budget_spent',
        receive_audience: 'receive_audience',
        remove_funding_source: 'remove_funding_source',
        remove_shared_audience: 'remove_shared_audience',
        share_audience: 'share_audience',
        unknown: 'unknown',
        unshare_audience: 'unshare_audience',
        update_ad_bid_info: 'update_ad_bid_info',
        update_ad_bid_type: 'update_ad_bid_type',
        update_ad_creative: 'update_ad_creative',
        update_ad_friendly_name: 'update_ad_friendly_name',
        update_ad_labels: 'update_ad_labels',
        update_ad_run_status: 'update_ad_run_status',
        update_ad_set_bidding: 'update_ad_set_bidding',
        update_ad_set_budget: 'update_ad_set_budget',
        update_ad_set_duration: 'update_ad_set_duration',
        update_ad_set_name: 'update_ad_set_name',
        update_ad_set_run_status: 'update_ad_set_run_status',
        update_ad_set_target_spec: 'update_ad_set_target_spec',
        update_ad_targets_spec: 'update_ad_targets_spec',
        update_adgroup_stop_delivery: 'update_adgroup_stop_delivery',
        update_audience: 'update_audience',
        update_campaign_budget: 'update_campaign_budget',
        update_campaign_duration: 'update_campaign_duration',
        update_campaign_group_spend_cap: 'update_campaign_group_spend_cap',
        update_campaign_name: 'update_campaign_name',
        update_campaign_run_status: 'update_campaign_run_status'
      });
    }
  }, {
    key: 'Category',
    get: function get() {
      return Object.freeze({
        account: 'ACCOUNT',
        ad: 'AD',
        ad_set: 'AD_SET',
        audience: 'AUDIENCE',
        bid: 'BID',
        budget: 'BUDGET',
        campaign: 'CAMPAIGN',
        date: 'DATE',
        status: 'STATUS',
        targeting: 'TARGETING'
      });
    }
  }]);
  return AdActivity;
}(AbstractObject);

var AdAsyncRequest = function (_AbstractCrudObject) {
  inherits(AdAsyncRequest, _AbstractCrudObject);

  function AdAsyncRequest() {
    classCallCheck(this, AdAsyncRequest);
    return possibleConstructorReturn(this, (AdAsyncRequest.__proto__ || Object.getPrototypeOf(AdAsyncRequest)).apply(this, arguments));
  }

  createClass(AdAsyncRequest, null, [{
    key: 'Field',
    get: function get() {
      return Object.freeze({
        async_request_set: 'async_request_set',
        created_time: 'created_time',
        id: 'id',
        input: 'input',
        result: 'result',
        scope_object_id: 'scope_object_id',
        status: 'status',
        updated_time: 'updated_time'
      });
    }
  }, {
    key: 'Status',
    get: function get() {
      return Object.freeze({
        canceled: 'CANCELED',
        canceled_dependency: 'CANCELED_DEPENDENCY',
        error: 'ERROR',
        error_conflicts: 'ERROR_CONFLICTS',
        error_dependency: 'ERROR_DEPENDENCY',
        in_progress: 'IN_PROGRESS',
        initial: 'INITIAL',
        pending_dependency: 'PENDING_DEPENDENCY',
        success: 'SUCCESS'
      });
    }
  }, {
    key: 'Statuses',
    get: function get() {
      return Object.freeze({
        canceled: 'CANCELED',
        canceled_dependency: 'CANCELED_DEPENDENCY',
        error: 'ERROR',
        error_conflicts: 'ERROR_CONFLICTS',
        error_dependency: 'ERROR_DEPENDENCY',
        in_progress: 'IN_PROGRESS',
        initial: 'INITIAL',
        pending_dependency: 'PENDING_DEPENDENCY',
        success: 'SUCCESS'
      });
    }
  }]);
  return AdAsyncRequest;
}(AbstractCrudObject);

var AdAsyncRequestSet = function (_AbstractCrudObject) {
  inherits(AdAsyncRequestSet, _AbstractCrudObject);

  function AdAsyncRequestSet() {
    classCallCheck(this, AdAsyncRequestSet);
    return possibleConstructorReturn(this, (AdAsyncRequestSet.__proto__ || Object.getPrototypeOf(AdAsyncRequestSet)).apply(this, arguments));
  }

  createClass(AdAsyncRequestSet, [{
    key: 'getRequests',
    value: function getRequests(fields, params) {
      return this.getEdge(AdAsyncRequest, fields, params, 'requests');
    }
  }], [{
    key: 'getEndpoint',
    value: function getEndpoint() {
      return 'asyncadrequestsets';
    }
  }, {
    key: 'Field',
    get: function get() {
      return Object.freeze({
        ad_specs: 'ad_specs',
        canceled_count: 'canceled_count',
        created_time: 'created_time',
        error_count: 'error_count',
        id: 'id',
        in_progress_count: 'in_progress_count',
        initial_count: 'initial_count',
        is_completed: 'is_completed',
        name: 'name',
        notification_mode: 'notification_mode',
        notification_result: 'notification_result',
        notification_status: 'notification_status',
        notification_uri: 'notification_uri',
        owner_id: 'owner_id',
        success_count: 'success_count',
        total_count: 'total_count',
        updated_time: 'updated_time'
      });
    }
  }, {
    key: 'NotificationMode',
    get: function get() {
      return Object.freeze({
        off: 'OFF',
        on_complete: 'ON_COMPLETE'
      });
    }
  }, {
    key: 'NotificationStatus',
    get: function get() {
      return Object.freeze({
        not_sent: 'NOT_SENT',
        sending: 'SENDING',
        sent: 'SENT'
      });
    }
  }]);
  return AdAsyncRequestSet;
}(AbstractCrudObject);

var AdImage = function (_AbstractCrudObject) {
  inherits(AdImage, _AbstractCrudObject);

  function AdImage() {
    classCallCheck(this, AdImage);
    return possibleConstructorReturn(this, (AdImage.__proto__ || Object.getPrototypeOf(AdImage)).apply(this, arguments));
  }

  createClass(AdImage, null, [{
    key: 'getEndpoint',
    value: function getEndpoint() {
      return 'adimages';
    }
  }, {
    key: 'Field',
    get: function get() {
      return Object.freeze({
        account_id: 'account_id',
        bytes: 'bytes',
        copy_from: 'copy_from',
        created_time: 'created_time',
        creatives: 'creatives',
        filename: 'filename',
        hash: 'hash',
        height: 'height',
        id: 'id',
        is_associated_creatives_in_adgroups: 'is_associated_creatives_in_adgroups',
        name: 'name',
        original_height: 'original_height',
        original_width: 'original_width',
        permalink_url: 'permalink_url',
        status: 'status',
        updated_time: 'updated_time',
        url: 'url',
        url_128: 'url_128',
        width: 'width',
        zipbytes: 'zipbytes'
      });
    }
  }, {
    key: 'Status',
    get: function get() {
      return Object.freeze({
        active: 'ACTIVE',
        deleted: 'DELETED'
      });
    }
  }]);
  return AdImage;
}(AbstractCrudObject);

var AdSet = function (_AbstractCrudObject) {
  inherits(AdSet, _AbstractCrudObject);

  function AdSet() {
    classCallCheck(this, AdSet);
    return possibleConstructorReturn(this, (AdSet.__proto__ || Object.getPrototypeOf(AdSet)).apply(this, arguments));
  }

  createClass(AdSet, [{
    key: 'getActivities',
    value: function getActivities(fields, params) {
      return this.getEdge(AdActivity, fields, params, 'activities');
    }
  }, {
    key: 'getAdCreatives',
    value: function getAdCreatives(fields, params) {
      return this.getEdge(AdCreative, fields, params, 'adcreatives');
    }
  }, {
    key: 'getAds',
    value: function getAds(fields, params) {
      return this.getEdge(Ad, fields, params, 'ads');
    }
  }, {
    key: 'getAsyncAdRequests',
    value: function getAsyncAdRequests(fields, params) {
      return this.getEdge(AdAsyncRequest, fields, params, 'asyncadrequests');
    }
  }, {
    key: 'getInsights',
    value: function getInsights(fields, params) {
      return this.getEdge(AdsInsights, fields, params, 'insights');
    }
  }, {
    key: 'getInsightsAsync',
    value: function getInsightsAsync(fields, params) {
      return this.getEdge(AdReportRun, fields, params, 'insights');
    }
  }, {
    key: 'getTargetingSentenceLines',
    value: function getTargetingSentenceLines(fields, params) {
      return this.getEdge(TargetingSentenceLine, fields, params, 'targetingsentencelines');
    }
  }], [{
    key: 'getEndpoint',
    value: function getEndpoint() {
      return 'adsets';
    }
  }, {
    key: 'Field',
    get: function get() {
      return Object.freeze({
        account_id: 'account_id',
        adlabels: 'adlabels',
        adset_schedule: 'adset_schedule',
        attribution_spec: 'attribution_spec',
        bid_amount: 'bid_amount',
        bid_info: 'bid_info',
        billing_event: 'billing_event',
        budget_remaining: 'budget_remaining',
        campaign: 'campaign',
        campaign_id: 'campaign_id',
        campaign_spec: 'campaign_spec',
        configured_status: 'configured_status',
        created_time: 'created_time',
        creative_sequence: 'creative_sequence',
        daily_budget: 'daily_budget',
        daily_imps: 'daily_imps',
        effective_status: 'effective_status',
        end_time: 'end_time',
        execution_options: 'execution_options',
        frequency_cap: 'frequency_cap',
        frequency_cap_reset_period: 'frequency_cap_reset_period',
        frequency_control_specs: 'frequency_control_specs',
        id: 'id',
        is_autobid: 'is_autobid',
        is_average_price_pacing: 'is_average_price_pacing',
        lifetime_budget: 'lifetime_budget',
        lifetime_frequency_cap: 'lifetime_frequency_cap',
        lifetime_imps: 'lifetime_imps',
        name: 'name',
        optimization_goal: 'optimization_goal',
        pacing_type: 'pacing_type',
        promoted_object: 'promoted_object',
        recommendations: 'recommendations',
        recurring_budget_semantics: 'recurring_budget_semantics',
        redownload: 'redownload',
        rf_prediction_id: 'rf_prediction_id',
        rtb_flag: 'rtb_flag',
        start_time: 'start_time',
        status: 'status',
        targeting: 'targeting',
        time_based_ad_rotation_id_blocks: 'time_based_ad_rotation_id_blocks',
        time_based_ad_rotation_intervals: 'time_based_ad_rotation_intervals',
        updated_time: 'updated_time',
        use_new_app_click: 'use_new_app_click'
      });
    }
  }, {
    key: 'BillingEvent',
    get: function get() {
      return Object.freeze({
        app_installs: 'APP_INSTALLS',
        clicks: 'CLICKS',
        impressions: 'IMPRESSIONS',
        link_clicks: 'LINK_CLICKS',
        mrc_video_views: 'MRC_VIDEO_VIEWS',
        offer_claims: 'OFFER_CLAIMS',
        page_likes: 'PAGE_LIKES',
        post_engagement: 'POST_ENGAGEMENT',
        video_views: 'VIDEO_VIEWS'
      });
    }
  }, {
    key: 'ConfiguredStatus',
    get: function get() {
      return Object.freeze({
        active: 'ACTIVE',
        archived: 'ARCHIVED',
        deleted: 'DELETED',
        paused: 'PAUSED'
      });
    }
  }, {
    key: 'EffectiveStatus',
    get: function get() {
      return Object.freeze({
        active: 'ACTIVE',
        adset_paused: 'ADSET_PAUSED',
        archived: 'ARCHIVED',
        campaign_paused: 'CAMPAIGN_PAUSED',
        deleted: 'DELETED',
        disapproved: 'DISAPPROVED',
        paused: 'PAUSED',
        pending_billing_info: 'PENDING_BILLING_INFO',
        pending_review: 'PENDING_REVIEW',
        preapproved: 'PREAPPROVED'
      });
    }
  }, {
    key: 'OptimizationGoal',
    get: function get() {
      return Object.freeze({
        app_downloads: 'APP_DOWNLOADS',
        app_installs: 'APP_INSTALLS',
        brand_awareness: 'BRAND_AWARENESS',
        clicks: 'CLICKS',
        engaged_users: 'ENGAGED_USERS',
        event_responses: 'EVENT_RESPONSES',
        impressions: 'IMPRESSIONS',
        lead_generation: 'LEAD_GENERATION',
        link_clicks: 'LINK_CLICKS',
        none: 'NONE',
        offer_claims: 'OFFER_CLAIMS',
        offsite_conversions: 'OFFSITE_CONVERSIONS',
        page_engagement: 'PAGE_ENGAGEMENT',
        page_likes: 'PAGE_LIKES',
        post_engagement: 'POST_ENGAGEMENT',
        reach: 'REACH',
        social_impressions: 'SOCIAL_IMPRESSIONS',
        video_views: 'VIDEO_VIEWS'
      });
    }
  }, {
    key: 'Status',
    get: function get() {
      return Object.freeze({
        active: 'ACTIVE',
        archived: 'ARCHIVED',
        deleted: 'DELETED',
        paused: 'PAUSED'
      });
    }
  }, {
    key: 'DatePreset',
    get: function get() {
      return Object.freeze({
        last_14d: 'last_14d',
        last_28d: 'last_28d',
        last_30d: 'last_30d',
        last_3d: 'last_3d',
        last_7d: 'last_7d',
        last_90d: 'last_90d',
        last_month: 'last_month',
        last_quarter: 'last_quarter',
        last_week_mon_sun: 'last_week_mon_sun',
        last_week_sun_sat: 'last_week_sun_sat',
        last_year: 'last_year',
        lifetime: 'lifetime',
        this_month: 'this_month',
        this_quarter: 'this_quarter',
        this_week_mon_today: 'this_week_mon_today',
        this_week_sun_today: 'this_week_sun_today',
        this_year: 'this_year',
        today: 'today',
        yesterday: 'yesterday'
      });
    }
  }, {
    key: 'ExecutionOptions',
    get: function get() {
      return Object.freeze({
        include_recommendations: 'include_recommendations',
        validate_only: 'validate_only'
      });
    }
  }, {
    key: 'Operator',
    get: function get() {
      return Object.freeze({
        all: 'ALL',
        any: 'ANY'
      });
    }
  }]);
  return AdSet;
}(AbstractCrudObject);

var Campaign = function (_AbstractCrudObject) {
  inherits(Campaign, _AbstractCrudObject);

  function Campaign() {
    classCallCheck(this, Campaign);
    return possibleConstructorReturn(this, (Campaign.__proto__ || Object.getPrototypeOf(Campaign)).apply(this, arguments));
  }

  createClass(Campaign, [{
    key: 'getAdSets',
    value: function getAdSets(fields, params) {
      return this.getEdge(AdSet, fields, params, 'adsets');
    }
  }, {
    key: 'getAds',
    value: function getAds(fields, params) {
      return this.getEdge(Ad, fields, params, 'ads');
    }
  }, {
    key: 'getInsights',
    value: function getInsights(fields, params) {
      return this.getEdge(AdsInsights, fields, params, 'insights');
    }
  }, {
    key: 'getInsightsAsync',
    value: function getInsightsAsync(fields, params) {
      return this.getEdge(AdReportRun, fields, params, 'insights');
    }
  }], [{
    key: 'getEndpoint',
    value: function getEndpoint() {
      return 'campaigns';
    }
  }, {
    key: 'Field',
    get: function get() {
      return Object.freeze({
        account_id: 'account_id',
        adlabels: 'adlabels',
        brand_lift_studies: 'brand_lift_studies',
        budget_rebalance_flag: 'budget_rebalance_flag',
        buying_type: 'buying_type',
        can_create_brand_lift_study: 'can_create_brand_lift_study',
        can_use_spend_cap: 'can_use_spend_cap',
        configured_status: 'configured_status',
        created_time: 'created_time',
        effective_status: 'effective_status',
        execution_options: 'execution_options',
        id: 'id',
        name: 'name',
        objective: 'objective',
        promoted_object: 'promoted_object',
        recommendations: 'recommendations',
        spend_cap: 'spend_cap',
        start_time: 'start_time',
        status: 'status',
        stop_time: 'stop_time',
        updated_time: 'updated_time'
      });
    }
  }, {
    key: 'ConfiguredStatus',
    get: function get() {
      return Object.freeze({
        active: 'ACTIVE',
        archived: 'ARCHIVED',
        deleted: 'DELETED',
        paused: 'PAUSED'
      });
    }
  }, {
    key: 'EffectiveStatus',
    get: function get() {
      return Object.freeze({
        active: 'ACTIVE',
        adset_paused: 'ADSET_PAUSED',
        archived: 'ARCHIVED',
        campaign_paused: 'CAMPAIGN_PAUSED',
        deleted: 'DELETED',
        disapproved: 'DISAPPROVED',
        paused: 'PAUSED',
        pending_billing_info: 'PENDING_BILLING_INFO',
        pending_review: 'PENDING_REVIEW',
        preapproved: 'PREAPPROVED'
      });
    }
  }, {
    key: 'Status',
    get: function get() {
      return Object.freeze({
        active: 'ACTIVE',
        archived: 'ARCHIVED',
        deleted: 'DELETED',
        paused: 'PAUSED'
      });
    }
  }, {
    key: 'DatePreset',
    get: function get() {
      return Object.freeze({
        last_14d: 'last_14d',
        last_28d: 'last_28d',
        last_30d: 'last_30d',
        last_3d: 'last_3d',
        last_7d: 'last_7d',
        last_90d: 'last_90d',
        last_month: 'last_month',
        last_quarter: 'last_quarter',
        last_week_mon_sun: 'last_week_mon_sun',
        last_week_sun_sat: 'last_week_sun_sat',
        last_year: 'last_year',
        lifetime: 'lifetime',
        this_month: 'this_month',
        this_quarter: 'this_quarter',
        this_week_mon_today: 'this_week_mon_today',
        this_week_sun_today: 'this_week_sun_today',
        this_year: 'this_year',
        today: 'today',
        yesterday: 'yesterday'
      });
    }
  }, {
    key: 'DeleteStrategy',
    get: function get() {
      return Object.freeze({
        delete_any: 'DELETE_ANY',
        delete_archived_before: 'DELETE_ARCHIVED_BEFORE',
        delete_oldest: 'DELETE_OLDEST'
      });
    }
  }, {
    key: 'ExecutionOptions',
    get: function get() {
      return Object.freeze({
        include_recommendations: 'include_recommendations',
        validate_only: 'validate_only'
      });
    }
  }, {
    key: 'Objective',
    get: function get() {
      return Object.freeze({
        app_installs: 'APP_INSTALLS',
        brand_awareness: 'BRAND_AWARENESS',
        conversions: 'CONVERSIONS',
        event_responses: 'EVENT_RESPONSES',
        lead_generation: 'LEAD_GENERATION',
        link_clicks: 'LINK_CLICKS',
        local_awareness: 'LOCAL_AWARENESS',
        offer_claims: 'OFFER_CLAIMS',
        page_likes: 'PAGE_LIKES',
        post_engagement: 'POST_ENGAGEMENT',
        product_catalog_sales: 'PRODUCT_CATALOG_SALES',
        reach: 'REACH',
        video_views: 'VIDEO_VIEWS'
      });
    }
  }, {
    key: 'Operator',
    get: function get() {
      return Object.freeze({
        all: 'ALL',
        any: 'ANY'
      });
    }
  }]);
  return Campaign;
}(AbstractCrudObject);

var AdLabel = function (_AbstractCrudObject) {
  inherits(AdLabel, _AbstractCrudObject);

  function AdLabel() {
    classCallCheck(this, AdLabel);
    return possibleConstructorReturn(this, (AdLabel.__proto__ || Object.getPrototypeOf(AdLabel)).apply(this, arguments));
  }

  createClass(AdLabel, [{
    key: 'getAdCreatives',
    value: function getAdCreatives(fields, params) {
      return this.getEdge(AdCreative, fields, params, 'adcreatives');
    }
  }, {
    key: 'getAdSets',
    value: function getAdSets(fields, params) {
      return this.getEdge(AdSet, fields, params, 'adsets');
    }
  }, {
    key: 'getAds',
    value: function getAds(fields, params) {
      return this.getEdge(Ad, fields, params, 'ads');
    }
  }, {
    key: 'getCampaigns',
    value: function getCampaigns(fields, params) {
      return this.getEdge(Campaign, fields, params, 'campaigns');
    }
  }], [{
    key: 'getEndpoint',
    value: function getEndpoint() {
      return 'adlabels';
    }
  }, {
    key: 'Field',
    get: function get() {
      return Object.freeze({
        account: 'account',
        created_time: 'created_time',
        id: 'id',
        name: 'name',
        updated_time: 'updated_time'
      });
    }
  }, {
    key: 'ExecutionOptions',
    get: function get() {
      return Object.freeze({
        validate_only: 'validate_only'
      });
    }
  }]);
  return AdLabel;
}(AbstractCrudObject);

var AdPlacePageSet = function (_AbstractCrudObject) {
  inherits(AdPlacePageSet, _AbstractCrudObject);

  function AdPlacePageSet() {
    classCallCheck(this, AdPlacePageSet);
    return possibleConstructorReturn(this, (AdPlacePageSet.__proto__ || Object.getPrototypeOf(AdPlacePageSet)).apply(this, arguments));
  }

  createClass(AdPlacePageSet, null, [{
    key: 'getEndpoint',
    value: function getEndpoint() {
      return 'ad_place_page_sets';
    }
  }, {
    key: 'Field',
    get: function get() {
      return Object.freeze({
        account_id: 'account_id',
        id: 'id',
        location_types: 'location_types',
        name: 'name',
        pages_count: 'pages_count',
        parent_page: 'parent_page'
      });
    }
  }, {
    key: 'LocationTypes',
    get: function get() {
      return Object.freeze({
        home: 'home',
        recent: 'recent'
      });
    }
  }]);
  return AdPlacePageSet;
}(AbstractCrudObject);

var AdsDataPartner = function (_AbstractCrudObject) {
  inherits(AdsDataPartner, _AbstractCrudObject);

  function AdsDataPartner() {
    classCallCheck(this, AdsDataPartner);
    return possibleConstructorReturn(this, (AdsDataPartner.__proto__ || Object.getPrototypeOf(AdsDataPartner)).apply(this, arguments));
  }

  createClass(AdsDataPartner, null, [{
    key: 'Field',
    get: function get() {
      return Object.freeze({
        id: 'id',
        name: 'name',
        rev_share_policies: 'rev_share_policies'
      });
    }
  }]);
  return AdsDataPartner;
}(AbstractCrudObject);

var AdsPixelStatsResult = function (_AbstractObject) {
  inherits(AdsPixelStatsResult, _AbstractObject);

  function AdsPixelStatsResult() {
    classCallCheck(this, AdsPixelStatsResult);
    return possibleConstructorReturn(this, (AdsPixelStatsResult.__proto__ || Object.getPrototypeOf(AdsPixelStatsResult)).apply(this, arguments));
  }

  createClass(AdsPixelStatsResult, null, [{
    key: 'getEndpoint',
    value: function getEndpoint() {
      return 'stats';
    }
  }, {
    key: 'Field',
    get: function get() {
      return Object.freeze({
        aggregation: 'aggregation',
        data: 'data',
        timestamp: 'timestamp'
      });
    }
  }, {
    key: 'Aggregation',
    get: function get() {
      return Object.freeze({
        browser_type: 'browser_type',
        custom_data_field: 'custom_data_field',
        device_os: 'device_os',
        device_type: 'device_type',
        event: 'event',
        host: 'host',
        pixel_fire: 'pixel_fire',
        url: 'url'
      });
    }
  }]);
  return AdsPixelStatsResult;
}(AbstractObject);

var BusinessAdAccountRequest = function (_AbstractCrudObject) {
  inherits(BusinessAdAccountRequest, _AbstractCrudObject);

  function BusinessAdAccountRequest() {
    classCallCheck(this, BusinessAdAccountRequest);
    return possibleConstructorReturn(this, (BusinessAdAccountRequest.__proto__ || Object.getPrototypeOf(BusinessAdAccountRequest)).apply(this, arguments));
  }

  createClass(BusinessAdAccountRequest, null, [{
    key: 'Field',
    get: function get() {
      return Object.freeze({
        ad_account: 'ad_account',
        id: 'id'
      });
    }
  }]);
  return BusinessAdAccountRequest;
}(AbstractCrudObject);

var BusinessPageRequest = function (_AbstractCrudObject) {
  inherits(BusinessPageRequest, _AbstractCrudObject);

  function BusinessPageRequest() {
    classCallCheck(this, BusinessPageRequest);
    return possibleConstructorReturn(this, (BusinessPageRequest.__proto__ || Object.getPrototypeOf(BusinessPageRequest)).apply(this, arguments));
  }

  createClass(BusinessPageRequest, null, [{
    key: 'Field',
    get: function get() {
      return Object.freeze({
        id: 'id',
        page: 'page'
      });
    }
  }]);
  return BusinessPageRequest;
}(AbstractCrudObject);

var EventSourceGroup = function (_AbstractCrudObject) {
  inherits(EventSourceGroup, _AbstractCrudObject);

  function EventSourceGroup() {
    classCallCheck(this, EventSourceGroup);
    return possibleConstructorReturn(this, (EventSourceGroup.__proto__ || Object.getPrototypeOf(EventSourceGroup)).apply(this, arguments));
  }

  createClass(EventSourceGroup, null, [{
    key: 'getEndpoint',
    value: function getEndpoint() {
      return 'event_source_groups';
    }
  }, {
    key: 'Field',
    get: function get() {
      return Object.freeze({
        business: 'business',
        event_sources: 'event_sources',
        id: 'id',
        name: 'name'
      });
    }
  }]);
  return EventSourceGroup;
}(AbstractCrudObject);

var LegacyBusinessAdAccountRequest = function (_AbstractCrudObject) {
  inherits(LegacyBusinessAdAccountRequest, _AbstractCrudObject);

  function LegacyBusinessAdAccountRequest() {
    classCallCheck(this, LegacyBusinessAdAccountRequest);
    return possibleConstructorReturn(this, (LegacyBusinessAdAccountRequest.__proto__ || Object.getPrototypeOf(LegacyBusinessAdAccountRequest)).apply(this, arguments));
  }

  createClass(LegacyBusinessAdAccountRequest, null, [{
    key: 'Field',
    get: function get() {
      return Object.freeze({
        ad_account: 'ad_account',
        id: 'id',
        permitted_roles: 'permitted_roles'
      });
    }
  }]);
  return LegacyBusinessAdAccountRequest;
}(AbstractCrudObject);

var ExternalEventSource = function (_AbstractCrudObject) {
  inherits(ExternalEventSource, _AbstractCrudObject);

  function ExternalEventSource() {
    classCallCheck(this, ExternalEventSource);
    return possibleConstructorReturn(this, (ExternalEventSource.__proto__ || Object.getPrototypeOf(ExternalEventSource)).apply(this, arguments));
  }

  createClass(ExternalEventSource, null, [{
    key: 'getEndpoint',
    value: function getEndpoint() {
      return 'external_event_sources';
    }
  }, {
    key: 'Field',
    get: function get() {
      return Object.freeze({
        external_event_sources: 'external_event_sources',
        id: 'id',
        name: 'name',
        source_type: 'source_type'
      });
    }
  }]);
  return ExternalEventSource;
}(AbstractCrudObject);

var Hotel = function (_AbstractCrudObject) {
  inherits(Hotel, _AbstractCrudObject);

  function Hotel() {
    classCallCheck(this, Hotel);
    return possibleConstructorReturn(this, (Hotel.__proto__ || Object.getPrototypeOf(Hotel)).apply(this, arguments));
  }

  createClass(Hotel, null, [{
    key: 'getEndpoint',
    value: function getEndpoint() {
      return 'hotels';
    }
  }, {
    key: 'Field',
    get: function get() {
      return Object.freeze({
        address: 'address',
        applinks: 'applinks',
        brand: 'brand',
        description: 'description',
        guest_ratings: 'guest_ratings',
        hotel_id: 'hotel_id',
        id: 'id',
        images: 'images',
        lowest_base_price: 'lowest_base_price',
        name: 'name',
        phone: 'phone',
        star_rating: 'star_rating',
        url: 'url'
      });
    }
  }]);
  return Hotel;
}(AbstractCrudObject);

var ProductCatalogHotelRoomsBatch = function (_AbstractCrudObject) {
  inherits(ProductCatalogHotelRoomsBatch, _AbstractCrudObject);

  function ProductCatalogHotelRoomsBatch() {
    classCallCheck(this, ProductCatalogHotelRoomsBatch);
    return possibleConstructorReturn(this, (ProductCatalogHotelRoomsBatch.__proto__ || Object.getPrototypeOf(ProductCatalogHotelRoomsBatch)).apply(this, arguments));
  }

  createClass(ProductCatalogHotelRoomsBatch, null, [{
    key: 'getEndpoint',
    value: function getEndpoint() {
      return 'hotel_rooms_batch';
    }
  }, {
    key: 'Field',
    get: function get() {
      return Object.freeze({
        errors: 'errors',
        errors_total_count: 'errors_total_count',
        file: 'file',
        handle: 'handle',
        password: 'password',
        standard: 'standard',
        status: 'status',
        update_only: 'update_only',
        url: 'url',
        username: 'username'
      });
    }
  }, {
    key: 'Standard',
    get: function get() {
      return Object.freeze({
        google: 'google'
      });
    }
  }]);
  return ProductCatalogHotelRoomsBatch;
}(AbstractCrudObject);

var ProductCatalogPricingVariablesBatch = function (_AbstractCrudObject) {
  inherits(ProductCatalogPricingVariablesBatch, _AbstractCrudObject);

  function ProductCatalogPricingVariablesBatch() {
    classCallCheck(this, ProductCatalogPricingVariablesBatch);
    return possibleConstructorReturn(this, (ProductCatalogPricingVariablesBatch.__proto__ || Object.getPrototypeOf(ProductCatalogPricingVariablesBatch)).apply(this, arguments));
  }

  createClass(ProductCatalogPricingVariablesBatch, null, [{
    key: 'getEndpoint',
    value: function getEndpoint() {
      return 'pricing_variables_batch';
    }
  }, {
    key: 'Field',
    get: function get() {
      return Object.freeze({
        errors: 'errors',
        errors_total_count: 'errors_total_count',
        file: 'file',
        handle: 'handle',
        password: 'password',
        standard: 'standard',
        status: 'status',
        update_only: 'update_only',
        url: 'url',
        username: 'username'
      });
    }
  }, {
    key: 'Standard',
    get: function get() {
      return Object.freeze({
        google: 'google'
      });
    }
  }]);
  return ProductCatalogPricingVariablesBatch;
}(AbstractCrudObject);

var ProductFeedUploadErrorSample = function (_AbstractCrudObject) {
  inherits(ProductFeedUploadErrorSample, _AbstractCrudObject);

  function ProductFeedUploadErrorSample() {
    classCallCheck(this, ProductFeedUploadErrorSample);
    return possibleConstructorReturn(this, (ProductFeedUploadErrorSample.__proto__ || Object.getPrototypeOf(ProductFeedUploadErrorSample)).apply(this, arguments));
  }

  createClass(ProductFeedUploadErrorSample, null, [{
    key: 'Field',
    get: function get() {
      return Object.freeze({
        id: 'id',
        retailer_id: 'retailer_id',
        row_number: 'row_number'
      });
    }
  }]);
  return ProductFeedUploadErrorSample;
}(AbstractCrudObject);

var ProductFeedUploadError = function (_AbstractCrudObject) {
  inherits(ProductFeedUploadError, _AbstractCrudObject);

  function ProductFeedUploadError() {
    classCallCheck(this, ProductFeedUploadError);
    return possibleConstructorReturn(this, (ProductFeedUploadError.__proto__ || Object.getPrototypeOf(ProductFeedUploadError)).apply(this, arguments));
  }

  createClass(ProductFeedUploadError, [{
    key: 'getSamples',
    value: function getSamples(fields, params) {
      return this.getEdge(ProductFeedUploadErrorSample, fields, params, 'samples');
    }
  }], [{
    key: 'getEndpoint',
    value: function getEndpoint() {
      return 'errors';
    }
  }, {
    key: 'Field',
    get: function get() {
      return Object.freeze({
        description: 'description',
        error_type: 'error_type',
        id: 'id',
        severity: 'severity',
        summary: 'summary',
        total_count: 'total_count'
      });
    }
  }, {
    key: 'Severity',
    get: function get() {
      return Object.freeze({
        fatal: 'fatal',
        warning: 'warning'
      });
    }
  }]);
  return ProductFeedUploadError;
}(AbstractCrudObject);

var ProductFeedUpload = function (_AbstractCrudObject) {
  inherits(ProductFeedUpload, _AbstractCrudObject);

  function ProductFeedUpload() {
    classCallCheck(this, ProductFeedUpload);
    return possibleConstructorReturn(this, (ProductFeedUpload.__proto__ || Object.getPrototypeOf(ProductFeedUpload)).apply(this, arguments));
  }

  createClass(ProductFeedUpload, [{
    key: 'getErrors',
    value: function getErrors(fields, params) {
      return this.getEdge(ProductFeedUploadError, fields, params, 'errors');
    }
  }], [{
    key: 'getEndpoint',
    value: function getEndpoint() {
      return 'uploads';
    }
  }, {
    key: 'Field',
    get: function get() {
      return Object.freeze({
        end_time: 'end_time',
        id: 'id',
        input_method: 'input_method',
        start_time: 'start_time',
        url: 'url'
      });
    }
  }, {
    key: 'InputMethod',
    get: function get() {
      return Object.freeze({
        manual_upload: 'Manual Upload',
        server_fetch: 'Server Fetch'
      });
    }
  }]);
  return ProductFeedUpload;
}(AbstractCrudObject);

var ProductGroup = function (_AbstractCrudObject) {
  inherits(ProductGroup, _AbstractCrudObject);

  function ProductGroup() {
    classCallCheck(this, ProductGroup);
    return possibleConstructorReturn(this, (ProductGroup.__proto__ || Object.getPrototypeOf(ProductGroup)).apply(this, arguments));
  }

  createClass(ProductGroup, [{
    key: 'getProductSets',
    value: function getProductSets(fields, params) {
      return this.getEdge(ProductSet, fields, params, 'product_sets');
    }
  }, {
    key: 'getProducts',
    value: function getProducts(fields, params) {
      return this.getEdge(ProductItem, fields, params, 'products');
    }
  }], [{
    key: 'getEndpoint',
    value: function getEndpoint() {
      return 'product_groups';
    }
  }, {
    key: 'Field',
    get: function get() {
      return Object.freeze({
        id: 'id',
        product_catalog: 'product_catalog',
        retailer_id: 'retailer_id',
        variants: 'variants'
      });
    }
  }]);
  return ProductGroup;
}(AbstractCrudObject);

var ProductSet = function (_AbstractCrudObject) {
  inherits(ProductSet, _AbstractCrudObject);

  function ProductSet() {
    classCallCheck(this, ProductSet);
    return possibleConstructorReturn(this, (ProductSet.__proto__ || Object.getPrototypeOf(ProductSet)).apply(this, arguments));
  }

  createClass(ProductSet, [{
    key: 'getProductGroups',
    value: function getProductGroups(fields, params) {
      return this.getEdge(ProductGroup, fields, params, 'product_groups');
    }
  }, {
    key: 'getProducts',
    value: function getProducts(fields, params) {
      return this.getEdge(ProductItem, fields, params, 'products');
    }
  }], [{
    key: 'getEndpoint',
    value: function getEndpoint() {
      return 'product_sets';
    }
  }, {
    key: 'Field',
    get: function get() {
      return Object.freeze({
        auto_creation_url: 'auto_creation_url',
        filter: 'filter',
        id: 'id',
        name: 'name',
        product_catalog: 'product_catalog',
        product_count: 'product_count'
      });
    }
  }]);
  return ProductSet;
}(AbstractCrudObject);

var ProductItem = function (_AbstractCrudObject) {
  inherits(ProductItem, _AbstractCrudObject);

  function ProductItem() {
    classCallCheck(this, ProductItem);
    return possibleConstructorReturn(this, (ProductItem.__proto__ || Object.getPrototypeOf(ProductItem)).apply(this, arguments));
  }

  createClass(ProductItem, [{
    key: 'getProductSets',
    value: function getProductSets(fields, params) {
      return this.getEdge(ProductSet, fields, params, 'product_sets');
    }
  }], [{
    key: 'getEndpoint',
    value: function getEndpoint() {
      return 'products';
    }
  }, {
    key: 'Field',
    get: function get() {
      return Object.freeze({
        additional_image_urls: 'additional_image_urls',
        age_group: 'age_group',
        android_app_name: 'android_app_name',
        android_class: 'android_class',
        android_package: 'android_package',
        android_url: 'android_url',
        applinks: 'applinks',
        availability: 'availability',
        brand: 'brand',
        category: 'category',
        checkout_url: 'checkout_url',
        color: 'color',
        commerce_insights: 'commerce_insights',
        condition: 'condition',
        currency: 'currency',
        custom_data: 'custom_data',
        custom_label_0: 'custom_label_0',
        custom_label_1: 'custom_label_1',
        custom_label_2: 'custom_label_2',
        custom_label_3: 'custom_label_3',
        custom_label_4: 'custom_label_4',
        description: 'description',
        expiration_date: 'expiration_date',
        gender: 'gender',
        gtin: 'gtin',
        id: 'id',
        image_url: 'image_url',
        inventory: 'inventory',
        ios_app_name: 'ios_app_name',
        ios_app_store_id: 'ios_app_store_id',
        ios_url: 'ios_url',
        ipad_app_name: 'ipad_app_name',
        ipad_app_store_id: 'ipad_app_store_id',
        ipad_url: 'ipad_url',
        iphone_app_name: 'iphone_app_name',
        iphone_app_store_id: 'iphone_app_store_id',
        iphone_url: 'iphone_url',
        manufacturer_part_number: 'manufacturer_part_number',
        material: 'material',
        name: 'name',
        ordering_index: 'ordering_index',
        pattern: 'pattern',
        price: 'price',
        product_catalog: 'product_catalog',
        product_feed: 'product_feed',
        product_group: 'product_group',
        product_type: 'product_type',
        retailer_id: 'retailer_id',
        retailer_product_group_id: 'retailer_product_group_id',
        review_rejection_reasons: 'review_rejection_reasons',
        review_status: 'review_status',
        sale_price: 'sale_price',
        sale_price_end_date: 'sale_price_end_date',
        sale_price_start_date: 'sale_price_start_date',
        shipping_weight_unit: 'shipping_weight_unit',
        shipping_weight_value: 'shipping_weight_value',
        short_description: 'short_description',
        size: 'size',
        start_date: 'start_date',
        url: 'url',
        visibility: 'visibility',
        windows_phone_app_id: 'windows_phone_app_id',
        windows_phone_app_name: 'windows_phone_app_name',
        windows_phone_url: 'windows_phone_url'
      });
    }
  }, {
    key: 'AgeGroup',
    get: function get() {
      return Object.freeze({
        adult: 'adult',
        infant: 'infant',
        kids: 'kids',
        newborn: 'newborn',
        toddler: 'toddler'
      });
    }
  }, {
    key: 'Availability',
    get: function get() {
      return Object.freeze({
        available_for_order: 'available for order',
        discontinued: 'discontinued',
        in_stock: 'in stock',
        out_of_stock: 'out of stock',
        preorder: 'preorder'
      });
    }
  }, {
    key: 'Condition',
    get: function get() {
      return Object.freeze({
        new: 'new',
        refurbished: 'refurbished',
        used: 'used'
      });
    }
  }, {
    key: 'Gender',
    get: function get() {
      return Object.freeze({
        female: 'female',
        male: 'male',
        unisex: 'unisex'
      });
    }
  }, {
    key: 'ReviewStatus',
    get: function get() {
      return Object.freeze({
        approved: 'approved',
        pending: 'pending',
        rejected: 'rejected'
      });
    }
  }, {
    key: 'ShippingWeightUnit',
    get: function get() {
      return Object.freeze({
        kg: 'kg',
        lb: 'lb',
        oz: 'oz',
        value_g: 'g'
      });
    }
  }, {
    key: 'Visibility',
    get: function get() {
      return Object.freeze({
        published: 'published',
        staging: 'staging'
      });
    }
  }]);
  return ProductItem;
}(AbstractCrudObject);

var ProductFeed = function (_AbstractCrudObject) {
  inherits(ProductFeed, _AbstractCrudObject);

  function ProductFeed() {
    classCallCheck(this, ProductFeed);
    return possibleConstructorReturn(this, (ProductFeed.__proto__ || Object.getPrototypeOf(ProductFeed)).apply(this, arguments));
  }

  createClass(ProductFeed, [{
    key: 'getProducts',
    value: function getProducts(fields, params) {
      return this.getEdge(ProductItem, fields, params, 'products');
    }
  }, {
    key: 'getUploads',
    value: function getUploads(fields, params) {
      return this.getEdge(ProductFeedUpload, fields, params, 'uploads');
    }
  }], [{
    key: 'getEndpoint',
    value: function getEndpoint() {
      return 'product_feeds';
    }
  }, {
    key: 'Field',
    get: function get() {
      return Object.freeze({
        country: 'country',
        created_time: 'created_time',
        default_currency: 'default_currency',
        deletion_enabled: 'deletion_enabled',
        delimiter: 'delimiter',
        encoding: 'encoding',
        file_name: 'file_name',
        id: 'id',
        latest_upload: 'latest_upload',
        name: 'name',
        product_count: 'product_count',
        quoted_fields_mode: 'quoted_fields_mode',
        schedule: 'schedule'
      });
    }
  }, {
    key: 'Delimiter',
    get: function get() {
      return Object.freeze({
        autodetect: 'AUTODETECT',
        bar: 'BAR',
        comma: 'COMMA',
        semicolon: 'SEMICOLON',
        tab: 'TAB',
        tilde: 'TILDE'
      });
    }
  }, {
    key: 'QuotedFieldsMode',
    get: function get() {
      return Object.freeze({
        autodetect: 'AUTODETECT',
        off: 'OFF',
        on: 'ON'
      });
    }
  }, {
    key: 'Encoding',
    get: function get() {
      return Object.freeze({
        autodetect: 'AUTODETECT',
        latin1: 'LATIN1',
        utf16be: 'UTF16BE',
        utf16le: 'UTF16LE',
        utf32be: 'UTF32BE',
        utf32le: 'UTF32LE',
        utf8: 'UTF8'
      });
    }
  }]);
  return ProductFeed;
}(AbstractCrudObject);

var ProductCatalog = function (_AbstractCrudObject) {
  inherits(ProductCatalog, _AbstractCrudObject);

  function ProductCatalog() {
    classCallCheck(this, ProductCatalog);
    return possibleConstructorReturn(this, (ProductCatalog.__proto__ || Object.getPrototypeOf(ProductCatalog)).apply(this, arguments));
  }

  createClass(ProductCatalog, [{
    key: 'getAgencies',
    value: function getAgencies(fields, params) {
      return this.getEdge(Business, fields, params, 'agencies');
    }
  }, {
    key: 'getDestinations',
    value: function getDestinations(fields, params) {
      return this.getEdge(AbstractCrudObject, fields, params, 'destinations');
    }
  }, {
    key: 'getExternalEventSources',
    value: function getExternalEventSources(fields, params) {
      return this.getEdge(ExternalEventSource, fields, params, 'external_event_sources');
    }
  }, {
    key: 'getFlights',
    value: function getFlights(fields, params) {
      return this.getEdge(AbstractCrudObject, fields, params, 'flights');
    }
  }, {
    key: 'getHotelRoomsBatch',
    value: function getHotelRoomsBatch(fields, params) {
      return this.getEdge(ProductCatalogHotelRoomsBatch, fields, params, 'hotel_rooms_batch');
    }
  }, {
    key: 'getHotels',
    value: function getHotels(fields, params) {
      return this.getEdge(Hotel, fields, params, 'hotels');
    }
  }, {
    key: 'getPricingVariablesBatch',
    value: function getPricingVariablesBatch(fields, params) {
      return this.getEdge(ProductCatalogPricingVariablesBatch, fields, params, 'pricing_variables_batch');
    }
  }, {
    key: 'getProductFeeds',
    value: function getProductFeeds(fields, params) {
      return this.getEdge(ProductFeed, fields, params, 'product_feeds');
    }
  }, {
    key: 'getProductGroups',
    value: function getProductGroups(fields, params) {
      return this.getEdge(ProductGroup, fields, params, 'product_groups');
    }
  }, {
    key: 'getProductSets',
    value: function getProductSets(fields, params) {
      return this.getEdge(ProductSet, fields, params, 'product_sets');
    }
  }, {
    key: 'getProductSetsBatch',
    value: function getProductSetsBatch(fields, params) {
      return this.getEdge(AbstractCrudObject, fields, params, 'product_sets_batch');
    }
  }, {
    key: 'getProducts',
    value: function getProducts(fields, params) {
      return this.getEdge(ProductItem, fields, params, 'products');
    }
  }], [{
    key: 'getEndpoint',
    value: function getEndpoint() {
      return 'product_catalogs';
    }
  }, {
    key: 'Field',
    get: function get() {
      return Object.freeze({
        business: 'business',
        da_display_settings: 'da_display_settings',
        default_image_url: 'default_image_url',
        fallback_image_url: 'fallback_image_url',
        feed_count: 'feed_count',
        id: 'id',
        image_padding_landscape: 'image_padding_landscape',
        image_padding_square: 'image_padding_square',
        name: 'name',
        product_count: 'product_count',
        vertical: 'vertical'
      });
    }
  }, {
    key: 'Vertical',
    get: function get() {
      return Object.freeze({
        commerce: 'commerce',
        destinations: 'destinations',
        flights: 'flights',
        hotels: 'hotels'
      });
    }
  }]);
  return ProductCatalog;
}(AbstractCrudObject);

var ProfilePictureSource = function (_AbstractObject) {
  inherits(ProfilePictureSource, _AbstractObject);

  function ProfilePictureSource() {
    classCallCheck(this, ProfilePictureSource);
    return possibleConstructorReturn(this, (ProfilePictureSource.__proto__ || Object.getPrototypeOf(ProfilePictureSource)).apply(this, arguments));
  }

  createClass(ProfilePictureSource, null, [{
    key: 'Field',
    get: function get() {
      return Object.freeze({
        bottom: 'bottom',
        height: 'height',
        is_silhouette: 'is_silhouette',
        left: 'left',
        right: 'right',
        top: 'top',
        url: 'url',
        width: 'width'
      });
    }
  }, {
    key: 'Type',
    get: function get() {
      return Object.freeze({
        album: 'album',
        large: 'large',
        normal: 'normal',
        small: 'small',
        square: 'square'
      });
    }
  }]);
  return ProfilePictureSource;
}(AbstractObject);

var ReachFrequencyPrediction = function (_AbstractCrudObject) {
  inherits(ReachFrequencyPrediction, _AbstractCrudObject);

  function ReachFrequencyPrediction() {
    classCallCheck(this, ReachFrequencyPrediction);
    return possibleConstructorReturn(this, (ReachFrequencyPrediction.__proto__ || Object.getPrototypeOf(ReachFrequencyPrediction)).apply(this, arguments));
  }

  createClass(ReachFrequencyPrediction, null, [{
    key: 'getEndpoint',
    value: function getEndpoint() {
      return 'reachfrequencypredictions';
    }
  }, {
    key: 'Field',
    get: function get() {
      return Object.freeze({
        account_id: 'account_id',
        budget: 'budget',
        campaign_group_id: 'campaign_group_id',
        campaign_id: 'campaign_id',
        campaign_time_start: 'campaign_time_start',
        campaign_time_stop: 'campaign_time_stop',
        curve_budget_reach: 'curve_budget_reach',
        daily_impression_curve: 'daily_impression_curve',
        day_parting_schedule: 'day_parting_schedule',
        destination_id: 'destination_id',
        destination_ids: 'destination_ids',
        end_time: 'end_time',
        expiration_time: 'expiration_time',
        external_budget: 'external_budget',
        external_impression: 'external_impression',
        external_maximum_budget: 'external_maximum_budget',
        external_maximum_impression: 'external_maximum_impression',
        external_maximum_reach: 'external_maximum_reach',
        external_minimum_budget: 'external_minimum_budget',
        external_minimum_impression: 'external_minimum_impression',
        external_minimum_reach: 'external_minimum_reach',
        external_reach: 'external_reach',
        frequency_cap: 'frequency_cap',
        grp_dmas_audience_size: 'grp_dmas_audience_size',
        holdout_percentage: 'holdout_percentage',
        id: 'id',
        instagram_destination_id: 'instagram_destination_id',
        interval_frequency_cap: 'interval_frequency_cap',
        interval_frequency_cap_reset_period: 'interval_frequency_cap_reset_period',
        name: 'name',
        num_curve_points: 'num_curve_points',
        objective: 'objective',
        pause_periods: 'pause_periods',
        placement_breakdown: 'placement_breakdown',
        prediction_mode: 'prediction_mode',
        prediction_progress: 'prediction_progress',
        reach: 'reach',
        reservation_status: 'reservation_status',
        rf_prediction_id_to_share: 'rf_prediction_id_to_share',
        start_time: 'start_time',
        status: 'status',
        stop_time: 'stop_time',
        story_event_type: 'story_event_type',
        target_audience_size: 'target_audience_size',
        target_spec: 'target_spec',
        time_created: 'time_created',
        time_updated: 'time_updated'
      });
    }
  }, {
    key: 'Status',
    get: function get() {
      return Object.freeze({
        active: 'ACTIVE',
        completed: 'COMPLETED',
        draft: 'DRAFT',
        expired: 'EXPIRED',
        pending: 'PENDING'
      });
    }
  }]);
  return ReachFrequencyPrediction;
}(AbstractCrudObject);

var Business = function (_AbstractCrudObject) {
  inherits(Business, _AbstractCrudObject);

  function Business() {
    classCallCheck(this, Business);
    return possibleConstructorReturn(this, (Business.__proto__ || Object.getPrototypeOf(Business)).apply(this, arguments));
  }

  createClass(Business, [{
    key: 'getAdsPixels',
    value: function getAdsPixels(fields, params) {
      return this.getEdge(AdsPixel, fields, params, 'adspixels');
    }
  }, {
    key: 'getAssignedAdAccounts',
    value: function getAssignedAdAccounts(fields, params) {
      return this.getEdge(AdAccount, fields, params, 'assigned_ad_accounts');
    }
  }, {
    key: 'getAssignedPages',
    value: function getAssignedPages(fields, params) {
      return this.getEdge(AbstractCrudObject, fields, params, 'assigned_pages');
    }
  }, {
    key: 'getAssignedProductCatalogs',
    value: function getAssignedProductCatalogs(fields, params) {
      return this.getEdge(ProductCatalog, fields, params, 'assigned_product_catalogs');
    }
  }, {
    key: 'getClientAdAccountRequests',
    value: function getClientAdAccountRequests(fields, params) {
      return this.getEdge(BusinessAdAccountRequest, fields, params, 'client_ad_account_requests');
    }
  }, {
    key: 'getClientAdAccounts',
    value: function getClientAdAccounts(fields, params) {
      return this.getEdge(AdAccount, fields, params, 'client_ad_accounts');
    }
  }, {
    key: 'getClientPageRequests',
    value: function getClientPageRequests(fields, params) {
      return this.getEdge(BusinessPageRequest, fields, params, 'client_page_requests');
    }
  }, {
    key: 'getClientPages',
    value: function getClientPages(fields, params) {
      return this.getEdge(AbstractCrudObject, fields, params, 'client_pages');
    }
  }, {
    key: 'getEventSourceGroups',
    value: function getEventSourceGroups(fields, params) {
      return this.getEdge(EventSourceGroup, fields, params, 'event_source_groups');
    }
  }, {
    key: 'getGrpPlans',
    value: function getGrpPlans(fields, params) {
      return this.getEdge(ReachFrequencyPrediction, fields, params, 'grp_plans');
    }
  }, {
    key: 'getInstagramAccounts',
    value: function getInstagramAccounts(fields, params) {
      return this.getEdge(AbstractCrudObject, fields, params, 'instagram_accounts');
    }
  }, {
    key: 'getMeasurementReports',
    value: function getMeasurementReports(fields, params) {
      return this.getEdge(AbstractCrudObject, fields, params, 'measurement_reports');
    }
  }, {
    key: 'getOfflineConversionDataSets',
    value: function getOfflineConversionDataSets(fields, params) {
      return this.getEdge(AbstractCrudObject, fields, params, 'offline_conversion_data_sets');
    }
  }, {
    key: 'getOwnedAdAccountRequests',
    value: function getOwnedAdAccountRequests(fields, params) {
      return this.getEdge(LegacyBusinessAdAccountRequest, fields, params, 'owned_ad_account_requests');
    }
  }, {
    key: 'getOwnedAdAccounts',
    value: function getOwnedAdAccounts(fields, params) {
      return this.getEdge(AdAccount, fields, params, 'owned_ad_accounts');
    }
  }, {
    key: 'getOwnedInstagramAccounts',
    value: function getOwnedInstagramAccounts(fields, params) {
      return this.getEdge(AbstractCrudObject, fields, params, 'owned_instagram_accounts');
    }
  }, {
    key: 'getOwnedPageRequests',
    value: function getOwnedPageRequests(fields, params) {
      return this.getEdge(BusinessPageRequest, fields, params, 'owned_page_requests');
    }
  }, {
    key: 'getOwnedPages',
    value: function getOwnedPages(fields, params) {
      return this.getEdge(AbstractCrudObject, fields, params, 'owned_pages');
    }
  }, {
    key: 'getOwnedPixels',
    value: function getOwnedPixels(fields, params) {
      return this.getEdge(AdsPixel, fields, params, 'owned_pixels');
    }
  }, {
    key: 'getPicture',
    value: function getPicture(fields, params) {
      return this.getEdge(ProfilePictureSource, fields, params, 'picture');
    }
  }, {
    key: 'getProductCatalogs',
    value: function getProductCatalogs(fields, params) {
      return this.getEdge(ProductCatalog, fields, params, 'product_catalogs');
    }
  }, {
    key: 'getReceivedAudiencePermissions',
    value: function getReceivedAudiencePermissions(fields, params) {
      return this.getEdge(AbstractCrudObject, fields, params, 'received_audience_permissions');
    }
  }, {
    key: 'getSharedAudiencePermissions',
    value: function getSharedAudiencePermissions(fields, params) {
      return this.getEdge(AbstractCrudObject, fields, params, 'shared_audience_permissions');
    }
  }, {
    key: 'getSystemUsers',
    value: function getSystemUsers(fields, params) {
      return this.getEdge(AbstractCrudObject, fields, params, 'system_users');
    }
  }], [{
    key: 'Field',
    get: function get() {
      return Object.freeze({
        created_by: 'created_by',
        created_time: 'created_time',
        id: 'id',
        link: 'link',
        name: 'name',
        payment_account_id: 'payment_account_id',
        primary_page: 'primary_page',
        timezone_id: 'timezone_id',
        two_factor_type: 'two_factor_type',
        updated_by: 'updated_by',
        updated_time: 'updated_time'
      });
    }
  }]);
  return Business;
}(AbstractCrudObject);

var CustomAudiencePrefillState = function (_AbstractObject) {
  inherits(CustomAudiencePrefillState, _AbstractObject);

  function CustomAudiencePrefillState() {
    classCallCheck(this, CustomAudiencePrefillState);
    return possibleConstructorReturn(this, (CustomAudiencePrefillState.__proto__ || Object.getPrototypeOf(CustomAudiencePrefillState)).apply(this, arguments));
  }

  createClass(CustomAudiencePrefillState, null, [{
    key: 'Field',
    get: function get() {
      return Object.freeze({
        description: 'description',
        num_added: 'num_added',
        status: 'status'
      });
    }
  }]);
  return CustomAudiencePrefillState;
}(AbstractObject);

var CustomAudienceSession = function (_AbstractObject) {
  inherits(CustomAudienceSession, _AbstractObject);

  function CustomAudienceSession() {
    classCallCheck(this, CustomAudienceSession);
    return possibleConstructorReturn(this, (CustomAudienceSession.__proto__ || Object.getPrototypeOf(CustomAudienceSession)).apply(this, arguments));
  }

  createClass(CustomAudienceSession, null, [{
    key: 'Field',
    get: function get() {
      return Object.freeze({
        end_time: 'end_time',
        num_invalid_entries: 'num_invalid_entries',
        num_matched: 'num_matched',
        num_received: 'num_received',
        progress: 'progress',
        session_id: 'session_id',
        stage: 'stage',
        start_time: 'start_time'
      });
    }
  }]);
  return CustomAudienceSession;
}(AbstractObject);

var CustomAudience = function (_AbstractCrudObject) {
  inherits(CustomAudience, _AbstractCrudObject);

  function CustomAudience() {
    classCallCheck(this, CustomAudience);
    return possibleConstructorReturn(this, (CustomAudience.__proto__ || Object.getPrototypeOf(CustomAudience)).apply(this, arguments));
  }

  createClass(CustomAudience, [{
    key: 'getAdAccounts',
    value: function getAdAccounts(fields, params) {
      return this.getEdge(AdAccount, fields, params, 'adaccounts');
    }
  }, {
    key: 'getAds',
    value: function getAds(fields, params) {
      return this.getEdge(Ad, fields, params, 'ads');
    }
  }, {
    key: 'getPrefills',
    value: function getPrefills(fields, params) {
      return this.getEdge(CustomAudiencePrefillState, fields, params, 'prefills');
    }
  }, {
    key: 'getSessions',
    value: function getSessions(fields, params) {
      return this.getEdge(CustomAudienceSession, fields, params, 'sessions');
    }
  }], [{
    key: 'getEndpoint',
    value: function getEndpoint() {
      return 'customaudiences';
    }
  }, {
    key: 'Field',
    get: function get() {
      return Object.freeze({
        account_id: 'account_id',
        approximate_count: 'approximate_count',
        data_source: 'data_source',
        delivery_status: 'delivery_status',
        description: 'description',
        external_event_source: 'external_event_source',
        id: 'id',
        is_value_based: 'is_value_based',
        lookalike_audience_ids: 'lookalike_audience_ids',
        lookalike_spec: 'lookalike_spec',
        name: 'name',
        operation_status: 'operation_status',
        opt_out_link: 'opt_out_link',
        permission_for_actions: 'permission_for_actions',
        pixel_id: 'pixel_id',
        retention_days: 'retention_days',
        rule: 'rule',
        subtype: 'subtype',
        time_content_updated: 'time_content_updated',
        time_created: 'time_created',
        time_updated: 'time_updated'
      });
    }
  }, {
    key: 'ClaimObjective',
    get: function get() {
      return Object.freeze({
        home_listing: 'HOME_LISTING',
        product: 'PRODUCT',
        travel: 'TRAVEL'
      });
    }
  }, {
    key: 'ContentType',
    get: function get() {
      return Object.freeze({
        destination: 'DESTINATION',
        flight: 'FLIGHT',
        home_listing: 'HOME_LISTING',
        hotel: 'HOTEL'
      });
    }
  }, {
    key: 'Subtype',
    get: function get() {
      return Object.freeze({
        app: 'APP',
        bag_of_accounts: 'BAG_OF_ACCOUNTS',
        claim: 'CLAIM',
        custom: 'CUSTOM',
        data_set: 'DATA_SET',
        engagement: 'ENGAGEMENT',
        lookalike: 'LOOKALIKE',
        managed: 'MANAGED',
        offline_conversion: 'OFFLINE_CONVERSION',
        partner: 'PARTNER',
        study_rule_audience: 'STUDY_RULE_AUDIENCE',
        video: 'VIDEO',
        website: 'WEBSITE'
      });
    }
  }]);
  return CustomAudience;
}(AbstractCrudObject);

var AdsPixel = function (_AbstractCrudObject) {
  inherits(AdsPixel, _AbstractCrudObject);

  function AdsPixel() {
    classCallCheck(this, AdsPixel);
    return possibleConstructorReturn(this, (AdsPixel.__proto__ || Object.getPrototypeOf(AdsPixel)).apply(this, arguments));
  }

  createClass(AdsPixel, [{
    key: 'getAudiences',
    value: function getAudiences(fields, params) {
      return this.getEdge(CustomAudience, fields, params, 'audiences');
    }
  }, {
    key: 'getSharedAccounts',
    value: function getSharedAccounts(fields, params) {
      return this.getEdge(AdAccount, fields, params, 'shared_accounts');
    }
  }, {
    key: 'getSharedAgencies',
    value: function getSharedAgencies(fields, params) {
      return this.getEdge(Business, fields, params, 'shared_agencies');
    }
  }, {
    key: 'getStats',
    value: function getStats(fields, params) {
      return this.getEdge(AdsPixelStatsResult, fields, params, 'stats');
    }
  }], [{
    key: 'getEndpoint',
    value: function getEndpoint() {
      return 'adspixels';
    }
  }, {
    key: 'Field',
    get: function get() {
      return Object.freeze({
        code: 'code',
        creation_time: 'creation_time',
        id: 'id',
        is_created_by_business: 'is_created_by_business',
        last_fired_time: 'last_fired_time',
        name: 'name',
        owner_ad_account: 'owner_ad_account',
        owner_business: 'owner_business'
      });
    }
  }]);
  return AdsPixel;
}(AbstractCrudObject);

var BroadTargetingCategories = function (_AbstractCrudObject) {
  inherits(BroadTargetingCategories, _AbstractCrudObject);

  function BroadTargetingCategories() {
    classCallCheck(this, BroadTargetingCategories);
    return possibleConstructorReturn(this, (BroadTargetingCategories.__proto__ || Object.getPrototypeOf(BroadTargetingCategories)).apply(this, arguments));
  }

  createClass(BroadTargetingCategories, null, [{
    key: 'getEndpoint',
    value: function getEndpoint() {
      return 'broadtargetingcategories';
    }
  }, {
    key: 'Field',
    get: function get() {
      return Object.freeze({
        category_description: 'category_description',
        id: 'id',
        name: 'name',
        parent_category: 'parent_category',
        path: 'path',
        size: 'size',
        source: 'source',
        type: 'type',
        type_name: 'type_name',
        untranslated_name: 'untranslated_name',
        untranslated_parent_name: 'untranslated_parent_name'
      });
    }
  }]);
  return BroadTargetingCategories;
}(AbstractCrudObject);

var CustomAudiencesTOS = function (_AbstractCrudObject) {
  inherits(CustomAudiencesTOS, _AbstractCrudObject);

  function CustomAudiencesTOS() {
    classCallCheck(this, CustomAudiencesTOS);
    return possibleConstructorReturn(this, (CustomAudiencesTOS.__proto__ || Object.getPrototypeOf(CustomAudiencesTOS)).apply(this, arguments));
  }

  createClass(CustomAudiencesTOS, null, [{
    key: 'Field',
    get: function get() {
      return Object.freeze({
        content: 'content',
        id: 'id',
        type: 'type'
      });
    }
  }]);
  return CustomAudiencesTOS;
}(AbstractCrudObject);

var LeadgenForm = function (_AbstractCrudObject) {
  inherits(LeadgenForm, _AbstractCrudObject);

  function LeadgenForm() {
    classCallCheck(this, LeadgenForm);
    return possibleConstructorReturn(this, (LeadgenForm.__proto__ || Object.getPrototypeOf(LeadgenForm)).apply(this, arguments));
  }

  createClass(LeadgenForm, [{
    key: 'getLeads',
    value: function getLeads(fields, params) {
      return this.getEdge(Lead, fields, params, 'leads');
    }
  }], [{
    key: 'getEndpoint',
    value: function getEndpoint() {
      return 'leadgen_forms';
    }
  }, {
    key: 'Field',
    get: function get() {
      return Object.freeze({
        allow_organic_lead: 'allow_organic_lead',
        context_card: 'context_card',
        continued_flow_request_method: 'continued_flow_request_method',
        created_time: 'created_time',
        creator: 'creator',
        creator_id: 'creator_id',
        cusomized_tcpa_content: 'cusomized_tcpa_content',
        expired_leads_count: 'expired_leads_count',
        follow_up_action_text: 'follow_up_action_text',
        follow_up_action_url: 'follow_up_action_url',
        id: 'id',
        is_continued_flow: 'is_continued_flow',
        leadgen_export_csv_url: 'leadgen_export_csv_url',
        leads_count: 'leads_count',
        legal_content: 'legal_content',
        locale: 'locale',
        messenger_welcome_message: 'messenger_welcome_message',
        name: 'name',
        organic_leads_count: 'organic_leads_count',
        page: 'page',
        page_id: 'page_id',
        privacy_policy_url: 'privacy_policy_url',
        qualifiers: 'qualifiers',
        questions: 'questions',
        status: 'status',
        tcpa_compliance: 'tcpa_compliance'
      });
    }
  }]);
  return LeadgenForm;
}(AbstractCrudObject);

var MinimumBudget = function (_AbstractObject) {
  inherits(MinimumBudget, _AbstractObject);

  function MinimumBudget() {
    classCallCheck(this, MinimumBudget);
    return possibleConstructorReturn(this, (MinimumBudget.__proto__ || Object.getPrototypeOf(MinimumBudget)).apply(this, arguments));
  }

  createClass(MinimumBudget, null, [{
    key: 'getEndpoint',
    value: function getEndpoint() {
      return 'minimum_budgets';
    }
  }, {
    key: 'Field',
    get: function get() {
      return Object.freeze({
        currency: 'currency',
        min_daily_budget_high_freq: 'min_daily_budget_high_freq',
        min_daily_budget_imp: 'min_daily_budget_imp',
        min_daily_budget_low_freq: 'min_daily_budget_low_freq',
        min_daily_budget_video_views: 'min_daily_budget_video_views'
      });
    }
  }]);
  return MinimumBudget;
}(AbstractObject);

var OffsitePixel = function (_AbstractCrudObject) {
  inherits(OffsitePixel, _AbstractCrudObject);

  function OffsitePixel() {
    classCallCheck(this, OffsitePixel);
    return possibleConstructorReturn(this, (OffsitePixel.__proto__ || Object.getPrototypeOf(OffsitePixel)).apply(this, arguments));
  }

  createClass(OffsitePixel, [{
    key: 'getAdAccounts',
    value: function getAdAccounts(fields, params) {
      return this.getEdge(AdAccount, fields, params, 'adaccounts');
    }
  }], [{
    key: 'getEndpoint',
    value: function getEndpoint() {
      return 'offsitepixels';
    }
  }, {
    key: 'Field',
    get: function get() {
      return Object.freeze({
        creator: 'creator',
        id: 'id',
        js_pixel: 'js_pixel',
        last_firing_time: 'last_firing_time',
        name: 'name',
        tag: 'tag'
      });
    }
  }, {
    key: 'Tag',
    get: function get() {
      return Object.freeze({
        add_to_cart: 'ADD_TO_CART',
        checkout: 'CHECKOUT',
        key_page_view: 'KEY_PAGE_VIEW',
        lead: 'LEAD',
        other: 'OTHER',
        registration: 'REGISTRATION'
      });
    }
  }]);
  return OffsitePixel;
}(AbstractCrudObject);

var PartnerCategory = function (_AbstractCrudObject) {
  inherits(PartnerCategory, _AbstractCrudObject);

  function PartnerCategory() {
    classCallCheck(this, PartnerCategory);
    return possibleConstructorReturn(this, (PartnerCategory.__proto__ || Object.getPrototypeOf(PartnerCategory)).apply(this, arguments));
  }

  createClass(PartnerCategory, null, [{
    key: 'getEndpoint',
    value: function getEndpoint() {
      return 'partnercategories';
    }
  }, {
    key: 'Field',
    get: function get() {
      return Object.freeze({
        approximate_count: 'approximate_count',
        country: 'country',
        description: 'description',
        details: 'details',
        id: 'id',
        is_private: 'is_private',
        name: 'name',
        parent_category: 'parent_category',
        source: 'source',
        status: 'status',
        targeting_type: 'targeting_type'
      });
    }
  }, {
    key: 'PrivateOrPublic',
    get: function get() {
      return Object.freeze({
        private: 'PRIVATE',
        public: 'PUBLIC'
      });
    }
  }]);
  return PartnerCategory;
}(AbstractCrudObject);

var RateCard = function (_AbstractObject) {
  inherits(RateCard, _AbstractObject);

  function RateCard() {
    classCallCheck(this, RateCard);
    return possibleConstructorReturn(this, (RateCard.__proto__ || Object.getPrototypeOf(RateCard)).apply(this, arguments));
  }

  createClass(RateCard, null, [{
    key: 'getEndpoint',
    value: function getEndpoint() {
      return 'ratecard';
    }
  }, {
    key: 'Field',
    get: function get() {
      return Object.freeze({
        country: 'country',
        currency: 'currency',
        rate: 'rate'
      });
    }
  }]);
  return RateCard;
}(AbstractObject);

var ReachEstimate = function (_AbstractObject) {
  inherits(ReachEstimate, _AbstractObject);

  function ReachEstimate() {
    classCallCheck(this, ReachEstimate);
    return possibleConstructorReturn(this, (ReachEstimate.__proto__ || Object.getPrototypeOf(ReachEstimate)).apply(this, arguments));
  }

  createClass(ReachEstimate, null, [{
    key: 'getEndpoint',
    value: function getEndpoint() {
      return 'reachestimate';
    }
  }, {
    key: 'Field',
    get: function get() {
      return Object.freeze({
        estimate_ready: 'estimate_ready',
        unsupported: 'unsupported',
        users: 'users'
      });
    }
  }, {
    key: 'OptimizeFor',
    get: function get() {
      return Object.freeze({
        app_downloads: 'APP_DOWNLOADS',
        app_installs: 'APP_INSTALLS',
        brand_awareness: 'BRAND_AWARENESS',
        clicks: 'CLICKS',
        engaged_users: 'ENGAGED_USERS',
        event_responses: 'EVENT_RESPONSES',
        impressions: 'IMPRESSIONS',
        lead_generation: 'LEAD_GENERATION',
        link_clicks: 'LINK_CLICKS',
        none: 'NONE',
        offer_claims: 'OFFER_CLAIMS',
        offsite_conversions: 'OFFSITE_CONVERSIONS',
        page_engagement: 'PAGE_ENGAGEMENT',
        page_likes: 'PAGE_LIKES',
        post_engagement: 'POST_ENGAGEMENT',
        reach: 'REACH',
        social_impressions: 'SOCIAL_IMPRESSIONS',
        video_views: 'VIDEO_VIEWS'
      });
    }
  }]);
  return ReachEstimate;
}(AbstractObject);

var Transaction = function (_AbstractCrudObject) {
  inherits(Transaction, _AbstractCrudObject);

  function Transaction() {
    classCallCheck(this, Transaction);
    return possibleConstructorReturn(this, (Transaction.__proto__ || Object.getPrototypeOf(Transaction)).apply(this, arguments));
  }

  createClass(Transaction, null, [{
    key: 'getEndpoint',
    value: function getEndpoint() {
      return 'transactions';
    }
  }, {
    key: 'Field',
    get: function get() {
      return Object.freeze({
        account_id: 'account_id',
        app_amount: 'app_amount',
        billing_end_time: 'billing_end_time',
        billing_reason: 'billing_reason',
        billing_start_time: 'billing_start_time',
        charge_type: 'charge_type',
        checkout_campaign_group_id: 'checkout_campaign_group_id',
        credential_id: 'credential_id',
        fatura_id: 'fatura_id',
        id: 'id',
        payment_option: 'payment_option',
        product_type: 'product_type',
        provider_amount: 'provider_amount',
        status: 'status',
        time: 'time',
        tracking_id: 'tracking_id'
      });
    }
  }, {
    key: 'ProductType',
    get: function get() {
      return Object.freeze({
        facebook_ad: 'facebook_ad',
        ig_ad: 'ig_ad'
      });
    }
  }]);
  return Transaction;
}(AbstractCrudObject);

var AdAccount = function (_AbstractCrudObject) {
  inherits(AdAccount, _AbstractCrudObject);

  function AdAccount() {
    classCallCheck(this, AdAccount);
    return possibleConstructorReturn(this, (AdAccount.__proto__ || Object.getPrototypeOf(AdAccount)).apply(this, arguments));
  }

  createClass(AdAccount, [{
    key: 'getActivities',
    value: function getActivities(fields, params) {
      return this.getEdge(AdActivity, fields, params, 'activities');
    }
  }, {
    key: 'getAdCreatives',
    value: function getAdCreatives(fields, params) {
      return this.getEdge(AdCreative, fields, params, 'adcreatives');
    }
  }, {
    key: 'getAdCreativesByLabels',
    value: function getAdCreativesByLabels(fields, params) {
      return this.getEdge(AdCreative, fields, params, 'adcreativesbylabels');
    }
  }, {
    key: 'getAdImages',
    value: function getAdImages(fields, params) {
      return this.getEdge(AdImage, fields, params, 'adimages');
    }
  }, {
    key: 'getAdLabels',
    value: function getAdLabels(fields, params) {
      return this.getEdge(AdLabel, fields, params, 'adlabels');
    }
  }, {
    key: 'getAdPlacePageSets',
    value: function getAdPlacePageSets(fields, params) {
      return this.getEdge(AdPlacePageSet, fields, params, 'ad_place_page_sets');
    }
  }, {
    key: 'getAdReportRuns',
    value: function getAdReportRuns(fields, params) {
      return this.getEdge(AdReportRun, fields, params, 'adreportruns');
    }
  }, {
    key: 'getAdReportSchedules',
    value: function getAdReportSchedules(fields, params) {
      return this.getEdge(AbstractCrudObject, fields, params, 'adreportschedules');
    }
  }, {
    key: 'getAdSets',
    value: function getAdSets(fields, params) {
      return this.getEdge(AdSet, fields, params, 'adsets');
    }
  }, {
    key: 'getAdSetsByLabels',
    value: function getAdSetsByLabels(fields, params) {
      return this.getEdge(AdSet, fields, params, 'adsetsbylabels');
    }
  }, {
    key: 'getAdVideos',
    value: function getAdVideos(fields, params) {
      return this.getEdge(AbstractCrudObject, fields, params, 'advideos');
    }
  }, {
    key: 'getAds',
    value: function getAds(fields, params) {
      return this.getEdge(Ad, fields, params, 'ads');
    }
  }, {
    key: 'getAdsByLabels',
    value: function getAdsByLabels(fields, params) {
      return this.getEdge(Ad, fields, params, 'adsbylabels');
    }
  }, {
    key: 'getAdsPixels',
    value: function getAdsPixels(fields, params) {
      return this.getEdge(AdsPixel, fields, params, 'adspixels');
    }
  }, {
    key: 'getAdvertisableApplications',
    value: function getAdvertisableApplications(fields, params) {
      return this.getEdge(AbstractCrudObject, fields, params, 'advertisable_applications');
    }
  }, {
    key: 'getApplications',
    value: function getApplications(fields, params) {
      return this.getEdge(AbstractCrudObject, fields, params, 'applications');
    }
  }, {
    key: 'getAsyncAdRequestSets',
    value: function getAsyncAdRequestSets(fields, params) {
      return this.getEdge(AdAsyncRequestSet, fields, params, 'asyncadrequestsets');
    }
  }, {
    key: 'getBroadTargetingCategories',
    value: function getBroadTargetingCategories(fields, params) {
      return this.getEdge(BroadTargetingCategories, fields, params, 'broadtargetingcategories');
    }
  }, {
    key: 'getCampaigns',
    value: function getCampaigns(fields, params) {
      return this.getEdge(Campaign, fields, params, 'campaigns');
    }
  }, {
    key: 'getCampaignsByLabels',
    value: function getCampaignsByLabels(fields, params) {
      return this.getEdge(Campaign, fields, params, 'campaignsbylabels');
    }
  }, {
    key: 'getCustomAudiences',
    value: function getCustomAudiences(fields, params) {
      return this.getEdge(CustomAudience, fields, params, 'customaudiences');
    }
  }, {
    key: 'getCustomAudiencesTos',
    value: function getCustomAudiencesTos(fields, params) {
      return this.getEdge(CustomAudiencesTOS, fields, params, 'customaudiencestos');
    }
  }, {
    key: 'getGeneratePreviews',
    value: function getGeneratePreviews(fields, params) {
      return this.getEdge(AdPreview, fields, params, 'generatepreviews');
    }
  }, {
    key: 'getInsights',
    value: function getInsights(fields, params) {
      return this.getEdge(AdsInsights, fields, params, 'insights');
    }
  }, {
    key: 'getInsightsAsync',
    value: function getInsightsAsync(fields, params) {
      return this.getEdge(AdReportRun, fields, params, 'insights');
    }
  }, {
    key: 'getInstagramAccounts',
    value: function getInstagramAccounts(fields, params) {
      return this.getEdge(AbstractCrudObject, fields, params, 'instagram_accounts');
    }
  }, {
    key: 'getLeadGenForms',
    value: function getLeadGenForms(fields, params) {
      return this.getEdge(LeadgenForm, fields, params, 'leadgen_forms');
    }
  }, {
    key: 'getMinimumBudgets',
    value: function getMinimumBudgets(fields, params) {
      return this.getEdge(MinimumBudget, fields, params, 'minimum_budgets');
    }
  }, {
    key: 'getOfflineConversionDataSets',
    value: function getOfflineConversionDataSets(fields, params) {
      return this.getEdge(AbstractCrudObject, fields, params, 'offline_conversion_data_sets');
    }
  }, {
    key: 'getOffsitePixels',
    value: function getOffsitePixels(fields, params) {
      return this.getEdge(OffsitePixel, fields, params, 'offsitepixels');
    }
  }, {
    key: 'getPartnerCategories',
    value: function getPartnerCategories(fields, params) {
      return this.getEdge(PartnerCategory, fields, params, 'partnercategories');
    }
  }, {
    key: 'getPartners',
    value: function getPartners(fields, params) {
      return this.getEdge(AdsDataPartner, fields, params, 'partners');
    }
  }, {
    key: 'getPublisherBlockLists',
    value: function getPublisherBlockLists(fields, params) {
      return this.getEdge(AbstractCrudObject, fields, params, 'publisher_block_lists');
    }
  }, {
    key: 'getRateCard',
    value: function getRateCard(fields, params) {
      return this.getEdge(RateCard, fields, params, 'ratecard');
    }
  }, {
    key: 'getReachEstimate',
    value: function getReachEstimate(fields, params) {
      return this.getEdge(ReachEstimate, fields, params, 'reachestimate');
    }
  }, {
    key: 'getReachFrequencyPredictions',
    value: function getReachFrequencyPredictions(fields, params) {
      return this.getEdge(ReachFrequencyPrediction, fields, params, 'reachfrequencypredictions');
    }
  }, {
    key: 'getRoas',
    value: function getRoas(fields, params) {
      return this.getEdge(AdAccountRoas, fields, params, 'roas');
    }
  }, {
    key: 'getTargetingBrowse',
    value: function getTargetingBrowse(fields, params) {
      return this.getEdge(AdAccountTargetingUnified, fields, params, 'targetingbrowse');
    }
  }, {
    key: 'getTargetingSearch',
    value: function getTargetingSearch(fields, params) {
      return this.getEdge(AdAccountTargetingUnified, fields, params, 'targetingsearch');
    }
  }, {
    key: 'getTargetingSentenceLines',
    value: function getTargetingSentenceLines(fields, params) {
      return this.getEdge(TargetingSentenceLine, fields, params, 'targetingsentencelines');
    }
  }, {
    key: 'getTargetingSuggestions',
    value: function getTargetingSuggestions(fields, params) {
      return this.getEdge(AdAccountTargetingUnified, fields, params, 'targetingsuggestions');
    }
  }, {
    key: 'getTargetingValidation',
    value: function getTargetingValidation(fields, params) {
      return this.getEdge(AdAccountTargetingUnified, fields, params, 'targetingvalidation');
    }
  }, {
    key: 'getTransactions',
    value: function getTransactions(fields, params) {
      return this.getEdge(Transaction, fields, params, 'transactions');
    }
  }, {
    key: 'getUsers',
    value: function getUsers(fields, params) {
      return this.getEdge(AdAccountUser, fields, params, 'users');
    }
  }], [{
    key: 'getEndpoint',
    value: function getEndpoint() {
      return 'adaccounts';
    }
  }, {
    key: 'Field',
    get: function get() {
      return Object.freeze({
        account_id: 'account_id',
        account_status: 'account_status',
        age: 'age',
        agency_client_declaration: 'agency_client_declaration',
        amount_spent: 'amount_spent',
        balance: 'balance',
        business: 'business',
        business_city: 'business_city',
        business_country_code: 'business_country_code',
        business_name: 'business_name',
        business_state: 'business_state',
        business_street: 'business_street',
        business_street2: 'business_street2',
        business_zip: 'business_zip',
        can_create_brand_lift_study: 'can_create_brand_lift_study',
        capabilities: 'capabilities',
        created_time: 'created_time',
        currency: 'currency',
        disable_reason: 'disable_reason',
        end_advertiser: 'end_advertiser',
        end_advertiser_name: 'end_advertiser_name',
        failed_delivery_checks: 'failed_delivery_checks',
        funding_source: 'funding_source',
        funding_source_details: 'funding_source_details',
        has_migrated_permissions: 'has_migrated_permissions',
        id: 'id',
        io_number: 'io_number',
        is_notifications_enabled: 'is_notifications_enabled',
        is_personal: 'is_personal',
        is_prepay_account: 'is_prepay_account',
        is_tax_id_required: 'is_tax_id_required',
        line_numbers: 'line_numbers',
        media_agency: 'media_agency',
        min_campaign_group_spend_cap: 'min_campaign_group_spend_cap',
        min_daily_budget: 'min_daily_budget',
        name: 'name',
        offsite_pixels_tos_accepted: 'offsite_pixels_tos_accepted',
        owner: 'owner',
        partner: 'partner',
        rf_spec: 'rf_spec',
        salesforce_invoice_group_id: 'salesforce_invoice_group_id',
        show_checkout_experience: 'show_checkout_experience',
        spend_cap: 'spend_cap',
        tax_id: 'tax_id',
        tax_id_status: 'tax_id_status',
        tax_id_type: 'tax_id_type',
        timezone_id: 'timezone_id',
        timezone_name: 'timezone_name',
        timezone_offset_hours_utc: 'timezone_offset_hours_utc',
        tos_accepted: 'tos_accepted',
        user_role: 'user_role'
      });
    }
  }, {
    key: 'AccessType',
    get: function get() {
      return Object.freeze({
        agency: 'AGENCY',
        owner: 'OWNER'
      });
    }
  }, {
    key: 'PermittedRoles',
    get: function get() {
      return Object.freeze({
        admin: 'ADMIN',
        fb_employee_dso_advertiser: 'FB_EMPLOYEE_DSO_ADVERTISER',
        general_user: 'GENERAL_USER',
        instagram_advertiser: 'INSTAGRAM_ADVERTISER',
        instagram_manager: 'INSTAGRAM_MANAGER',
        reports_only: 'REPORTS_ONLY'
      });
    }
  }]);
  return AdAccount;
}(AbstractCrudObject);

var Domain = function (_AbstractCrudObject) {
  inherits(Domain, _AbstractCrudObject);

  function Domain() {
    classCallCheck(this, Domain);
    return possibleConstructorReturn(this, (Domain.__proto__ || Object.getPrototypeOf(Domain)).apply(this, arguments));
  }

  createClass(Domain, null, [{
    key: 'Field',
    get: function get() {
      return Object.freeze({
        id: 'id',
        name: 'name',
        url: 'url'
      });
    }
  }]);
  return Domain;
}(AbstractCrudObject);

var Event = function (_AbstractCrudObject) {
  inherits(Event, _AbstractCrudObject);

  function Event() {
    classCallCheck(this, Event);
    return possibleConstructorReturn(this, (Event.__proto__ || Object.getPrototypeOf(Event)).apply(this, arguments));
  }

  createClass(Event, [{
    key: 'getPicture',
    value: function getPicture(fields, params) {
      return this.getEdge(ProfilePictureSource, fields, params, 'picture');
    }
  }], [{
    key: 'Field',
    get: function get() {
      return Object.freeze({
        attending_count: 'attending_count',
        can_guests_invite: 'can_guests_invite',
        category: 'category',
        cover: 'cover',
        declined_count: 'declined_count',
        description: 'description',
        end_time: 'end_time',
        guest_list_enabled: 'guest_list_enabled',
        id: 'id',
        interested_count: 'interested_count',
        is_canceled: 'is_canceled',
        is_page_owned: 'is_page_owned',
        is_viewer_admin: 'is_viewer_admin',
        maybe_count: 'maybe_count',
        name: 'name',
        noreply_count: 'noreply_count',
        owner: 'owner',
        parent_group: 'parent_group',
        place: 'place',
        start_time: 'start_time',
        ticket_uri: 'ticket_uri',
        timezone: 'timezone',
        type: 'type',
        updated_time: 'updated_time'
      });
    }
  }, {
    key: 'Type',
    get: function get() {
      return Object.freeze({
        community: 'community',
        group: 'group',
        private: 'private',
        public: 'public'
      });
    }
  }]);
  return Event;
}(AbstractCrudObject);

var User = function (_AbstractCrudObject) {
  inherits(User, _AbstractCrudObject);

  function User() {
    classCallCheck(this, User);
    return possibleConstructorReturn(this, (User.__proto__ || Object.getPrototypeOf(User)).apply(this, arguments));
  }

  createClass(User, [{
    key: 'getAccounts',
    value: function getAccounts(fields, params) {
      return this.getEdge(AbstractCrudObject, fields, params, 'accounts');
    }
  }, {
    key: 'getAdAccounts',
    value: function getAdAccounts(fields, params) {
      return this.getEdge(AdAccount, fields, params, 'adaccounts');
    }
  }, {
    key: 'getLeadGenForms',
    value: function getLeadGenForms(fields, params) {
      return this.getEdge(LeadgenForm, fields, params, 'leadgen_forms');
    }
  }, {
    key: 'getPicture',
    value: function getPicture(fields, params) {
      return this.getEdge(ProfilePictureSource, fields, params, 'picture');
    }
  }, {
    key: 'getPromotableDomains',
    value: function getPromotableDomains(fields, params) {
      return this.getEdge(Domain, fields, params, 'promotable_domains');
    }
  }, {
    key: 'getPromotableEvents',
    value: function getPromotableEvents(fields, params) {
      return this.getEdge(Event, fields, params, 'promotable_events');
    }
  }], [{
    key: 'Field',
    get: function get() {
      return Object.freeze({
        about: 'about',
        admin_notes: 'admin_notes',
        age_range: 'age_range',
        birthday: 'birthday',
        can_review_measurement_request: 'can_review_measurement_request',
        context: 'context',
        cover: 'cover',
        currency: 'currency',
        devices: 'devices',
        education: 'education',
        email: 'email',
        employee_number: 'employee_number',
        favorite_athletes: 'favorite_athletes',
        favorite_teams: 'favorite_teams',
        first_name: 'first_name',
        gender: 'gender',
        hometown: 'hometown',
        id: 'id',
        inspirational_people: 'inspirational_people',
        install_type: 'install_type',
        installed: 'installed',
        interested_in: 'interested_in',
        is_shared_login: 'is_shared_login',
        is_verified: 'is_verified',
        labels: 'labels',
        languages: 'languages',
        last_name: 'last_name',
        link: 'link',
        locale: 'locale',
        location: 'location',
        meeting_for: 'meeting_for',
        middle_name: 'middle_name',
        name: 'name',
        name_format: 'name_format',
        payment_pricepoints: 'payment_pricepoints',
        political: 'political',
        public_key: 'public_key',
        quotes: 'quotes',
        relationship_status: 'relationship_status',
        religion: 'religion',
        security_settings: 'security_settings',
        shared_login_upgrade_required_by: 'shared_login_upgrade_required_by',
        short_name: 'short_name',
        significant_other: 'significant_other',
        sports: 'sports',
        test_group: 'test_group',
        third_party_id: 'third_party_id',
        timezone: 'timezone',
        token_for_business: 'token_for_business',
        updated_time: 'updated_time',
        verified: 'verified',
        video_upload_limits: 'video_upload_limits',
        viewer_can_send_gift: 'viewer_can_send_gift',
        website: 'website',
        work: 'work'
      });
    }
  }]);
  return User;
}(AbstractCrudObject);

exports.FacebookAdsApi = FacebookAdsApi;
exports.Ad = Ad;
exports.AdAccount = AdAccount;
exports.AdAccountRoas = AdAccountRoas;
exports.AdAccountTargetingUnified = AdAccountTargetingUnified;
exports.AdAccountUser = AdAccountUser;
exports.AdActivity = AdActivity;
exports.AdAsyncRequest = AdAsyncRequest;
exports.AdAsyncRequestSet = AdAsyncRequestSet;
exports.AdCreative = AdCreative;
exports.AdImage = AdImage;
exports.AdKeywordStats = AdKeywordStats;
exports.AdLabel = AdLabel;
exports.AdPlacePageSet = AdPlacePageSet;
exports.AdPreview = AdPreview;
exports.AdReportRun = AdReportRun;
exports.AdsDataPartner = AdsDataPartner;
exports.AdSet = AdSet;
exports.AdsInsights = AdsInsights;
exports.AdsPixel = AdsPixel;
exports.AdsPixelStatsResult = AdsPixelStatsResult;
exports.BroadTargetingCategories = BroadTargetingCategories;
exports.Business = Business;
exports.BusinessAdAccountRequest = BusinessAdAccountRequest;
exports.BusinessPageRequest = BusinessPageRequest;
exports.Campaign = Campaign;
exports.CustomAudience = CustomAudience;
exports.CustomAudiencePrefillState = CustomAudiencePrefillState;
exports.CustomAudienceSession = CustomAudienceSession;
exports.CustomAudiencesTOS = CustomAudiencesTOS;
exports.Domain = Domain;
exports.Event = Event;
exports.EventSourceGroup = EventSourceGroup;
exports.ExternalEventSource = ExternalEventSource;
exports.Hotel = Hotel;
exports.Lead = Lead;
exports.LeadgenForm = LeadgenForm;
exports.LegacyBusinessAdAccountRequest = LegacyBusinessAdAccountRequest;
exports.MinimumBudget = MinimumBudget;
exports.OffsitePixel = OffsitePixel;
exports.PartnerCategory = PartnerCategory;
exports.ProductCatalog = ProductCatalog;
exports.ProductCatalogHotelRoomsBatch = ProductCatalogHotelRoomsBatch;
exports.ProductCatalogPricingVariablesBatch = ProductCatalogPricingVariablesBatch;
exports.ProductFeed = ProductFeed;
exports.ProductFeedUpload = ProductFeedUpload;
exports.ProductFeedUploadError = ProductFeedUploadError;
exports.ProductFeedUploadErrorSample = ProductFeedUploadErrorSample;
exports.ProductGroup = ProductGroup;
exports.ProductItem = ProductItem;
exports.ProductSet = ProductSet;
exports.ProfilePictureSource = ProfilePictureSource;
exports.RateCard = RateCard;
exports.ReachEstimate = ReachEstimate;
exports.ReachFrequencyPrediction = ReachFrequencyPrediction;
exports.TargetingSentenceLine = TargetingSentenceLine;
exports.Transaction = Transaction;
exports.User = User;

//# sourceMappingURL=cjs.js.map
