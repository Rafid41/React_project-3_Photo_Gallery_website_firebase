import React, { Component } from "react";
import { storage } from "../../firebase/firebase";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import "../../App.css";
import { Modal, ModalBody, ModalFooter } from "reactstrap";
import {
    getDatabase,
    set,
    query,
    ref as ref_data,
    get,
    orderByChild,
} from "firebase/database";
import { Link } from "react-router-dom";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageUpload: null,
            imageList: new Set(),
            modalOpen: false,
            refresh_screen: false,
            pictureDataArray: [],
            loading: false,

            // refresh_2
            refresh2: true,
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
            category: "All",
        });
        this.setState({ ALert_album_added: true });
    }

    //================== modal======================//
    toggleModal = () => {
        this.setState({
            modalOpen: !this.state.modalOpen,
        });

        if (this.state.modalOpen) {
            window.location.reload();
        }
    };

    //================ image or not ==================//
    if_image(name) {
        var s = "";
        for (let i = name.length - 1; i >= 0; i--) {
            if (name[i] === ".") break;
            s = name[i] + s;
        }
        return s === "jpg" || s === "png" || s === "jpeg";
    }

    // ====================== upload img =======================//
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
    // ===================== refresh =================//
    // refresh = () => {
    //     const { imageList } = this.state;
    //     this.setState({ refresh_screen: true });

    //     listAll(this.imageListRef).then((response) => {
    //         const uniqueUrls = new Set(imageList);

    //         response.items.forEach((item) => {
    //             getDownloadURL(item).then((url) => {
    //                 this.setState((prevState) => ({
    //                     imageList: new Set([...prevState.imageList, url]),
    //                 }));
    //             });
    //         });
    //     });
    // };

    // ============== fetch pics ==================//
    fetchPictures = async () => {
        const db = getDatabase();
        const picturesRef = ref_data(db, "Pictures");

        try {
            const allRecordsSnapshot = await get(
                query(picturesRef, orderByChild("url"))
            );

            const pictureDataArray = [];

            if (allRecordsSnapshot.exists()) {
                allRecordsSnapshot.forEach((childSnapshot) => {
                    const pictureData = {
                        id: childSnapshot.key, // Store the unique ID
                        ...childSnapshot.val(),
                    };

                    pictureDataArray.push(pictureData);
                });
            }
            return pictureDataArray;
        } catch (error) {
            throw error;
        }
    };

    // =================== component did mount =================//
    componentDidMount = () => {
        this.refresh_2();
    };
    async refresh_2() {
        try {
            const pictureDataArray = await this.fetchPictures();

            this.setState({
                pictureDataArray: pictureDataArray,
                loading: false,
                // refresh2
                refresh2: false,
            });
        } catch (error) {
            console.error("Error fetching pictures:", error);
            this.setState({
                loading: false,
            });
        }
    }

    // ======================== component did update =======================//

    render() {
        // if (this.state.refresh2 == true) {
        //     this.refresh_2();
        // }
        // if (this.state.refresh_screen == false) {
        //     this.refresh();
        // }
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
                    {this.state.pictureDataArray.map((pictureData, index) => (
                        <Link
                            to={`/comments/${"Home"}/${pictureData.id} `}
                            key={index}
                        >
                            <img
                                className="img_view"
                                src={pictureData.url}
                                alt={`Picture ${pictureData.id}`}
                            />
                        </Link>
                    ))}
                </div>
                {/* ============================================= */}
                {/* <div className="img_div">
                    {sortedImgArray.map((url) => (
                        <img
                            className="img_view"
                            key={url}
                            src={url}
                            alt="Uploaded"
                        />
                    ))}
                </div> */}
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
