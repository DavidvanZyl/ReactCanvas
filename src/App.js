import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { store} from './Components/ControlPanel/index';

class App extends Component {

    createCanvas() {

        const canvas = document.querySelector('#draw');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.strokeStyle = '#BADA55';
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = 50;

        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;

        function draw(e) {
            if (!isDrawing) {
                return; //stops func when not mousedown
            };
            const thickness = store.getState().thickness;
            ctx.lineWidth = thickness;
            ctx.strokeStyle = store.getState().hex;
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
            [lastX, lastY] = [e.offsetX, e.offsetY];
        }


        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mousedown', (e) => {
            isDrawing = true;
            [lastX, lastY] = [e.offsetX, e.offsetY];
        });
        canvas.addEventListener('mouseup', () => isDrawing = false);
        canvas.addEventListener('mouseout', () => isDrawing = false);
    }

    componentDidMount() {
        this.createCanvas();
    }

    render() {
    return (
      <div className="App">
          <img src={logo} className="App-logo" alt="logo" />
          <canvas id="draw" width="800" height="800"></canvas>
      </div>
    );
  }

}

export default App;
