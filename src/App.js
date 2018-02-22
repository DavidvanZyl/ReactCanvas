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
        let direction = false;
        //let hue = 0;

        function draw(e) {
            if (!isDrawing) {
                return; //stops func when not mousedown
            }
            ctx.lineWidth = store.getState().thickness;
            console.log(store.getState());
            let hue = store.getState().hue;
            console.log(hue);
            let sat = store.getState().saturation;
            let lit = store.getState().light;
            ctx.strokeStyle = store.getState().hex;
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
            [lastX, lastY] = [e.offsetX, e.offsetY];

            //drawWidth();
        }

        function drawWidth() {
            // if (hue >= 360) hue = 0;
            if (ctx.lineWidth >= 100 || ctx.lineWidth <= 1) {
                direction = !direction;
            }
            if (direction) {
                ctx.lineWidth++;
            } else {
                ctx.lineWidth--;
            }
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


