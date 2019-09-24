import React from 'react';
import axios from 'axios';
import lang from '../lang.json';
import './HomePage.css';

class HomePage extends React.Component {
  constructor() {
    super();

    this.state = {
      intervalId: null,
      count: 0
    }
  }

  updateTimer = () => {
    this.setState({
      count: this.state.count + 1
    })
  }

  componentDidMount() {
    this.setState({intervalId: setInterval(this.updateTimer, 1000)});
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId)
  }

  setLang(lang) {
    localStorage.setItem('lang', lang);
  }

  getLocation() {
    navigator.geolocation.getCurrentPosition(function(position) {
      console.log(position)
      axios.get('https://api.opencagedata.com/geocode/v1/json?q=50.2617926+19.0309843&key=f5217a495b934378b4a5e5b6532cb8e4')
      .then((resp) => {
        console.log(resp);
      })
    });
  }

  render() {
    return (
      <div>
        <h1>{lang[localStorage.getItem('lang')].title}</h1>
        <h3>{lang[localStorage.getItem('lang')].desc}</h3>
        <button className="btn-primary" onClick={this.getLocation.bind(this)}>Moja lokalizacja</button>
      </div>
    );
  } 
}

export default HomePage;
