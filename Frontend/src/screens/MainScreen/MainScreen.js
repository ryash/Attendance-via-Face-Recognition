import React, { Component } from 'react';
import UserScreen from '../UserScreen/UserScreen.js';
import AdminScreen from '../AdminScreen/AdminScreen.js';


export default class MainScreen extends Component {
    render() {
        return (
            this.props.currentState.mode === 'user' ?
            <UserScreen changeState={this.props.changeState} currentState={this.props.currentState}/> :
            <AdminScreen changeState={this.props.changeState} currentState={this.props.currentState}/>
        );
    }
}
