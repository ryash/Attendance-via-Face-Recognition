import React, { Component } from 'react';
import {
    ScrollView,
    BackHandler,
    Alert,
} from 'react-native';

import { Input, Button, Divider, Text } from 'react-native-elements';

import {AppContext} from '../../../Contexts.js';
import { makeCancelablePromise } from '../../../Constants.js';

export default class AddCourse extends Component {

    static contextType = AppContext;

    constructor(props){

        super(props);

        this.state = {
            CourseCode: {
                hasError: false,
                errorMessage: '',
                value: '',
            },
            CourseName: {
                hasError: false,
                errorMessage: '',
                value: '',
            },
            hasError: false,
            isLoading: false,
            errorMessage: '',
        };

        this.promises = [];

        this.validate = this.validate.bind(this);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.addCourse = this.addCourse.bind(this);
    }

    validate(){
        let isValid = true;

        if (this.state.CourseCode.value.length === 0){
            this.setState({
                CourseCode:{
                    hasError: true,
                    errorMessage: 'This field cannot be empty',
                },
            });

            isValid = false;
        }
        if (this.state.CourseName.value.length === 0){
            this.setState({
                CourseName:{
                    hasError: true,
                    errorMessage: 'This field cannot be empty',
                },
            });

            isValid = false;
        }

        return isValid;
    }

    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
        for (let prom of this.promises){
            // Canceling any pending promises
            prom.cancel();
        }
    }

    handleBackButtonClick(){
        this.props.goBack();
        return true;
    }

    addCourse(){
        if (this.validate()){
            this.setState({isLoading: true}, () => {
                let cancFetch = makeCancelablePromise(fetch(this.context.domain + '/api/service/course/' + this.context.id, {
                    headers: {
                        'Authorization': 'Bearer ' + this.context.token,
                        'Content-Type': 'application/json',
                    },
                    body : JSON.stringify({
                        courseId: this.state.CourseCode.value,
                        courseName: this.state.CourseName.value,
                    }),
                    method: 'POST',
                }));

                cancFetch.promise.then(async res => {
                    if (res.status === 200){
                        return res.json();
                    }
                    else {
                        try {
                            let pm = makeCancelablePromise(res.json());
                            this.promises.push(pm);
                            let {error} = await pm.promise;
                            error.isCanceled = false;
                            return Promise.reject(error);
                        } catch (er){
                            return Promise.reject(er);
                        }
                    }
                }).then(bdy => {
                    Alert.alert('Notification',
                    'Course has been successfully added',
                    [
                        {
                            text: 'OK', onPress: () =>{
                                this.props.goBack();
                            },
                        },
                    ]
                    );
                }).catch(err => {
                    if (!this.isCanceled){
                        this.setState({
                            hasError: true,
                            errorMessage: err.errorMessage,
                            isLoading: false,
                        });
                    }
                });

                this.promises.push(cancFetch);
            });
        }
    }

    render() {
        return (
            <ScrollView style={{padding: 20}}>
                {this.state.hasError ?
                    <Text style={{color: 'red'}}> {this.state.errorMessage} </Text> :
                    <></>
                }
                <Input
                    placeholder="Course Code"
                    onChangeText={(CourseCode) => this.setState({CourseCode: {
                        value: CourseCode,
                        hasError: false,
                    }})}
                    value={this.state.CourseCode.value}
                    errorMessage={this.state.CourseCode.hasError ? this.state.CourseCode.errorMessage : undefined}
                    errorStyle={{color:'red'}}
                />
                <Divider />
                <Input
                    placeholder="Course Name"
                    onChangeText={(CourseName) => this.setState({CourseName: {
                        value: CourseName,
                        hasError: false,
                    }})}
                    value={this.state.CourseName.value}
                    errorMessage={this.state.CourseName.hasError ? this.state.CourseName.errorMessage : undefined}
                    errorStyle={{color:'red'}}
                />
                <Divider />
                <Button
                    title="Add"
                    onPress={()=>this.addCourse()}
                    loading={this.state.isLoading ? true : false}
                    disabled={this.state.isLoading ? true : false}
                />
                <Divider />
                <Button
                    title="Back"
                    onPress={()=>this.props.goBack()}
                />
            </ScrollView>
        );
    }
}
