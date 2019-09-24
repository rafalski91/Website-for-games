import React from 'react';
import './PaddleGame.css';

class PaddleGame extends React.Component {
  constructor() {
    super();

    this.game = {
      gameSpeed: 1000,
      gameBoard: null,
      context: null,
      ballX: 100,
      ballY: 100,
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

    if (localStorage.getItem('highScore') > 10 && localStorage.getItem('highScore') < 20) {
      this.game.gameSpeed = 500
    }

    if (localStorage.getItem('highScore') > 20) {
      this.game.gameSpeed = 250
    }

    this.updateAll = this.updateAll.bind(this);
    this.updateMousePosition = this.updateMousePosition.bind(this);
  }

  componentDidMount() {
    this.game.gameBoard = this.refs.canvas;
    this.game.context = this.refs.canvas.getContext('2d');
    this.printElements();
    this.refs.canvas.addEventListener('mousemove', this.updateMousePosition)
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
      this.setState({bounces: 0})
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
          this.setState({bounces: this.state.bounces + 1})
          this.setHighScore();
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
    this.game.gameSpeed = this.game.gameSpeed - 1;
    this.printElements();
    this.updateDirection();
  }
  
  updateMousePosition(ev) {
    let rect = this.refs.canvas.getBoundingClientRect();
    let mouseX = ev.clientX - rect.left;
    this.game.paddleX = mouseX - (this.game.paddleWidth / 2);
  }
  
  resetBall() {
    this.game.ballX = this.game.gameBoard.width / 2;
    this.game.ballY = this.game.gameBoard.height / 4;
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
    this.setState({bounces: 0})
  }

  render() {
    let startStopGameBtn;

    if (!this.state.gameRefreshInterval) {
      startStopGameBtn = <button className="btn btn-primary" onClick={this.startStopGame.bind(this)}>START GAME</button>
    } else {
      startStopGameBtn = <button className="btn btn-danger" onClick={this.startStopGame.bind(this)}>STOP GAME</button>
    }

    return (
      <div>
        <h1>Current bounces: {this.state.bounces}</h1>
        <h2>High Score: {localStorage.getItem("highScore")}</h2>

        <button className="btn btn-success" onClick={this.toggleFullScreen.bind(this)}>FULL SCREEN</button>

        {startStopGameBtn}
        
        <button className="btn btn-primary" onClick={this.resetScore.bind(this)}>RESET SCORE</button>

        <canvas onDoubleClick={this.toggleFullScreen.bind(this)}
        className={this.state.isFullScreen ? 'game-board game-board--full-screen' : 'game-board'} 
        ref="canvas" 
        width="800" 
        height="600"></canvas>
      </div>
    );
  } 
}

export default PaddleGame;
