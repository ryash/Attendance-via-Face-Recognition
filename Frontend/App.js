/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';

import LoginScreen from './src/screens/LogInScreen/LoginScreen.js';
import MainScreen from './src/screens/MainScreen/MainScreen.js';

class App extends PureComponent {
  constructor() {
    super();

    this.state = {
      isLoggedIn: false,
      mode: 'anonymous',
    };

    this.changeAppState = this.changeAppState.bind(this);
  }

  changeAppState(newstate) {
    this.setState(newstate);
  }

  render() {
    if (this.state.isLoggedIn) {
      return (
        <MainScreen
          changeState={this.changeAppState}
          currentState={this.state}
        />
      );
    } else {
      return (
        <LoginScreen
          changeState={this.changeAppState}
          currentState={this.state}
        />
      );
    }
  }
}

export default App;
