const allTrains = ['1', '2', '3', '4', '5', '6', '7', 'A', 'C', 'E', 'B', 'D', 'F', 'M', 'G', 'J', 'Z', 'L', 'S', 'N', 'Q', 'R', 'W']

export const trainLines = {
  '123': '',
  '456': '',
  '7': '',
  'L': '',
  'ACE': '',
  'BDFM': '',
  'G': '',
  'NQRW': '',
  'JZ': '',
  'S': ''
}

export const getDelays = function (delays, tweets) {
  // Generate train2line mapping
  const trains2Lines = {}
  for (var j = 0; j < allTrains.length; j++) {
    var train = allTrains[j]
    var allLines = Object.keys(trainLines)
    var lineToUpdate = allLines.filter(line => line.includes(train))
    trains2Lines[train] = lineToUpdate
  }
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
          var line = trains2Lines[train]
          newDelays[line] = train + ' train service has resumed'
          visited.push(train)
        }
      })
    }
    if (tweet.includes('running local')) {
      console.log('running local', tweet)
      var trains = tweet.split('running local')[0].trim().split(' ').filter((item) => item !== 'and').map(item => item.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ""))
      console.log('running local', trains)
      trains.forEach(train => {
        if (visited.indexOf(train) === -1) {
          var line = trains2Lines[train]
          newDelays[line] = train + ' running local'
          visited.push(train)
        }
      })
    }
    if (tweet.includes('express')) {
      console.log('express', tweet)
      var trains = tweet.split('express')[0].trim().split(' ').filter((item) => item !== 'and').map(item => item.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ""))
      console.log('express', trains)
      trains.forEach(train => {
        if (visited.indexOf(train) === -1) {
          var line = trains2Lines[train]
          newDelays[line] = train + ' running express'
          visited.push(train)
        }
      })
    }
    if (tweet.includes('service change')) {
      console.log('service change', tweet)
      var trains = tweet.split('service change')[0].trim().split(' ').filter((item) => item !== 'and').map(item => item.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ""))
      console.log('service change', trains)
      trains.forEach(train => {
        if (visited.indexOf(train) === -1) {
          var line = trains2Lines[train]
          newDelays[line] = train + ' service change'
          visited.push(train)
        }
      })
    }
  }
  return newDelays
}
