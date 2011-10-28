provide(function (exports) {
  module('suite1', {
    setup: function () {
    },
    teardown: function () {
    }
  });

  asyncTest('should use the foo module', function () {
    expect(1);
    using('demo/modules/foo', function (foo) {
      strictEqual(foo(), 'bar', 'should use the foo module');
      start();
    });
  });

  asyncTest('should use a basic stub', function () {
    expect(1);
    var stubs = {
      'demo/modules/foo': function () { return 'bazz!'; }
    };
    useWithStubs('demo/modules/foo', stubs, 
      // everything within this context uses the foo stub when reloaded
      function (foo) {
        strictEqual(foo(), 'bazz!', 'should use the foo stub module');
        start();
      });
  });

  asyncTest('should use a basic stub, while still holding the original module reference', function () {
    expect(2);
    var stubs = {
      'demo/modules/foo': function () { return 'bazz!'; }
    };
    using('demo/modules/foo', function(foo) {
      useWithStubs('demo/modules/foo', stubs, function (foo2) {
          strictEqual(foo(), 'bar', 'should retain reference to original foo');
          strictEqual(foo2(), 'bazz!', 'should use the foo stub');
          start();
        });
    });
  });

  asyncTest('should use the foo stub (even within another module)', function () {
    expect(2);
    var stubs = {
      'demo/modules/foo': function () { return 'bazz!'; }
    };
    useWithStubs(['demo/modules/foo', 'demo/modules/usefoo'], stubs, function (foo, usefoo) {
      strictEqual(foo(), 'bazz!', 'should still use the foo stub');
      strictEqual(usefoo(), 'foo() = bazz!', 'usefoo should use the foo stub too!');
      start();
    });
  });

  asyncTest('should use restore existing modules after a stub block', function () {
    expect(5);

    var stubs = {
      "demo/modules/foo": function () { return 'stubs foo'; },
      "demo/modules/usefoo": function () { return 'stubs usefoo'; }
    };

    // run this block after the main useWithStubs
    var doLater = function () {
      window.setTimeout(function () {
        using('demo/modules/foo', 'demo/modules/usefoo', function (realFoo, realUseFoo) {
          strictEqual(realFoo(), 'bar', 'should replace the old foo');
          strictEqual(realUseFoo(), 'foo() = bar', 'should replace the old usefoo');
          start();
        });
      }, 1);
    }

    useWithStubs(['demo/modules/foo', 'demo/modules/usefoo'], stubs, function(foo, usefoo) {
      ok(true, 'the test block is run');
      strictEqual(foo(), 'stubs foo', 'should use the foo stub');
      strictEqual(usefoo(), 'stubs usefoo', 'should use the usefoo stub');

      doLater();
    });
  });

  asyncTest('should remove a stubbed module, if it wasnt previously loaded before the stub block', function () {
    expect(3);

    // the world is as we expect it
    removeModule('demo/modules/foo');
    ok(!loadrunner.Module.exports.hasOwnProperty('demo/modules/foo'), 'should not have foo module loaded');

    var stubs = {
      'demo/modules/foo': function () { return 'bazz!'; }
    };
    var doLater = function () {
      window.setTimeout(function () {
        ok(!loadrunner.Module.exports.hasOwnProperty('demo/modules/foo'), 'should still not have foo module loaded');
        start();
      }, 1);
    }
    useWithStubs(['demo/modules/foo'], stubs, function(foo) {
      strictEqual(foo(), 'bazz!', 'should use the foo stub');
      doLater();
    });
  });

  exports();
});