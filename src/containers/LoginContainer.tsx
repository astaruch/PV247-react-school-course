import {Dispatch} from 'redux';
import {connect} from 'react-redux';
import {ILoginDispatchProps, Login} from '../components/Login';
import {IUser} from '../models/IUser';

import * as authService from '../services/authService';
import {AUTH__FAIL, AUTH__SUCCESS, MESSAGE_APP_REGISTER_SUCCESS, MESSAGE_APP_REGISTERING_FAILED, USER_ALREADY_REGISTERED,
    LOGIN_EMAIL_DOES_NOT_EXIST} from '../constants/actionTypes';

const registrationFailed = (response: USER_ALREADY_REGISTERED): Action => ({
    type: MESSAGE_APP_REGISTERING_FAILED,
    payload: {
        response,
    }
});

const registrationSuccess = (user: IUser): Action => ({
    type: MESSAGE_APP_REGISTER_SUCCESS,
    payload: {
        user,
    }
});

const authSuccess = (currentUser: IUser): Action => ({
    type: AUTH__SUCCESS,
    payload: {
        currentUser
    }
});

const authFailed = (): Action => ({
    type: AUTH__FAIL,
    payload: {}
});

export const registerUser = (email: string, password: string): any => {
    return async (dispatch: Dispatch): Promise<void> => {
        console.log(`Registering user: ${email}| password: ${password}`);
        const result = await authService.registerUser(email, password);

        if (typeof result === 'string') {
            console.log('User is already registered.');
            dispatch(registrationFailed(result));
        } else {
            console.log('Registered a new user');
            dispatch(registrationSuccess(result));
        }
    };
};

export const loginUser = (email: string, password: string): any => {
    return async (dispatch: Dispatch): Promise<void> => {
        // AUTHENTICATION STARTED
        console.log(`Logging in: ${email} : ${password}`);
        const bearerTokenObj = await authService.authUser(email);

        if (typeof bearerTokenObj === 'object') {
            console.log('Type is object');
            localStorage.setItem('token', bearerTokenObj.token);
            const userObj = await authService.fetchUser(email, bearerTokenObj.token);
            if (userObj !== LOGIN_EMAIL_DOES_NOT_EXIST) {
                console.log('LOGIN OK');
                // save user to local storage
                localStorage.setItem('logged_user', JSON.stringify(userObj));
                dispatch(authSuccess(userObj));
            } else {
                // SOME ERROR
                console.log('non existing user');
                dispatch(authFailed());
            }
        } else {
            // AUTHENTICATION FAILED
            console.log('It is AUTH__FAIL');
            dispatch(authFailed());
        }
    };
};


const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        onLogin: (username: string, password: string) => dispatch(loginUser(username, password))
    };
};
export const LoginContainer =
    connect<void, ILoginDispatchProps>(null, mapDispatchToProps)(Login);
