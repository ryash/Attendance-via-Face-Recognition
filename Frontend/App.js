/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

// Library Component Imports
import React, {PureComponent} from 'react';
import {ActivityIndicator} from 'react-native';

// Application Component Imports
import EntryScreen from './EntryScreen.js';
import UserLoginScreen from './src/screens/LogInScreen/UserLoginScreen.js';
import AdminLoginScreen from './src/screens/LogInScreen/AdminLoginScreen.js';
import MainScreen from './src/screens/MainScreen/MainScreen.js';
import UserSignUpScreen from './src/screens/SignUpScreen/UserSignUpScreen.js';

// Asset Imports
import {AppContext} from './Contexts.js';
import {modes, makeCancelablePromise} from './Constants.js';
import Storage from './src/storage/Storage.js';

/**
 * Main Application Component
 */
class App extends PureComponent {
  constructor(props) {
    super(props);

    this.changeAppState = state => {
      this.setState(state);
    };

    this.state = {
      isLoggedIn: false,
      isDomainSet: false,
      mode: modes.ANONYMOUS,
      id: '',
      token: '',
      openAdminPages: true,
      openSignUpPage: false,
      changeAppState: this.changeAppState,
      domain: '',
      isLoading: true,
    };

    // Array of all the async tasks(promises).
    this.promises = [];

    this.changeAppState = this.changeAppState.bind(this);
  }

  render() {
    if (this.state.isLoading) {
      return <ActivityIndicator size={50} style={{alignContent: 'center'}} />;
    } else {
      if (this.state.isDomainSet) {
        if (this.state.isLoggedIn) {
          return (
            <AppContext.Provider value={this.state}>
              <MainScreen />
            </AppContext.Provider>
          );
        } else {
          if (this.state.openSignUpPage && !this.state.openAdminPages) {
            return (
              <AppContext.Provider value={this.state}>
                <UserSignUpScreen />
              </AppContext.Provider>
            );
          } else if (!this.state.openAdminPages) {
            return (
              <AppContext.Provider value={this.state}>
                <UserLoginScreen />
              </AppContext.Provider>
            );
          } else {
            return (
              <AppContext.Provider value={this.state}>
                <AdminLoginScreen />
              </AppContext.Provider>
            );
          }
        }
      } else {
        return (
          <AppContext.Provider value={this.state}>
            <EntryScreen />
          </AppContext.Provider>
        );
      }
    }
  }

  componentDidMount() {
    let prm = makeCancelablePromise(Storage.getItem('domain'));
    prm.promise
      .then(async domain => {
        if (domain) {
          try {
            this.setState({domain, isDomainSet: true, isLoading: false});
            let pm2 = makeCancelablePromise(Storage.getItem('user:id'));
            this.promises.push(pm2);
            let id = await pm2.promise;
            if (id) {
              let pm3 = makeCancelablePromise(Storage.getItem('user:token'));
              this.promises.push(pm3);
              let token = await pm3.promise;
              if (token) {
                this.setState({
                  id,
                  token,
                  isLoggedIn: true,
                  mode: modes.USER,
                });
              } else {
                let err = new Error('No student logged in');
                err.isCanceled = false;
                throw err;
              }
            } else {
              let err = new Error('No student logged in');
              err.isCanceled = false;
              throw err;
            }
          } catch (error) {
            if (!error.isCanceled) {
              error.isCanceled = false;
              return Promise.reject(error);
            }
          }
        } else {
          this.setState({
            isLoading: false,
          });
          let err = new Error('Domain not set');
          err.isCanceled = false;
          return Promise.reject(err);
        }
      })
      .catch(async err => {
        if (!err.isCanceled) {
          if (this.state.domain !== '' && !this.state.isLoggedIn) {
            try {
              let pm4 = makeCancelablePromise(Storage.getItem('admin:id'));
              this.promises.push(pm4);
              let id = await pm4.promise;
              let pm5 = makeCancelablePromise(Storage.getItem('admin:token'));
              this.promises.push(pm5);
              let token = await pm5.promise;

              if (id && token) {
                this.setState({
                  id,
                  token,
                  isLoggedIn: true,
                  mode: modes.ADMIN,
                });
              } else {
                let error = new Error('No faculty logged in!');
                error.isCanceled = false;
                throw error;
              }
            } catch (er) {
              if (!er.isCanceled) {
                this.setState({isLoading: false});
                console.log('None is Logged in!');
              }
            }
          }
        }
      })
      .catch(err => {
        if (!err.isCanceled) {
          console.log(err.message);
        }
      });

    // Adding the current promise to the async tasks list(this.promises).
    this.promises.push(prm);
  }

  componentWillUnmount() {
    for (let prom of this.promises) {
      // Cancelling any pending promises on unmount.
      prom.cancel();
    }
  }
}

export default App;
