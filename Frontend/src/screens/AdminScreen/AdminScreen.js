import React, { Component } from 'react';
import {
  ScrollView,
} from 'react-native';
import {Button, Divider} from 'react-native-elements';

import AddCourse from './AddCourse.js';
import {AppContext} from '../../../Contexts.js';
import {modes} from '../../../Constants.js';
import Storage from '../../storage/Storage.js';
import MyCourses from './MyCourses.js';
import AddFaculty from './AddFaculty.js';

export default class AdminScreen extends Component {

    static contextType = AppContext;

    constructor(props){

        super(props);

        this.state = {
            addNewCourse: false,
            openMyCourses: false,
            addFaculty: false,
            hasError: false,
            errorMessage: '',
        };

        this.onLogoutPress = this.onLogoutPress.bind(this);
        this.goBack = this.goBack.bind(this);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

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

    goBack(){
      this.setState({
        addNewCourse: false,
        openMyCourses: false,
        addFaculty: false,
      });
    }

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
            />
            <Divider />
            <Button
              onPress = {()=>{this.setState({addNewCourse: true});}}
              title="Add New Course"
            />
            <Divider />
            <Button
                onPress={() => this.setState({addFaculty: true})}
                title="Add New Faculty"
            />
            <Button
                onPress={() => this.onLogoutPress()}
                title="Logout"
            />
            </ScrollView>
        );
    }
}
