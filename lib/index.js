'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/// configuration
var defaultConfig = {
  date: false,
  name: 'dirty',
  setLogging: false,
  getLogging: false
};

var config = Object.assign({}, defaultConfig);

var configure = exports.configure = function configure() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultConfig;

  config = Object.assign({}, config, options);
};

var getLogging = function getLogging(key) {
  if (config.getLogging) {
    console.log('getting prop ' + key);
  }
};

var setLogging = function setLogging(key, v) {
  if (config.setLogging) {
    console.log('setting prop ' + key + ' with ' + (v.constructor.name === 'Object' ? JSON.stringify(v) : v));
  }
};

/// library
var __generate__ = function __generate__(clz, key, val) {
  var _f = val;
  return {
    __proto__: null,
    enumerable: true,
    get: function get() {
      getLogging(key);
      return _f;
    },
    set: function set(v) {
      clz[config.name] = true;

      if (config && config.hasOwnProperty('date') && config.date) {
        clz.last_modified = Date.now();
      }

      setLogging(key, v);
      _f = v;
    }
  };
};

var observe_child = function observe_child() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var root = arguments[1];

  if (!root) root = obj;
  var keys = Object.keys(obj);
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var key = _step.value;

      if (key === config.name) continue;

      // copy current value -- delete from object for reassignment
      var seed = obj[key];

      // ignore functions
      if (typeof seed === 'function') {
        continue;
      }

      delete obj[key];
      Object.defineProperty(obj, key, __generate__(root, key, seed));
      if (seed !== null && seed !== undefined && (typeof seed === 'undefined' ? 'undefined' : _typeof(seed)) === 'object') {
        observe_child(seed, root);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
};

var observe = exports.observe = function observe(root) {
  root[config.name] = false;
  observe_child(root);
};