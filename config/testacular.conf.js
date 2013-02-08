basePath = '../';

files = [
    JASMINE,
    JASMINE_ADAPTER,
    REQUIRE,
    REQUIRE_ADAPTER,
    {pattern:'app/libs/angular/angular.js', included:false},
    {pattern:'test/libs/angular/angular-mocks.js', included:false},
    {pattern:'app/js/**/*.js', included:false}, //Produktionscode
    {pattern:'test/unit/**/*.js', included:false}, //Testcode
    'test/main-test.js' //requireJS-Konfiguration
];

autoWatch = true;

browsers = ['Chrome'];

junitReporter = {
  outputFile: 'test_out/unit.xml',
  suite: 'unit'
};
