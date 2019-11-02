// Library Component Imports
import React, {Component} from 'react';
import {Input, Icon, Button, Divider} from 'react-native-elements';

// Asset Imports
import {AppContext} from './Contexts.js';
import Storage from './src/storage/Storage.js';

export default class EntryScreen extends Component{

	constructor(props){

		// Calling the parent constructor.
		super(props);

		this.state = {
			hasError: false,
			errorMessage: '',
			domain: '',
		};

		// Binding the functions to current object's context.
		this.validate = this.validate.bind(this);
		this.onClickHandler = this.onClickHandler.bind(this);
	}

	static contextType = AppContext;

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

		Storage.setItem('domain', this.state.domain);

		return true;
	}

	onClickHandler(){
		if (this.validate()){
			this.context.changeAppState({
				domain: this.state.domain,
				isDomainSet: true,
			});
		}
	}

	render(){
		return (
			<>
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
					style={{borderLeftColor: 'red'}}
					onPress={this.onClickHandler}
				/>
			</>
		);
	}

}
