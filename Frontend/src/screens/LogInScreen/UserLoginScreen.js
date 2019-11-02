import React, { Component } from 'react';
import {
    ScrollView,
    View,
} from 'react-native';
import {Input, Divider, Header, Text, Button} from 'react-native-elements';

import Storage from '../../storage/Storage.js';
import {AppContext} from '../../../Contexts.js';
import {modes, makeCancelablePromise} from '../../../Constants.js';

export default class UserLoginScreen extends Component {

    static contextType = AppContext;

    constructor(){
        super();
        this.state = {
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
            hasError: false,
            errorMessage: '',
            isLoading: false,
        };

        // Array of all the async tasks(promises).
        this.promises = [];

        this.validate = this.validate.bind(this);
        this.onLoginPress = this.onLoginPress.bind(this);

    }

    componentWillUnmount(){
        for (let prom of this.promises) {
            // Cancelling any pending promises on unmount.
            prom.cancel();
        }
    }

    validate(){

        let isValid = true;
        if (this.state.RollNo.length === 0){
            this.setState({
                RollNo: {
                    hasError: true,
                    errorMessage: 'This field cannot be empty',
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
        return isValid;
    }

    onLoginPress(){

        // Primary validation of Email and Password.

        if (this.validate()){
            this.setState({
                isLoading: true,
            }, () => {

                let cancFetch = makeCancelablePromise(fetch(this.context.domain + '/api/auth/signin/student/', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        rollNo: this.state.RollNo.value.toUpperCase(),
                        password: this.state.Password.value,
                    }),
                    method: 'POST',
                }));

                cancFetch.promise.then(async (data)=>{
                    if (data.status === 200){
                        return data.json();
                    }

                    let {error} = await data.json();
                    error.isCanceled = false;
                    return Promise.reject(error);

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
                }).catch(err => {
                    if (!err.isCanceled){
                        console.log(err.message);
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
                    centerComponent = {{text: 'Log In', style: { color: '#fff' }}}
                />
                <Divider/>
                {this.state.hasError ?
                    <>
                        <Text style={{color: 'red'}}> {this.state.errorMessage} </Text>
                        <Divider />
                    </> :
                    <></>
                }
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
                <Button
                    onPress={() => this.onLoginPress()}
                    title="Log In"
                    loading={this.state.isLoading ? true : false}
                    disabled={this.state.isLoading ? true : false}
                />
                <View style={styles.verticalRightLayout}>
                <Text
                        style={styles.switchLoginMode}
                        onPress={() => this.context.changeAppState({
                            openSignUpPage: true,
                        })} >
                    Register as a new student
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
