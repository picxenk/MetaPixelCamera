var page = require('webpage').create();
//viewportSize being the actual size of the headless browser
page.viewportSize = { width: 1920, height: 1080 };
//the clipRect is the portion of the page you are taking a screenshot of
page.clipRect = { top: 0, left: 0, width: 1920, height: 1080 };
//the rest of the code is the same as the previous example
page.open('http://localhost/renderMP.html', function() {
  page.render('img/0_test_phantom.png');
  phantom.exit();
});
