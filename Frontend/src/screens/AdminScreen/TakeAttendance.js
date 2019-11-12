import React, {Component} from 'react';
import {
  ScrollView,
  Alert,
  View
} from 'react-native';

import {Button, Input} from 'react-native-elements';
import Camera from './Camera.js';
import {makeCancelablePromise} from '../../../Constants.js';

/**
 * UI Component to take the roll no of a student before marking his/her attendance.
 * This component applies to the faculties.
 */
export default class TakeAttendance extends Component{
    constructor(props){

        super(props);

        this.state = {
            openCamera: false,
            RollNo: {
                hasError: false,
                errorMessage: '',
                value: '',
            },
        };

        // Binding all the functions to current context so that they can be called
        // from the context of other components as well.
        this.takeAttendence = this.takeAttendence.bind(this);
        this.getBack = this.getBack.bind(this);
        this.validate = this.validate.bind(this);
    }

    // Funtion which is called when the faculty proceeds to mark the attendance
    // of the student after giving the student's roll no.
    // Opens the camera.
    takeAttendence = () => {
        this.setState({
            openCamera: true,
        });
    };

    /**
     * The function which is called before the faculty submits
     * the roll no and images of all the students to the server.
     * Validates all the entered student credentials.
     */
    validate(){
        if (this.state.RollNo.value.length === 0){
            this.setState({
                RollNo: {
                    hasError: true,
                    errorMessage: 'This field cannot be empty',
                },
            });
            return false;
        }

        return true;
    }

    /**
     * Function which is passed to the camera component.
     * The camera component calls this function when a photo is snapped.
     * This function is responsible to send the image to the server to mark the attendance.
     * This function is not bound to the current context.
     * It is expected since this.camera is defined in the Camera Component.
     */
    async takePicture(){
        // making sure that the camera context is set.
        if (this.camera) {
            this.setState({isLoading: true}, async () => {
                // configuration for the camera.
                const options = {quality: 0.25, base64: true};
                const data = await this.camera.takePictureAsync(options);
                // getting the base64 representation of the image.
                let image = 'data:image/jpeg;base64,' + data.base64;

                let attUrl = this.context.domain + '/api/service/' + this.context.id;
                attUrl = attUrl + '/' + this.props.course.courseId + '/' + this.props.currentRollNo;

                let cancFetch = makeCancelablePromise(fetch(attUrl, {
                    headers: {
                        'Authorization' : 'Bearer ' + this.context.token,
                        'Content-Type' : 'application/json',
                    },
                    body: JSON.stringify({
                        image: image,
                    }),
                    method: 'POST',
                }));

                cancFetch.promise
                .then(async res => {
                    if (res.status === 200){
                        return res.json();
                    } else if (data.headers['Content-Type'] !== 'application/json'){
                        let err = new Error('Server uses unsupported data format');
                        err.isCanceled = false;
                        return Promise.reject(err);
                    }
                    try {
                        let pm1 = makeCancelablePromise(res.json());
                        this.promises.push(pm1);
                        let {error} = await pm1.promise;
                        error.isCanceled = false;
                        throw error;
                    } catch (err){
                        return Promise.reject(err);
                    }
                })
                .then(body => {
                    Alert.alert('Notification',
                        'Student marked present successfully',
                        [
                            {
                                text: 'OK', onPress: () =>{
                                    this.props.toggleCamera();
                                },
                            },
                        ]
                    );
                })
                .catch(err => {
                    if (!err.isCanceled){
                        if (err.message === 'Student not identified'){
                            Alert.alert('Notification',
                                `No Student Identified in the image. Make sure
                                that you have decent lightning around you while snapping
                                the image.`,
                                [
                                    {
                                        text: 'OK', onPress: () =>{
                                            this.setState({
                                                isLoading: false,
                                            });
                                        },
                                    },
                                ]
                            );
                        }
                        else {
                            Alert.alert('Notification',
                                err.message,
                                [
                                    {
                                        text: 'OK', onPress: () => {
                                            this.setState({
                                                isLoading: false,
                                            });
                                        },
                                    },
                                ]
                            );
                        }
                    }
                });
                this.promises.push(cancFetch);
            });
        }
    }

    /**
     * The function which is passed to other components which they can call to return back to this component.
     */
    getBack(){
        this.setState({
            openCamera: false,
        });
    }

    render(){
        return (
            this.state.openCamera ?
            <Camera
                toggleCamera={this.getBack}
                course={this.props.course}
                currentRollNo={this.state.RollNo.value}
                takePicture={this.takePicture}
            /> :
            <ScrollView style={{padding: 20}}>
                <Input
                    placeholder = "Roll No."
                    onChangeText={(RollNo) => {
                        this.setState({
                            RollNo: {
                                hasError: false,
                                value: RollNo,
                            },
                        });
                    }}
                    value={this.state.RollNo.value}
                    errorMessage={this.state.RollNo.errorMessage}
                    errorStyle={{color: 'red'}}
                />
                <View style={{margin: 7}} />
                <Button
                    title="Mark Attendance"
                    onPress={() => {
                        if (this.validate()){
                            this.setState({
                                openCamera: true,
                            });
                        }
                    }}
                    icon={{type: 'antdesign', name: 'right', iconStyle: {left: '450%'}}}
                    type="outline"
                    iconRight
                    titleStyle={{left: '-400%'}}
                />
                <View style={{margin: 7}} />
                <Button
                    title="Back"
                    onPress={()=>this.props.goBack()}
                    icon={{type: 'antdesign', name: 'left', iconStyle: {left: '-600%'}}}
                    type="outline"
                    titleStyle={{left: '500%'}}
                />
            </ScrollView>
        );
    }
}
