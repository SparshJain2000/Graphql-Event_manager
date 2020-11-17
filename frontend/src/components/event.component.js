import Axios from "axios";
import React, { useState, useContext } from "react";
import { useHistory } from "react-router";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormGroup,
    Input,
    Label,
} from "reactstrap";
import "../stylesheets/event.css";
import AuthContext from "../context/auth-context";
const formatDate = (date) => {
    const now = new Date(date);
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, -1);
};
export default Event = ({
    event,
    user,
    updateEventsList,
    deleteEventHandler,
}) => {
    const context = useContext(AuthContext);
    const history = useHistory();
    const [modal, setModal] = useState(false);
    const [modalUpdate, setModalUpdate] = useState(false);
    const [data, setData] = useState(event);
    const toggleModal = () => setModal(!modal);
    const toggleModalUpdate = () => setModalUpdate(!modalUpdate);
    const deleteEvent = () => {
        const variables = {
            _id: event._id,
            creatorId: event.creator._id,
        };
        let config = {
            headers: {
                Authorization: `Bearer ${context.token}`,
            },
        };
        const query = `
                mutation CancelEvent($_id:ID!,$creatorId:ID!){
                    deleteEvent(eventId:$_id,creatorId:$creatorId){
                        title
                        _id    
                    }
                }
            `;
        Axios.post(
            `${process.env.REACT_APP_API_URL}`,
            { query, variables },
            config,
        )
            .then((result) => {
                console.log(result);
                const data = result?.data?.data;
                console.log(data);
                if (!data.deleteEvent && result?.data.errors) {
                    context.logout();
                    history.push("/auth/signin");
                } else {
                    deleteEventHandler(event._id);
                }
                // toggleModalUpdate();
            })
            .catch((err) => console.log(err.response));
    };
    const updateEvent = () => {
        let { creator, ...updatedEvent } = data;
        updatedEvent.creatorId = creator._id;
        updatedEvent.price = Number(data.price);

        const valid =
            data.title.trim().length > 0 &&
            data.description.trim().length > 0 &&
            data.price >= 0 &&
            data.date.trim().length > 0;
        console.log(context.token);
        if (valid) {
            console.log(updatedEvent);
            let config = {
                headers: {
                    Authorization: `Bearer ${context.token}`,
                },
            };
            const query = `
                mutation UpdateEvent($_id:String!,$title:String!,$description:String!,$date:String!,$price:Float!,$creatorId:String!){
                updateEvent(eventInput:{
                    _id:$_id
                    title:$title
                    description:$description
                    price:$price
                    date:$date
                    creatorId:$creatorId
                }){
                    title
                    price
                    _id    
                    date
                    description
                    creator{
                        _id
                        email
                    }

                }
                }
            `;
            // updateEventsList(updatedEvent);

            Axios.post(
                `${process.env.REACT_APP_API_URL}`,
                { query, variables: updatedEvent },
                config,
            )
                .then((result) => {
                    console.log(result);
                    const data = result?.data?.data;
                    console.log(data);
                    if (!data.createEvent && result?.data.errors) {
                        context.logout();
                        history.push("/auth/signin");
                    } else {
                        updateEventsList(data.updateEvent);
                    }
                    toggleModalUpdate();
                })
                .catch((err) => console.log(err.response));
        }
    };
    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    };
    const bookEvent = () => {
        const query = `
            mutation {
                bookEvent(eventId:"${event._id}"){
                    _id 
                    createdAt
                    updatedAt
                }
            }
        `;
        Axios.post(
            `${process.env.REACT_APP_API_URL}`,
            { query },
            {
                headers: {
                    Authorization: `Bearer ${context.token}`,
                },
            },
        )
            .then((result) => {
                console.log(result);
                const data = result?.data?.data;
                console.log(data);
                if (!data.bookEvent && result?.data.errors) {
                    context.logout();
                    history.push("/auth/signin");
                } else {
                    console.log("Booked !!");
                    toggleModal();
                }
            })
            .catch((err) => console.log(err.response));
    };
    return (
        <div
            className='border-secondary row p-3 event my-2 mx-1 d-flex justify-content-center align-content-center'
            key={event._id}>
            <div className='col-12 col-sm-7 col-md-8 px-0 mb-3 mb-sm-0'>
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
                className='col-12 col-sm-5 col-md-4 px-0 my-auto d-flex justify-content-center justify-content-sm-end'
                style={{ height: "fit-content" }}>
                {user.userId === event.creator._id ? (
                    <React.Fragment>
                        <Button
                            color='outline-secondary'
                            className='mr-1'
                            onClick={deleteEvent}>
                            Delete Event
                        </Button>
                        <Button color='secondary' onClick={toggleModalUpdate}>
                            Edit Event
                        </Button>
                    </React.Fragment>
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
                    <Button color='secondary' onClick={bookEvent}>
                        Book Event
                    </Button>
                    <Button color='outline-secondary' onClick={toggleModal}>
                        Close
                    </Button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={modalUpdate} toggle={toggleModalUpdate}>
                <ModalHeader toggle={toggleModalUpdate}>
                    Update Event
                </ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label>Title</Label>
                        <Input
                            onChange={handleChange}
                            type='text'
                            defaultValue={event.title}
                            name='title'></Input>
                    </FormGroup>

                    <FormGroup>
                        <Label>Price</Label>
                        <Input
                            onChange={handleChange}
                            type='number'
                            defaultValue={event.price}
                            name='price'></Input>
                    </FormGroup>
                    <FormGroup>
                        <Label>Time</Label>
                        <Input
                            onChange={handleChange}
                            type='datetime-local'
                            defaultValue={formatDate(event.date)}
                            name='date'></Input>
                    </FormGroup>
                    <FormGroup>
                        <Label>Description</Label>
                        <Input
                            onChange={handleChange}
                            type='textarea'
                            name='description'
                            defaultValue={event.description}
                            rows='3'></Input>
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button color='secondary' onClick={updateEvent}>
                        Update Event
                    </Button>
                    <Button
                        color='outline-secondary'
                        onClick={toggleModalUpdate}>
                        Close
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
};
