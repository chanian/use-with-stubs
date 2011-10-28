QUnit + Loadrunner + Stubs
====================
A set of basic helper functions which provide clean/pollution free stubing for your loadrunner based applications.

Methods
-------------------   

 - **useWithStubs**([Array] moduleList, [object] stubs, [function] testBlock)
 - **removeModule**([string|array] moduleName)

Usage
-------------------
Modules provided in the moduleList will be reloaded, with any provided stubs, and returned to their regular form after the test block has run.
New modules that are used/introduced for the first time in the moduleList (were not previously in the registry) will be removed after the test block has run.
The code inside the testBlock must be synchronous, the test environment is reverted immediately after execution of the testBlock.

Sample Usage
-------------------
```javascript

    // assume we've loaded qunit + loadrunner
    
    // define some simple loadrunner modules
    provide('foo', function (exports) {
      exports(function () {
        return 'bar';
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
        'foo': function () { return 'a stub!'; }
      };
      // create a test block using and stub out foo
      useWithStubs('foo', stubs, function (foo) {
        strictEqual(foo(), 'a stub!', 'we use the foo stub!');
        start();
      });
    });

    // a nested module stub
    asyncTest('should run a test using a module which uses a foo stub', function () {
      expect(1);
      var stubs = {
        'foo': function () { return 'a stub!'; }
      };
      useWithStubs(['foo', 'usefoo'], stubs, function (foo, usefoo) {
        strictEqual(usefoo(), 'foo() = a stub!', 'we use the foo stub with the real usefoo!');
        start();
      });
    });


```
  