import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Button,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import AddCourse from './AddCourse.js';
import RenderAttendance from './RenderAttendance.js';
import TakeAttendance from './TakeAttendance.js';
import FacultyRequestList from './FacultyRequestList.js';

export default class AdminScreen extends Component {
    constructor(){
        super();
        this.state = {
            renderAttendence: false,
            addNewCourse: false,
            openCourseRequests: false,
            takeAttendance: false,
            showFacultyRequests: false,
        };

        this.goToMainScreen = this.goToMainScreen.bind(this);
        this.onLogoutPress = this.onLogoutPress.bind(this);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.showFacultyRequests = this.showFacultyRequests.bind(this);
    }

    showFacultyRequests(){
      this.setState({
        showFacultyRequests: true,
      });
    }

    onLogoutPress(){
      this.props.changeState({
          isLoggedIn: false,
          mode: 'anonymous',
      });
    }

    goToMainScreen(){
      this.setState({
        renderAttendence: false,
        addNewCourse: false,
        openCourseRequests: false,
        takeAttendance: false,
        showFacultyRequests: false,
      });
    }

    handleBackButtonClick(){
      this.goToMainScreen();
      return true;
    }

    render() {
      let courseUrl = 'http://10.8.15.214:8081/api/service/course/' + this.props.currentState.id;
      let requestsUrl = 'http://10.8.15.214:8081/api/service/course/' + this.props.currentState.id;
        return (
          this.state.addNewCourse ?
           <AddCourse goToMainScreen={this.goToMainScreen} currentState={this.props.currentState}/> :
           this.state.takeAttendance ?
           <TakeAttendance
              goToMainScreen={this.goToMainScreen}
              currentState={this.props.currentState}
              handleBackButtonClick={this.handleBackButtonClick}
              url={courseUrl}
           />
            : this.state.renderAttendence ?
              <RenderAttendance
                goToMainScreen={this.goToMainScreen}
                currentState={this.props.currentState}
                handleBackButtonClick={this.handleBackButtonClick}
                url={courseUrl}
              />
              : this.state.showFacultyRequests ?
              <FacultyRequestList
                goToMainScreen={this.goToMainScreen}
                currentState={this.props.currentState}
                handleBackButtonClick={this.handleBackButtonClick}
                url={requestsUrl}
              />
            : <ScrollView style={{padding: 20}}>
            <Button
                onPress={() => this.setState({takeAttendance: true})}
                title="Take Attendance"
            />
            <View style={{margin:20}} />
            <Button
                onPress={() => this.setState({renderAttendence: true})}
                title="See Attendence Records"
            />
            <View style={{margin:20}} />
            <Button
              onPress = {()=>{this.setState({addNewCourse: true});}}
              title="Add New Course"
            />
            {/* <View style={{margin:20}} />
            <Button
              onPress={()=>{this.setState({openCourseRequests: true});}}
              title="Course Requests"
            /> */}
            <View style={{margin:20}} />
            <Button
                onPress={() => this.showFacultyRequests()}
                title="New Faculty Requests"
            />
            <View style={{margin:20}} />
            <Button
                onPress={() => this.onLogoutPress()}
                title="Logout"
            />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});
