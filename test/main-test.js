(function (window, require) {
    "use strict";
    var file, requireModules;
    requireModules = [];
 
   for (file in window.__testacular__.files) {
        if (window.__testacular__.files.hasOwnProperty(file)) {
            if (file.substring(file.length - 7, file.length) === 'Spec.js') {
                console.log('Added file to testing..');
                requireModules.push(file);
            }
        }
    }
    requireModules.push("app");
    requireModules.push("mocks");
 
    require({
        baseUrl:'/base/app/js',
        paths:{
            'angular':'../libs/angular/angular',
            'mocks':'../../test/libs/angular/angular-mocks'
        },
        shim:{
            'angular' : {'exports' : 'angular'},
            'mocks':{ deps:['angular'], exports:'mocks' }
        }
    }, requireModules, function () {
        console.log("Trying to start Testacular");  
        window.__testacular__.start();
    }, function (err) {
        console.log(err);
    });
}(window, require));