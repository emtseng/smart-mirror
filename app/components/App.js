import React, { Component } from 'react'
import $ from 'jQuery'
import axios from 'axios'

import { getDelays, getTrainDict } from './train_helpers'

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      timeOfDay: '',
      tweets: [],
      trains: getTrainDict()
    }
    this.getTimeOfDay = this.getTimeOfDay.bind(this)
  }
  getTimeOfDay() {
    var hours = (new Date()).getHours()
      , output = '';
    switch (hours) {
      case (hours < 12):
        output = 'morning'
        break
      case (hours >= 12 && hours < 19):
        output = 'afternoon'
        break
      case (hours >= 19):
        output = 'evening'
        break
      default:
        return 'day'
    }
    return output
  }
  componentWillMount() {
    axios.get('/api/tweets')
      .then(res => {
        this.setState({
          timeOfDay: this.getTimeOfDay(),
          tweets: res.data,
          trains: getDelays(this.state.trains, res.data)
        })
      })
  }
  render() {
    return (
      <div>
        <div id="greeting">
          Good {this.state.timeOfDay}!
        </div>
        <div id="trains">
          {
            Object.keys(this.state.trains).map(train => (
              <div className="line" style={{ margin: '1em' }}>
                {train} : {this.state.trains[train]}
              </div>
            ))
          }
        </div>
        <hr />
        <div>
          {
            this.state.tweets ? this.state.tweets.map(tweet => (
              <div className="tweet" style={{ margin: '1em' }}>
                {tweet.text}
              </div>
            )) : null
          }
        </div>
      </div>
    )
  }
}
