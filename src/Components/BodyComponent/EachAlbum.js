// src\Components\BodyComponent\EachAlbum.js
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "../../App.css";
import { Modal, ModalBody, ModalFooter } from "reactstrap";
import Add_Pictures_to_album from "./EachAlbum_Subfolders/Add_Pictures_to_album";

const EachAlbum = () => {
    // ==========modal state and function ===========//
    const [modalOpen, setModalOpen] = useState(false);

    const toggleModal = () => {
        setModalOpen(!modalOpen);
    };

    // =========== dynamic parameters from url ==============//
    const params = useParams();
    const { categoryName } = params;

    return (
        <div>
            {/* ========== modal ============= */}
            <Modal isOpen={modalOpen}>
                <ModalBody>
                    <Add_Pictures_to_album categoryName={categoryName} />
                </ModalBody>

                {/* close button */}
                <ModalFooter>
                    <button className="btn btn-primary" onClick={toggleModal}>
                        Close
                    </button>
                </ModalFooter>
            </Modal>

            {/* ================== album============ */}
            <center>
                <h2>Album: {categoryName}</h2>
                <br />
            </center>

            {/* ===================== modal open button================ */}
            <button
                className="addNewAlbumButton"
                active
                color="info"
                onClick={toggleModal}
            >
                Add Pictures to this Album
            </button>
        </div>
    );
};

export default EachAlbum;
