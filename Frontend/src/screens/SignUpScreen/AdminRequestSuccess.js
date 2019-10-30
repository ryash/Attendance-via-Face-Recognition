import React, { Component } from 'react';
import {
    ScrollView,
    Text,
    TextInput,
    View,
    Button,
    BackHandler,
} from 'react-native';

export default class AdminRequestSucces extends Component{

    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.props.goBack);
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.props.goBack);
    }

    render(){
        return (<Text> Your request has been sent succesfully </Text>);
    }
}
