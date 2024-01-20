// src\Components\BodyComponent\AddNewAlbumForm.js
import React, { Component } from "react";
import { Button, Form, Label, Input, UncontrolledAlert } from "reactstrap";
import { getDatabase, ref, set, onValue, child, get } from "firebase/database";


export default class AddNewAlbumForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Alert_data_exists: false,
            ALert_album_added: false,
            Alert_error: false,
        };
    }
    // post to firebase
    writeUserData(newAlbum) {
        const db = getDatabase();
        set(ref(db, "Categories/" + newAlbum), {
            category_name: newAlbum,
        });
        this.setState({ ALert_album_added: true });
    }

    // read if value already exists or not
    ifDataExists(newAlbum) {
        let data = null;
        const db = getDatabase();
        const starCountRef = ref(db, "Categories/" + newAlbum);
        onValue(starCountRef, (snapshot) => {
            data = snapshot.val();
            console.log(data);
        });

        if (data != null) return true;
        return false;
    }

    // async ifDataExists(newAlbum) {
    //     const db = getDatabase();
    //     const starCountRef = ref(db, "Categories/" + newAlbum);
    //     let data = null;
    
    //     return new Promise((resolve, reject) => {
    //         onValue(starCountRef, (snapshot) => {
    //             data = snapshot.val();
    //             console.log(data);
    //             resolve(data);
    //         }, (error) => {
    //             console.error("Error fetching data:", error);
    //             reject(error);
    //         });
    //     });
    // }
    //  helper
    // async existsOrNot(newAlbum) {
    //     try {
    //         const exists = await this.ifDataExists(newAlbum);
    //         var x = (exists == null ? false : true);
    //         // console.log("x=",x);
    //         return x;
    //     } catch (error) {
    //         return "error";
    //     }
    // }

    //==============================Submit handler=============================//
    
    handleSubmit = (event) => {
        event.preventDefault();
        
        const newAlbum = event.target.elements.newAlbum.value;
        var x=this.ifDataExists(newAlbum);
        
         
        //=================================== error=====================//
        // if (x=="error") {
        //     this.setState({ Alert_error: true });

        //     setTimeout(() => {
        //         this.setState({ Alert_error: false });
        //     }, 2000);
        // }
        //======================== exists =================================//
        if (x == true) {
            
            this.setState({ Alert_data_exists: true });

            setTimeout(() => {
                this.setState({ Alert_data_exists: false });
            }, 2000);
        }
        
        //====================================================//
        else {
            this.writeUserData(newAlbum);
            setTimeout(() => {
                this.setState({ Alert_album_added: false });
            }, 2000);
        }
       
    };


    //==============================================================================//

    render() {
        return (
            <div className="container" style={{ padding: "2rem" }}>
                {/* error */}
                {this.state.Alert_error && (
                    <UncontrolledAlert color="danger">
                        Something went wrong
                    </UncontrolledAlert>
                )}

                {/* data exists alert */}
                {this.state.Alert_data_exists && (
                    <UncontrolledAlert color="danger">
                        Album already exists! Enter a new Name
                    </UncontrolledAlert>
                )}

                {/* add album alert */}
                {this.state.ALert_album_added && (
                    <UncontrolledAlert color="success">
                        Album added successfully
                    </UncontrolledAlert>
                )}
                <Form onSubmit={this.handleSubmit}>
                    <Input
                        placeholder="Enter Album Name:"
                        type="text"
                        name="newAlbum"
                    />
                    <br />
                    <br />
                    <Button type="submit" className="btn btn-success">
                        Add Album
                    </Button>
                </Form>
            </div>
        );
    }
}
