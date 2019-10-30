import React, { Component } from 'react';
import {
    ScrollView,
    TextInput,
    View,
    Button,
    Text,
    ActivityIndicator,
    BackHandler,
} from 'react-native';

export default class AddCourse extends Component {

    constructor(props){
        super(props);

        this.state = {
            CourseCode: '',
            CourseName: '',
            hasError: false,
            isLoading: false,
            errorMessage: '',
        };

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick(){
        this.props.goToMainScreen();
        return true;
    }

    addCourse(){
        this.setState({isLoading: true}, () => {
            fetch('http://10.8.15.214:8081/api/service/course/' + this.props.currentState.id, {
                headers: {
                    'Authorization': 'Bearer ' + this.props.currentState.token,
                    'Content-Type': 'application/json',
                },
                body : JSON.stringify({
                    courseId: this.state.CourseCode,
                    courseName: this.state.CourseName,
                }),
                method: 'POST',
            }).then(async res => {
                if (res.status === 200){
                    return res.json();
                }
                else {
                    let {error} = await res.json();
                    return Promise.reject(error.message);
                }
            }).then(bdy => {
                this.props.goToMainScreen();
            }).catch(err => {
                this.setState({
                    hasError: true,
                    errorMessage: err,
                    isLoading: false,
                });
            });
        });
    }

    render() {
        return (
            <ScrollView style={{padding: 20}}>
                {this.state.hasError ?
                    <Text> {this.state.errorMessage} </Text> :
                    <></>
                }
                <View>
                    <TextInput
                        placeholder="Course Code"
                        onChangeText={(CourseCode) => this.setState({CourseCode})}
                        value={this.state.CourseCode}
                    />
                    <TextInput
                        placeholder="Course Name"
                        onChangeText={(CourseName) => this.setState({CourseName})}
                        value={this.state.CourseName}
                    />
                    {
                        this.state.isLoading ?
                        <>
                            <View style={{margin:20}} />
                            <ActivityIndicator />
                        </> :
                        <></>
                    }
                    <Button
                        title="Add"
                        onPress={()=>this.addCourse()}
                    />
                    <View style={{margin:20}} />
                    <Button
                        title="Cancel"
                        onPress={()=>this.props.goToMainScreen()}
                    />
                </View>
            </ScrollView>
        );
    }
}

let styles = {
    switchLoginMode: {
        fontSize: 16,
        color: 'blue',
        textAlign: 'right',
        textDecorationLine: 'underline',
        textDecorationStyle: 'solid',
    },
    verticalRightLayout:{
        flexDirection: 'column',
    },
};
