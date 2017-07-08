var config = require('./config');

var Gpio = require('onoff').Gpio;
var button = new Gpio(5, 'in', 'both');
var button2 = new Gpio(6, 'in', 'both');
var spawn = require('child_process').spawn;
var exec  = require('child_process').exec;
var dateFormat = require('dateformat');

var state = 'READY';
var camOptions = config.camOptions;
// var camOptions = ["-vf", 
// 	"-w", "1000", "-h", "1000", 
// 	"-q", "100", "-t", "250",
// 	"-o"] 
// var scpOptions = ["picxenk@192.168.0.17:./MPScreenServer/MPCams/1/"];
// var scpOptions = ["picxenk@222.121.149.230:./MPScreenServer/MPCams/1/"];
var scpOptions = [config.MPScreenServerUser+"@"
    +config.MPScreenServerIP+":"
    +"./MPScreenServer/MPCams/"
    +config.MPCamID+"/"];

button.watch(function(err, value) {
    var fileName;
    var shotProc;
    var scpProc;

    if(err) {
        throw err;
    }
    console.log(value);

    
    if (value == 1) {
        fileName = makeTimeString()+".jpg";
        shotProc = spawn('raspistill', camOptions.concat(fileName));
        console.log('cam done '+fileName);

        shotProc.on('close', (code) => {
            // scpProc = spawn('scp', [fileName].concat(scpOptions));
            exec("scp "+fileName+" "+scpOptions[0], (err, sto, ste) => {
                if (err) {
                    console.error(`${err}`);
                    return;
                }
            });
            console.log('scp done '+fileName);
            // scpProc.stderr.on('data', (data) => {
            //     console.log(`err : ${data}`);
            // });
        });

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

