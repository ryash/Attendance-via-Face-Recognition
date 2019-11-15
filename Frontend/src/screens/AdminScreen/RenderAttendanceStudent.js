import React, { Component } from 'react';
import {
    ScrollView,
    View,
    ActivityIndicator,
    BackHandler,
    StyleSheet,
} from 'react-native';

import {Text} from 'react-native-elements';
import { makeCancelablePromise } from '../../../Constants.js';
import {AppContext} from '../../../Contexts.js';
import { Table, Row } from 'react-native-table-component';

/**
 * UI Component to show the attendance record of a student in a particular course.
 * This component applies to the faculties/students.
 */
export default class RenderAttendanceStudent extends Component {

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
    };

    // Keeps the list of all the asynchronous task,
    // which may potentially change the component state after completion.
    this.promises = [];

    // Binding all the functions to current context so that they can be called
    // from the context of other components as well.
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
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

    let attendenceData = [], attHeader = [], attendenceDataArray = [], attWidthArray = [];

    if (!this.state.isLoading && !this.state.hasError && this.state.attendenceData.length > 0){
      attendenceData = this.state.attendenceData;

      attHeader = Object.getOwnPropertyNames(attendenceData[0]);

      for (let itr = 0; itr < attHeader.length; itr++){
        attWidthArray.push(189);
      }

      attendenceDataArray = attendenceData.map((row) => {
        return Object.getOwnPropertyNames(row).map(val => row[val]);
      });

    }

    return (this.state.isLoading ?
      <ActivityIndicator /> :
      this.state.hasError ?
      <View>
        <Text>
          {this.state.errorMessage}
        </Text>
      </View> :
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

    let cancFetch = makeCancelablePromise(fetch(this.props.url, {
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
        let pm1 = makeCancelablePromise(res.json());
        this.promises.push(pm1);
        try {
          let {error} = await pm1.promise;
          error.isCanceled = false;
          return Promise.reject(error);
        } catch (err){
          return Promise.reject(err);
        }
      }
    }).then(attData => {
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
