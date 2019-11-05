// Library Component Imports
import React, {Component} from 'react';
import {Input, Icon, Button, Divider} from 'react-native-elements';
import {ScrollView} from 'react-native';
// Asset Imports
import {AppContext} from './Contexts.js';
import Storage from './src/storage/Storage.js';
import { makeCancelablePromise } from './Constants.js';

/**
 * Entry UI component which is shown to the user when he/she opens the application.
 * This component asks for the server domain which is then used throughout the application
 * to communicate with the server.
 */
export default class EntryScreen extends Component{

	constructor(props){

		// Calling the parent constructor.
		super(props);

		this.state = {
			hasError: false,
			errorMessage: '',
			domain: '',
		};

		// Array of all the async tasks(promises).
		this.promises = [];

		// Binding the functions to current object's context.
		this.validate = this.validate.bind(this);
		this.onClickHandler = this.onClickHandler.bind(this);
	}

	static contextType = AppContext;

	/**
	 * Function to validate a url.
	 */
	validate(){
		let urlRegEx = /.*/;
		if (this.state.domain.length === 0){
			this.setState({
				errorMessage: 'URL cannot be empty',
				hasError: true,
			});
			return false;
		}
		else if (!this.state.domain.match(urlRegEx)){
			this.setState({
				errorMessage: 'Given URL is invalid',
				hasError: true,
			});
			return false;
		}

		return true;
	}

	/**
	 * Function which is called when user confirms a server url.
	 * It first validates the url and then saves it in the local storage.
	 */
	onClickHandler(){
		if (this.validate()){

			let prom = makeCancelablePromise(Storage.setItem('domain', this.state.domain));

			this.promises.push(prom);

			prom.promise
			.then(() => {
				console.log('Domain successfully set');
			})
			.catch(() => {
				console.log("Cann't store domain in storage");
			})
			.finally(() => {
				this.context.changeAppState({
					domain: this.state.domain,
					isDomainSet: true,
				});
			});
		}
	}

	componentWillUnmount(){
		for (let prom of this.promises){
			// Cancel any pending promises
			prom.cancel();
		}
	}

	render(){
		return (
			<ScrollView contentContainerStyle={{ backgroundColor: '#00ff55'}}>
				<Input
					placeholder="Your Server URL"
					leftIcon={
						<Icon
							name="web"
							type="material-community"
						/>
					}
					errorMessage={this.state.hasError ? this.state.errorMessage : undefined}
					errorStyle={{color: 'red'}}
					onChangeText={(domain)=>this.setState(()=>{
						return ({
							domain,
							hasError: false,
						});
					})}
					value={this.state.domain}
				/>
				<Divider />
				<Button
					title="Continue"
					onPress={this.onClickHandler}
				/>
			</ScrollView>
		);
	}

}
