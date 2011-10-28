(function () {
  // thanks angus
  var isType = function(type, obj) {
    return (type == ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase());
  }

  // Rip a loadrunner module directly out of the exports object
  window.removeModule = function(moduleName) {
    var moduleList = loadrunner.Module.exports;
    if(isType('array', moduleName)) {
      for(var i = 0; i < moduleName.length; i++) {
        var m = moduleName[i];
        if(moduleList.hasOwnProperty(m)) {
          delete moduleList[m];
        }
      }
    } else {
      if(moduleList.hasOwnProperty(moduleName)) {
        delete moduleList[moduleName];
      }
    }
  }

  // Run a test block with a module stub, then replace it after
  window.stubWith = function (modules, stubs, testBlock) {
    var cache = {};

    // freeze/cache any using modules
    for(var i = 0; i < modules.length; i++) {
      // store the old module
      var m = modules[i];
      if(loadrunner.Module.exports.hasOwnProperty(m)) {
        cache[m] = loadrunner.Module.exports[m];
      }
    }
    // stub out the appropriate modules
    for(var i in stubs) {
      if(stubs.hasOwnProperty(i)) {
        // we didn't already cache it
        if(cache[i] && loadrunner.Module.exports.hasOwnProperty(m)) {
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
          loadrunner.Module.exports[m] = cache[m];
        } else {
        // remove the possibly polluted module from our test block
          delete loadrunner.Module.exports[m];
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