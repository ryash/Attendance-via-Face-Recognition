import React, { Component } from 'react';
import {
  ScrollView,
  ActivityIndicator,
  BackHandler,
} from 'react-native';


import {Button, Divider, Text, Input} from 'react-native-elements';
import ImageChooser from '../SignUpScreen/ImageChooser.js';

export default class AddStudent extends Component{
    constructor(props){

        super(props);

        this.state = {
            RollNo: {
                hasError: false,
                errorMessage: '',
                value: '',
            },
            images: [],
            hasError: false,
            errorMessage: '',
        };

        this.promises = [];

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.setImage = this.setImage.bind(this);
        this.addStudent = this.addStudent.bind(this);
        this.validate = this.validate.bind(this);
    }

    validate(){
        let isValid = true;
        if (this.state.RollNo.value.length === 0){
            this.setState({
                RollNo:{
                    hasError: true,
                    errorMessage: 'This field cannot be empty',
                },
            });

            isValid = false;
        }

        return isValid;
    }

    setImage(img){
        this.state.images.push(img);
    }

    addStudent(){
        if (this.validate()){

        }
    }

    handleBackButtonClick(){
        this.props.goBack();
        return true;
    }

    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);

        for (let prom of this.promises){
            // Cancel any pending promises.
            prom.cancel();
        }
    }

    render(){
        return (<>
            <Input
                placeholder="Roll No."
                onChangeText={(RollNo) => this.setState({RollNo : { hasError: false, value: RollNo }})}
                value={this.state.RollNo.value}
                errorMessage={this.state.RollNo.hasError ? this.state.RollNo.errorMessage : undefined}
                errorStyle={{color: 'red'}}
            />
            <Divider />
            <ImageChooser
                setUserImage={this.setImage}
            />
            <Button
                title="Add Student"
                onPress={() => this.addStudent()}
            />
        </>);
    }
}
