import React, {Component} from 'react';
import {
  ScrollView,
  Alert,
} from 'react-native';

import {Button, Input, Divider} from 'react-native-elements';
import Camera from './Camera.js';
import {makeCancelablePromise} from '../../../Constants.js';

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

        this.takeAttendence = this.takeAttendence.bind(this);
        this.getBack = this.getBack.bind(this);
        this.validate = this.validate.bind(this);
    }

    takeAttendence = () => {
        this.setState({
            openCamera: true,
        });
    };

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

    // This function is not bound to the current context.
    // It is expected since this.camera is defined in the Camera Component.

    async takePicture(){
        if (this.camera) {
            //console.log(image);
            this.setState({isLoading: true}, async () => {
                const options = {quality: 0.25, base64: true};
                const data = await this.camera.takePictureAsync(options);
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
            <ScrollView>
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
                <Divider />
                <Button
                    title="Mark Attendance"
                    onPress={() => {
                        if (this.validate()){
                            this.setState({
                                openCamera: true,
                            });
                        }
                    }}
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
