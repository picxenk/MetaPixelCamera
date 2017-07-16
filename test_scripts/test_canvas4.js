var time = require('time');
var MetaPixel = require('./metapixel');
var MPImage = require('./mpimage');
var fs = require('fs');
var Canvas = require('canvas');
var Image = Canvas.Image;

// setup Canvas
var fileName = 'andy_540.jpg';
var canvas = new Canvas(960, 540);
var canvas2 = new Canvas(960, 540);
// var canvas = new Canvas(1920, 1080);
// var canvas2 = new Canvas(1920, 1080);
var canvasWidth  = canvas.width;
var canvasHeight = canvas.height;
var ctx = canvas.getContext('2d');
var ctx2 = canvas2.getContext('2d');

var t=time.time();
var timeStamp = function(m) {
    var n = time.time() - t;
    console.log(m + " : " + n);
}


// read original image
// timeStamp('read original image');
var img;
var imgFile = fs.readFileSync(__dirname + '/' + fileName);

img = new Image;
img.src = imgFile;
ctx.drawImage(img, 0, 0, img.width, img.height);
var w = img.width;
var h = img.height;
var imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
var img = imageData.data;


for (var i=0; i<w; i++) {
    for (var j=0; j<h; j++) {
        var off = (j*w+i)*4;
        var r = img[off];
        var g = img[off+1];
        var b = img[off+2];
        var a = img[off+3];
        var mp = new MetaPixel(i, j, r, g, b, a);

        if (r > g) {
            mp.beStrong(15);
            mp.moveDown(r*0.3);
        } else {
            mp.moveRandom(r*0.5);
        }

        mp.displayOn(ctx2);
    }
}


var out = fs.createWriteStream(__dirname + '/mp_new_' + fileName);
var stream = canvas2.pngStream();

stream.on('data', function(chunk){
      out.write(chunk);
});

stream.on('end', function(){
      console.log('saved png');
});

