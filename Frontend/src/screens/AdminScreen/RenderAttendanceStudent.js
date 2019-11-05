import React, { Component } from 'react';
import {
    ScrollView,
    View,
    ActivityIndicator,
    BackHandler,
} from 'react-native';

import {Button, Text} from 'react-native-elements';
import { makeCancelablePromise } from '../../../Constants.js';
import {AppContext} from '../../../Contexts.js';

export default class RenderAttendanceStudent extends Component {

  static contextType = AppContext;

  constructor(props){

    super(props);

    this.state = {
      isLoading: true,
      hasError: false,
      errorMessage: '',
      attendenceData: [],
    };

    this.promises = [];

    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
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
    if (list.length === 0){
      return (<Text> No Attendeance Data! </Text>);
    }
    return (<ScrollView style={{padding: 20}}>
      {
        <View style={{flex: 1, alignSelf: 'stretch', flexDirection: 'row' }}>
          {
            Object.getOwnPropertyNames(list[0]).map((val, ind) => {
              return (<Text key={val}>
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
        title="Back"
      />
    </ScrollView>);
  }

  renderRow(row, key) {
    return (<View key={key} style={{flex: 1, alignSelf: 'stretch', flexDirection: 'row' }}>
        {
          Object.getOwnPropertyNames(row).map((val) => {
            return (<Text key={row[val]}>
              {row[val]}
            </Text>);
          })
        }
      </View>);
  }

  render() {

    let attendenceData = [], attKeys = [];

    if (!this.state.isLoading && !this.state.hasError && this.state.attendenceData.length > 0){
      attendenceData = this.state.attendenceData;

      attKeys = attendenceData.map((obj)=>{
        return obj.Date;
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
      this.renderAttendenceList(attendenceData, attKeys)
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
