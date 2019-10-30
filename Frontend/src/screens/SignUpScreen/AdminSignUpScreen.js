import React, { Component } from 'react';
import {
    ScrollView,
    Text,
    TextInput,
    View,
    Button,
    BackHandler,
} from 'react-native';

import AdminRequestSuccess from './AdminRequestSuccess.js';

export default class AdminSignUpScreen extends Component {

    constructor(){
        super();
        this.state = {
            Name: '',
            Email: '',
            Password: '',
            CnfPassword: '',
            hasError: false,
            errorMessage: '',
            adminRequestSuccess: false,
        };

        this.onProceedPress = this.onProceedPress.bind(this);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.validate = this.validate.bind(this);
        this.goBack = this.goBack.bind(this);

    }

    goBack(){
        this.setState({
            adminRequestSuccess: false,
        });
        return true;
    }

    validate() {
        let emReg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (!this.state.Name.match(/[a-zA-Z] *[a-zA-Z]/g)){
            this.setState({
                hasError: true,
                errorMessage: 'Name is invalid',
            });
            return false;
        }
        else if (!this.state.Password.match(/.{6,}/g)){
            this.setState({
                hasError: true,
                errorMessage: 'Password is invalid',
            });
            return false;
        }
        else if (!this.state.Email.match(emReg)){
            this.setState({
                hasError: true,
                errorMessage: 'Email is invalid',
            });
            return false;
        }
        else if (this.state.Password !== this.state.CnfPassword){
            this.setState({
                hasError: true,
                errorMessage: "Passwords don't match",
            });
            return false;
        }
        return true;
    }

    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick(){
        this.props.changeState({
            modeChosen: false,
        });
        return true;
    }

    onProceedPress(){
        if (this.validate()){
            fetch('http://10.8.15.214:8081/api/auth/signup/faculty/', {
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: this.state.Name,
                    email: this.state.Email,
                    password: this.state.Password,
                }),
                method: 'POST',
            }).then(async (data)=>{
                if (data.status === 200){
                    return data.json();
                } else {
                    let {error} = await data.json();
                    return Promise.reject(new Error(error.message));
                }
            }).then(body=>{
                this.setState({
                    adminRequestSuccess: true,
                });
            }).catch(err => {
                this.setState({
                    hasError: true,
                    errorMessage: err.message,
                });
            });
        }
    }

    render() {
        return (
            this.state.adminRequestSuccess ?
            <AdminRequestSuccess
                goBack = {this.goBack}
            /> :
            <ScrollView style={{padding: 20}}>
                <Text
                    style={{fontSize: 27}}>
                    Register
                </Text>
                {this.state.hasError ? <Text>{this.state.errorMessage}</Text> : <></>}
                <TextInput
                    placeholder="Name"
                    onChangeText={(Name) => this.setState({Name, hasError: false})}
                    value={this.state.Name}
                />
                <TextInput
                    placeholder="Email"
                    onChangeText={(Email) => this.setState({Email, hasError: false})}
                    value={this.state.Email}
                />
                <TextInput
                    placeholder="Password"
                    secureTextEntry={true}
                    onChangeText={(Password) => this.setState({Password, hasError: false})}
                    value={this.state.Password}
                />
                <TextInput
                    placeholder="Confirm Password"
                    secureTextEntry={true}
                    onChangeText={(CnfPassword) => this.setState({CnfPassword, hasError: false})}
                    value={this.state.CnfPassword}
                />
                <View style={{margin:7}} />
                <Button
                    onPress={() => this.onProceedPress()}
                    title="Proceed"
                />
                <View style={styles.verticalRightLayout}>
                    <Text style={styles.switchLoginMode} onPress={this.props.toggleRegisterPage}> Already Registered ? Login </Text>
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
