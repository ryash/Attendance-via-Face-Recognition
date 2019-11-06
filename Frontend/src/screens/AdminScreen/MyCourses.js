import React from 'react';
import {
  ScrollView,
  ActivityIndicator,
  View,
} from 'react-native';


import {Button, Text} from 'react-native-elements';
import Courses from './Courses.js';
import RenderCourseActions from './RenderCourseActions.js';
import {AppContext} from '../../../Contexts.js';

/**
 * UI Component to show all the courses belonging to the relevant faculty.
 * This component applies to the faculties.
 */
export default class MyCourses extends Courses {

    /**
     * Getting the current nearest context to get the data from.
     * This context will have id and token of the faculty to authenticate him on the server
     * along with other useful information.
     */
    static contextType = AppContext;

    constructor(props){

        super(props);

        this.state = Object.assign({}, this.state, {
            currentCourse: {},
            renderCourseActions: false,
        });

        // Binding all the functions to current context so that they can be called
        // from the context of other components as well.
        this.goBack = this.goBack.bind(this);
        this.renderCourseActions = this.renderCourseActions.bind(this);
    }

    /**
     * The function which is passed to other components which they can call to return back to this component.
     */
    goBack(){
        this.setState({
            renderCourseActions: false,
        });
    }

    /**
     * Function which sets the context of the actions
     * which are rendered when a button corresponding to some course is clicked.
     * @param {Object} course - course object with fields, courseId, representing the course code and courseName, representing the course name.
     */
    renderCourseActions(course){
        this.setState({
            currentCourse: course,
            renderCourseActions: true,
        });
    }

    render(){
        return (
            this.state.isLoading ?
            <ActivityIndicator
                size="large"
                color="#bc2b78"
                style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
            /> :
            this.state.hasError ? <Text style={{color: 'red'}}> {this.state.errorMessage} </Text> :
            this.state.renderCourseActions ?
            <RenderCourseActions
                goBack={this.goBack}
                course={this.state.currentCourse}
            /> :
            <ScrollView style={{padding: 20}}>
                {this.state.allCourses.map((val)=>{
                    return (
                        <View key={val.courseId}>
                            <Button
                                onPress={() => this.renderCourseActions(val)}
                                title={val.courseId + ': ' + val.courseName}
                                icon={{type: 'antdesign', name: 'right'}}
                                type="outline"
                                iconRight
                            />
                            <View style={{margin: 7}} />
                        </View>
                    );
                })}
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
