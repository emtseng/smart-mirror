var SerialPort = require('serialport'); // serial library
var readLine = SerialPort.parsers.Readline; // read serial data as lines
var hdmiOn = true;
var exec = require('child_process').exec;
console.log ('got here');
// start the serial port connection and read on newlines
const serial = new SerialPort('/dev/ttyUSB0', {
  baudRate: 9600

});
const parser = new readLine({
  delimiter: '\n'
});

// Read data that is available on the serial port and send it to the websocket
serial.pipe(parser);
serial.on('open', function () {
    console.log('~Port is open.');
      parser.on('data', function (data) { //if person is present and HDMI is OFF, turn ON
        if (data === 'PRESENT'  && !hdmiOn) {  
          exec("tvservice -p", function (error, stdout, stderr) {
      		console.log("Executed tvservice -p");
              hdmiOn = true;
          }
        )}else if (data === 'AWAY' && hdmiOn){ //if Person is AWAY and HDMI is ON, turnoff
          exec("tvservice -o", function (error, stdout, stderr) {
      		console.log("Executed tvservice -o");
              hdmiOn = false;

              }) 
          }
     })    
  });

