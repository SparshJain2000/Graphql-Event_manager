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
export default Event = ({ event, user }) => {
    const [modal, setModal] = useState(false);
    const toggleModal = () => setModal(!modal);
    return (
        <div
            className='border-secondary p-3  my-2 d-flex justify-content-between align-content-center'
            key={event._id}>
            <div>
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

            <div className='my-auto' style={{ height: "fit-content" }}>
                {user.userId === event.creator._id ? (
                    <p className='Raleway color-secondary'>Your Event</p>
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
