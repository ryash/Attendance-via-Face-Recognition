import React, { Component } from 'react';
import {
  ScrollView,
} from 'react-native';

import {Button} from 'react-native-elements';

import Storage from '../../storage/Storage.js';
import {modes} from '../../../Constants.js';
import {AppContext} from '../../../Contexts.js';

import MyCourses from './MyCourses.js';

/**
 * This class is the UI component for the screen shown to the students when they log in.
 * This component applies to the students.
 */
export default class UserScreen extends Component {

  /**
   * Getting the current nearest context to get the data from.
   * This context will have id and token of the faculty to authenticate him on the server
   * along with other useful information.
   */
  static contextType = AppContext;

  constructor(){

    super();

    this.state = {
      renderCourses: false,
      hasError: false,
      errorMessage: '',
    };

    // Binding all the functions to current context so that they can be called
    // from the context of other components as well.
    this.goBack = this.goBack.bind(this);
    this.onLogoutPress = this.onLogoutPress.bind(this);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

  }

  /**
   * The handler which is called when user hits back button on his device.
   */
  handleBackButtonClick(){
    this.goBack();
    return true;
  }

  /**
   * The handler which is called when the student opts to logout.
   */
  onLogoutPress(){
    Storage.removeItem('user:id')
      .then(() => Storage.removeItem('user:token'))
      .then(()=>{
        this.context.changeAppState({
          isLoggedIn: false,
          mode: modes.ANONYMOUS,
          id: '',
          token: '',
        });
      })
      .catch((err) => {

        console.log('Failed to Log out with Error: ' + err.message);

        this.setState({
          hasError: true,
          errorMessage: 'Failed to Log out',
        });
      });
  }

  goBack(){
    this.setState({
      renderCourses: false,
    });
  }

  render() {
    return (
    this.state.renderCourses ?
      <MyCourses
        goBack={this.goBack}
        url={this.context.domain + '/api/user/' + this.context.id}
        handleBackButtonClick={this.handleBackButtonClick}
      /> :
    <ScrollView style={{padding: 20}}>
      <Button
        title = "My Courses"
        onPress={() => {this.setState({renderCourses: true});}}
        titleStyle={{color: 'red'}}
      />
      <Button
          onPress={() => this.onLogoutPress()}
          title="Logout"
          titleStyle={{color: 'red'}}
      />
    </ScrollView>);
  }
}
