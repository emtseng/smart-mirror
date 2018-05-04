import express from 'express'

import path from 'path'
import morgan from 'morgan'
import bodyParser from 'body-parser'

import Twitter from 'twitter'
import secrets from './secrets'
import SerialPort from 'serialport'
import ws from 'nodejs-websocket'
import { exec } from 'child_process'

// By default, assume monitor is on
var hdmiOn = true
  , turnOffTimer
  , WAIT_UNTIL_SLEEP = 5 * 60 * 1000;

var server = ws.createServer(function (conn) {
  console.log("New connection from client established")
  conn.on("text", function (str) {
    console.log("Received " + str)
  })
  conn.on("close", function (code, reason) {
    console.log("Connection closed")
  })
}).listen(8004)

// turn display on or off
function saveEnergy(person) {

  // deactivate timeout handler if present
  if (turnOffTimer) {
    clearTimeout(turnOffTimer);
  }

  // turn on display if off and person is present in front of mirror
  if (person == "PRESENT" && !hdmiOn) {

    // make system call to power on display
    exec('tvservice -p', function (error, stdout, stderr) {
      if (error !== null) {
        console.log(new Date() + ': exec error: ' + error);
      } else {
        process.stdout.write(new Date() + ': Turned monitor on.\n');
        hdmiOn = true;
      }
    });

  }
  // activate timer to turn off display if display is on and person is away for a while
  else if (person === 'AWAY' && hdmiOn) {

    // activate time to turn off display
    turnOffTimer = setTimeout(function () {

      // make system call to turn off display
      exec('tvservice -o', function (error, stdout, stderr) {
        if (error !== null) {
          console.log(new Date() + ': exec error: ' + error);
        } else {
          process.stdout.write(new Date() + ': Turned monitor off.\n');
          hdmiOn = false;
        }
      });

    }, WAIT_UNTIL_SLEEP);

  }

}

//Make system call to get device where Arduino is connected (e.g. /dev/ttyACM0)
exec('ls /dev/ttyACM*', function (error, stdout, stderr) {

  if (error !== null) {

    console.log(new Date() + ': exec error: ' + error);

  } else {

    // extract device information (which USB port)
    var usbDev = stdout.replace("\n", "");
    process.stdout.write(new Date() + ': Using USB: ' + usbDev + '.\n');

    // create serial port for connected Arduino
    var serialPort = new SerialPort(usbDev, {
      baudrate: 9600,
      parser: SerialPort.parsers.readline('\n')
    });

    // list to events from Arduino via serial USB port (e.g. from /dev/ttyACM0)
    serialPort.on('open', function () {

      console.log('serial port opened');

      serialPort.on('data', function (data) {

        // parse Arduino distance events (distance sensor)
        if (data.indexOf('Person: ') === 0) {

          console.log(data);

          var person = data.replace('Person: ', '');
          // remove ending newline
          person = person.replace(/(\r\n|\n|\r)/gm, '');

          saveEnergy(person);

        }

      });

    });
  }
});

// Create web server, add logging capabilities for dev
const app = express()
app.use(morgan('dev'))
app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }))
// Serve static files from /public folder
app.use('/static', express.static(path.join(__dirname, 'public')))

// Create Twitter client
const client = new Twitter(secrets)
var max_id = null

const params = {
  screen_name: 'NYCTSubway',
  exclude_replies: 'true',
  include_rts: 'false',
  count: '100',
  since_id: max_id ? max_id : 66379182
}

// Set up server route for tweets
app.use('/api/tweets', (req, res, next) => {
  client.get('statuses/user_timeline', params, (error, tweets, response) => {
    if (!error) {
      if (!max_id) {
        max_id = tweets[0].id
      }
      res.send(tweets)
    }
  })
})

// Catch-all route for index.html
app.get('*', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'public/index.html'))
})

// Add error handling
app.use((err, req, res, next) => {
  console.error(err)
  console.error(err.stack)
  res.status(err.status || 500).send(err.message || 'Internal server error')
})

// Put server on port 3000
const PORT = Number(process.env.PORT) || 3000
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}!`)
});
