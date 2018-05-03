const allTrains = ['1', '2', '3', '4', '5', '6', '7', 'A', 'C', 'E', 'B', 'D', 'F', 'M', 'G', 'J', 'Z', 'L', 'S', 'N', 'Q', 'R', 'W']

export const getTrainDict = function() {
  var output = {}
  for (var i = 0; i < allTrains.length; i++) {
    var train = allTrains[i]
    output[train] = 'Expect regular service'
  }
  return output
}

export const getDelays = function (delays, tweets) {
  console.log('delays', delays)
  // Get new delays
  var newDelays = Object.assign({}, delays)
  var visited = []
  for (var i = 0; i < tweets.length; i++) {
    var tweet = tweets[i].text
    if (tweet.includes('train service has resumed')) {
      console.log('resumed tweet', tweet)
      var trains = tweet.split('train service has resumed')[0].trim().split(' ').filter((item) => item !== 'and').map(item => item.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ""))
      console.log('resumed trains', trains)
      trains.forEach(train => {
        if (visited.indexOf(train) === -1) {
          newDelays[train] = 'Service has resumed'
          visited.push(train)
        }
      })
    } else if (tweet.includes('running local')) {
      console.log('running local', tweet)
      var trains = tweet.split('are running local')[0].trim().split(' ').filter((item) => item !== 'and').map(item => item.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ""))
      console.log('running local', trains)
      var direction = trains[0]
      trains = trains.slice(1, -1)
      trains.forEach(train => {
        if (visited.indexOf(train) === -1) {
          newDelays[train] = direction + ' running local'
          visited.push(train)
        }
      })
    } else if (tweet.includes('will arrive on the express track')) {
      console.log('will arrive on the express track', tweet)
      var trains = tweet.split('will arrive on the express track')[0].trim().split(' ').filter((item) => item !== 'and').map(item => item.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")).slice(0,-1)
      console.log('trains', trains)
      var at = tweet.split('trains')[1]
        , stop = at.indexOf('because')
        , at = at.slice(0, stop)
      var direction = trains.filter(item => allTrains.indexOf(item) === -1)
      trains = trains.filter(item => direction.indexOf(item) === -1)
      trains.forEach(train => {
        if (visited.indexOf(train) === -1) {
          newDelays[train] = direction.join(' ') + at
          visited.push(train)
        }
      })
    } else if (tweet.includes('express')) {
      console.log('express', tweet)
      var trains = tweet.split('are running express')[0].trim().split(' ').filter((item) => item !== 'and').map(item => item.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ""))
      var direction = trains[0]
      , trains = trains.slice(1,-1)
      console.log('express', trains)
      trains.forEach(train => {
        if (visited.indexOf(train) === -1) {
          newDelays[train] = direction + ' running express'
          visited.push(train)
        }
      })
    } else if (tweet.includes('service change')) {
      console.log('service change', tweet)
      var trains = tweet.split('service change')[0].trim().split(' ').filter((item) => item !== 'and').map(item => item.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ""))
      console.log('service change', trains)
      trains.forEach(train => {
        if (visited.indexOf(train) === -1) {
          newDelays[train] = 'Service change'
          visited.push(train)
        }
      })
    }
  }
  console.log('newDelays', newDelays)
  return newDelays
}
