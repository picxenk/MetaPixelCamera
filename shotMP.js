var config = require('./config');

// for websocket
var io = require('socket.io').listen(8080);
io.on('connection', (soc) => {
    console.log('connected: '+soc);
});
// var WebSocketClient = require('websocket').client;
// var client = new WebSocketClient();
// client.connect('ws://'+config.MPScreenServerIP+':8080/screenserver');
// var W3CWebSocket = require('websocket').w3cwebsocket;
// var client = new W3CWebSocket('ws://'+config.MPScreenServerIP+':8888/screenserver', 'echo-protocol');
// client.onerror = function() {
//     console.log('websocket error');
// }
var WebSocket = require('ws');
var client = new WebSocket('ws://'+config.MPScreenServerIP+':8080/screenserver');
client.on('error', (err) => {
    console.log('ws error: '+ err.code);
});

// for buttons
var Gpio = require('onoff').Gpio;
var buttonOptions = { persistentWatch: true, debounceTimeout: 50};
var button = new Gpio(5, 'in', 'both', buttonOptions); // for shotting
var button2 = new Gpio(6, 'in', 'both', buttonOptions); // for extra
var spawn = require('child_process').spawn;
var exec  = require('child_process').exec;
var dateFormat = require('dateformat');


// for phantomjs
var path = require('path');
var childProcess = require('child_process');
var phantomjs = require('phantomjs2');
var binPath = phantomjs.path;


var camOptions = config.camOptions;
var scpOptions = [config.MPScreenServerUser+"@"
    +config.MPScreenServerIP+":"
    +"./MPScreenServer/MPCams/"
    +config.MPCamID+"/"];


// vars for shot button
var state = 'READY';
var oButtonValue = -1;
var cButtonValue = -1;
var isProcessing = false;
var isShutterOpen = false;

button.watch(function(err, value) {
    var fileName;
    var shotProc;
    var scpProc;

    if(err) {
        throw err;
    }
    cButtonValue = value;
    if (state == 'READY' && oButtonValue == -1 && cButtonValue == 0) {
        state = 'SHOT';
        oButtonValue = 0;
    }
    if (state == 'SHOT' && oButtonValue == 0 && cButtonValue == 1) {
        state = 'RELEASE';
        oButtonValue = 1;
    }


    console.log(value);

    
    if (state == 'SHOT' && !isProcessing) {
        console.log('==================================CHAL');
        io.emit('shot', { time: Date.now() });
        client.send('shot');
        isShutterOpen = true;
        isProcessing = true;

        var timeStamp = makeTimeString();
        fileName = timeStamp+".png";
        mpFileName = timeStamp+"_mp.png";
        filePath = "./public_html/img/"+fileName;
        mpFilePath = "./public_html/img/"+mpFileName;
        shotProc = spawn('raspistill', camOptions.concat(filePath));
        console.log('cam done '+filePath);


        shotProc.on('close', (code) => {
            var args = [
                path.join(__dirname, 'renderMP.js'),
                fileName,
                mpFileName
            ]

            var mpProc = spawn(binPath, args);
            mpProc.on('close', (code) => {
                exec("scp "+mpFilePath+" "+scpOptions[0], (err, sto, ste) => {
                    if (err) {
                        console.error(`${err}`);
                        return;
                    }
                });
                console.log('scp done '+mpFilePath);
                io.emit('scp_done', { time: Date.now() });
                isProcessing = false;
            });

            // childProcess.execFile(binPath, args, (err, sto, ste) => {
            //     if (err) {
            //         console.error(`${err}`);
            //         return;
            //     }
            //     exec("scp "+mpFilePath+" "+scpOptions[0], (err, sto, ste) => {
            //         if (err) {
            //             console.error(`${err}`);
            //             return;
            //         }
            //     });
            //     console.log('scp done '+mpFilePath);
            //     isProcessing = false;
            // });
        });

        // shotProc.on('close', (code) => {
        //     exec("scp "+fileName+" "+scpOptions[0], (err, sto, ste) => {
        //         if (err) {
        //             console.error(`${err}`);
        //             return;
        //         }
        //     });
        //     console.log('scp done '+fileName);
        //     isProcessing = false;
        // });

    }

    if (state == 'RELEASE') {
        if (isShutterOpen) {
            console.log('==================================KHACK!');
            isShutterOpen = false;
        }
        oButtonValue = -1;
        state = 'READY';
    }

});

button2.watch(function(err, value) {
    if(err) {
        throw err;
    }
    console.log('b2: '+value);

});


process.on('SIGINT', function() {
    button.unexport();
    button2.unexport();
});


var makeTimeString = function() {
    return dateFormat(new Date(), "yyyymmdd-HH_MM_ssl");
}

var shotPreview = function() {
    var previewProc;
    if (!isProcessing) {
        previewProc = spawn('raspistill', config.previewOptions);
    }
}

setInterval(shotPreview, 2000);
