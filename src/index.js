/// configuration
const defaultConfig = {
  date: false,
  name: 'dirty'
}

let config = Object.assign({}, defaultConfig);

export const configure = (options = defaultConfig) => {
  config = Object.assign({}, config, options);
}

/// library
const __generate__ = (clz, key, val) => {
  let _f = val;
  return {
    __proto__: null,
    enumerable: true,
    get: function() { return _f; },
    set: function(v) {
      clz[config.name] = true;

      if( config && config.hasOwnProperty('showDate') && config.showDate ) {
        clz.last_modified = Date.now();
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

    // copy current value -- delete from object for reassignment
    let seed = obj[key];

    // ignore functions
    if( typeof(seed) === 'function' ) {
      observe_child(seed, root);
      continue;
    }

    delete obj[key];
    Object.defineProperty(obj, key, __generate__(root, key, seed))
    if( typeof(seed) === 'object' ) {
      observe_child(seed, root);
    }
  }
}

export const observe = (root) => {
  root[config.name] = false;
  observe_child(root);
}
