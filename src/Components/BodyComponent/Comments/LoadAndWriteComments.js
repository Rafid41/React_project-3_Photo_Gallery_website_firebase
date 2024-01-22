import React, { Component } from "react";
import { Formik } from "formik";
import "../../../App.css";
import { ListGroup, ListGroupItem } from "reactstrap";
import {
    getDatabase,
    ref,
    set,
    onValue,
    child,
    get,
    query,
    orderByChild,
} from "firebase/database";

class LoadAndWriteComments extends Component {
    state = {
        commentDataArray: [], // Store picture data along with IDs
        loading: true,
        refresh_screen: false,
    };
    //====================== post comment  firebase =====================//
    commentToDatabase(comment, picture_id, username) {
        const db = getDatabase();
        var seconds = new Date().getTime();
        set(ref(db, "Comments/" + seconds), {
            picture_id: picture_id,
            username: username,
            dateTime: Date(seconds),
            commentText: comment,
        });
    }
    // ==================== refresh =====================//
    async refresh() {
        this.setState({ refresh_screen: true });
        const { picture_id, username } = this.props;

        try {
            const commentDataArray = await this.fetchComments(picture_id);

            this.setState({
                commentDataArray,
                loading: false,
                refresh_screen: true,
            });
        } catch (error) {
            console.error("Error fetching pictures:", error);
            this.setState({
                loading: false,
            });
        }
    }

    // ============== fetch comments ==================//
    fetchComments = async (picture_id) => {
        const db = getDatabase();
        const Ref = ref(db, "Comments");

        try {
            const allRecordsSnapshot = await get(
                query(Ref, orderByChild("picture_id"))
            );

            const commentDataArray = [];
            if (allRecordsSnapshot.exists()) {
                allRecordsSnapshot.forEach((childSnapshot) => {
                    const commentData = {
                        id: childSnapshot.key, // Store the unique ID
                        ...childSnapshot.val(),
                    };

                    if (commentData.picture_id === picture_id) {
                        commentDataArray.push(commentData);
                    }
                });
            }
            return commentDataArray;
        } catch (error) {
            throw error;
        }
    };

    // ==========================  render ===================================//
    render() {
        // ===================== props =======================//
        const { picture_id, username } = this.props;

        if (this.state.refresh_screen == false) {
            this.refresh();
        }
        // console.log("text");

        //========================= comment  form =======================//
        const form = (
            <Formik
                initialValues={
                    // j field gulo thakbe auth page e
                    {
                        comment: "",
                    }
                }
                onSubmit={(values, { resetForm }) => {
                    // console.log(values.comment);
                    this.commentToDatabase(
                        values.comment,
                        picture_id,
                        username
                    );
                    resetForm();
                }}
                //==================== validation ==================//
                // for validation, built in props
                // validation check failed hole r shamne agabe na
                validate={(values) => {
                    const errors = {};
                    // empty kina
                    if (!values.comment) {
                        errors.email = "Required";
                    }

                    //console.log("Errors",errors);
                    return errors;
                }}
            >
                {/* ei fn er vitor form render kora hbe */}
                {/* handleChange built in formik fn, er maddhome field er value auto form e upate hy */}
                {/* handleSubmit o built in fn */}
                {/* errors => to show errors under field input */}
                {({ values, handleChange, handleSubmit, errors }) => (
                    <div
                        style={{
                            border: "1px grey solid",
                            padding: "30px",
                            borderRadius: "7px",
                        }}
                    >
                        <br />
                        <form onSubmit={handleSubmit}>
                            {/* field "name" will be same as initialValues field_names */}
                            <p style={{ color: "red" }}>
                                <strong>
                                    Note: To View the Updated Comment, You'll
                                    have to Refresh the Page
                                </strong>
                            </p>
                            <br />
                            <input
                                name="comment"
                                placeholder="Write comment"
                                className="form-control"
                                value={values.comment}
                                onChange={handleChange}
                            />
                            <span style={{ color: "red" }}>
                                {errors.comment}
                            </span>

                            <br />

                            <button type="submit" className="btn btn-info">
                                Comment
                            </button>
                        </form>
                    </div>
                )}
            </Formik>
        );
        //========================== return ========================//
        return (
            <div>
                <ListGroup>
                    {this.state.commentDataArray.map((commentData) => (
                        <ListGroupItem
                            desabled
                            href="#"
                            tag="a"
                            style={{ textAlign: "left" }}
                        >
                            <h5 style={{ color: "blue" }}>
                                {commentData.username}
                            </h5>
                            <p>{commentData.commentText}</p>
                        </ListGroupItem>
                    ))}
                </ListGroup>
                {form}
                <br />
            </div>
        );
    }
}

export default LoadAndWriteComments;
