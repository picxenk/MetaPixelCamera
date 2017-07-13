var config = require('./config');

// for websocket
var io = require('socket.io').listen(8080);
io.on('connection', (soc) => {
    console.log('connected: '+soc);
});
var WebSocket = require('ws');
var connectScreenServerWS = function() {
    return new WebSocket('ws://'+config.MPScreenServerIP+':8080/screenserver');
}
// var client = new WebSocket('ws://'+config.MPScreenServerIP+':8080/screenserver');
var client = connectScreenServerWS();
client.on('error', (err) => {
    console.log('ws error: '+ err.code + ' ... reconnect');
    process.exit();
});
var makeWSData = function(m) {
    var data = {
        id: config.MPCamID,
        msg: m
    }
    return JSON.stringify(data);
};

// for buttons
var Gpio = require('onoff').Gpio;
// var buttonOptions = { persistentWatch: true, debounceTimeout: 50};
var buttonOptions = { debounceTimeout: 30};
var button = new Gpio(5, 'in', 'both', buttonOptions); // for shotting
var button2 = new Gpio(6, 'in', 'both', buttonOptions); // for extra

// common
var spawn = require('child_process').spawn;
var exec  = require('child_process').exec;
var dateFormat = require('dateformat');
var path = require('path');
var waitUntil = require('wait-until');

// for phantomjs - deprecated
// var childProcess = require('child_process');
// var phantomjs = require('phantomjs2');
// var binPath = phantomjs.path;


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
var isPreviewShot = false;
var isShutterOpen = false;

var isDebugging = true;
function debug() {
    if (isDebugging) {
        console.log('state:'+state+' isProcessing:'+isProcessing+' isPreviewShot:'+isPreviewShot);
    }
}

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
    debug();

    
    if (state == 'SHOT' && !isProcessing) {
        console.log('==================================CHAL');
        io.emit('shot', { time: Date.now() });
        client.send(makeWSData('shot'), (err) => { if (err) console.log(err); });
        isShutterOpen = true;
        isProcessing = true;

        var timeStamp = makeTimeString();
        fileName = timeStamp+".png";
        mpFileName = timeStamp+"_mp.png";
        filePath = "./public_html/img/"+fileName;
        mpFilePath = "./public_html/img/"+mpFileName;


        waitUntil()
            .interval(100)
            .times(20)
            .condition(function() {
                return (!isPreviewShot ? true : false);
            })
            .done(function(result) {
                shotProc = spawn('raspistill', camOptions.concat(filePath));
                console.log('cam done '+filePath);
                shotProc.on('exit', (code) => {
                    var args = [
                        path.join(__dirname, 'renderMP.js'),
                        fileName,
                        mpFileName
                    ]

                    var mpProc = spawn('node', [path.join(__dirname, 'renderMPCanvas.js'), fileName]);
                    mpProc.on('exit', (code) => {
                        var scpProc = spawn('scp', [mpFilePath, scpOptions[0]]);
                        scpProc.on('close', (c) => {
                            console.log('scp done '+mpFilePath);
                            io.emit('scp_done', { time: Date.now() });
                            client.send(makeWSData('send'), (err) => { if (err) console.log(err); });
                            isProcessing = false;
                        });
                    });
                });
            });
    }

    if (state == 'RELEASE') {
        if (isShutterOpen) {
            console.log('==================================KHACK!');
            isShutterOpen = false;
            // client.send(makeWSData('release'));
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
        isPreviewShot = true;
        previewProc = spawn('raspistill', config.previewOptions);

        previewProc.on('exit', (code) => {
            isPreviewShot = false;
        });
    }
}

var heartbeat = function() {
    client.send(makeWSData('live'), (err) => { if (err) console.log('heartbeat fail: '+err); });
}

setInterval(shotPreview, 3000);
setInterval(heartbeat, 60000);
