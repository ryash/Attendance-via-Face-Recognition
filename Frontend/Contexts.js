// Library Component Imports
import React from 'react';

// Asset Imports
import {modes} from './Constants.js';

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
