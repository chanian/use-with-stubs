// a simple module which uses foo
provide(function (exports) {
  using('demo/modules/foo', function (foo) {
    var useFoo = function () {
      return 'foo() = ' + foo();
    };
    exports(useFoo);
  });
});