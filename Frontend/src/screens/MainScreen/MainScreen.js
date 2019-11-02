import React, { Component } from 'react';
import UserScreen from '../UserScreen/UserScreen.js';
import AdminScreen from '../AdminScreen/AdminScreen.js';

import {AppContext} from '../../../Contexts.js';
import {modes} from '../../../Constants.js';
export default class MainScreen extends Component {

    static contextType = AppContext;

    render() {
        return (
            this.context.mode === modes.USER ?
            <UserScreen /> :
            <AdminScreen />
        );
    }
}
