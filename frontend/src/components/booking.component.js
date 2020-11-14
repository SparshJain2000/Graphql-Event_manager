import Axios from "axios";
import React, { useState, useContext } from "react";
import { useHistory } from "react-router";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import "../stylesheets/event.css";
import AuthContext from "../context/auth-context";

const Booking = ({ booking, cancelBooking }) => {
    const context = useContext(AuthContext);
    const history = useHistory();
    const [modal, setModal] = useState(false);
    const toggleModal = () => setModal(!modal);
    const cancel = () => {
        cancelBooking(booking._id);
        toggleModal();
    };
    return (
        <div
            className='border-secondary row p-3 event my-2  mx-1 d-flex justify-content-center align-content-center'
            key={booking._id}>
            <div className='col-12 col-sm-9 px-0 mb-3 mb-sm-0'>
                <h5 className='color-primary'>{booking.event.title}</h5>
                <h6>
                    {new Intl.DateTimeFormat("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                    }).format(new Date(booking.event.date))}
                </h6>
            </div>

            <div
                className='col-12 col-sm-3 px-0 my-auto d-flex justify-content-center justify-content-sm-end'
                style={{ height: "fit-content" }}>
                <Button color='secondary' onClick={toggleModal}>
                    Cancel
                </Button>
            </div>
            <Modal isOpen={modal} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>Cancel Event</ModalHeader>
                <ModalBody>
                    Are you sure you want to cancel this Event ?
                </ModalBody>
                <ModalFooter>
                    <Button color='secondary' onClick={cancel}>
                        Yes
                    </Button>
                    <Button color='outline-secondary' onClick={toggleModal}>
                        No
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default Booking;
