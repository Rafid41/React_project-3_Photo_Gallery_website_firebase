import React, { useState, useEffect } from "react";
import { storage } from "../../firebase/firebase";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

// image or not
function if_image(name) {
    var s = "";
    for (let i = name.length - 1; i >= 0; i--) {
        if (name[i] === ".") break;
        s = name[i] + s;
    }
    return s === "jpg" || s === "png" || s === "jpeg";
}

export const Home = () => {
    let init_size;
    const [imageUpload, setImageUpload] = useState(null);
    const [imageList, setImageList] = useState(new Set());

    const imageListRef = ref(storage, "images/");

    const uploadImage = () => {
        if (imageUpload == null) return;

        // image or not
        if (!if_image(imageUpload.name)) {
            alert("Supported formats: jpg, png, and jpeg");
            return;
        }

        const random_name = imageUpload.name + v4();
        const imageRef = ref(storage, `images/${random_name}`);

        uploadBytes(imageRef, imageUpload).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                setImageList((prev) => new Set([...prev, url]));
                alert("Image Uploaded");
            });
        });
    };

    function refresh() {
        listAll(imageListRef).then((response) => {
            const uniqueUrls = new Set(imageList);

            response.items.forEach((item) => {
                getDownloadURL(item).then((url) => {
                    setImageList((prev) => [...prev, url]);
                    // uniqueUrls.add(url);
                });
            });

            // setImageList(uniqueUrls);
        });
    }

    // disploy er age refresh er bodole eta dite hbe
    // useEffect(() => {
    //     listAll(imageListRef).then((response) => {
    //         const uniqueUrls = new Set(imageList);

    //         response.items.forEach((item) => {
    //             getDownloadURL(item).then((url) => {
    //                 setImageList((prev) => [...prev, url]);
    //                 // uniqueUrls.add(url);
    //             });
    //         });

    //         // setImageList(uniqueUrls);
    //     });
    // }, []);

    // setImageList to set
    const ListsOfImageList = new Set(imageList);
    // Convert the Set to an array and sort it
    const sortedImgArray = Array.from(ListsOfImageList);

    // Create a new Set from the sorted array
    //sortedImgArray.sort();

    //size of sorted array
    let size = sortedImgArray.length;

    let form = (
        <div>
            <input
                type="file"
                onChange={(event) => {
                    setImageUpload(event.target.files[0]);
                }}
            />
            <button onClick={uploadImage} className="btn btn-primary">
                Upload Image
            </button>
            <button onClick={refresh} className="btn btn-primary">
                Refresh Page
            </button>
            <hr />
            <hr />
            <div className="img_div">
                {Array.from(sortedImgArray).map((url) => {
                    return <img key={url} src={url} alt="Uploaded" />;
                })}
            </div>
        </div>
    );

    if (sortedImgArray.length != init_size) {
        init_size = sortedImgArray.length;
        console.log(sortedImgArray.length);
        return <div className="App">{form}</div>;
    }
};

export const sortedImgArray = Home.sortedImgArray;
