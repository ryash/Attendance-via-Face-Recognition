import React from 'react';
import {
  TouchableOpacity,
  ScrollView,
  View,
  ActivityIndicator,
  Button,
  Text,
} from 'react-native';

import Courses from './Courses.js';
import Camera from './Camera.js';

export default class TakeAttendance extends Courses{
    constructor(){

        super();

        this.state = Object.assign({}, this.state, {
            openCamera: false,
            currentCourse: '',
        });

        this.takeAttendence = this.takeAttendence.bind(this);
        this.getBack = this.getBack.bind(this);
    }

    takeAttendence = async (course) => {
        this.setState({
            currentCourse: course,
            openCamera: true,
        });
    };

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
            this.state.isLoading ? <ActivityIndicator/> :
            this.state.hasError ? <Text> {this.state.errorMessage} </Text> :
            this.state.openCamera ?
            <Camera toggleCamera={this.getBack} takePicture={this.takePicture}/> :
            <ScrollView>
                {this.state.allCourses.map((val)=>{
                    return (<TouchableOpacity>
                        <View key={val}>
                            <Text onPress={() => this.takeAttendence(val)}>
                                {val}
                            </Text>
                        </View>
                    </TouchableOpacity>);
                })}
                <View style={{margin:20}} />
                <Button
                    title="Back"
                    onPress={()=>this.props.goToMainScreen()}
                />
            </ScrollView>
        );
    }
}
