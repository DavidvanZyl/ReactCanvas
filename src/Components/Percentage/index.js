import React from 'react';
import Rx from 'rxjs/Observable';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/takeUntil';
import "rxjs/add/operator/map";

class Percentage extends React.Component {
    constructor({ type, value, gradient, hue, saturation, lightness, thickness, set }) {
        super({ type, value, gradient, hue, saturation, lightness, thickness, set });

        const padding = 60;
        this.padding = padding / 2;
        const innerSize = 150;
        this.innerSize = innerSize;
        this.outterSize = innerSize + padding;
        this.barOffsetX = innerSize - 20;

        this.state = {
            dragging: false
        }

        this.canvas = null;
        this.selector = null;
    }

    render() {
        return (
            <svg ref={(canvas) => { this.canvas = canvas; }}
                width={this.outterSize} height={this.outterSize}
                viewBox={`0 0 ${this.outterSize} ${this.outterSize}`}
                xmlns="http://www.w3.org/2000/svg" version="1.1">
                <defs>
                    {this.props.gradient}
                </defs>
                <g transform={`translate(${this.padding},${this.padding})`}>
                    <rect x={this.barOffsetX} y="0"
                        width="20" height={this.innerSize}
                        strokeWidth="20"
                        fill={`url(#${this.props.type})`} />
                    <g ref={(selector) => { this.selector = selector; }}>
                        <rect x={this.barOffsetX - 10} y={this.innerSize * (1 - this.props.value / 100) - 25 / 2}
                            width="40" height="25"
                            strokeWidth="20"
                            fill={this.state.dragging ? `hsl(${this.props.hue}, ${this.props.saturation}%, ${this.props.lightness}%)` : "white"} />
                    </g>
                    <text
                        x="40"
                        y="75"
                        textAnchor="middle"
                        fill={`hsl(${this.props.hue}, ${this.props.saturation}%, ${this.props.lightness}%)`}
                        stroke={`hsl(${this.props.hue}, ${this.props.saturation}%, ${this.props.lightness}%)`}>
                        {this.props.value}%
                    </text>
                    <text
                        className="label"
                        x="40"
                        y="110"
                        textAnchor="middle"
                        fill={`hsl(${this.props.hue}, ${this.props.saturation}%, ${this.props.lightness}%)`}
                        stroke={`hsl(${this.props.hue}, ${this.props.saturation}%, ${this.props.lightness}%)`}>
                        {this.props.type}
                    </text>
                </g>
            </svg>

        );
    }

    componentDidMount() {
        // Event handling using Reactive JS
        let mouseDowns = Rx.Observable.fromEvent(this.selector, "mousedown");
        let mouseMoves = Rx.Observable.fromEvent(this.canvas, "mousemove");
        let mouseUps = Rx.Observable.fromEvent(this.canvas, "mouseup");
        let mouseLeaves = Rx.Observable.fromEvent(this.canvas, "mouseleave");

        let touchStarts = Rx.Observable.fromEvent(this.selector, "touchstart");
        let touchMoves = Rx.Observable.fromEvent(this.selector, "touchmove");
        let touchEnds = Rx.Observable.fromEvent(this.canvas, "touchend");

        let mouseDrags = mouseDowns.concatMap(clickEvent => {
            const yMouseShouldBe = (1 - this.props.value / 100) * this.innerSize;
            const yMouseIs = clickEvent.clientY;
            const yMouseDelta = yMouseIs - yMouseShouldBe;
            return mouseMoves.takeUntil(mouseUps.merge(mouseLeaves)).map(moveEvent => {
                const y = moveEvent.clientY - yMouseDelta;
                let percentage = (1 - y / this.innerSize) * 100;
                percentage = Math.min(percentage, 100);
                percentage = Math.max(percentage, 0);
                return parseInt(percentage, 10);
            })
        });

        let touchDrags = touchStarts.concatMap(startEvent => {
            startEvent.preventDefault();
            const yTouchShouldBe = (1 - this.props.value / 100) * this.innerSize;
            const yTouchIs = startEvent.touches[0].clientY;
            const yTouchDelta = yTouchIs - yTouchShouldBe;
            return touchMoves.takeUntil(touchEnds).map(moveEvent => {
                moveEvent.preventDefault();
                const y = moveEvent.touches[0].clientY - yTouchDelta;
                let percentage = (1 - y / this.innerSize) * 100;
                percentage = Math.min(percentage, 100);
                percentage = Math.max(percentage, 0);
                return parseInt(percentage, 10);
            })
        });

        let dragStarts = mouseDowns.merge(touchStarts);
        let drags = mouseDrags.merge(touchDrags);
        let dragEnds = mouseUps.merge(mouseLeaves).merge(touchEnds);

        dragStarts.forEach(() => {
            this.setState({ dragging: true });
        });

        drags.forEach(percentage => {
            this.props.set(percentage);
        });

        dragEnds.forEach(() => {
            this.setState({ dragging: false });
        });
    }
}

export default Percentage;