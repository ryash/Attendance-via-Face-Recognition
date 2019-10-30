/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {PureComponent} from 'react';
import {ScrollView, View, Text, Button} from 'react-native';

import UserLoginScreen from './src/screens/LogInScreen/UserLoginScreen.js';
import AdminLoginScreen from './src/screens/LogInScreen/AdminLoginScreen.js';
import AdminSignUpScreen from './src/screens/SignUpScreen/AdminSignUpScreen.js';
import MainScreen from './src/screens/MainScreen/MainScreen.js';
import UserSignUpScreen from './src/screens/SignUpScreen/UserSignUpScreen.js';

class App extends PureComponent {
  constructor() {
    super();

    this.state = {
      isLoggedIn: false,
      mode: 'anonymous',
      id: '',
      token: '',
      openAdminPages: false,
      openUserSignUpPage: false,
      openAdminSignUpPage: false,
      modeChosen: false,
    };

    this.changeAppState = this.changeAppState.bind(this);
    this.toggleAdminRegisterPage = this.toggleAdminRegisterPage.bind(this);
    this.toggleUserRegisterPage = this.toggleUserRegisterPage.bind(this);
  }

  toggleAdminRegisterPage() {
    this.setState({openAdminSignUpPage: !this.state.openAdminSignUpPage});
  }

  toggleUserRegisterPage() {
    this.setState({openUserSignUpPage: !this.state.openUserSignUpPage});
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
      if (this.state.modeChosen) {
        if (!this.state.openAdminPages) {
          if (this.state.openUserSignUpPage) {
            return (
              <UserSignUpScreen
                changeState={this.changeAppState}
                currentState={this.state}
                toggleRegisterPage={this.toggleUserRegisterPage}
              />
            );
          } else {
            return (
              <UserLoginScreen
                changeState={this.changeAppState}
                currentState={this.state}
                toggleRegisterPage={this.toggleUserRegisterPage}
              />
            );
          }
        } else {
          if (this.state.openAdminSignUpPage) {
            return (
              <AdminSignUpScreen
                changeState={this.changeAppState}
                currentState={this.state}
                toggleRegisterPage={this.toggleAdminRegisterPage}
              />
            );
          } else {
            return (
              <AdminLoginScreen
                changeState={this.changeAppState}
                currentState={this.state}
                toggleRegisterPage={this.toggleAdminRegisterPage}
              />
            );
          }
        }
      } else {
        return (
          <ScrollView>
            <View>
              <Button
                title="Login As User"
                onPress={() => {
                  this.setState({
                    modeChosen: true,
                    openUserSignUpPage: false,
                    openAdminPages: false,
                  });
                }}
              />
              <View style={{margin: 9}} />
              <Button
                title="Register As User"
                onPress={() => {
                  this.setState({
                    modeChosen: true,
                    openUserSignUpPage: true,
                    openAdminPages: false,
                  });
                }}
              />
              <View style={{margin: 9}} />
              <Button
                title="Login As Admin"
                onPress={() => {
                  this.setState({
                    modeChosen: true,
                    openAdminSignUpPage: false,
                    openAdminPages: true,
                  });
                }}
              />
              <View style={{margin: 9}} />
              <Button
                title="Register As Admin"
                onPress={() => {
                  this.setState({
                    modeChosen: true,
                    openAdminSignUpPage: true,
                    openAdminPages: true,
                  });
                }}
              />
            </View>
          </ScrollView>
        );
      }
    }
  }
}

export default App;
