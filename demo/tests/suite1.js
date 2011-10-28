provide(function (exports) {
  module('suite1', {
    setup: function () {
    },
    teardown: function () {
      removeModule(['demo/modules/foo', 'demo/modules/usefoo']);
    }
  });
  // test('should be a regular test', function () {
  //   expect(1);
  //   ok(true);
  // });
  // 
  // asyncTest('should be an asyncTest', function () {
  //   expect(1);
  //   ok(true);
  //   start();
  // });
  // 
  // asyncTest('should use the foo module', function () {
  //   expect(1);
  //   using('demo/modules/foo', function (foo) {
  //     strictEqual(foo(), 'bar', 'should use the foo module');
  //     start();
  //   });
  // });
  // 
  // asyncTest('should use a basic stub', function () {
  //   expect(1);
  //   var fooStub = function () { return 'bazz!'; };
  //   stubWith('demo/modules/foo', fooStub, 
  //     // everything within this context uses the foo stub when reloaded
  //     function () {
  //       using('demo/modules/foo', function (foo) {
  //         strictEqual(foo(), 'bazz!', 'should use the foo stub module');
  //         start();
  //       });
  //     });
  // });
  // 
  // asyncTest('should use a basic stub, while still holding the original module reference', function () {
  //   expect(3);
  //   var fooStub = function () { return 'bazz!'; };
  //   using('demo/modules/foo', function (foo) {
  //     strictEqual(foo(), 'bar', 'the real foo module');
  // 
  //     stubWith('demo/modules/foo', fooStub, 
  //       function () {
  //         using('demo/modules/foo', function (foo2) {
  //           strictEqual(foo2(), 'bazz!', 'should use the foo stub module');
  //           strictEqual(foo(), 'bar', 'should still reference the original module');
  //           start();
  //         });
  //       });
  //   });
  // });
  // 
  // asyncTest('should use the foo stub (even within another module)', function () {
  //   expect(2);
  //   var fooStub = function () { return 'bazz!'; };
  //   stubWith('demo/modules/foo', fooStub,
  //     function () {
  //       using('demo/modules/foo', 'demo/modules/usefoo', function (foo, usefoo) {
  //         strictEqual(foo(), 'bazz!', 'we still use the foo stub');
  //         strictEqual(usefoo(), 'foo() = bazz!', 'and usefoo loads the stub too');
  //         start();
  //       });
  //   });
  // });
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