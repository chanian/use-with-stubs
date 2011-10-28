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
    stubWith('demo/modules/foo', stubs, 
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
      stubWith('demo/modules/foo', stubs, function (foo2) {
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
    stubWith(['demo/modules/foo', 'demo/modules/usefoo'], stubs, function (foo, usefoo) {
      strictEqual(foo(), 'bazz!', 'should still use the foo stub');
      strictEqual(usefoo(), 'foo() = bazz!', 'usefoo should use the foo stub too!');
      start();
    });
  });

  asyncTest('should use restore existing modules after a stub block', function () {
    expect(3);

    var stubs = {
      "demo/modules/foo": function () { return 'stubs foo'; },
      "demo/modules/usefoo": function () { return 'stubs usefoo'; }
    };

    stubWith(['demo/modules/foo', 'demo/modules/usefoo'], stubs, function(foo, usefoo) {
      ok(true, 'the test block is run');
      strictEqual(foo(), 'stubs foo', 'should use the foo stub');
      strictEqual(usefoo(), 'stubs usefoo', 'should use the usefoo stub');
      start();
    });
  });
  exports();
});