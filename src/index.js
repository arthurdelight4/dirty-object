const { isValid, isObject, isCallable, smartString } = require('./helpers');

/// configuration
let config = Object.assign({}, defaultConfig);

const defaultConfig = {
  date: false,
  name: 'dirty',
  setLogging: false,
  getLogging: false
}

export const configure = (options = defaultConfig) => {
  config = Object.assign({}, config, defaultConfig, options);
}

/// library
const __generate__ = (clz, key, val) => {
  let _f = val;
  return {
    __proto__: null,
    enumerable: true,
    get: function() {
      if( config.getLogging ) {
        console.log(`getting prop ${key}`)
      }
      return _f;
    },
    set: function(v) {
      clz[config.name] = true;

      if( config.date ) {
        clz.last_modified = Date.now();
      }

      if( config.setLogging ) {
        console.log(`setting prop ${key} with ${smartString(v)}`)
      }
      _f = v;
    }
  }
}

const observe_child = (obj = {}, root) => {
  if( !root ) root = obj;
  const keys = Object.keys(obj);
  for( let key of keys ) {
    if( key === config.name ) continue;

    // copy current value
    let seed = obj[key];

    // ignore functions
    if( isCallable(seed) ) {
      continue;
    }

    // delete existing value
    delete obj[key];

    Object.defineProperty(obj, key, __generate__(root, key, seed))
    if( isValid(seed) && isObject(seed) ) {
      observe_child(seed, root);
    }
  }
}

export const observe = (root) => {
  root[config.name] = false;
  observe_child(root);
}
