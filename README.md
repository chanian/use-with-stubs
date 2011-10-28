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
    provide('foo', function (exports) {
      exports({
        value: 'bar'
      });
    });

    asyncTest('should test out something cool', function () {
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

```
  