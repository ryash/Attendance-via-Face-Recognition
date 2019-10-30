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
import RenderAttendanceCourse from './RenderAttendanceCourse.js';

export default class RenderAttendance extends Courses{
    constructor(){

        super();

        this.state = Object.assign({}, this.state, {
            currentCourse: '',
            renderCourseAttendance: false,
        });

        this.goBack = this.goBack.bind(this);
        this.renderAttendance = this.renderAttendance.bind(this);

    }

    goBack(){
        this.setState({
            renderCourseAttendance: false,
        });
    }

    renderAttendance(course){
        this.setState({
            currentCourse: course,
            renderCourseAttendance: true,
        });
    }

    render(){
        return (
            this.state.isLoading ? <ActivityIndicator/> :
            this.state.hasError ? <Text> {this.state.errorMessage} </Text> :
            this.state.renderCourseAttendance ?
            <RenderAttendanceCourse
                goBack={this.goBack}
                course={this.state.currentCourse}
                currentState={this.props.currentState}
            /> :
            <ScrollView>
                {this.state.allCourses.map((val)=>{
                    return (<>
                        <TouchableOpacity key={val}>
                            <View>
                                <Text onPress={() => this.renderAttendance(val)}>
                                    {val}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </>);
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
