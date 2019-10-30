import React, { Component } from 'react';
import {
  TouchableOpacity,
  View,
  Button,
  ScrollView,
  Text,
} from 'react-native';

import MyCourses from './MyCourses.js';

export default class AdminScreen extends Component {

  constructor(){

    super();

    this.state = {
      renderCourses: false,
    };

    this.goBack = this.goBack.bind(this);

  }

  onLogoutPress(){
    this.props.changeState({
        isLoggedIn: false,
        mode: 'anonymous',
    });
  }

  goBack(){
    this.setState({
      renderCourses: false,
    });
  }

  render() {
    return (<ScrollView style={{padding: 20}}>
      {this.state.renderCourses ?
      <MyCourses
        goBack={this.goBack}
        url={'http://10.8.15.214:8081/api/user/' + this.props.currentState.id}
        currentState={this.props.currentState}
      /> :
      <TouchableOpacity onPress={() => {this.setState({renderCourses: true});}}>
        <View>
          <Text>
            See Attendance
          </Text>
        </View>
      </TouchableOpacity>}
      <View style={{margin:20}} />
        <Button
            onPress={() => this.onLogoutPress()}
            title="Logout"
        />
    </ScrollView>);
  }
}
