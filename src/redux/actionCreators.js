// src\redux\actionCreators.js

import * as actionTypes from "./actionTypes";
import axios from "axios";
import { getDatabase, ref, set, onValue, child, get } from "firebase/database";


//=================lOAD CATEGORIES==========//
export const loadCategories = (orders) => {
    return {
        type: actionTypes.LOAD_CATEGORIES,
        payload: orders,
    };
};

export const categoryLoadFailed = () => {
    return {
        type: actionTypes.CATEGORIES_LOAD_FAILED,
    };
};

// dispatch above 2 fn
// firebase auth token for secure viewing order history
export const fetchOrders = (newAlbum) => (dispatch) => {
    const db = getDatabase();
    const Ref = ref(db, "Categories/" + newAlbum);
    // //'&orderBy=userId' er 'userId' string firebase database er 'userId' column_name
    // const queryParams = '&orderBy="userId"&equalTo="' + userId + '"';
    // //don't use tabnine here
    axios
        .get(
            `https://react-photo-gallery-app-2-default-rtdb.asia-southeast1.firebasedatabase.app/Categories/${Ref}.json`)
        .then((response) => {
            //load order to redux
            dispatch(loadCategories(response.data));
        })
        .catch((err) => {
            dispatch(categoryLoadFailed());
        });
};
