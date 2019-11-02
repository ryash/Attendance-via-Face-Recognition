import React, { Component } from 'react';
import {
  ScrollView,
} from 'react-native';

import {Button} from 'react-native-elements';

import Storage from '../../storage/Storage.js';
import {modes} from '../../../Constants.js';
import {AppContext} from '../../../Contexts.js';

import MyCourses from './MyCourses.js';

export default class AdminScreen extends Component {

  static contextType = AppContext;

  constructor(){

    super();

    this.state = {
      renderCourses: false,
      hasError: false,
      errorMessage: '',
    };

    this.goBack = this.goBack.bind(this);
    this.onLogoutPress = this.onLogoutPress.bind(this);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

  }

  handleBackButtonClick(){
    this.goBack();
    return true;
  }

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
