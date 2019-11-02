import React, { Component } from 'react';
import {
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import {Button, Divider, Text} from 'react-native-elements';
import Courses from '../AdminScreen/Courses.js';
import RenderAttendanceStudent from '../AdminScreen/RenderAttendanceStudent';
import {AppContext} from '../../../Contexts.js';

export default class MyCourses extends Courses{

    static contextType = AppContext;

    constructor(props){

        super(props);

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
            this.state.hasError ? <Text style={{color: 'red'}}> {this.state.errorMessage} </Text> :
            this.state.renderAttendance ?
            <RenderAttendanceStudent
                goBack={this.goBack}
                url={this.context.domain + '/api/user/' + this.context.id + '/' + this.state.currentCourse.courseId}
            /> :
            <ScrollView>
                {this.state.allCourses.map((val)=>{
                    return (
                            <Button
                                key = {val.courseId}
                                onPress={() => this.renderAttendance(val)}
                                title = {val.courseId + ': ' + val.courseName}
                            />
                        );
                })}
                <Divider />
                <Button
                    title="Back"
                    onPress={() => this.props.goBack()}
                />
            </ScrollView>
        );
    }
}
