import React, { Component } from 'react';
import {
    ScrollView,
    Alert,
    BackHandler,
    View,
} from 'react-native';

import {Input, Header, Text, Button} from 'react-native-elements';

import {AppContext} from '../../../Contexts.js';
import {makeCancelablePromise} from '../../../Constants.js';

/**
 * UI Component to add a new faculty.
 * This component applies to the faculties.
 */
export default class AddFaculty extends Component{

    /**
     * Getting the current nearest context to get the data from.
     * This context will have id and token of the faculty to authenticate him on the server
     * along with other useful information.
     */
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

        // Binding all the functions to current context so that they can be called
        // from the context of other components as well.
        this.onProceedPress = this.onProceedPress.bind(this);
        this.validate = this.validate.bind(this);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    /**
     * Handler which is called when the user hits back button on his/her device
     */
    handleBackButtonClick(){
        this.props.goBack();
        return true;
    }

    /**
     * The function which is called before the faculty submits all the faculty credentials.
     * Validates all the entered faculty credentials.
     */
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

        return isValid;
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
        for (let prom of this.promises) {
            // Cancelling any pending promises on unmount.
            prom.cancel();
        }
    }

    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    /**
     * Function which is called when faculty submits the faculty credentials to the server.
     */
    onProceedPress(){
        if (this.validate()){
            this.setState({
                isLoading: true,
            }, () => {
                let cancFetch = makeCancelablePromise(fetch(this.context.domain + '/api/auth/signup/faculty/' + this.context.id, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.context.token,
                    },
                    body: JSON.stringify({
                        name: this.state.Name.value,
                        email: this.state.Email.value,
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
                    } else {
                        let {error} = await data.json();
                        error.isCanceled = false;
                        return Promise.reject(error);
                    }
                }).then(() => {
                    Alert.alert('Notification',
                    'Faculty has been successfully Registered',
                    [
                        {
                            text: 'OK', onPress: () =>{
                                this.props.goBack();
                            },
                        },
                    ]
                    );
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
            <ScrollView style={{padding: 20}}>
                <Header
                    centerComponent = {{text: 'Add Faculty', color: '#fff', style:{fontSize: 40, marginBottom: 20}}}
                />
                <View style={{margin: 7}} />
                {this.state.hasError ?
                    <>
                        <Text style={{color: 'red'}}> {this.state.errorMessage} </Text>
                        <View style={{margin: 7}} />
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
                <View style={{margin: 7}} />
                <Input
                    placeholder="Email"
                    onChangeText={(Email) => this.setState({Email : { hasError: false, value: Email }})}
                    value={this.state.Email.value}
                    errorMessage={this.state.Email.hasError ? this.state.Email.errorMessage : undefined}
                    errorStyle={{color: 'red'}}
                />
                <View style={{margin: 7}} />
                <Input
                    placeholder="Password"
                    secureTextEntry={true}
                    onChangeText={(Password) => this.setState({Password : { hasError: false, value: Password }})}
                    value={this.state.Password.value}
                    errorMessage={this.state.Password.hasError ? this.state.Password.errorMessage : undefined}
                    errorStyle={{color: 'red'}}
                />
                <View style={{margin: 7}} />
                <Input
                    placeholder="Confirm Password"
                    secureTextEntry={true}
                    onChangeText={(CnfPassword) => this.setState({CnfPassword : { hasError: false, value: CnfPassword }})}
                    value={this.state.CnfPassword.value}
                    errorMessage={this.state.CnfPassword.hasError ? this.state.CnfPassword.errorMessage : undefined}
                    errorStyle={{color: 'red'}}
                />
                <View style={{margin: 7}} />
                <Button
                    onPress={() => this.onProceedPress()}
                    title="Add Faculty"
                    style={{backgroundColor: '#00ff00'}}
                    loading={this.state.isLoading ? true : false}
                    disabled={this.state.isLoading ? true : false}
                    icon={{type: 'material-icons', name: 'add-circle-outline'}}
                    type="outline"
                />
                <View style={{margin: 7}} />
                <Button
                    onPress={() => this.props.goBack()}
                    title="Back"
                    style={{backgroundColor: '#00ff00'}}
                    loading={this.state.isLoading ? true : false}
                    disabled={this.state.isLoading ? true : false}
                    icon={{type: 'antdesign', name: 'left', iconStyle: {left: '-600%'}}}
                    type="outline"
                    titleStyle={{left: '500%'}}
                />
            </ScrollView>
        );
    }
}

