var config = require('./config');
var system = require('system');
var args = system.args;

var urlArgs = '';
var renderedImageFile = '0_test_phantom.png';

if (args.length === 2) {
    console.log(args[1]);
    urlArgs = '?img='+args[1];
    renderedImageFile = args[1].split('.').join('_mp.');
}
if (args.length === 3) {
    urlArgs = '?img='+args[1];
    renderedImageFile = args[2];
}


var page = require('webpage').create();
//viewportSize being the actual size of the headless browser
page.viewportSize = { width: config.camWidth, height: config.camHeight };
//the clipRect is the portion of the page you are taking a screenshot of
page.clipRect = { top: 0, left: 0, width: config.camWidth, height: config.camHeight };
//the rest of the code is the same as the previous example
page.open('http://localhost/renderMP.html'+urlArgs, function() {
    page.render('public_html/img/'+renderedImageFile);
    phantom.exit();
});
