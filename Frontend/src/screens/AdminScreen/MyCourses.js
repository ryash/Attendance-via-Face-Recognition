import React from 'react';
import {
  ScrollView,
  ActivityIndicator,
  BackHandler,
} from 'react-native';


import {Button, Divider, Text} from 'react-native-elements';
import Courses from './Courses.js';
import RenderCourseActions from './RenderCourseActions.js';
import {AppContext} from '../../../Contexts.js';

export default class MyCourses extends Courses {

    static contextType = AppContext;

    constructor(props){

        super(props);

        this.state = Object.assign({}, this.state, {
            currentCourse: {},
            renderCourseActions: false,
        });

        this.goBack = this.goBack.bind(this);
        this.renderCourseActions = this.renderCourseActions.bind(this);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    goBack(){
        this.setState({
            renderCourseActions: false,
        });
    }

    handleBackButtonClick(){
        this.props.goBack();
        return true;
    }

    renderCourseActions(course){
        this.setState({
            currentCourse: course,
            renderCourseActions: true,
        });
    }

    render(){
        return (
            this.state.isLoading ? <ActivityIndicator/> :
            this.state.hasError ? <Text style={{color: 'red'}}> {this.state.errorMessage} </Text> :
            this.state.renderCourseActions ?
            <RenderCourseActions
                goBack={this.goBack}
                course={this.state.currentCourse}
            /> :
            <ScrollView>
                {this.state.allCourses.map((val)=>{
                    return (
                        <Button
                            key={val.courseId}
                            onPress={() => this.renderCourseActions(val)}
                            title={val.courseId + ': ' + val.courseName}
                        />
                    );
                })}
                <Divider />
                <Button
                    title="Back"
                    onPress={()=>this.props.goBack()}
                />
            </ScrollView>
        );
    }
}
