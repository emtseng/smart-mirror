import React, { Component } from 'react'
import $ from 'jQuery'
import axios from 'axios'

import { getDelays, trainLines } from './train_helpers'

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      tweets: [],
      delays: trainLines
    }
  }
  componentDidMount() {
    axios.get('/api/tweets')
      .then(res => {
        this.setState({
          tweets: res.data,
          delays: getDelays(this.state.delays, res.data)
        })
      })
  }
  render() {
    return (
      <div>
        <div>
          Hi there!
        </div>
        <div>
          {
            Object.keys(this.state.delays).map(line => (
              <div className="line" style={{margin: '1em'}}>
                {line} : {this.state.delays[line]}
              </div>
            ))
          }
        </div>
        <hr />
        <div>
          {
            this.state.tweets ? this.state.tweets.map(tweet => (
              <div className="tweet" style={{margin: '1em'}}>
              {tweet.text}
              </div>
            )) : null
          }
        </div>
      </div>
    )
  }
}
