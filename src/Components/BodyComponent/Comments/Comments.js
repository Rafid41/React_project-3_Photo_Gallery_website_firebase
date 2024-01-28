import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import LoadAndWriteComments from "./LoadAndWriteComments";
import {
    getDatabase,
    ref,
    onValue,
    query,
    equalTo,
    get,
    orderByChild,
} from "firebase/database";

//=========================== fetching username =========================//
async function fetchUN(email) {
    const db = getDatabase();
    const Ref = ref(db, "Credentials");

    try {
        const allRecordsSnapshot = await get(query(Ref, orderByChild("email")));

        let username = null;
        if (allRecordsSnapshot.exists()) {
            allRecordsSnapshot.forEach((childSnapshot) => {
                const usernameData = {
                    id: childSnapshot.key, // Store the unique ID
                    ...childSnapshot.val(),
                };

                if (usernameData.email === email) {
                    username = usernameData.username;
                    return username;
                }
            });
        }
        return username;
    } catch (error) {
        throw error;
    }
}

// ======================== main comment fn ===========================//

const Comments = () => {
    const [userName, setUserName] = useState(null);
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
    fetchUN(email)
        .then((username) => {
            setUserName(username);
        })
        .catch((error) => {
            console.error("Error fetching username:", error);
        });

    // console.log(userName);

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
                <br />
            </center>
            <LoadAndWriteComments picture_id={picture_id} username={userName} />
        </div>
    );
};

export default Comments;
