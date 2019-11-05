// Library Component Imports
import React from 'react';

// Asset Imports
import {modes} from './Constants.js';

/**
 * Global Application context which provides all the components
 * with the most useful information about the application's state.
 */
export let AppContext = React.createContext({
    isLoggedIn: false,
    isDomainSet: false,
    mode: modes.ANONYMOUS,
    id: '',
    token: '',
    openAdminPages: false,
    openSignUpPage: false,
    domain: '',
    changeAppState: () => {},
});
