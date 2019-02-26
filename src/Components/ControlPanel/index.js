import React from 'react';
import { createStore } from 'redux';
import { connect } from 'react-redux';

import Hue from './../Hue/index';
import Percentage from './../Percentage/index';


const Container = ({ hue, saturation, lightness, red, green, blue, hex, thickness, setHue, setSaturation, setLightness, setThickness }) => {
    return <div id='container'>
        <Hue hue={hue} saturation={saturation} lightness={lightness} setHue={setHue} />
        <Saturation hue={hue} saturation={saturation} lightness={lightness} setSaturation={setSaturation} />
        <Lightness hue={hue} saturation={saturation} lightness={lightness} setLightness={setLightness} />
        <Thickness hue={hue} saturation={saturation} lightness={lightness} thickness={thickness} setThickness={setThickness} />
        <div id='footer'>
            <div>
                {`hsl(${hue}, ${saturation}%, ${lightness}%), thickness: ${thickness}%`}
            </div>
            <div>
                {`rgb(${red}, ${green}, ${blue})`}
            </div>
            <div>
                {hex}
            </div>
        </div>
    </div>;
}

const Saturation = ({ hue, saturation, lightness, setSaturation }) => {
    const gradient = <linearGradient id="Saturation" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor={`hsl(${hue}, 100%, ${lightness}%)`} />
        <stop offset="100%" stopColor={`hsl(${hue}, 0%, ${lightness}%)`} />
    </linearGradient>;
    return <Percentage
        type="Saturation" value={saturation} gradient={gradient}
        hue={hue} saturation={saturation} lightness={lightness}
        set={setSaturation} />
}

const Lightness = ({ hue, saturation, lightness, setLightness }) => {
    const gradient = <linearGradient id="Lightness" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor={`hsl(${hue}, ${saturation}%, 100%)`} />
        <stop offset="50%" stopColor={`hsl(${hue}, ${saturation}%, 50%)`} />
        <stop offset="100%" stopColor={`hsl(${hue}, ${saturation}%, 0%)`} />
    </linearGradient>;
    return <Percentage
        type="Lightness" value={lightness} gradient={gradient}
        hue={hue} saturation={saturation} lightness={lightness}
        set={setLightness} />
}

const Thickness = ({ hue, saturation, lightness, thickness, setThickness }) => {
    const gradient = <linearGradient id="Thickness" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor={`hsl(${hue}, ${saturation}%, ${lightness}%)`} />
        <stop offset="100%" stopColor={`hsl(${hue}, ${saturation}%, ${lightness}%)`} />
    </linearGradient>;
    return <Percentage
        type="Thickness" value={thickness} gradient={gradient}
        hue={hue} saturation={saturation} lightness={lightness} thickness={thickness}
        set={setThickness} />
}

const initialState = {
    hue: 169,
    saturation: 100,
    lightness: 53,
    thickness: 50,
    red: 15,
    green: 255,
    blue: 211,
    hex: "#0FFFD3"
};

const hsl2rgb = (hue, saturation, lightness) => {
    saturation /= 100;
    lightness /= 100;
    const C = (1 - Math.abs(2 * lightness - 1)) * saturation;
    const X = C * (1 - Math.abs((hue / 60) % 2 - 1));
    const m = lightness - C / 2;
    let [R, G, B] =
        (0 <= hue && hue < 60 && [C, X, 0]) ||
        (60 <= hue && hue < 120 && [X, C, 0]) ||
        (120 <= hue && hue < 180 && [0, C, X]) ||
        (180 <= hue && hue < 240 && [0, X, C]) ||
        (240 <= hue && hue < 300 && [X, 0, C]) ||
        (300 <= hue && hue < 360 && [C, 0, X]);
    [R, G, B] = [(R + m) * 255, (G + m) * 255, (B + m) * 255];
    return [Math.round(R), Math.round(G), Math.round(B)];
}

const rgb2hex = (red, green, blue) => {
    red = red.toString(16).toUpperCase();
    green = green.toString(16).toUpperCase();
    blue = blue.toString(16).toUpperCase();
    red = red.length === 1 ? "0" + red : red;
    green = green.length === 1 ? "0" + green : green;
    blue = blue.length === 1 ? "0" + blue : blue;
    return `#${red}${green}${blue}`;
}

const mainReducer = (state = initialState, action) => {
    let red;
    let green;
    let blue;
    let hex;
    switch (action.type) {
        case 'HUE':
            [red, green, blue] = hsl2rgb(action.value, state.saturation, state.lightness);
            hex = rgb2hex(red, green, blue);
            return Object.assign({}, state, { hue: action.value, red, green, blue, hex });
        case 'SATURATION':
            [red, green, blue] = hsl2rgb(state.hue, action.value, state.lightness);
            hex = rgb2hex(red, green, blue);
            return Object.assign({}, state, { saturation: action.value, red, green, blue, hex });
        case 'LIGHTNESS':
            [red, green, blue] = hsl2rgb(state.hue, state.saturation, action.value);
            hex = rgb2hex(red, green, blue);
            return Object.assign({}, state, { lightness: action.value, red, green, blue, hex });
        case 'THICKNESS':
            [red, green, blue] = hsl2rgb(state.hue, state.saturation, state.lightness);
            hex = rgb2hex(red, green, blue);
            return Object.assign({}, state, { thickness: action.value, red, green, blue, hex });
        default:
            return state;
    }
};


export const store = createStore(mainReducer);

const mapStateToProps = (state, ownProps) => {
    return {
        hue: state.hue,
        saturation: state.saturation,
        lightness: state.lightness,
        thickness: state.thickness,
        red: state.red,
        green: state.green,
        blue: state.blue,
        hex: state.hex
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        setHue: (value) => {
            dispatch({
                type: 'HUE',
                value
            })
        },
        setSaturation: (value) => {
            dispatch({
                type: 'SATURATION',
                value
            })
        },
        setLightness: (value) => {
            dispatch({
                type: 'LIGHTNESS',
                value
            })
        },
        setThickness: (value) => {
            dispatch({
                type: 'THICKNESS',
                value
            })
        }
    }
}

export const ConnectedContainer = connect(mapStateToProps, mapDispatchToProps)(Container);

