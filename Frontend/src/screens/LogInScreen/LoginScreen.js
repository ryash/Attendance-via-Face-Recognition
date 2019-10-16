import React, { Component } from 'react';
import {
    ScrollView,
    Text,
    TextInput,
    View,
    Button,
} from 'react-native';

export default class LoginScreen extends Component {

    state = {
        Username: '',
        Password: '',
    }

    onLoginPress(){
        if (this.state.Username === 'user' && this.state.Password === 'user_password'){
            this.props.changeState({
                isLoggedIn: true,
                mode: 'user',
            });
        }
        else if (this.state.Username === 'admin' && this.state.Password === 'admin_password'){
            this.props.changeState({
                isLoggedIn: true,
                mode: 'admin',
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
                <TextInput
                    placeholder="Username"
                    onChangeText={(Username) => this.setState({Username})}
                    value={this.state.Username}
                />
                <TextInput
                    placeholder="Password"
                    onChangeText={(Password) => this.setState({Password})}
                    value={this.state.Password}
                />
                <View style={{margin:7}} />
                <Button
                    onPress={() => this.onLoginPress()}
                    title="Submit"
                />
            </ScrollView>
        );
    }
}
