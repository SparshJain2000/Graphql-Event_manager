import React, { useState } from "react";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Label,
    FormGroup,
    Input,
} from "reactstrap";
import "../stylesheets/event.css";
export default Event = ({ event, user }) => {
    const [modal, setModal] = useState(false);
    const toggleModal = () => setModal(!modal);
    return (
        <div
            className='border-secondary row p-3 event my-2  mx-1 d-flex justify-content-center align-content-center'
            key={event._id}>
            <div className='col-12 col-sm-9 px-0 mb-3 mb-sm-0'>
                <h3 className='color-secondary'>{event.title}</h3>
                <h6>
                    {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                    }).format(event.price)}{" "}
                    -{" "}
                    {new Intl.DateTimeFormat("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                    }).format(new Date(event.date))}
                </h6>
            </div>

            <div
                className='col-12 col-sm-3 px-0 my-auto d-flex justify-content-center justify-content-sm-end'
                style={{ height: "fit-content" }}>
                {user.userId === event.creator._id ? (
                    <Button color='secondary' onClick={toggleModal}>
                        Edit Event
                    </Button>
                ) : (
                    <Button color='outline-secondary' onClick={toggleModal}>
                        View Details
                    </Button>
                )}
                {/* <p>{event.creator.email}</p> */}
            </div>
            <Modal isOpen={modal} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>Event Details</ModalHeader>
                <ModalBody>
                    <h3 className='color-secondary'>{event.title}</h3>
                    <h6>
                        {new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                        }).format(event.price)}{" "}
                        -{" "}
                        {new Intl.DateTimeFormat("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                        }).format(new Date(event.date))}
                    </h6>
                    <p>{event.description}</p>
                </ModalBody>
                <ModalFooter>
                    <Button color='secondary' onClick={toggleModal}>
                        Book Event
                    </Button>
                    <Button color='outline-secondary' onClick={toggleModal}>
                        Close
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
};
