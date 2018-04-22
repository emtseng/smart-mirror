var Twitter = require('twitter')

import secrets from '../secrets'

var client = new Twitter(secrets)

var params = {screen_name: 'NYCTSubway'};

client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    console.log(tweets);
  }
});
