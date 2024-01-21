import React, { Component } from "react";
import {
    getDatabase,
    ref,
    query,
    orderByChild,
    get,
    set,
    push, // Import push to generate unique IDs when adding new pictures
} from "firebase/database";
import "../../../App.css";

export default class Add_Pictures_to_album extends Component {
    state = {
        categoryName: null,
        pictureDataArray: [], // Store picture data along with IDs
        loading: true,
    };

    async componentDidMount() {
        const { categoryName } = this.props;

        try {
            const pictureDataArray = await this.fetchPictures(categoryName);

            this.setState({
                categoryName,
                pictureDataArray,
                loading: false,
            });
        } catch (error) {
            console.error("Error fetching pictures:", error);
            this.setState({
                loading: false,
            });
        }
    }

    fetchPictures = async (categoryName) => {
        const db = getDatabase();
        const picturesRef = ref(db, "Pictures");

        try {
            const allRecordsSnapshot = await get(
                query(picturesRef, orderByChild("category"))
            );

            const pictureDataArray = [];
            if (allRecordsSnapshot.exists()) {
                allRecordsSnapshot.forEach((childSnapshot) => {
                    const pictureData = {
                        id: childSnapshot.key, // Store the unique ID
                        ...childSnapshot.val(),
                    };

                    if (pictureData.category !== categoryName) {
                        pictureDataArray.push(pictureData);
                    }
                });
            }
            return pictureDataArray;
        } catch (error) {
            throw error;
        }
    };

    // ========================= update category =========================//
    handlePictureClick = async (pictureData) => {
        const { categoryName } = this.state;
        const db = getDatabase();
        const picturesRef = ref(db, "Pictures");
        // console.log(pictureData.url);
        try {
            // Update the category of the clicked picture
            // await set(
            //     ref(picturesRef, `${pictureData.id}/category`),
            //     categoryName
            // );
            await set(ref(db, "Pictures/" + pictureData.id), {
                category: this.state.categoryName,
                url: pictureData.url,
            });

            // Fetch updated pictures after the category change
            const pictureDataArray = await this.fetchPictures(categoryName);

            this.setState({
                pictureDataArray,
            });
        } catch (error) {
            console.error("Error updating picture category:", error);
        }
    };

    // ========================= render ================================//
    render() {
        const { pictureDataArray, loading } = this.state;

        if (loading) {
            return <p>Loading...</p>;
        }

        return (
            <div>
                <center>
                    <h3>Click Pictures to Add</h3>
                    <div className="img_div">
                        {pictureDataArray.map((pictureData) => (
                            <button
                                key={pictureData.id} // Use the unique ID as the key
                                onClick={() =>
                                    this.handlePictureClick(pictureData)
                                }
                                style={{ border: "none" }}
                            >
                                <img
                                    className="img_view_modal"
                                    src={pictureData.url}
                                    alt={`Picture ${pictureData.id}`}
                                />
                            </button>
                        ))}
                    </div>
                </center>
            </div>
        );
    }
}
