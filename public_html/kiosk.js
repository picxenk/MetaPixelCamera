var previewFile;
var previewImage; 
var socket;
var isProcessing = false;
var splashColor = [
    [255, 50, 50],
    [50, 255, 50],
    [50, 50, 255],
    [255, 255, 50],
    [255, 50, 255],
    [50, 255, 255]
];
var splashTextColor = [
    [50, 255, 255],
    [255, 50, 255],
    [255, 255, 50],
    [50, 50, 255],
    [50, 255, 50],
    [255, 50, 50]
];
var n=0;

var code;
var preload() {
    code = loadStrings('code.js');
}

var setup = function() {
    createCanvas(displayWidth, displayHeight);
    previewImage = createImage(320, 480);
    // noLoop();
    frameRate(1);
    noCursor();


    socket = io.connect('http://localhost:8080', {
            'reconnection': true,
            'reconnectionDelay': 3000,
            'reconnectionAttemps': 100
    });
    socket.on('shot', (data) => {
        isProcessing = true;
    });
    socket.on('scp_done', (data) => {
        isProcessing = false;
    });

    background(0, 0, 200);
    stroke(200, 0, 0);
    line(0, 0, displayWidth, displayHeight);
    line(displayWidth, 0, 0, displayHeight);
}


var draw = function() {
    if (isProcessing) {
        showCodeSplash(n);
        n++;
        if (n >= splashColor.length) n = 0;
    } else {
        previewFile = "/preview.jpg?"+Date.now();
        updatePreview();
        image(previewImage, 0, 0);
    }
}


var showCodeSplash = function(n) {
    fill(splashColor[n][0], splashColor[n][1], splashColor[n][2]);
    rect(0, 0, displayWidth, displayHeight);
    fill(splashTextColor[n][0], splashTextColor[n][1], splashTextColor[n][2]);
    text(code, 10, 10, width-10, height-10);
}

var updatePreview = function() {
    loadImage(previewFile, 
        function(img) {
            previewImage = img;
            // redraw();
            // console.log('tick');
        },
        function(e) {
            console.log('error?');
        });
}
