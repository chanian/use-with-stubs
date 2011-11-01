// a simple module which uses foo
provide(function (exports) {
  using('modules/foo', function (foo) {
    var useFoo = function () {
      return 'foo() = ' + foo();
    };
    exports(useFoo);
  });
});