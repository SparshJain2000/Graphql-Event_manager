import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
export default class Events extends Component {
    state = {
        modal: false,
    };
    toggleModal = () => this.setState({ modal: !this.state.modal });

    render() {
        return (
            <div className='row'>
                <div className='col-10 col-md-8 col-lg-7 mx-auto mt-5 my-sm-4 p-3 text-align-center border-secondary'>
                    <h4>Create your own Events !!!</h4>
                    <Button
                        color={"secondary"}
                        onClick={this.toggleModal}
                        className='mt-2'>
                        Create Event
                    </Button>
                </div>
                <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>
                        Modal title
                    </ModalHeader>
                    <ModalBody>
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit, sed do eiusmod tempor incididunt ut labore et
                        dolore magna aliqua. Ut enim ad minim veniam, quis
                        nostrud exercitation ullamco laboris nisi ut aliquip ex
                        ea commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu
                        fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                        non proident, sunt in culpa qui officia deserunt mollit
                        anim id est laborum.
                    </ModalBody>
                    <ModalFooter>
                        <Button color='secondary' onClick={this.toggleModal}>
                            Create
                        </Button>{" "}
                        <Button
                            color='outline-secondary'
                            onClick={this.toggleModal}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}
