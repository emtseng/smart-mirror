import React, { Component } from 'react'
import $ from 'jQuery'
import axios from 'axios'

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      body: ''
    }
  }
  componentDidMount() {
    axios.get('/api/tweets')
    .then(res => {
      this.setState({
        body: res.data
      })
    })
  }
  render() {
    return (
      <div>
      There were { this.state.body.length } tweets in this get
      </div>
    )
  }
}
