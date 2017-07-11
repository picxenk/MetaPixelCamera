var MetaPixel = require('./metapixel');
var MPImage = require('./mpimage');
var fs = require('fs');
var Canvas = require('canvas');
var Image = Canvas.Image;

// setup Canvas
var canvas = new Canvas(960, 540);
// var canvasOut = new Canvas(960, 540);
// var canvas = new Canvas(1920, 1080);
var canvasWidth  = canvas.width;
var canvasHeight = canvas.height;
var ctx = canvas.getContext('2d');

var timeStamp = function(m) {
    var n = time.time() - t;
    console.log(m + " : " + n);
}


// read original image
var img;
// var fileName = 'frogcam_270.jpg';
var fileName = 'frogcam_540.jpg';
// var fileName = 'andy.jpg';
var imgFile = fs.readFileSync(__dirname + '/' + fileName);
// var imgFile = fs.readFileSync(__dirname + '/' + 'andy.jpg');
img = new Image;
img.src = imgFile;
ctx.drawImage(img, 0, 0, img.width, img.height);
var imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
// for (var i=0; i<imageData.data.length; i++) {
//     console.log(imageData.data[i]);
// }

var mpi = new MPImage(imageData.data, img.width, img.height);
mpi.updateMetaPixels();
mpi.do02();
mpi.processMPImage();

var out = fs.createWriteStream(__dirname + '/mp_' + fileName);
var stream = mpi.canvas.pngStream();

stream.on('data', function(chunk){
      out.write(chunk);
});

stream.on('end', function(){
      console.log('saved png');
});

