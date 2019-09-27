import React from 'react';
import axios from 'axios';
import lang from '../lang.json';
import './HomePage.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import TicTacToe from '../TicTacToe/TicTacToe';
import PaddleGame from '../PaddleGame/PaddleGame';
import TicTacToeScreenShot from './TicTacToe.jpg';
import PaddleGameScreenShot from './paddleGame.jpg';

class HomePage extends React.Component {
  constructor() {
    super();

    this.state = {
      TicTacToeScreen: <img src={TicTacToeScreenShot} alt='TicTacToeScreen'/>,
      PaddleGameScreen: <img src={PaddleGameScreenShot} alt='PaddleGameScreen'/>
    }
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
      <>
        <div className="home-container">
          <h1>{lang[localStorage.getItem('lang')].title}</h1>

            <div className="home-box-container">
              <div className="home-hover-single-box">
                <div className="home-single-box">
                  <Link className="nav-link" to="/tictactoe">{this.state.TicTacToeScreen}</Link>
                </div>
              </div>
              <div className="home-hover-single-box">
                <div className="home-single-box">
                  <Link className="nav-link" to="/paddle">{this.state.PaddleGameScreen}</Link>
                </div>
              </div>
            </div>

          <h3>{lang[localStorage.getItem('lang')].desc}</h3>
          <button className="btn-primary" onClick={this.getLocation.bind(this)}>{lang[localStorage.getItem('lang')].localization}</button>
          
        </div>
        <Router>
          <Route path="/tictactoe" component={TicTacToe}/>
          <Route path="/paddle" component={PaddleGame}/>
        </Router>
      </>
    );
  } 
}

export default HomePage;
