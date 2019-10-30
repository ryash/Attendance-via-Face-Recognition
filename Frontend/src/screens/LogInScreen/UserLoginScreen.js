import React, { Component } from 'react';
import {
    ScrollView,
    Text,
    TextInput,
    View,
    Button,
    BackHandler,
} from 'react-native';

export default class UserLoginScreen extends Component {

    constructor(){
        super();
        this.state = {
            RollNo: '',
            Password: '',
            hasError: false,
            errorMessage: '',
        };

        this.validate = this.validate.bind(this);
        this.onLoginPress = this.onLoginPress.bind(this);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

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

    validate(){
        if (this.state.RollNo.length === 0){
            this.setState({
                hasError: true,
                errorMessage: "Roll Number cann't be empty",
            });
            return false;
        }
        else if (this.state.Password.length === 0){
            this.setState({
                hasError: true,
                errorMessage: "Password cann't be empty",
            });
            return false;
        }
        return true;
    }

    onLoginPress(){

        // Primary validation of Email and Password.

        if (this.validate()){
            fetch('http://10.8.15.214:8081/api/auth/signin/student/', {
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rollNo: this.state.RollNo,
                    password: this.state.Password,
                }),
                method: 'POST',
            }).then(async (data)=>{
                if (data.status === 200){
                    return data.json();
                }

                let {error} = await data.json();
                return Promise.reject(new Error(error.message));

            }).then(body=>{
                let {id, token} = body;
                this.props.changeState({
                    id, token,
                    isLoggedIn: true,
                    mode: 'user',
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
            <ScrollView style={{padding: 20}}>
                <Text
                    style={{fontSize: 27}}>
                    Login
                </Text>
                {this.state.hasError ? <Text>
                    {this.state.errorMessage}
                </Text> : <></>
                }
                <TextInput
                    placeholder="Roll No."
                    onChangeText={(RollNo) => {
                        this.setState({
                            RollNo,
                            hasError: false,
                        });
                    }}
                    value={this.state.RollNo}
                />
                <TextInput
                    placeholder="Password"
                    onChangeText={(Password) => {
                        this.setState({
                            Password,
                            hasError: false,
                        });
                    }}
                    secureTextEntry={true}
                    value={this.state.Password}
                />
                <View style={{margin:7}} />
                <Button
                    onPress={() => this.onLoginPress()}
                    title="Log In"
                />
                <View style={styles.verticalRightLayout}>
                    <Text style={styles.switchLoginMode} onPress={this.props.toggleRegisterPage}> register as a new user </Text>
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
