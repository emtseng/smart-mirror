var SerialPort = require('serialport'); // serial library
// var readLine = SerialPort.parsers.Readline; // read serial data as lines
var hdmiOn = true;
var exec = require('child_process').exec;
// start the serial port connection and read on newlines
const serial = new SerialPort('/dev/ttyUSB0', {
  baudRate: 9600,
  parser: new SerialPort.parsers.Readline('\n')
});

console.log('got here, after instantiating serialport')

// Read data that is available on the serial port and send it to the websocket
// serial.pipe(parser);
serial.on('open', function () {
  console.log('~Port is open.');
})

serial.on('data', function (data) {
  console.log('Registered data', data)
  console.log('Is the data PRESENT?', data === 'PRESENT')
  console.log('Is the data AWAY?', data === 'AWAY')
  if (data === 'PRESENT' && !hdmiOn) { //if person is present and HDMI is OFF, turn ON
    exec("tvservice -p", function (error, stdout, stderr) {
      if (error) {
        console.error(error)
      }
      console.log("Executed tvservice -p");
      hdmiOn = true;
    })
  } else if (data === 'AWAY' && hdmiOn) { //if Person is AWAY and HDMI is ON, turnoff
    exec("tvservice -o", function (error, stdout, stderr) {
      if (error) {
        console.error(error)
      }
      console.log("Executed tvservice -o");
      hdmiOn = false;
    })
  }
})
