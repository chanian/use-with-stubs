QUnit + Loadrunner + Stubs
====================
A set of basic helper functions which provide clean/pollution free stubing for your loadrunner based applications.

Methods
-------------------   

 - **useWithStubs**(moduleList, stubs, testBlock)
 - **removeModule**(moduleName)

Sample Usage
-------------------
```javascript

    // assume we've loaded qunit
    
    // define some simple loadrunner modules
    provide('foo', function (exports) {
      exports({
        value: 'bar'
      });
    });

    provide('usefoo', function (exports) {
      using('foo', function (foo) {
        exports(function () {
          return 'foo() = ' + foo();
        });
      });
    });


    // a very simple example of using a stub
    asyncTest('should run a test with a foo stub', function () {
      expect(1);
      var stubs = {
        'foo': { value: 'a stub!' }
      };
      // create a test block using and stub out foo
      useWithStubs('foo', stubs, function (foo) {
        strictEqual(foo.value, 'a stub!', 'we use the foo stub!');
        start();
      });
    });

    // a nested module stub
    asyncTest('should run a test using a module which uses a foo stub', function () {
      expect(1);
      var stubs = {
        'foo': { value: 'a stub!' }
      };
      useWithStubs(['foo', 'usefoo'], stubs, function (foo, usefoo) {
        strictEqual(usefoo(), 'foo() = a stub!', 'we use the foo stub with the real usefoo!');
        start();
      });
    });


```
  