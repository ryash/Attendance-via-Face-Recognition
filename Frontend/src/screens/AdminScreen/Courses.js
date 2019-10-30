import { Component } from 'react';
import {BackHandler} from 'react-native';

export default class Courses extends Component{
    constructor(){

        super();

        this.state = {
            allCourses: [],
            hasError: false,
            errorMessage: '',
            isLoading: true,
        };

    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.props.handleBackButtonClick);
    }

    componentDidMount(){

        BackHandler.addEventListener('hardwareBackPress', this.props.handleBackButtonClick);

        fetch(this.props.url, {
            headers: {
                'Authorization': 'Bearer ' + this.props.currentState.token,
            },
            method: 'GET',
        }).then(async res => {
            if (res.status === 200){
                return res.json();
            }
            else {
                let {error} = await res.json();
                return Promise.reject(new Error(error.message));
            }
        }).then(bdy => {
            this.setState({
                allCourses: bdy.message.map(val => val.courseId),
                isLoading: false,
            });
        }).catch(err => {
            this.setState({
                hasError: true,
                errorMessage: err.message,
                isLoading: false,
            });
        });
    }
}
