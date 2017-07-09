var previewFile;
var previewImage; 
var setup = function() {
    createCanvas(displayWidth, displayHeight);
    previewImage = createImage(320, 480);
    // noLoop();
    frameRate(1);
    noCursor();
    background(0, 0, 200);
    stroke(200, 0, 0);
    line(0, 0, displayWidth, displayHeight);
    line(displayWidth, 0, 0, displayHeight);
}

var draw = function() {
    // background(0);
    previewFile = "/preview.jpg?"+Date.now();
    updatePreview();
    image(previewImage, 0, 0);
    // loadImage(previewFile, 
    //     function(img) {
    //         img.set(0, 0, color(0));
    //         img.updatePixels();
    //         image(img, 0, 0);
    //         console.log('tick');
    //     },
    //     function(e) {
    //         console.log('error?');
    //     });
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


// setInterval(updatePreview, 1000);
