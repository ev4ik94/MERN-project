import React from 'react';


function noop(){};

export const AuthContext = React.createContext({
    token: null,
    userId: null,
    login: noop,
    logout: noop,
    isAuthenticated: false
});
