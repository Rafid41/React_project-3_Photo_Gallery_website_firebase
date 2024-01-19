// src\Components\BodyComponent\AddNewAlbumForm.js
import React, { Component } from "react";
import { Button, Form, Label, Input } from "reactstrap";
import { getDatabase, ref, set } from "firebase/database";

// function writeUserData(userId, name, email, imageUrl) {
//     const db = getDatabase();
//     set(ref(db, "users/" + userId), {
//         username: name,
//         email: email,
//         profile_picture: imageUrl,
//     });
// }

export default class AddNewAlbumForm extends Component {

    writeUserData(newAlbum) {
        const db = getDatabase();
        set(ref(db, "Categories/" + newAlbum), {
            Category_name: newAlbum,
        });
        alert("New Album added");
    }


    handleSubmit = (event) => {
        // addComment fn call kora holo
        const newAlbum = event.target.elements.newAlbum.value;

        this.writeUserData(newAlbum);
        event.preventDefault();
    };

    render() {
        return (
            <div className="container" style={{padding: "2rem"}}>
                <Form onSubmit={this.handleSubmit}>
                    <Input placeholder="Enter Album Name:" type="text" name="newAlbum" />
                    <br />
                    <br/>
                    <Button type="submit" className="btn btn-success">
                        Add Album
                    </Button>
                </Form>
            </div>
        );
    }
}
