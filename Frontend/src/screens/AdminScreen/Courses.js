import { Component } from 'react';
import {BackHandler} from 'react-native';
import { makeCancelablePromise } from '../../../Constants';
import {AppContext} from '../../../Contexts.js';

export default class Courses extends Component{

    static contextType = AppContext;

    constructor(props){

        super(props);

        this.state = {
            allCourses: [],
            hasError: false,
            errorMessage: '',
            isLoading: true,
        };

        this.promises = [];

    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.props.handleBackButtonClick);
        for (let prom of this.promises){
            // Cancel any pending promises on unmount.
            prom.cancel();
        }
    }

    componentDidMount(){

        BackHandler.addEventListener('hardwareBackPress', this.props.handleBackButtonClick);

        let cancFetch = makeCancelablePromise(fetch(this.props.url, {
            headers: {
                'Authorization': 'Bearer ' + this.context.token,
            },
            method: 'GET',
        }));

        cancFetch.promise.then(async res => {
            if (res.status === 200){
                return res.json();
            } else if (res.headers['Content-Type'] !== 'application/json'){
                let err = new Error('Server uses unsupported data format');
                err.isCanceled = false;
                return Promise.reject(err);
            }
            else {
                let {error} = await res.json();
                error.isCanceled = false;
                return Promise.reject(error);
            }
        }).then(bdy => {
            this.setState({
                allCourses: bdy.message,
                isLoading: false,
            });
        }).catch(err => {
            if (!err.isCanceled){
                this.setState({
                    hasError: true,
                    errorMessage: err.message,
                    isLoading: false,
                });
            }
        });

        this.promises.push(cancFetch);
    }
}
