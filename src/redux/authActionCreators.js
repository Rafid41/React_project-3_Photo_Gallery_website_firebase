// src\redux\authActionCreators.js
import * as actionTypes from "./actionTypes";
import axios from "axios";
import { getDatabase, ref, set } from "firebase/database";

//  eta dispatch hbe jokhn kono response ashbe firebase theke, means login/signUp hole
//  nicher auth fn theke dis[atch hye kehane ashbe, erpor reducer.js e jabe]
export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        payload: {
            token: token,
            userId: userId,
        },
    };
};

export const authLoading = (isLoading) => {
    return {
        type: actionTypes.AUTH_LOADING,
        payload: isLoading,
    };
};

// Firbase authentication Failed
export const authFailed = (errMsg) => {
    return {
        type: actionTypes.AUTH_FAILED,
        payload: errMsg,
    };
};

export const auth = (username, email, password, mode) => (dispatch) => {
    dispatch(authLoading(true)); // true ta payLoad hisebe pass hbe

    const authData = {
        email: email,
        password: password,
        returnSecureToken: true, // for firebase structure
    };
    // VVI NOTE:FIREBASE weak/common/repeating character pass dle bad request ashe and request send hyna

    let authUrl = null;
    if (mode === "Sign Up") {
        authUrl =
            "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=";
    } else {
        authUrl =
            "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=";
    }
    // post link collected from: https://firebase.google.com/docs/reference/rest/auth
    // this is default link for post
    // API key from Firebase -> settings -> project settings-> web API Key
    let error = false;
    const API_KEY = "AIzaSyBrZUeuqhadwkIwIZAKHBy9s3LQ3y6UiaQ";
    axios
        .post(authUrl + API_KEY, authData)
        .then((response) => {
            dispatch(authLoading(false));
            // set token in browsers local storage
            localStorage.setItem("token", response.data.idToken);
            localStorage.setItem("userId", response.data.localId);

            // new Date().getTime() return kore current time in milliseconds
            // response.data.expiresIn return kore second e, tai 1000 multiply kora hoise
            // eta abar Date e convert hbe
            const expirationTime = new Date(
                new Date().getTime() + response.data.expiresIn * 2000
            );
            localStorage.setItem("expirationTime", expirationTime);

            dispatch(authSuccess(response.data.idToken, response.data.localId));
        })
        .catch((err) => {
            dispatch(authLoading(false));
            dispatch(authFailed(err.response.data.error.message));
            error = true;
        });

    //store in credentials table
    if (error == false && mode === "Sign Up") {
        const db = getDatabase();
        // seconds will be unique user ID
        var seconds = new Date().getTime();
        // console.log(seconds);
        set(ref(db, "Credentials/" + seconds), {
            email: email,
            username: username,
        });
    }

    // set email to local storage
    localStorage.setItem("email", email);
};

//auto logout actions for auth token
export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");

    return {
        type: actionTypes.AUTH_LOGOUT,
    };
};

// app load holei eta call korte hbe Main.js theke
export const authCheck = () => (dispatch) => {
    const token = localStorage.getItem("token");

    if (!token) {
        // token na thakle logout
        dispatch(logout());
    } else {
        // string return kore, new Date() oitake dateTime e convert kore
        const expirationTime = new Date(localStorage.getItem("expirationTime"));

        // time expire kina chk
        if (expirationTime <= new Date()) {
            //logout
            dispatch(logout());
        } else {
            const userId = localStorage.getItem("userId");
            dispatch(authSuccess(token, userId));
        }
    }
};
