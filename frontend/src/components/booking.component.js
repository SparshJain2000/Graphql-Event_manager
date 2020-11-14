import Axios from "axios";
import React, { useState, useContext } from "react";
import { useHistory } from "react-router";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import "../stylesheets/event.css";
import AuthContext from "../context/auth-context";
import Spinner from "../components/spinner.component";
const Booking = ({ booking, cancelBooking }) => {
    const context = useContext(AuthContext);
    const history = useHistory();
    const [event, setEvent] = useState(null);
    const [modal, setModal] = useState(false);
    const [modalDetails, setModalDetails] = useState(false);
    const toggleModal = () => setModal(!modal);
    const toggleModalDetails = () => setModalDetails(!modalDetails);
    const cancel = () => {
        cancelBooking(booking._id);
        toggleModal();
    };
    const showDetails = () => {
        console.log("SHOW it");
        toggleModalDetails();
        if (!event) {
            const query = `
            query{
                event(id:"${booking.event._id}"){
                    _id
                    title
                    description
                    date
                    price
                }
            }
        `;
            Axios.post(`http://localhost:8080/graphql`, { query })
                .then((result) => {
                    const data = result?.data?.data?.event;
                    console.log(data);
                    if (data) setEvent(data);
                })
                .catch((err) => {
                    console.log(err);
                    console.log(err.response);
                });
        }
    };
    return (
        <div
            className='border-secondary row p-3 event my-2  mx-1 d-flex justify-content-center align-content-center'
            key={booking._id}>
            <div className='col-12 col-sm-7 px-0 mb-3 mb-sm-0'>
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
                className='col-12 col-sm-5 px-0 my-auto row justify-content-center justify-content-sm-end'
                style={{ height: "fit-content" }}>
                <Button color='outline-secondary' onClick={showDetails}>
                    View Details
                </Button>

                <Button
                    className='ml-1'
                    color='secondary'
                    onClick={toggleModal}>
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
            <Modal isOpen={modalDetails} toggle={toggleModalDetails}>
                <ModalHeader toggle={toggleModalDetails}>
                    Event Details
                </ModalHeader>
                <ModalBody>
                    {event ? (
                        <React.Fragment>
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
                        </React.Fragment>
                    ) : (
                        <Spinner />
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button color='secondary' onClick={toggleModal}>
                        Cancel Event
                    </Button>
                    <Button
                        color='outline-secondary'
                        onClick={toggleModalDetails}>
                        Close
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default Booking;
