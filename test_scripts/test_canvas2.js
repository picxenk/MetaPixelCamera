var time = require('time');
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

var t=time.time();
var timeStamp = function(m) {
    var n = time.time() - t;
    console.log(m + " : " + n);
}


timeStamp('start');
// read original image
var img;
// var fileName = 'frogcam_270.jpg';
var fileName = 'andy_540.jpg';
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

timeStamp('make mpi & update');
var mpi = new MPImage(imageData.data, img.width, img.height);
mpi.updateMetaPixels();
console.log(mpi.mps[5000].x);
console.log(mpi.mps[5000].y);
console.log(mpi.mps[5000].maxW);
console.log(mpi.mps[5000].maxH);

timeStamp('do mpi');
mpi.do02();
console.log(mpi.mps[5000].x);
console.log(mpi.mps[5000].y);
console.log(mpi.mps[5000].maxW);
console.log(mpi.mps[5000].maxH);
// console.log(mpi.mps[5000].x);
timeStamp('do process');
mpi.processMPImage();
console.log(mpi.mps.length);


// var buf = new ArrayBuffer(imageData.data.length);
// var buf8 = new Uint8ClampedArray(buf);
// var data = new Uint32Array(buf);
//
// for (var y = 0; y < canvasHeight; ++y) {
//     for (var x = 0; x < canvasWidth; ++x) {
//         var value = x * y & 0x55;
//
//         data[y * canvasWidth + x] =
//             (255   << 24) |    // alpha
//             (value << 16) |    // blue
//             (value <<  8) |    // green
//              value;            // red
//     }
// }
//
// imageData.data.set(buf8);
// ctx.putImageData(imageData, 0, 0);
//
var out = fs.createWriteStream(__dirname + '/mp_old_' + fileName);
var stream = mpi.canvas.pngStream();
// var stream = canvasOut.pngStream();

stream.on('data', function(chunk){
      out.write(chunk);
});

stream.on('end', function(){
      console.log('saved png');
});

