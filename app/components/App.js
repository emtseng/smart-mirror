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
      trains: getTrainDict(),
      weather: '',
      temp: '',
      weather_icon: '',
      max_id: 0
    }
    this.getTimeOfDay = this.getTimeOfDay.bind(this)
  }
  getTimeOfDay() {
    var hours = (new Date()).getHours()
    if (hours < 12) {
      return 'morning'
    } else if (hours >= 19) {
      return 'evening'
    } else {
      return 'afternoon'
    }
  }
  componentWillMount() {
    axios.get('/api/weather')
      .then(res => {
        this.setState({
          weather: res.data.weather,
          temp: res.data.temp,
          weather_icon: res.data.weather_icon
        })
        return axios.get('/api/tweets')
      })
      .then(res => {
        this.setState({
          timeOfDay: this.getTimeOfDay(),
          tweets: res.data,
          trains: getDelays(this.state.trains, res.data),
          max_id: res.data[0].id
        })
      })
  }
  componentDidMount() {
    setInterval(() => {
      axios.get('/api/tweets')
        .then(res => {
          var tweets = res.data
            , max_id = tweets[0].id
          if (max_id > this.state.max_id) {
            console.log('found new tweet, updating')
            this.setState({
              tweets,
              trains: getDelays(this.state.trains, tweets),
              max_id
            })
          } else {
            console.log('found no new tweets')
          }
        })
    }, 120000)
  }
  render() {
    return (
      <div id="app">
        <div id="greeting">
          Good {this.state.timeOfDay}!
          <div id="weather">
            <img src={this.state.weather_icon} />
            {
              this.state.weather
            }
            {
              this.state.temperature_string
            }
            {
              this.state.temp
            }
          </div>
        </div>
        <div id="trains">
          {
            Object.keys(this.state.trains).map(train => (
              <div className="line" style={{ margin: '1em' }}>
                <div className={`train ${this.state.trains[train].color}`}>
                  {train}
                </div>
                {this.state.trains[train].status}
              </div>
            ))
          }
        </div>
        <hr />
        {
          /*
          <div>
            {
              this.state.tweets ? this.state.tweets.map(tweet => (
                <div className="tweet" style={{ margin: '1em' }}>
                  {tweet.text}
                </div>
              )) : null
            }
          </div>
          */
        }
      </div>
    )
  }
}
