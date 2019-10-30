import React, { Component } from 'react';
import {
    ScrollView,
    Text,
    TextInput,
    View,
    Button,
    BackHandler,
} from 'react-native';

export default class AdminLoginScreen extends Component {

    constructor(props){
        super(props);
        this.state = {
            Email: '',
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
        let emReg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (!this.state.Email.match(emReg)){
            this.setState({
                hasError: true,
                errorMessage: 'Email Invalid',
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
            fetch('http://10.8.15.214:8081/api/auth/signin/faculty/', {
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: this.state.Email,
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
                    mode: 'Admin',
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
                    placeholder="Email"
                    onChangeText={(Email) => this.setState({Email, hasError: false})}
                    value={this.state.Email}
                />
                <TextInput
                    placeholder="Password"
                    onChangeText={(Password) => this.setState({Password, hasError: false})}
                    secureTextEntry={true}
                    value={this.state.Password}
                />
                <View style={{margin:7}} />
                <Button
                    onPress={() => this.onLoginPress()}
                    title="Log In"
                />
                <View style={styles.verticalRightLayout}>
                    <Text style={styles.switchLoginMode} onPress={this.props.toggleRegisterPage}> Make a new admin request </Text>
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
