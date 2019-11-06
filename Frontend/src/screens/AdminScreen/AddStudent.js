import React, { Component } from 'react';
import { BackHandler, ScrollView, Alert, View } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';

import { makeCancelablePromise } from '../../../Constants.js';
import { AppContext } from '../../../Contexts.js';
import ImageChooser from '../SignUpScreen/ImageChooser.js';

/**
 * The UI Component to add new students to the course.
 * The number of students which are added are dynamic.
 * However, the number of students should be as large as possible, i.e.
 * all the students should be enrolled in one go, if possible, as model needs to be
 * retrained whenever a new student is added, which is slow.
 * This component applies to the faculties.
 */
export default class AddStudent extends Component{

    /**
     * Getting the current nearest context to get the data from.
     * This context will have id and token of the faculty to authenticate him on the server
     * along with other useful information.
     */
    static contextType = AppContext;

    constructor(props){

        super(props);

        this.state = {
            students: [],
            hasError: false,
            errorMessage: '',
            isLoading: false,
        };


        // Keeps the list of all the asynchronous task,
        // which may potentially change the component state after completion.
        this.promises = [];

        // Binding all the functions to current context so that they can be called
        // from the context of other components as well.
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.setImage = this.setImage.bind(this);
        this.addStudent = this.addStudent.bind(this);
        this.validate = this.validate.bind(this);
    }

    /**
     * The function which is called before the faculty submits
     * the roll no and images of all the students to the server.
     * Validates all the entered student credentials.
     */
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

    /**
     * Sets the image of the student as chosen by the faculty.
     * @param {number} ind - the index of the student credentials field, the user is adding the image to.
     */
    setImage(ind){
        return (img) => {
            this.state.students[ind].images.push(img);
        };
    }

    /**
     * The function which is called when the faculty submits the student data to the server.
     */
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

    /**
     * This function creates new input fields to add one more student in the list of students to be
     * enrolled in the course.
     */
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

    /**
     * Handler which is called when the user hits back button on his/her device
     */
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
                            <View style={{margin: 7}} />
                            <ImageChooser
                                setUserImage={this.setImage(ind)}
                            />
                            <View style={{margin: 7}} />
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
                type="outline"
            />
            <View style={{margin: 7}} />
            <Button
                title="Add Students"
                onPress={() => this.addStudent()}
                loading={this.state.isLoading}
                disabled={this.state.isLoading}
                icon={{type: 'material-icons', name: 'add-circle-outline', iconStyle: {left: '450%'}}}
                type="outline"
                iconRight
                titleStyle={{left: '-400%'}}
            />
        </ScrollView>);
    }
}
