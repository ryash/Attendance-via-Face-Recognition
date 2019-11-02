import React, {Component} from 'react';
import {
  ScrollView,
} from 'react-native';

import {Button, Input, Divider} from 'react-native-elements';
import Camera from './Camera.js';

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
            const options = {quality: 0.5, base64: true};
            const data = await this.camera.takePictureAsync(options);
            console.log(data);
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
            <Camera toggleCamera={this.getBack} takePicture={this.takePicture}/> :
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
                        this.setState({
                            openCamera: true,
                        });
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
