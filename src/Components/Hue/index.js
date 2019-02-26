import React from 'react';
import Rx from 'rxjs/Observable';

class Hue extends React.Component {
    constructor({ hue, saturation, lightness, thickness, setHue }) {
        super({ hue, saturation, lightness, thickness, setHue });

        const padding = 60;
        const innerSize = 300;
        this.radius = innerSize / 2;
        this.outerSize = innerSize + padding;
        this.centerOffset = this.outterSize / 2;

        this.state = {
            dragging: false
        }

        this.canvas = null;
        this.selector = null;
    }

    render() {
        return (
            <svg ref={(canvas) => { this.canvas = canvas; }}
                width={this.outerSize} height={this.outerSize}
                viewBox={`0 0 ${this.outerSize} ${this.outerSize}`}
                xmlns="http://www.w3.org/2000/svg" version="1.1">

                <g transform="translate(180,180)">
                    {Array.from({ length: 360 }, (value, key) => (
                        <HueSlice
                            key={key}
                            degree={key}
                            radius={this.radius}
                            color={`hsl(${key}, ${this.props.saturation}%, ${this.props.lightness}%)`}
                            marker={false} />
                    ))}
                    <g ref={(selector) => { this.selector = selector; }} >
                        <HueSlice
                            degree={this.props.hue}
                            radius={this.radius}
                            color={this.state.dragging ? `hsl(${this.props.hue}, ${this.props.saturation}%, ${this.props.lightness}%)` : "white"}
                            marker={true} />
                    </g>
                    <text
                        x="10"
                        y="10"
                        textAnchor="middle"
                        fill={`hsl(${this.props.hue}, ${this.props.saturation}%, ${this.props.lightness}%)`}
                        stroke={`hsl(${this.props.hue}, ${this.props.saturation}%, ${this.props.lightness}%)`}>
                        {this.props.hue}°
                    </text>
                    <text
                        className="label"
                        x="0"
                        y="40"
                        textAnchor="middle"
                        fill={`hsl(${this.props.hue}, ${this.props.saturation}%, ${this.props.lightness}%)`}
                        stroke={`hsl(${this.props.hue}, ${this.props.saturation}%, ${this.props.lightness}%)`}>
                        Hue
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
            const xMouseShouldBe = Math.sin(this.props.hue / 180 * Math.PI) * this.radius;
            const yMouseShouldBe = -Math.cos(this.props.hue / 180 * Math.PI) * this.radius;
            const xMouseIs = clickEvent.clientX;
            const yMouseIs = clickEvent.clientY;
            const xMouseDelta = xMouseIs - xMouseShouldBe;
            const yMouseDelta = yMouseIs - yMouseShouldBe;
            return mouseMoves.takeUntil(mouseUps.merge(mouseLeaves)).map(moveEvent => {
                const xRelativeToCenter = moveEvent.clientX - xMouseDelta;
                const yRelativeToCenter = moveEvent.clientY - yMouseDelta;
                const degree = Math.atan(yRelativeToCenter / xRelativeToCenter) * 180 / Math.PI + 90 + (xRelativeToCenter >= 0 ? 0 : 180);
                return parseInt(degree, 10);
            })
        });

        let touchDrags = touchStarts.concatMap(startEvent => {
            startEvent.preventDefault();
            const xTouchShouldBe = Math.sin(this.props.hue / 180 * Math.PI) * this.radius;
            const yTouchShouldBe = -Math.cos(this.props.hue / 180 * Math.PI) * this.radius;
            const xTouchIs = startEvent.touches[0].clientX;
            const yTouchIs = startEvent.touches[0].clientY;
            const xTouchDelta = xTouchIs - xTouchShouldBe;
            const yTouchDelta = yTouchIs - yTouchShouldBe;
            return touchMoves.takeUntil(touchEnds).map(moveEvent => {
                moveEvent.preventDefault();
                const xRelativeToCenter = moveEvent.touches[0].clientX - xTouchDelta;
                const yRelativeToCenter = moveEvent.touches[0].clientY - yTouchDelta;
                const degree = Math.atan(yRelativeToCenter / xRelativeToCenter) * 180 / Math.PI + 90 + (xRelativeToCenter >= 0 ? 0 : 180);
                return parseInt(degree, 10);
            })
        });

        let dragStarts = mouseDowns.merge(touchStarts);
        let drags = mouseDrags.merge(touchDrags);
        let dragEnds = mouseUps.merge(mouseLeaves).merge(touchEnds);

        dragStarts.forEach(() => {
            this.setState({ dragging: true });
        });

        drags.forEach(degree => {
            this.props.setHue(degree);
        });

        dragEnds.forEach(() => {
            this.setState({ dragging: false });
        });
    }
}

const HueSlice = ({ degree, color, radius, marker }) => {
    const thickness = marker ? 5 : 1;
    const startX = Math.sin((degree - thickness) / 180 * Math.PI) * radius;
    const startY = - Math.cos((degree - thickness) / 180 * Math.PI) * radius;
    const endX = Math.sin((degree + thickness) / 180 * Math.PI) * radius;
    const endY = - Math.cos((degree + thickness) / 180 * Math.PI) * radius;
    return <path
        className={marker ? 'marker' : ''}
        d={`M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`}
        stroke={color} />
}

export default Hue;
