var previewFile;
var previewImage; 
var socket;
var isProcessing = false;

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
        fill(250, 250, 50);
        rect(0, 0, displayWidth, displayHeight);
    } else {
        previewFile = "/preview.jpg?"+Date.now();
        updatePreview();
        image(previewImage, 0, 0);
    }
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
