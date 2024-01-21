// src\Components\BodyComponent\EachAlbum.js
import React from "react";
import { useParams } from "react-router-dom";

const EachAlbum = () => {
    const params = useParams();
    const { categoryName } = params;

    return (
        <div>
            <center>
                <h2>Album: {categoryName}</h2>
            </center>
        </div>
    );
};

export default EachAlbum;
