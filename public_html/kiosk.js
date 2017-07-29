var previewFile;
var previewImage; 
var socket;
var isProcessing = false;
var isWaiting = false;
var isInitImage = false;
var splashColor = [
    [0, 169, 255],
    [50, 210, 50],
    [255, 50, 50]
    // [255, 50, 50],
    // [50, 255, 50],
    // [50, 50, 255],
    // [255, 255, 50],
    // [255, 50, 255],
    // [50, 255, 255]
];
var splashTextColor = [
    [255, 255, 23],
    [255, 242, 255],
    [0, 255, 255]
    // [50, 255, 255],
    // [255, 50, 255],
    // [255, 255, 50],
    // [50, 50, 255],
    // [50, 255, 50],
    // [255, 50, 50]
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
                code = codeStrings.join('\n');
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
    socket.on('wait', (data) => {
        isWaiting = true;
    });
    socket.on('newinit', (data) => {
        isInitImage = true;
    });
    socket.on('ready', (data) => {
        isWaiting = false;
        isInitImage = false;
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
        if (isProcessing && !isWaiting && !isInitImage) {
            // if (frameCount % 2 == 0) {
                var strings = code.slice(0, txtIndex).split('\n');
                showCodeSplash2(strings);
                txtIndex = txtIndex + 4;
                if (txtIndex > code.length+50) {
                    // txtIndex = code.length;
                    txtIndex = 0;
                    n++;
                    if (n >= splashColor.length) n = 0;
                }
            // }
        } else {
            if (frameCount % 40 == 0) {
                txtIndex = 0;
                previewFile = "/preview.jpg?"+Date.now();
                updatePreview();
                image(previewImage, 0, 0);
            }

            if (isWaiting) {
                fill(0);
                noStroke();
                rect(0, displayHeight/5*2, displayWidth, displayHeight/5+30);
                fill(240);
                textAlign(CENTER, BOTTOM);
                textFont(font);
                textSize(20);
                text("PLEASE, WAIT", displayWidth/2, displayHeight/2);
                text("Other Camera is sending", displayWidth/2, displayHeight/2+30);
                text("messages to 518,400 pixels", displayWidth/2, displayHeight/2+60);
            }

            if (isInitImage) {
                fill(30);
                noStroke();
                rect(0, 0, displayWidth, displayHeight);
                fill(240, 240, 0);
                textAlign(CENTER, BOTTOM);
                textFont(font);
                textSize(20);
                text("Please, Wait", displayWidth/2, displayHeight/2);
                text("For Next New Image", displayWidth/2, displayHeight/2+30);
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

var showCodeSplash2 = function(strings) {
    fill(splashColor[n][0], splashColor[n][1], splashColor[n][2]);
    rect(0, 0, displayWidth, displayHeight);

    fill(splashTextColor[n][0], splashTextColor[n][1], splashTextColor[n][2]);
    textAlign(LEFT, TOP);
    textFont(font);
    textSize(30);
    strokeWeight(0);
    var sx = 10;
    var sy = 10;
    for (var i=0; i<strings.length; i++) {
        text(strings[i], sx, sy+40*i);
    }

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
            if (e) {
                console.log('error?');
            }
        });
}
