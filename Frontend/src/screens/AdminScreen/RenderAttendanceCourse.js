import React, { Component } from 'react';
import {
    ScrollView,
    Text,
    View,
    ActivityIndicator,
    BackHandler,
    StyleSheet,
} from 'react-native';

import RenderAttendanceStudent from './RenderAttendanceStudent.js';
import {AppContext} from '../../../Contexts.js';
import {makeCancelablePromise} from '../../../Constants.js';
import { Table, Row } from 'react-native-table-component';

/**
 * UI Component to show the overview of attendance of every student enrolled in the corresponding course.
 * This component applies to the faculties.
 */
export default class RenderAttendanceCourse extends Component {

  /**
   * Getting the current nearest context to get the data from.
   * This context will have id and token of the faculty to authenticate him on the server
   * along with other useful information.
   */
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

    // Keeps the list of all the asynchronous task,
    // which may potentially change the component state after completion.
    this.promises = [];

    // Binding all the functions to current context so that they can be called
    // from the context of other components as well.
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  /**
   * The function which is passed to other components which they can call to return back to this component.
   */
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

  /**
   * Handler which is called when the user hits back button on his/her device
   */
  handleBackButtonClick(){
      this.props.goBack();
      return true;
  }

  render() {

    let attendenceData = this.state.attendenceData;

    let attHeader = [], attWidthArray = [];

    if (attendenceData.length > 0){
      attHeader = Object.getOwnPropertyNames(attendenceData[0]);
      for (let itr = 0; itr < attHeader.length; itr++){
        attWidthArray.push(94);
      }
    }

    let attendenceDataArray = attendenceData.map((row) => {
      return Object.getOwnPropertyNames(row).map(val => row[val]);
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
        attendenceData.length > 0 ?
        <View style={styles.container}>
          <ScrollView horizontal={true}>
            <View>
              <Table borderStyle={{borderColor: '#C1C0B9'}}>
                <Row data={attHeader} widthArr={attWidthArray} style={styles.header} textStyle={styles.text}/>
              </Table>
              <ScrollView style={styles.dataWrapper}>
                <Table borderStyle={{borderColor: '#C1C0B9'}}>
                  {
                    attendenceDataArray.map((rowData, index) => (
                      <Row
                        key={index}
                        data={rowData}
                        widthArr={attWidthArray}
                        style={[styles.row, index%2 && {backgroundColor: '#F7F6E7'}]}
                        textStyle={styles.text}
                        onPress={()=>this.setState({renderStudentAttendance: true, currentRollNo: rowData[0]})}
                      />
                    ))
                  }
                </Table>
              </ScrollView>
            </View>
          </ScrollView>
        </View> :
        <Text> No Attendance Data </Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  header: { height: 50, backgroundColor: '#537791' },
  text: { textAlign: 'center', fontWeight: '100' },
  dataWrapper: { marginTop: -1 },
  row: { height: 40, backgroundColor: '#E7E6E1' },
});
