import { syncActions } from './index';

function addMethod(object, name, fn) {
  var old = object[name];
  object[name] = function() {
    if (fn.length === arguments.length) {
      return fn.apply(this, arguments);
    } else if (typeof old === 'function') {
      return old.apply(this, arguments);
    }
  };
}

const mod = {};

addMethod(mod, 'mapSyncActions', map => {
  let fn = {};
  let namespace = '';
  let action = '';
  for (let i = 0; i < map.length; i++) {
    [namespace, action] = map[i].split('/');
    if (syncActions[namespace]) {
      fn[action] = syncActions[namespace][action];
    }
  }
  return fn;
});

addMethod(mod, 'mapSyncActions', (namespace, map) => {
  let fn = {};
  for (let i = 0; i < map.length; i++) {
    if (syncActions[namespace]) {
      fn[map[i]] = syncActions[namespace][map[i]];
    }
  }
  return fn;
});

export default mod.mapSyncActions;
