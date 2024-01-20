// src\Components\BodyComponent\CurrentAlbumLists.js
/*
import React from "react";
import { getDatabase, ref, set, onValue, child, get } from "firebase/database";
import { ListGroup, ListGroupItem, Button } from "reactstrap";
import "../../App.css";

function retreiveCategories() {
    let dataList = [];
    const db = getDatabase();
    const starCountRef = ref(db, "Categories/");
    onValue(starCountRef, (snapshot) => {
        let data = null;
        data = snapshot.val();
        if (data != null) {
            dataList.push(Object.keys(data));
            // dataList.push(
            //     <button className="album_list_btn">{Object.keys(data)}</button>
            // );
        }
    });

    return dataList;
}
const CurrentAlbumLists = () => {
    const dataS = retreiveCategories();
    let dataList = [];
    for (let i = 0; i < dataS[0].length; i++) {
        dataList.push(dataS[0][i]);
    }
    console.log(dataList[2]);

    return (
        <div className="custom_container">
            <center>
                {dataList.map((categoryName, index) => (
                    <button key={index} className="album_list_btn">
                        {categoryName}
                    </button>
                ))}
            </center>
        </div>
    );
};

export default CurrentAlbumLists;
*/
import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { Button } from "reactstrap";
import "../../App.css";

const CurrentAlbumLists = () => {
    const [dataList, setDataList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const db = getDatabase();
                const starCountRef = ref(db, "Categories/");
                const snapshot = await onValue(starCountRef, (snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        const categoryNames = Object.keys(data);
                        setDataList(categoryNames);
                    }
                });
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []); // Empty dependency array means this effect runs once after the initial render

    return (
        <div className="custom_container">
            <center>
                {dataList.map((categoryName, index) => (
                    <button key={index} className="album_list_btn">
                        {categoryName}
                    </button>
                ))}
            </center>
        </div>
    );
};

export default CurrentAlbumLists;
