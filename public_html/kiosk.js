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

var message = "";
var isError = false;
var isDebugging = false;

var font;
var code, codeStrings;
var txtIndex = 0;
var preload = function() {
    font = loadFont('D2Coding.ttf');
    codeStrings = loadStrings('code.js',
            (string) => {
                // text("loading code", 10, 10);
                code = codeStrings.join(' ');
            },
            (err) => {
                isError = true;
                message = "check code file";
            });
}

var setup = function() {
    createCanvas(displayWidth, displayHeight);
    previewImage = createImage(320, 480);
    // noLoop();
    frameRate(20);
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
    if (isError) {
        fill(255, 0, 0);
        text(message, 10, 10);
    } else {
        if (isProcessing) {
            // if (frameCount % 2 == 0) {
                showCodeSplash();
            // }
        } else {
            if (frameCount % 40 == 0) {
                txtIndex = 0;
                previewFile = "/preview.jpg?"+Date.now();
                updatePreview();
                image(previewImage, 0, 0);
            }
        }
    }

}


var showCodeSplash = function() {
    fill(splashColor[n][0], splashColor[n][1], splashColor[n][2]);
    rect(0, 0, displayWidth, displayHeight);

    var codeToShow = code.slice(0, txtIndex);
    fill(splashTextColor[n][0], splashTextColor[n][1], splashTextColor[n][2]);
    textFont(font);
    textSize(30);
    text(codeToShow, 10, 10, width-10, height-10);
    txtIndex = txtIndex+4;

    if (txtIndex >= code.length+80) {
        txtIndex = 0;
        n++;
        if (n >= splashColor.length) n = 0;
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
