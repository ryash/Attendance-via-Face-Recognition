import React, { Component } from 'react';
import {
  ScrollView,
  View,
} from 'react-native';

import {Button} from 'react-native-elements';

import AddCourse from './AddCourse.js';
import {AppContext} from '../../../Contexts.js';
import {modes} from '../../../Constants.js';
import Storage from '../../storage/Storage.js';
import MyCourses from './MyCourses.js';
import AddFaculty from './AddFaculty.js';

/**
 * This class is the UI component for the screen shown to the Faculties when they log in.
 * This component applies to the faculties.
 */
export default class AdminScreen extends Component {

  /**
   * Getting the current nearest context to get the data from.
   * This context will have id and token of the faculty to authenticate him on the server
   * along with other useful information.
   */
  static contextType = AppContext;

  constructor(props){

      super(props);

      /**
       * The state of the Admin Screen component.
       * The description of different states is as follows:
       * addNewCourse: If set to true, presentational component for adding a new course(AddCourse) is rendered.
       * openMyCourses: If set to true, presentational component for seeing all their courses(MyCourses) is rendered.
       * addFaculty: If set to true, presentational component for adding new Faculty(AddFaculty) is rendered.
       * hasError: flag dictating if there is any error.
       * errorMessage: the error description if there is any error.
       */
      this.state = {
          addNewCourse: false,
          openMyCourses: false,
          addFaculty: false,
          hasError: false,
          errorMessage: '',
      };

      // Binding all the functions to current context so that they can be called
      // from the context of other components as well.
      this.onLogoutPress = this.onLogoutPress.bind(this);
      this.goBack = this.goBack.bind(this);
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  /**
   * The handler which is called when the faculty opts to logout.
   */
  onLogoutPress(){
    Storage.removeItem('admin:id').then(() => {
      return Storage.removeItem('admin:token');
    }).then(() => {
      this.context.changeAppState({
        isLoggedIn: false,
        mode: modes.ANONYMOUS,
        id: '',
        token: '',
      });
    }).catch((err) => {

      console.log('Log out Error: ' + err.message);

      this.setState({
        hasError: true,
        errorMessage: 'Failed to log out',
      });

    });
  }

  /**
   * The function which is passed to other components which they can call to return back to this component.
   */
  goBack(){
    this.setState({
      addNewCourse: false,
      openMyCourses: false,
      addFaculty: false,
    });
  }

  /**
   * The handler which is called when user hits back button on his device.
   */
  handleBackButtonClick(){
    this.goBack();
    return true;
  }

  render() {
    let courseUrl = this.context.domain + '/api/service/course/' + this.context.id;
      return (
        this.state.addNewCourse ?
          <AddCourse goBack={this.goBack}/> :
          this.state.openMyCourses ?
          <MyCourses
            url={courseUrl}
            goBack={this.goBack}
            handleBackButtonClick={this.handleBackButtonClick}
          /> :
          this.state.addFaculty ?
          <AddFaculty
            goBack={this.goBack}
          /> :
          <ScrollView style={{padding: 20}}>
          <Button
            onPress={() => this.setState({openMyCourses: true})}
            title="My Courses"
            icon={{type: 'antdesign', name: 'right', iconStyle: {left: '525%'}}}
            type="outline"
            iconRight
            titleStyle={{left: '-470%'}}
          />
          <View style={{margin: 7}} />
          <Button
            onPress = {()=>{this.setState({addNewCourse: true});}}
            title="Add New Course"
            icon={{type: 'antdesign', name: 'right', iconStyle: {left: '450%'}}}
            type="outline"
            iconRight
            titleStyle={{left: '-400%'}}
          />
          <View style={{margin: 7}} />
          <Button
            onPress={() => this.setState({addFaculty: true})}
            title="Add New Faculty"
            icon={{type: 'antdesign', name: 'right', iconStyle: {left: '450%'}}}
            type="outline"
            iconRight
            titleStyle={{left: '-400%'}}
          />
          <View style={{margin: 7}} />
          <Button
            onPress={() => this.onLogoutPress()}
            title="Logout"
            icon={{type: 'antdesign', name: 'logout', iconStyle: {left: '560%'}}}
            type="outline"
            iconRight
            titleStyle={{left: '-540%'}}
          />
          </ScrollView>
      );
  }
}
