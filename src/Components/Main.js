// src\Components\Main.js
import React, { Component } from "react";
import Header from "./Header/Header";
import { Route, Routes, Redirect, Navigate } from "react-router-dom";
import Auth from "./Auth/Auth";
import { connect } from "react-redux";
import { authCheck } from "../redux/authActionCreators";
import Logout from "./Auth/Logout";
import Home from "./BodyComponent/Home";
import Album from "./BodyComponent/Album";

const mapStateToProps = (state) => {
    return {
        token: state.token,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        authCheck: () => dispatch(authCheck()),
    };
};

class Main extends Component {
    componentDidMount() {
        //  check j login token diye auto login korte parbe kina
        this.props.authCheck();
    }

    render() {
        let routes = null;
        // user not authenticated
        if (this.props.token === null) {
            routes = (
                <Routes>
                    <Route path="/login" element={<Auth />} />
                    {/* kono kisur sathe match na hole login */}
                    <Route
                        path="*"
                        element={<Navigate to="/login" replace />}
                    />
                </Routes>
            );
        } else {
            routes = (
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/album" element={<Album />} />
                    {/* kono kisur sathe match na hole "/" */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            );
        }
        return (
            <div>
                <Header />

                {/* container class left right kisu padding dey */}
                <div className="container">{routes}</div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
