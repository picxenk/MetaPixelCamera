var config = require('./config');

var fs = require('fs');
var vm = require('vm');
var Canvas = require('canvas');
var Image = Canvas.Image;

var MetaPixel = require('./metapixel');
var MPImage = require('./mpimage');

// setup Canvas
var canvas = new Canvas(config.camWidth, config.camHeight);
var canvas2 = new Canvas(config.camWidth, config.camHeight);
var canvasWidth  = canvas.width;
var canvasHeight = canvas.height;
var ctx = canvas.getContext('2d');
var ctx2 = canvas2.getContext('2d');

var timeStamp = function(m) {
    var n = time.time() - t;
    console.log(m + " : " + n);
}


var includeInThisContext = function (path) {
    var code = fs.readFileSync(__dirname + '/' + path, {encoding: 'utf-8'});
    vm.runInThisContext(code, path);
}.bind(this);

var evalCode = function(path) {
    var code = fs.readFileSync(__dirname + '/' + path, {encoding: 'utf-8'});
    eval(code);
}


var imageFile;
var renderedImageFile;

console.log(process.argv);
if (process.argv.length === 3) {
    fileName = process.argv[2];
    renderedImageFile = fileName.split('.').join('_mp.');
}

// read original image
var image;
var imgFile = fs.readFileSync(__dirname + '/public_html/img/' + fileName);

image = new Image;
image.src = imgFile;
ctx.drawImage(image, 0, 0, image.width, image.height);
var imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
var img = imageData.data;
var w = canvasWidth;
var h = canvasHeight;


for (var i=0; i<w; i++) {
    for (var j=0; j<h; j++) {
        var off = (j*w+i)*4;
        var r = img[off];
        var g = img[off+1];
        var b = img[off+2];
        var a = img[off+3];
        var mp = new MetaPixel(i, j, r, g, b, a);

        // evalCode('public_html/code.js');
        if (r > g) {
            mp.beStrong(15);
            mp.moveDown(r*0.3);
        } else {
            mp.moveRandom(r*0.5);
        }

        mp.displayOn(ctx2);
    }
}


var out = fs.createWriteStream(__dirname + '/public_html/img/' + renderedImageFile);
var stream = canvas2.pngStream();

stream.on('data', function(chunk){
      out.write(chunk);
});

stream.on('end', function(){
      console.log('saved');
});

