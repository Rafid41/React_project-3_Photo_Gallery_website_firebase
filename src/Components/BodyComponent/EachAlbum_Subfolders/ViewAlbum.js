// src\Components\BodyComponent\EachAlbum_Subfolders\ViewAlbum.js
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

export default class ViewAlbum extends Component {
    state = {
        categoryName: null,
        pictureDataArray: [], // Store picture data along with IDs
        loading: true,
        refresh_screen: false,
    };

    async refresh() {
        this.setState({ refresh_screen: true });
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

    // ============== fetch pics ==================//
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

                    if (pictureData.category === categoryName) {
                        pictureDataArray.push(pictureData);
                    }
                });
            }
            return pictureDataArray;
        } catch (error) {
            throw error;
        }
    };

    // ============================ render ==============================//

    render() {
        if (this.state.refresh_screen == false) {
            this.refresh();
        }
        console.log("s");
        const { pictureDataArray, loading } = this.state;

        if (loading) {
            return <p>Loading...</p>;
        }

        return (
            <div>
                <center>
                    <div className="img_div">
                        {pictureDataArray.map((pictureData) => (
                            <img
                                className="img_view"
                                src={pictureData.url}
                                alt={`Picture ${pictureData.id}`}
                            />
                        ))}
                    </div>
                </center>
            </div>
        );
    }
}
