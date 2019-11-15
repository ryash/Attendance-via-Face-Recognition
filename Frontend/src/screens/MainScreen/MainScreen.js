import React, { Component } from 'react';
import UserScreen from '../UserScreen/UserScreen.js';
import AdminScreen from '../AdminScreen/AdminScreen.js';

import {AppContext} from '../../../Contexts.js';
import {modes} from '../../../Constants.js';

/**
 * Container Component which renders the appropriate Presentational Component
 * according to the logged in user.
 * This component applies to the faculties/students.
 */
export default class MainScreen extends Component {

    /**
     * Getting the current nearest context to get the data from.
     * This context will have id and token of the faculty to authenticate him on the server
     * along with other useful information.
     */
    static contextType = AppContext;

    render() {
        return (
            this.context.mode === modes.USER ?
            <UserScreen /> :
            <AdminScreen />
        );
    }
}
