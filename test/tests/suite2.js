provide(function (exports) {
  asyncTest('should test usefoo', function () {
    var stub = {
      "demo/modules/foo": function () {
        return 'bazz!';
      }
    }
    useWithStubs(['demo/modules/foo', 'demo/modules/usefoo'], stub, function (foo, usefoo) {
      strictEqual(usefoo(), 'foo() = bazz!', 'use foo');
      window.setTimeout(function () {
        using('demo/modules/usefoo', function(f) {
          strictEqual(f(), 'foo() = bar', 'use foo');
          start();
        });
      }, 10);
    });
  });
  exports();
});