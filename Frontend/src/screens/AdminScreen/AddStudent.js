import React, { Component } from 'react';
import { BackHandler, ScrollView, Alert, View } from 'react-native';
import { Button, Divider, Input, Text } from 'react-native-elements';

import { makeCancelablePromise } from '../../../Constants.js';
import { AppContext } from '../../../Contexts.js';
import ImageChooser from '../SignUpScreen/ImageChooser.js';

export default class AddStudent extends Component{

    static contextType = AppContext;

    constructor(props){

        super(props);

        this.state = {
            students: [],
            hasError: false,
            errorMessage: '',
            isLoading: false,
        };

        this.promises = [];

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.setImage = this.setImage.bind(this);
        this.addStudent = this.addStudent.bind(this);
        this.validate = this.validate.bind(this);
    }

    validate(){
        let isValid = true;
        let rollNoSet = new Set();

        let newArray = this.state.students.map((val) => {

            rollNoSet.add(val);

            if (val.RollNo.value.length === 0){

                val.RollNo.hasError = true;
                val.RollNo.errorMessage = 'This field cannot be empty';

                isValid = false;
            }

            if (val.images.length < 3){

                val.RollNo.hasError = true;
                val.RollNo.errorMessage = `Select ${3 - val.images.length} more images to continue`;

                isValid = false;
            }

            return val;
        });

        if ((rollNoSet.size < this.state.students.length)){
            isValid = false;
            this.setState({
                students: newArray,
                hasError: true,
                errorMessage: 'Roll No. of every student must be unique',
            });
        } else if (!this.state.students.length) {
            isValid = false;
            this.setState({
                students: newArray,
                hasError: true,
                errorMessage: 'No students are added',
            });
        } else {
            this.setState({
                students: newArray,
            });
        }

        return isValid;
    }

    setImage(ind){
        return (img) => {
            this.state.students[ind].images.push(img);
        };
    }

    addStudent(){
        let subUrl = this.context.domain + '/api/service/register/' + this.context.id;
        subUrl = subUrl + '/' + this.props.course.courseId;

        if (this.validate()){

            let studentsStringified = JSON.stringify({
                studentData: this.state.students.map((val) => {
                    return {
                        images: val.images,
                        rollNo: val.RollNo.value.toUpperCase(),
                    };
                }),
            });

            this.setState({isLoading: true}, ()=>{
                let cancFetch = makeCancelablePromise(fetch(subUrl, {
                    headers: {
                        'Authorization' : 'Bearer ' + this.context.token,
                        'Content-Type' : 'application/json',
                    },

                    body: studentsStringified,

                    method: 'POST',

                }));

                cancFetch.promise
                .then(async data => {
                    if (data.status === 200){
                        return data.json();
                    } else if (data.headers['Content-Type'] !== 'application/json'){
                        let err = new Error('Server uses unsupported data format');
                        err.isCanceled = false;
                        return Promise.reject(err);
                    }

                    try {
                        let pm1 = makeCancelablePromise(data.json());
                        this.promises.push(pm1);
                        let {error} = await pm1.promise;
                        error.isCanceled = false;
                        throw error;
                    } catch (err){
                        return Promise.reject(err);
                    }
                })
                .then((body) =>{
                    Alert.alert('Notification',
                        'Students are successfully added',
                        [
                            {
                                text: 'OK', onPress: () =>{
                                    this.props.goBack();
                                },
                            },
                        ]
                    );
                })
                .catch(err => {
                    if (!err.isCanceled){
                        this.setState({
                            hasError: true,
                            errorMessage: err.message,
                            isLoading: false,
                        });
                    }
                });

                this.promises.push(cancFetch);

            });
        }
    }

    addNewStudent(){
        this.setState({
            students: [...this.state.students, {
                key: new Date().toUTCString(),
                images: [],
                RollNo: {
                    hasError: false,
                    errorMessage: '',
                    value: '',
                },
            }],
        });
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
        return (<ScrollView style={{padding: 20}}>
            {this.state.hasError ?
                <Text style={{color: 'red'}}> {this.state.errorMessage} </Text> :
                <></>
            }
            {
                this.state.students.map((student, ind) => {
                    return (
                        <View key={student.key}>
                            <Input
                                placeholder="Roll No."
                                onChangeText={(RollNo) => this.setState({students : this.state.students.map((value, index)=>{
                                    if (index === ind){
                                        value.RollNo.value = RollNo;
                                        value.RollNo.hasError = false;
                                        return value;
                                    }
                                    return value;
                                })})}
                                value={student.RollNo.value}
                                errorMessage={this.state.students[ind].RollNo.hasError ? this.state.students[ind].RollNo.errorMessage : undefined}
                                errorStyle={{color: 'red'}}
                            />
                            <Divider />
                            <ImageChooser
                                setUserImage={this.setImage(ind)}
                            />
                        </View>
                    );
                })
            }
            <Button
                icon = {{
                    name: 'adduser',
                    type: 'antdesign',
                }}
                title="Add New Student"
                onPress = {() => this.addNewStudent()}
            />
            <Button
                title="Add Students"
                onPress={() => this.addStudent()}
                loading={this.state.isLoading}
                disabled={this.state.isLoading}
            />
        </ScrollView>);
    }
}
