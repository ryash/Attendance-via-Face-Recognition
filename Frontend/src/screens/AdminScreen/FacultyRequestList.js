import React, { Component } from 'react';
import {
  BackHandler,
} from 'react-native';

import FacultyRequest from './FacultyRequest.js';

export default class FacultyRequestList extends Component{

    constructor(props){
        super(props);

        this.state = {
            isLoading: true,
            hasError: false,
            errorMessage: '',
            facultyList: [],
        };
    }

    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.props.handleBackButtonClick);

        fetch(this.props.url, {
            headers: {
                'Authorization': 'Bearer ' + this.props.currentState.token,
            },
            method: 'GET',
        }).then(async (body) => {
            if (body.status === 200){
                return body.json();
            }

            let {error} = await body.json();

            return Promise.reject(new Error(error.message));

        }).then(body => {
            this.setState({
                isLoading: false,
                facultyList: body,
            });
        }).catch(async error => {
            this.setState({
                hasError: true,
                errorMessage: error.message,
                isLoading: false,
            });
        });

    }

    render(){

        let approvalUrl = '';

        return this.state.facultyList.map(faculty => {
            return (
                <FacultyRequest
                    currentState={this.props.currentState}
                    url={approvalUrl}
                    faculty={faculty}
                />
            );
        });
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.props.handleBackButtonClick);
    }
}
