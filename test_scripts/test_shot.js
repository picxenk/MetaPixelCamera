var Gpio = require('onoff').Gpio;
var buttonOptions = { persistentWatch: true, debounceTimeout: 50};
// var buttonOptions = { debounceTimeout: 10};
var button = new Gpio(5, 'in', 'both', buttonOptions); // for shotting
var dateFormat = require('dateformat');

var state = 'READY';


var oButtonValue = -1;
var cButtonValue = -1;
var isProcessing = false;
var isShutterOpen = false;
button.watch(function(err, value) {
    var fileName;

    if(err) {
        throw err;
    }
    cButtonValue = value;
    if (state == 'READY' && oButtonValue == -1 && cButtonValue == 0) {
        state = 'SHOT';
        // console.log("oB: "+oButtonValue+"  "+"cB: "+cButtonValue);
        oButtonValue = 0;
    }
    if (state == 'SHOT' && oButtonValue == 0 && cButtonValue == 1) {
        state = 'RELEASE';
        // console.log("oB: "+oButtonValue+"  "+"cB: "+cButtonValue);
        oButtonValue = 1;
    }



    
    if (state == 'SHOT' && !isProcessing) {
        console.log('==================================CHAL');
        isShutterOpen = true;
        isProcessing = true;
        console.log(state);
        fileName = "./public_html/img/"+makeTimeString()+".jpg";
        console.log('cam done '+fileName);
        setTimeout(setProcess, 3000);
    }


    if (state == 'RELEASE') {
        if (isShutterOpen) {
            console.log('==================================KHACK!');
            isShutterOpen = false;
        }
        oButtonValue = -1;
        console.log(state);
        state = 'READY';
        
    }

});


process.on('SIGINT', function() {
    button.unexport();
});


var makeTimeString = function() {
    return dateFormat(new Date(), "yyyymmdd-HH_MM_ssl");
}

function setProcess() {
    if (isProcessing) {
    isProcessing = false;
    console.log('processing done');
    }
}

