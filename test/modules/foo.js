// a simple module which does foo
provide(function (exports) {
  var foo = function () {
    return 'bar';
  }
  exports(foo);
});