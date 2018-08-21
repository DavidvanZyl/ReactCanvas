import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import App from './App';
import { store, ConnectedContainer} from './Components/ControlPanel/index';
import { Provider } from 'react-redux';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('app'));
ReactDOM.render(
    <Provider store={store}>
        <ConnectedContainer />
    </Provider>,
    document.getElementById('controls')
);

registerServiceWorker();
