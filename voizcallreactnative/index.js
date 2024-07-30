/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { Provider, connect } from 'react-redux';
import store from './src/store/store';


const appRedux = () => (
    <Provider store={store}>
      <App />
    </Provider>
  )

AppRegistry.registerComponent(appName, () => appRedux);
