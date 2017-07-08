#!/usr/bin/node --harmony

// Yes, no "var"
// We need to keep it ugly if we want everybody to be able to access these

fs = require('fs');
project = null;
modules = {};
vm = require('vm');


// A hackety "include" that just appends js files in context
include = function (moduleName) { return require(moduleName); };

var includeInThisContext = function (path, needsRequire) {
    // we can't "require" modules from within "appended" js files
    var code = fs.readFileSync(__dirname + '/' + path, {encoding: 'utf-8'});

    if (needsRequire) {
        code = code.replace(/require/g, 'include');
    }

    vm.runInThisContext(code, path);

}.bind(this);


// Let's load it all

if (!Object.assign) {
    require('es6-shim');
}


// includeInThisContext('snap/morphic.js');
includeInThisContext('canvas.js', true);
// includeInThisContext('temp.js');
// console.log(canvas);
includeInThisContext('p5/p5.js', true);
// includeInThisContext('sketch.js');
// function setup() {
//     console.log('good');
// }
var s = function( p ) {

    var x = 100; 
    var y = 100;

    p.setup = function() {
        p.createCanvas(700, 410);
    };

    p.draw = function() {
        p.background(0);
        p.fill(255);
        p.rect(x,y,50,50);
    };
};

var myp5 = new p5(s);

