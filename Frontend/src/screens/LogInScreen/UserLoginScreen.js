import React, { Component } from 'react';
import {
    ScrollView,
    View,
} from 'react-native';
import {Input, Divider, Header, Text, Button} from 'react-native-elements';

import Storage from '../../storage/Storage.js';
import {AppContext} from '../../../Contexts.js';
import {modes, makeCancelablePromise} from '../../../Constants.js';

/**
 * UI Component to render the content for logging into the application as a student.
 * This component applies to the students.
 */
export default class UserLoginScreen extends Component {

    /**
     * Getting the current nearest context to get the data from.
     * This context will have id and token of the faculty to authenticate him on the server
     * along with other useful information.
     */
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

        // Binding all the functions to current context so that they can be called
        // from the context of other components as well.
        this.validate = this.validate.bind(this);
        this.onLoginPress = this.onLoginPress.bind(this);

    }

    componentWillUnmount(){
        for (let prom of this.promises) {
            // Cancelling any pending promises on unmount.
            prom.cancel();
        }
    }

    /**
     * The function which is called before the student submits
     * the login credentials to the server.
     * Does Basic Validation of all the entered credentials.
     */
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

    /**
     * The function which is called when the user submits the credentials to the server.
     */
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
                    centerComponent = {{text: 'Student Log In', style: { color: '#fff', fontSize: 32, marginBottom: 20 }}}
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
                    loading={this.state.isLoading}
                    disabled={this.state.isLoading}
                    type="outline"
                    containerStyle={{width: '80%' , marginLeft: '10%'}}
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
