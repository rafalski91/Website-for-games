import React from 'react';
import './PaddleGame.css';
import lang from '../lang';

class PaddleGame extends React.Component {
  constructor(props) {
    super(props);

    this.game = {
      gameSpeed: 700,
      gameBoard: null,
      context: null,
      ballX: 0,
      ballY: 0,
      ballSpeedX: 5,
      ballSpeedY: 7,
      paddleWidth: 100,
      paddleHeight: 10,
      paddleDistFromEdge: 60,
      paddleX: 400
    }

    this.state = {
      gameRefreshInterval: null,
      bounces: 0,
      highScore: null,
      isFullScreen: false,
    }

    this.updateAll = this.updateAll.bind(this);
    this.updateMousePosition = this.updateMousePosition.bind(this);
  }

  componentDidMount() {
    this.game.gameBoard = this.refs.canvas;
    this.game.context = this.refs.canvas.getContext('2d');
    this.printElements();
    this.refs.canvas.addEventListener('mousemove', this.updateMousePosition)
    localStorage.setItem('score', '0');
  }

  componentWillUnmount() {
    clearInterval(this.state.gameRefreshInterval);
  }

  updateDirection() {
    this.game.ballX += this.game.ballSpeedX;
    this.game.ballY += this.game.ballSpeedY;
  
    if(this.game.ballX < 0) {
      this.game.ballSpeedX *= -1;
    }
    if(this.game.ballX > this.game.gameBoard.width) {
      this.game.ballSpeedX *= -1;
    }
    if(this.game.ballY < 0) {
      this.game.ballSpeedY *= -1;
    }
    if(this.game.ballY > this.game.gameBoard.height) {
      this.resetBall();
    }
  
    let paddleTopEdgeY = this.game.gameBoard.height - this.game.paddleDistFromEdge;
    let paddleBottomEdgeY = paddleTopEdgeY + this.game.paddleHeight;
    let paddleLeftEdgeX = this.game.paddleX;
    let paddleRightEdgeX = paddleLeftEdgeX + this.game.paddleWidth;

    if (this.game.ballY > paddleTopEdgeY &&
        this.game.ballY < paddleBottomEdgeY &&
        this.game.ballX > paddleLeftEdgeX &&
        this.game.ballX < paddleRightEdgeX) {
          this.game.ballSpeedY *= -1;
          this.setState({bounces: this.state.bounces+1})
          this.setHighScore();
          this.setScore();
          this.updateSpeedGame();
        }
  }

  updateSpeedGame() {
    if (localStorage.getItem('score') > 2 && localStorage.getItem('score') < 4) {
      this.game.gameSpeed = 400;
      this.game.ballSpeedX *= 1;
      this.game.ballSpeedY *= 2;
    }

    if (localStorage.getItem('score') > 4 && localStorage.getItem('score') < 6) {
      this.game.gameSpeed = 250;
      this.game.ballSpeedX *= 2;
      this.game.ballSpeedY *= 1;
    }

    if (localStorage.getItem('score') > 6 && localStorage.getItem('score') < 8) {
      this.game.gameSpeed = 150;
      this.game.ballSpeedX *= 1;
      this.game.ballSpeedY *= 1.5;
    }

    if (localStorage.getItem('score') > 8 && localStorage.getItem('score') < 10) {
      this.game.ballSpeedX *= 1;
      this.game.ballSpeedY *= 1.5;
    }
  }

  setScore() {
    let currentScore = localStorage.getItem("score");

    if (currentScore < this.state.bounces) {
      localStorage.setItem("score", this.state.bounces);
      this.setState({currentScore})
    }
  }

  setHighScore() {
    let highScore = localStorage.getItem("highScore");

    if (highScore < this.state.bounces) {
      localStorage.setItem("highScore", this.state.bounces);
      this.setState({highScore})
    }
  }

  printElements() {
    this.game.context.fillStyle = 'black';
    this.game.context.fillRect(0,0, this.game.gameBoard.width, this.game.gameBoard.height)
  
    this.game.context.fillStyle = 'white';
    this.game.context.fillRect(this.game.paddleX, this.game.gameBoard.height - this.game.paddleDistFromEdge - this.game.paddleHeight, this.game.paddleWidth, this.game.paddleHeight)
  
    this.game.context.fillStyle = 'white';
    this.game.context.beginPath();
    this.game.context.arc(this.game.ballX, this.game.ballY, 10, 0, Math.PI * 2, true);
    this.game.context.fill();
  }
  
  updateAll() {
    this.game.gameSpeed = this.game.gameSpeed;
    this.printElements();
    this.updateDirection();
  }
  
  updateMousePosition(ev) {
    let rect = this.refs.canvas.getBoundingClientRect();
    let mouseX = ev.clientX - rect.left;
    this.game.paddleX = mouseX - (this.game.paddleWidth / 2);
  }
  
  resetBall() {
    this.setState({bounces: 0})
    this.game.ballX = 0;
    this.game.ballY = 0;
    localStorage.setItem('score', '0');
    this.game.gameSpeed = 700;
    this.game.ballSpeedX = 5;
    this.game.ballSpeedY = 7;
    this.startStopGame();
  }

  toggleFullScreen() {
    this.setState({isFullScreen: !this.state.isFullScreen})
  }

  startStopGame() {
    if (!this.state.gameRefreshInterval) {
      this.setState({gameRefreshInterval: setInterval(this.updateAll, this.game.gameSpeed/30)});
    } else {
      clearInterval(this.state.gameRefreshInterval);
      this.setState({gameRefreshInterval: null})
    }
  }

  resetScore() {
    localStorage.setItem('highScore', '0');
    localStorage.setItem('score', '0');
    this.setState({bounces: 0})
  }

  render() {
    let startStopGameBtn;

    if (!this.state.gameRefreshInterval) {
      startStopGameBtn = <button className="btn btn-success" onClick={this.startStopGame.bind(this)}>{lang[localStorage.getItem('lang')].buttonStart}</button>
    } else {
      startStopGameBtn = <button className="btn btn-danger" onClick={this.startStopGame.bind(this)}>{lang[localStorage.getItem('lang')].buttonStop}</button>
    }

    return (
      <div className="game-board-container-paddle-game">
        <div className="score-container">
          <h3>{lang[localStorage.getItem('lang')].currentScore} {localStorage.getItem("score")}</h3>
          <h3>{lang[localStorage.getItem('lang')].highScore} {localStorage.getItem("highScore")}</h3>
        </div>
        <div className="options-container">
          <button className="btn btn-secondary" onClick={this.toggleFullScreen.bind(this)}>{lang[localStorage.getItem('lang')].buttonFullScreen}</button>
          {startStopGameBtn}
          <button className="btn btn-warning" onClick={this.resetScore.bind(this)}>{lang[localStorage.getItem('lang')].buttonResetScore}</button>
        </div>
        <canvas onDoubleClick={this.toggleFullScreen.bind(this)} onClick={this.startStopGame.bind(this)}
        className={this.state.isFullScreen ? 'game-board game-board--full-screen' : 'game-board'} 
        ref="canvas" 
        width="800" 
        height="600"></canvas>
      </div>
    );
  } 
}

export default PaddleGame;
