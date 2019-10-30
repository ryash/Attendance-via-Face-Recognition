import React, { Component } from 'react';
import {
    ScrollView,
    Text,
    View,
    Button,
    TouchableOpacity,
    ActivityIndicator,
    BackHandler,
} from 'react-native';

import RenderAttendanceStudent from './RenderAttendanceStudent.js';

export default class RenderAttendanceCourse extends Component {

    constructor(){
      super();
      this.state = {
        isLoading: true,
        hasError: false,
        errorMessage: '',
        attendenceData: [],
        renderStudentAttendance: false,
        currentRollNo: '',
      };

      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.goBack = this.goBack.bind(this);
    }

    goBack(){
      this.setState({
        renderStudentAttendance: false,
      });
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick(){
        this.props.goBack();
        return true;
    }

    renderAttendenceList(list, keys){
      return (<ScrollView style={{padding: 20}}>
        {
          list.map((element, ind) => {
            return this.renderRow(element, keys[ind]);
          })
        }
        <Button
          onPress={() => this.props.goBack()}
          title="Go Back"
        />
      </ScrollView>);
    }

    renderRow(row, key) {
      return (<>
        {
          Object.getOwnPropertyNames(row).map((val, ind) => {
            return (<Text key={ind}>
              {val}
            </Text>);
          })
        }
        <TouchableOpacity key={key} style={{flex: 1, alignSelf: 'stretch', flexDirection: 'row' }}>
          <View onPress={()=>this.setState({renderStudentAttendance: true, currentRollNo: row.RollNo})}>
          {
            Object.getOwnPropertyNames(row).map((val, ind) => {
              return (<Text key={ind}>
                {row[val]}
              </Text>);
            })
          }
          </View>
        </TouchableOpacity>
      </>);
    }

    render() {

      let attendenceData = this.state.attendenceData;

      let attKeys = attendenceData.map((obj)=>{
        return obj.rollNo;
      });

      return (this.state.isLoading ?
        <ActivityIndicator /> :
        this.state.renderStudentAttendance ?
        <RenderAttendanceStudent
          goBack={this.goBack}
          url={'http://10.8.15.214:8081/api/service/' + this.props.currentState.id + '/' + this.props.course + '/' + this.state.currentRollNo}
          currentState={this.props.currentState}
        /> :
        this.state.hasError ?
        <View>
          <Text>
            {this.state.errorMessage}
          </Text>
        </View> :
        this.renderAttendenceList(attendenceData, attKeys)
      );
    }

    componentDidMount(){

      BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

      fetch('http://10.8.15.214:8081/api/service/' + this.props.currentState.id + '/' + this.props.course + '?perc=true', {
        headers: {
          'Authorization': 'Bearer ' + this.props.currentState.token,
        },
        method: 'GET',
      }).then(async res => {
        if (res.status === 200){
          return res.json();
        }
        else {
          let {error} = await res.json();
          return Promise.reject(new Error(error.message));
        }
      }).then(attData => {
        this.setState({
          attendenceData: attData,
          isLoading: false,
        });
      }).catch(err => {
        this.setState({
          isLoading: false,
          errorMessage: err.message,
        });
      });
    }
}

let styles = {
    switchLoginMode: {
        fontSize: 16,
        color: 'blue',
        textAlign: 'right',
        textDecorationLine: 'underline',
        textDecorationStyle: 'solid',
    },
    verticalRightLayout:{
        flexDirection: 'column',
    },
};
