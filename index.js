import express from 'express'

import path from 'path'
import morgan from 'morgan'
import bodyParser from 'body-parser'

import Twitter from 'twitter'
import secrets from './secrets'

// Create web server, add logging capabilities for dev
const app = express()
app.use(morgan('dev'))
app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }))
// Serve static files from /public folder
app.use('/static', express.static(path.join(__dirname, 'public')))

// Setup environment variables

var twitterClientConfig = {
  'consumer_key': secrets['consumer_key'] || process.env['CONSUMER_KEY'],
  'consumer_secret': secrets['consumer_secret'] || process.env['CONSUMER_SECRET'],
  'access_token_key': secrets['access_token_key'] || process.env['ACCESS_TOKEN_KEY'],
  'access_token_secret': secrets['access_token_secret'] || process.env['ACCESS_TOKEN_SECRET']
}

// Create Twitter client
const client = new Twitter(twitterClientConfig)
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
