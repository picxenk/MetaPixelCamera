// var Canvas = require('canvas')
// , Image = Canvas.Image
// , canvas = new Canvas(200, 200)
// , ctx = canvas.getContext('2d');
//
// ctx.font = '30px Impact';
// ctx.rotate(.1);
// ctx.fillText("Awesome!", 50, 100);
//
// var te = ctx.measureText('Awesome!');
// ctx.strokeStyle = 'rgba(0,0,0,0.5)';
// ctx.beginPath();
// ctx.lineTo(50, 102);
// ctx.lineTo(50 + te.width, 102);
// ctx.stroke();
//
// console.log('<img src="' + canvas.toDataURL() + '" />');

var Canvas = require('canvas');
var canvas = new Canvas(960, 540);
var canvasWidth  = canvas.width;
var canvasHeight = canvas.height;
var ctx = canvas.getContext('2d');
var imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

var buf = new ArrayBuffer(imageData.data.length);
var buf8 = new Uint8ClampedArray(buf);
var data = new Uint32Array(buf);

for (var y = 0; y < canvasHeight; ++y) {
    for (var x = 0; x < canvasWidth; ++x) {
        var value = x * y & 0x55;

        data[y * canvasWidth + x] =
            (255   << 24) |    // alpha
            (value << 16) |    // blue
            (value <<  8) |    // green
             value;            // red
    }
}

imageData.data.set(buf8);
ctx.putImageData(imageData, 0, 0);
// console.log('<img src="' + canvas.toDataURL() + '" />');

var fs = require('fs')
    , out = fs.createWriteStream(__dirname + '/text.png')
    , stream = canvas.pngStream();

stream.on('data', function(chunk){
      out.write(chunk);
});

stream.on('end', function(){
      console.log('saved png');
});

