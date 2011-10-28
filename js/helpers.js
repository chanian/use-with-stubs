// Some helper functions for mocking/stubbing with loadrunner
(function () {
  // thanks angus
  var isType = function(type, obj) {
    return (type == ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase());
  }

  // a proxy for verifying the existence of a module in the registry
  var hasModule = function(name) {
    var moduleList = loadrunner.Module.exports;
    return moduleList.hasOwnProperty(name) && !!moduleList[name];
  }
  // a proxy for directly sending a module in the module cache/registry
  var setModule = function(name, module) {
    loadrunner.Module.exports[name] = module;
  }
  // a proxy for getting a module directly from the module cache/registry
  var getModule = function(name) {
    if(hasModule(name)) {
      return loadrunner.Module.exports[name];
    } else {
      return false;
    }
  }

  // Rip a loadrunner module directly out of registry. Note, this won't remove existing
  // references to an already loaded module possibly bound in a closure elsewhere
  window.removeModule = function(moduleName) {
    var moduleList = loadrunner.Module.exports;
    if(isType('string', moduleName)) {
      moduleName = [moduleName];
    }
    for(var i = 0; i < moduleName.length; i++) {
      var m = moduleName[i];
      if(hasModule(m)) {
        delete moduleList[m];
      }
    }
  }

  // Run a test block with a module stub, then replace it after
  window.useWithStubs = function (modules, stubs, testBlock) {
    var cache = {};

    if(isType('string', modules)) {
      modules = [modules];
    }

    // freeze/cache any using modules
    for(var i = 0; i < modules.length; i++) {
      var m = modules[i];
      if(hasModule(m)) {
        // cache it
        cache[m] = loadrunner.Module.exports[m];

        // and remove it for our upcoming sandboxed test block
        removeModule(m);
      }
    }

    // stub out the appropriate modules
    for(var i in stubs) {
      if(stubs.hasOwnProperty(i)) {
        // we didn't already cache it
        if(cache[i] && hasModule(m)) {
          cache[i] = loadrunner.Module.exports[i];
        }
        // and finally apply the stub
        loadrunner.Module.exports[i] = stubs[i];
      }
    }

    // Create a new "safe/sandboxed" using block
    using(modules, function () {
      // run the test block and just carry forward the module references
      testBlock.apply(null, [].slice.apply(arguments));

      // restore/unfreeze the modules
      for(var i = 0; i < modules.length; i++) {
        var m = modules[i];
        // unfreeze the existing module
        if(cache[m]) {
          setModule(m, cache[m]);
        } else {
        // remove the possibly polluted module from our test block
          removeModule(m)
        }
      }
    });
  };

  // A simple function that waits on a condition, then runs a callback
  // condition can be a function or an eval'd string
  window.waitFor = function (condition, cb, max) {
    var timeout = 250;
    var max = max || 6;
    function foo () {
      if(!--max) {
        cb();
        return;
      }
      if( (isType("string", condition) && eval(condition)) ||
          (isType("function", condition) && condition())) {
        cb();
        return;
      }
      window.setTimeout(foo, timeout);
    }
    foo();
  };
})();