import express from 'express'

import path from 'path'
import morgan from 'morgan'
import bodyParser from 'body-parser'

import Twitter from 'twitter'
import dotenv from 'dotenv'
import axios from 'axios'

// Create web server, add logging capabilities for dev
const app = express()
app.use(morgan('dev'))
app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }))
// Serve static files from /public folder
app.use('/static', express.static(path.join(__dirname, 'public')))

// Setup environment variables
dotenv.config()

var twitterClientConfig = {
  'consumer_key': process.env['CONSUMER_KEY'],
  'consumer_secret': process.env['CONSUMER_SECRET'],
  'access_token_key': process.env['ACCESS_TOKEN_KEY'],
  'access_token_secret': process.env['ACCESS_TOKEN_SECRET']
}

// Create Twitter client
const client = new Twitter(twitterClientConfig)

const params = {
  screen_name: 'NYCTSubway',
  exclude_replies: 'true',
  include_rts: 'false',
  count: '200',
}

// Set up server route for tweets
app.use('/api/tweets', (req, res, next) => {
  client.get('statuses/user_timeline', params, (error, tweets, response) => {
    if (!error) {
      res.send(tweets)
    }
  })
})

// Set up server route

app.use('/api/weather', (req, response, next) => {
  axios.get('http://api.wunderground.com/api/' + process.env.WUNDERGROUND_KEY.toString() + '/geolookup/q/autoip.json')
    .then(res => {
      var state = res.data.location.state
        , city = res.data.location.city;
      return axios.get('http://api.wunderground.com/api/' + process.env.WUNDERGROUND_KEY.toString() + '/conditions/q/' + state + '/' + city.replace(' ', '_') + '.json')
    })
    .then(res => {
      var data = res.data.current_observation
      response.send({
        weather: data['weather'],
        temp: data['temperature_string'],
        weather_icon: data['icon_url']
      })
    })
    .catch(err => {
      console.error(err)
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
