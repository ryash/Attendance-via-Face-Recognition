import React, { Component } from 'react';
import {
    ScrollView,
    View,
} from 'react-native';
import {Input, Divider, Header, Text, Button} from 'react-native-elements';

import Storage from '../../storage/Storage.js';
import {AppContext} from '../../../Contexts.js';
import {modes, makeCancelablePromise} from '../../../Constants.js';

export default class UserSignUpScreen extends Component {

    static contextType = AppContext;

    constructor(){
        super();
        this.state = {
            Name: {
                hasError: false,
                errorMessage: '',
                value: '',
            },
            Email: {
                hasError: false,
                errorMessage: '',
                value: '',
            },
            RollNo: {
                hasError: false,
                errorMessage: '',
                value: '',
            },
            Password: {
                hasError: false,
                errorMessage: '',
                value: '',
            },
            CnfPassword: {
                hasError: false,
                errorMessage: '',
                value: '',
            },
            isLoading: false,
            hasError: false,
            errorMessage: '',
        };

        // Array of all the async tasks(promises).
        this.promises = [];

        this.onProceedPress = this.onProceedPress.bind(this);
        this.validate = this.validate.bind(this);
    }

    validate() {
        let emReg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

        let isValid = true;
        if (this.state.Name.value.length === 0){
            this.setState({
                Name : {
                    hasError: true,
                    errorMessage: 'This field cannot be empty',
                },
            });
            isValid = false;
        }

        else if (!this.state.Name.value.match(/[a-zA-Z] *[a-zA-Z]/g)){
            this.setState({
                Name : {
                    hasError: true,
                    errorMessage: 'Name is invalid',
                },
            });
            isValid = false;
        }

        if (this.state.Password.value.length === 0){
            this.setState({
                Password : {
                    hasError: true,
                    errorMessage: 'This field cannot be empty',
                },
            });
            isValid = false;
        }
        else if (!this.state.Password.value.match(/.{6,}/g)){
            this.setState({
                Password : {
                    hasError: true,
                    errorMessage: 'Password is invalid',
                },
            });
            isValid = false;
        }

        if (this.state.Email.value.length === 0){
            this.setState({
                Email : {
                    hasError: true,
                    errorMessage: 'This field cannot be empty',
                },
            });
            isValid = false;
        }
        else if (!this.state.Email.value.match(emReg)){
            this.setState({
                Email : {
                    hasError: true,
                    errorMessage: 'Email is invalid',
                },
            });
            isValid = false;
        }

        if (this.state.Password.value !== this.state.CnfPassword.value){
            this.setState({
                CnfPassword: {
                    hasError: true,
                    errorMessage: "Passwords don't match",
                },
            });
            isValid = false;
        }

        if (this.state.RollNo.value.length === 0){
            this.setState({
                RollNo: {
                    hasError: true,
                    errorMessage: 'This field cannot be empty',
                },
            });
            isValid = false;
        }

        return isValid;
    }

    componentWillUnmount(){
        for (let prom of this.promises) {
            // Cancelling any pending promises on unmount.
            prom.cancel();
        }
    }

    onProceedPress(){
        if (this.validate()){
            this.setState({
                isLoading: true,
            }, () => {
                let cancFetch = makeCancelablePromise(fetch(this.context.domain + '/api/auth/signup/student/', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: this.state.Name.value,
                        email: this.state.Email.value,
                        password: this.state.Password.value,
                        rollNo: this.state.RollNo.value.toUpperCase(),
                    }),
                    method: 'POST',
                }));

                cancFetch.promise.then(async (data)=>{
                    if (data.status === 200){
                        return data.json();
                    } else if (data.headers['Content-Type'] !== 'application/json'){
                        let err = new Error('Server uses unsupported data format');
                        err.isCanceled = false;
                        return Promise.reject(err);
                    } else {
                        let {error} = await data.json();
                        error.isCanceled = false;
                        return Promise.reject(error);
                    }
                }).then(body=>{
                    let {id, token} = body;
                    this.setState({
                        isLoading: false,
                    }, () => {
                        this.context.changeAppState({
                            id, token,
                            isLoggedIn: true,
                            mode: modes.USER,
                        });
                    });
                    Storage.setItem('user:id', id).then(() => {
                        return Storage.setItem('user:token', token);
                    }).then(() => {
                        console.log('user id & token saved successfully!');
                    }).catch((err) => {
                        console.log('Failed to save user id & token.\n Error: ' + err.message);
                    });
                }).catch((err) => {
                    if (!err.isCanceled){
                        this.setState({
                            hasError: true,
                            isLoading: false,
                            errorMessage: err.message,
                        });
                    }
                });

                this.promises.push(cancFetch);
            });
        }
    }

    render() {
        return (
            <ScrollView>
                <Header
                    centerComponent = {{text: 'Student Register', style: { color: '#fff', fontSize: 32, marginBottom: 20 }}}
                />
                <Divider />
                {this.state.hasError ?
                    <>
                        <Text style={{color: 'red'}}> {this.state.errorMessage} </Text>
                        <Divider />
                    </> :
                    <></>
                }
                <Input
                    placeholder="Name"
                    onChangeText={(Name) => this.setState({Name : { hasError: false, value: Name }})}
                    value={this.state.Name.value}
                    errorMessage={this.state.Name.hasError ? this.state.Name.errorMessage : undefined}
                    errorStyle={{color: 'red'}}
                />
                <Divider />
                <Input
                    placeholder="Email"
                    onChangeText={(Email) => this.setState({Email : { hasError: false, value: Email }})}
                    value={this.state.Email.value}
                    errorMessage={this.state.Email.hasError ? this.state.Email.errorMessage : undefined}
                    errorStyle={{color: 'red'}}
                />
                <Divider />
                <Input
                    placeholder="Roll No."
                    onChangeText={(RollNo) => this.setState({RollNo : { hasError: false, value: RollNo }})}
                    value={this.state.RollNo.value}
                    errorMessage={this.state.RollNo.hasError ? this.state.RollNo.errorMessage : undefined}
                    errorStyle={{color: 'red'}}
                />
                <Divider />
                <Input
                    placeholder="Password"
                    secureTextEntry={true}
                    onChangeText={(Password) => this.setState({Password : { hasError: false, value: Password }})}
                    value={this.state.Password.value}
                    errorMessage={this.state.Password.hasError ? this.state.Password.errorMessage : undefined}
                    errorStyle={{color: 'red'}}
                />
                <Divider />
                <Input
                    placeholder="Confirm Password"
                    secureTextEntry={true}
                    onChangeText={(CnfPassword) => this.setState({CnfPassword : { hasError: false, value: CnfPassword }})}
                    value={this.state.CnfPassword.value}
                    errorMessage={this.state.CnfPassword.hasError ? this.state.CnfPassword.errorMessage : undefined}
                    errorStyle={{color: 'red'}}
                />
                <Divider />
                <Button
                    onPress={() => this.onProceedPress()}
                    title="Proceed"
                    style={{backgroundColor: '#00ff00'}}
                    loading={this.state.isLoading ? true : false}
                    disabled={this.state.isLoading ? true : false}
                    type="outline"
                    containerStyle={{width: '80%' , marginLeft: '10%'}}
                />
                <View style={styles.verticalRightLayout}>
                    <Text
                        style={styles.switchLoginMode}
                        onPress={() => this.context.changeAppState({
                            openSignUpPage: false,
                        })} >
                    Already Registered ? Login
                    </Text>
                </View>
                <View style={styles.verticalRightLayout}>
                    <Text
                        style={styles.switchLoginMode}
                        onPress={() => this.context.changeAppState({
                            openAdminPages: true,
                        })} >
                    Not a Student? Login as a faculty
                    </Text>
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
