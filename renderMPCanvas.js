var config = require('./config');

var fs = require('fs');
var Canvas = require('canvas');
var Image = Canvas.Image;

var MetaPixel = require('./metapixel');
var MPImage = require('./mpimage');

// setup Canvas
var canvas = new Canvas(config.camWidth, config.camHeight);
var canvasWidth  = canvas.width;
var canvasHeight = canvas.height;
var ctx = canvas.getContext('2d');

var timeStamp = function(m) {
    var n = time.time() - t;
    console.log(m + " : " + n);
}

var imageFile;
var renderedImageFile;

console.log(process.argv);
if (process.argv.length === 3) {
    fileName = process.argv[2];
    renderedImageFile = fileName.split('.').join('_mp.');
}

// read original image
var img;
// var fileName = 'andy_360.jpg';
var imgFile = fs.readFileSync(__dirname + '/public_html/img/' + fileName);

img = new Image;
img.src = imgFile;
ctx.drawImage(img, 0, 0, img.width, img.height);
var imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

var mpi = new MPImage(imageData.data, img.width, img.height);
mpi.updateMetaPixels();
// MetaPixel Language Process
mpi.do02();
mpi.processMPImage();

var out = fs.createWriteStream(__dirname + '/public_html/img/' + renderedImageFile);
var stream = mpi.canvas.pngStream();

stream.on('data', function(chunk){
      out.write(chunk);
});

stream.on('end', function(){
      console.log('saved');
});

