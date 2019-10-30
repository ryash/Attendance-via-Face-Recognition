import React, { Component } from 'react';
import {
  Text,
  View,
  Button,
  ScrollView,
  ActivityIndicator,
  TouchableHighlightComponent,
} from 'react-native';

import Courses from '../AdminScreen/Courses.js';
import RenderAttendanceStudent from '../AdminScreen/RenderAttendanceStudent';

export default class MyCourses extends Courses{
    constructor(){

        super();

        this.state = Object.assign({}, this.state, {
            renderAttendance: false,
        });

        this.goBack = this.goBack.bind(this);
        this.renderAttendance = this.renderAttendance.bind(this);
    }

    goBack(){
        this.setState({
            renderAttendance: false,
        });
    }

    renderAttendance(course){
        this.setState({
            currentCourse: course,
            renderAttendance: true,
        });
    }

    render(){
        return (
            this.state.isLoading ? <ActivityIndicator/> :
            this.state.hasError ? <Text> {this.state.errorMessage} </Text> :
            this.state.renderAttendance ?
            <RenderAttendanceStudent
                goBack={this.goBack}
                url={'http://10.8.15.214:8081/api/user/' + '/' + this.props.currentState.id + '/' + this.props.currentCourse}
                currentState={this.props.currentState}
            /> :
            <ScrollView>
                {this.state.allCourses.map((val)=>{
                    return (<TouchableHighlightComponent>
                        <View key={val}>
                            <Text onPress={() => this.renderAttendance(val)}>
                                {val}
                            </Text>
                        </View>
                    </TouchableHighlightComponent>);
                })}
                <View style={{margin:20}} />
                <Button
                    title="Back"
                    onPress={()=>this.props.goBack()}
                />
            </ScrollView>
        );
    }
}
