import React, { Component } from 'react';
import {
    ScrollView,
    View,
} from 'react-native';
import {Input, Header, Text, Button} from 'react-native-elements';

import Storage from '../../storage/Storage.js';
import {AppContext} from '../../../Contexts.js';
import {modes, makeCancelablePromise} from '../../../Constants.js';

export default class AdminLoginScreen extends Component {

    static contextType = AppContext;

    constructor(props){

        super(props);

        this.state = {
            Email: {
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
        if (this.state.Email.value.length === 0){
            this.setState({
                Email : {
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

                let cancFetch = makeCancelablePromise(fetch(this.context.domain + '/api/auth/signin/faculty/', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: this.state.Email.value,
                        password: this.state.Password.value,
                    }),
                    method: 'POST',
                }));

                cancFetch.promise.then(async data => {
                    if (data.status === 200){
                        return data.json();
                    } else if (data.headers['Content-Type'] !== 'application/json'){
                        let err = new Error('Server uses unsupported data format');
                        err.isCanceled = false;
                        return Promise.reject(err);
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
                            mode: modes.ADMIN,
                        });
                    });
                    Storage.setItem('admin:id', id).then(() => {
                        return Storage.setItem('admin:token', token);
                    }).then(() => {
                        console.log('admin id & token saved successfully!');
                    }).catch((err) => {
                        console.log('Failed to save admin id & token.\n Error: ' + err.message);
                    });
                }).catch(err => {

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
            <ScrollView style={{padding: 10}}>
                <Header
                    centerComponent = {{text: 'Faculty Log In', style: { color: '#fff', fontSize: 32, marginBottom: 20 }}}
                />
                {this.state.hasError ?
                    <>
                        <Text style={{color: 'red'}}> {this.state.errorMessage} </Text>
                    </> :
                    <></>
                }
                <Input
                    placeholder="Email"
                    onChangeText={(Email) => this.setState({Email : { hasError: false, value: Email }})}
                    value={this.state.Email.value}
                    errorMessage={this.state.Email.hasError ? this.state.Email.errorMessage : undefined}
                    errorStyle={{color: 'red'}}
                />
                <Input
                    placeholder="Password"
                    secureTextEntry={true}
                    onChangeText={(Password) => this.setState({Password : { hasError: false, value: Password }})}
                    value={this.state.Password.value}
                    errorMessage={this.state.Password.hasError ? this.state.Password.errorMessage : undefined}
                    errorStyle={{color: 'red'}}
                />
                <View style={{margin: 7}} />
                <Button
                    onPress={() => this.onLoginPress()}
                    title="Log In"
                    loading={this.state.isLoading}
                    disabled={this.state.isLoading}
                    type="outline"
                    containerStyle={{width: '80%' , marginLeft: '10%'}}
                />
                <View style={styles.verticalRightLayout}>
                    <Text
                        style={styles.switchLoginMode}
                        onPress={() => this.context.changeAppState({
                            openAdminPages: false,
                            openSignUpPage: false,
                        })} >
                    Not a Faculty? Login As Student
                    </Text>
                </View>
                <View style={styles.verticalRightLayout}>
                    <Text
                        style={styles.switchLoginMode}
                        onPress={() => this.context.changeAppState({
                            openSignUpPage: true,
                            openAdminPages: false,
                        })}>
                    Or Register as Student
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
