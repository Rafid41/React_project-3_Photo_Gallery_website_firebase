import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getDatabase, ref, onValue } from "firebase/database";

const Comments = () => {
    const [pic, setPic] = useState(null);
    const [loading, setLoading] = useState(true);

    //========================= Load props from URL============================//
    const params = useParams();
    const { picture_id } = params;

    //=========================== Load picture from Firebase=====================//
    useEffect(() => {
        const db = getDatabase();
        const pictureRef = ref(db, "Pictures/" + picture_id);

        const fetchData = async () => {
            try {
                // Listen for changes in the data
                onValue(pictureRef, (snapshot) => {
                    const pictureData = snapshot.val();
                    setPic(pictureData);
                    setLoading(false);
                });
            } catch (error) {
                console.error("Error fetching picture:", error);
                setLoading(false);
            }
        };

        fetchData();

        // Cleanup the listener when the component unmounts
        // return () => {
        //     // Detach the listener
        //     onValue(pictureRef, null);
        // };
    }, [picture_id]); // Re-run effect when picture_id changes

    // =========================== get auth email from local storage ==========================//

    const email = localStorage.getItem("email");

    // =============================== return =================================//
    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : pic ? (
                <center>
                    <img
                        style={{
                            height: "27rem",
                            width: "40rem",
                        }}
                        src={pic.url}
                        alt="Picture"
                    />

                    <br />
                    <h3>
                        Category: <strong>{pic.category}</strong>
                    </h3>
                </center>
            ) : (
                <p>Picture not found</p>
            )}
            <br />
            <br />
            <center>
                <h2>Comments:</h2>
            </center>
        </div>
    );
};

export default Comments;
