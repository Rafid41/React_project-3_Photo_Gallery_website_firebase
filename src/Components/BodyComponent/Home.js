import React, { Component } from "react";
import { storage } from "../../firebase/firebase";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import "../../App.css";
import { Modal, ModalBody, ModalFooter } from "reactstrap";
import {
    getDatabase,
    set,
    ref as ref_data,
    onValue,
    child,
    get,
} from "firebase/database";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageUpload: null,
            imageList: new Set(),
            modalOpen: false,
            // pic_id: 0,
            refresh_screen: false,
        };
        this.imageListRef = ref(storage, "images/");
    }

    //======================== firebase =================//
    // post to firebase
    pictureUrlToFirebase(pic_Url) {
        // seconds as unique id
        var seconds = new Date().getTime();
        const db = getDatabase();
        set(ref_data(db, "Pictures/" + seconds), {
            url: pic_Url,
            category: "",
        });
        this.setState({ ALert_album_added: true });
    }

    //================== modal======================//
    toggleModal = () => {
        this.setState({
            modalOpen: !this.state.modalOpen,
        });
    };

    // image or not
    if_image(name) {
        var s = "";
        for (let i = name.length - 1; i >= 0; i--) {
            if (name[i] === ".") break;
            s = name[i] + s;
        }
        return s === "jpg" || s === "png" || s === "jpeg";
    }

    uploadImage = () => {
        const { imageUpload, imageList } = this.state;

        if (imageUpload == null) return;

        // image or not
        if (!this.if_image(imageUpload.name)) {
            alert("Supported formats: jpg, png, and jpeg");
            return;
        }

        const random_name = imageUpload.name + v4();
        const imageRef = ref(storage, `images/${random_name}`);

        uploadBytes(imageRef, imageUpload).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                this.setState((prevState) => ({
                    imageList: new Set([...prevState.imageList, url]),
                }));
                alert("Image Uploaded");
                this.pictureUrlToFirebase(url);
            });
        });
    };

    refresh = () => {
        const { imageList } = this.state;
        this.setState({ refresh_screen: true });

        listAll(this.imageListRef).then((response) => {
            const uniqueUrls = new Set(imageList);

            response.items.forEach((item) => {
                getDownloadURL(item).then((url) => {
                    this.setState((prevState) => ({
                        imageList: new Set([...prevState.imageList, url]),
                    }));
                });
            });
        });
    };

    render() {
        if (this.state.refresh_screen == false) {
            this.refresh();
        }
        const { imageList } = this.state;
        var i = 0;
        console.log(i);

        // setImageList to set
        const ListsOfImageList = new Set(imageList);
        // Convert the Set to an array and sort it
        const sortedImgArray = Array.from(ListsOfImageList);

        return (
            <div className="App">
                <h2>All Pictures</h2>
                <div className="img_div">
                    {sortedImgArray.map((url) => (
                        <img
                            className="img_view"
                            key={url}
                            src={url}
                            alt="Uploaded"
                        />
                    ))}
                </div>
                {/* ================= modal =================== */}
                <Modal isOpen={this.state.modalOpen}>
                    <ModalBody>
                        <input
                            type="file"
                            onChange={(event) => {
                                this.setState({
                                    imageUpload: event.target.files[0],
                                });
                            }}
                        />
                        <button
                            onClick={this.uploadImage}
                            className="btn btn-primary"
                        >
                            Upload Image
                        </button>
                    </ModalBody>

                    {/* close button */}
                    <ModalFooter>
                        <button
                            className="btn btn-primary"
                            onClick={this.toggleModal}
                        >
                            Close
                        </button>
                    </ModalFooter>
                </Modal>
                <button
                    className="addNewAlbumButton"
                    active
                    color="info"
                    onClick={this.toggleModal}
                >
                    Upload Picture
                </button>
            </div>
        );
    }
}

export default Home;
