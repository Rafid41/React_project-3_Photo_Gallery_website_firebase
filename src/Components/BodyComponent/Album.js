// src\Components\BodyComponent\Album.js
import React from "react";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import AddNewAlbumForm from "./AddNewAlbumForm";

class Album extends React.Component {
    // class component e useState() use kora jayna
    state = {
        // comments and dishes ekhn redux e
        modalOpen: false,
    };

    toggleModal = () => {
        this.setState({
            modalOpen: !this.state.modalOpen,
        });
    };

    // onClickHandler = () => {
    //     return (
    //         <div>
    //             <Modal isOpen={this.state.modalOpen}>
    //                 <ModalBody></ModalBody>

    //                 {/* close button */}
    //                 <ModalFooter>
    //                     <button
    //                         className="btn btn-primary"
    //                         onClick={this.toggleModal}
    //                     >
    //                         Close
    //                     </button>
    //                 </ModalFooter>
    //             </Modal>
    //         </div>
    //     );
    // };
    render() {
        return (
            <div>
                <div>
                    <Button
                        active
                        block
                        color="info"
                        onClick={this.toggleModal}
                    >
                        Add New Album
                    </Button>
                    <Modal isOpen={this.state.modalOpen}>
                        <ModalBody>{ <AddNewAlbumForm/>}</ModalBody>

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
                </div>
            </div>
        );
    }
}

export default Album;
