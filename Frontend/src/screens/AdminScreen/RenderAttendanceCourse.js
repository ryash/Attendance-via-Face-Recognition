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
import {AppContext} from '../../../Contexts.js';
import {makeCancelablePromise} from '../../../Constants.js';

export default class RenderAttendanceCourse extends Component {

  static contextType = AppContext;

    constructor(props){

      super(props);

      this.state = {
        isLoading: true,
        hasError: false,
        errorMessage: '',
        attendenceData: [],
        renderStudentAttendance: false,
        currentRollNo: '',
      };

      this.promises = [];

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

        for (let prom of this.promises){
          // Cancel any pending promises.
          prom.cancel();
        }
    }

    handleBackButtonClick(){
        this.props.goBack();
        return true;
    }

    renderAttendenceList(list, keys){
      if  (list.length === 0){
        return (<Text> No Attendance Data! </Text>);
      }
      return (<ScrollView style={{padding: 20}}>
        {
          <View style={{flex: 1, alignSelf: 'stretch', flexDirection: 'row' }}>
          {
            Object.getOwnPropertyNames(list[0]).map((val, ind) => {
              return (<Text key={ind}>
                {val}
              </Text>);
            })
          }
          </View>
        }
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
      return (
          <TouchableOpacity key={key}>
            <View style={{flex: 1, alignSelf: 'stretch' , flexDirection: 'row'}}>
            {
              Object.getOwnPropertyNames(row).map((val, ind) => {
                return (<Text key={ind} onPress={()=>this.setState({renderStudentAttendance: true, currentRollNo: row.rollNo})}>
                  {row[val]}
                </Text>);
              })
            }
            </View>
          </TouchableOpacity>
        );
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
          url={this.context.domain + '/api/service/' + this.context.id + '/' + this.props.course.courseId + '/' + this.state.currentRollNo}
        /> :
        this.state.hasError ?
          <Text style={{color: 'red'}}>
            {this.state.errorMessage}
          </Text> :
        this.renderAttendenceList(attendenceData, attKeys)
      );
    }

    componentDidMount(){

      BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

      let cancFetch = makeCancelablePromise(fetch(this.context.domain + '/api/service/' + this.context.id + '/' + this.props.course.courseId + '?perc=true', {
        headers: {
          'Authorization': 'Bearer ' + this.context.token,
        },
        method: 'GET',
      }));

      cancFetch.promise.then(async res => {
        if (res.status === 200){
          return res.json();
        } else if (res.headers['Content-Type'] !== 'application/json'){
          let err = new Error('Server uses unsupported data format');
          err.isCanceled = false;
          return Promise.reject(err);
        }
        else {
          try {
            let pm = makeCancelablePromise(res.json());
            this.promises.push(pm);
            let {error} = await pm.promise;
            error.isCanceled = false;
            return Promise.reject(error);
          } catch (err){
            return Promise.reject(err);
          }
        }
      })
      .then(attData => {
        console.log(attData);
        this.setState({
          attendenceData: attData.message,
          isLoading: false,
        });
      }).catch(err => {
        console.log(err);
        if (!err.isCanceled){
          this.setState({
            isLoading: false,
            errorMessage: err.message,
          });
        }
      });

      this.promises.push(cancFetch);
    }
}
