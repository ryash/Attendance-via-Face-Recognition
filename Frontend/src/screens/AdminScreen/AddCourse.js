import React, { Component } from 'react';
import {
    ScrollView,
    BackHandler,
    Alert,
} from 'react-native';

import { Input, Button, Divider, Text } from 'react-native-elements';

import {AppContext} from '../../../Contexts.js';
import { makeCancelablePromise } from '../../../Constants.js';

/**
 * UI Component to add a new course.
 * This component applies to the faculties.
 */
export default class AddCourse extends Component {

    /**
     * Getting the current nearest context to get the data from.
     * This context will have id and token of the faculty to authenticate him on the server
     * along with other useful information.
     */
    static contextType = AppContext;

    constructor(props){

        super(props);

        this.state = {
            CourseCode: {
                hasError: false, // Flag indicating if there is an error.
                errorMessage: '', // This is the invalidation message, set when course code is invalid with the invalidation resaon.
                value: '', // Current course code value.
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

        // Keeps the list of all the asynchronous task,
        // which may potentially change the component state after completion.
        this.promises = [];

        // Binding all the functions to current context so that they can be called
        // from the context of other components as well.
        this.validate = this.validate.bind(this);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.addCourse = this.addCourse.bind(this);
    }

    /**
     * The function which is called before the faculty submits the course data.
     * Validates all the entered course data.
     */
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

    /**
     * Handler which is called when the user hits back button on his/her device
     */
    handleBackButtonClick(){
        this.props.goBack();
        return true;
    }

    /**
     * Function which is called when faculty submits the course data to the server.
     */
    addCourse(){
        if (this.validate()){
            this.setState({isLoading: true}, () => {
                // Making the fetch request cancelable so that if user hits back button
                // while the request is in progress, it can be cancelled in the componentDidMount method.
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
