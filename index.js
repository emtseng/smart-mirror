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

// Create Twitter client
const client = new Twitter(secrets)
const params = {screen_name: 'NYCTSubway'};

// Set up server route for tweets
app.use('/api/tweets', (req, res, next) => {
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      console.log(tweets)
      res.send(tweets)
    }
  })
})

// Catch-all route for index.html
app.get('*', function (req, res, next) {
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
app.listen(PORT, function () {
  console.log(`Server is listening on port ${PORT}!`)
});
