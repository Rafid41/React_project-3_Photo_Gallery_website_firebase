// src\Components\Auth\Logout.js
import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../../redux/authActionCreators";

const mapDispatchToProps = (dispatch) => {
    return {
        logout: () => dispatch(logout()),
    };
};

class Logout extends Component {
    // logout hbe
    componentDidMount() {
        this.props.logout();
    }

    // redirect kore main link e niye jabe
    render() {
        return <Navigate to="/" replace />;
    }
}

export default connect(null, mapDispatchToProps)(Logout);
