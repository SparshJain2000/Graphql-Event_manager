import Axios from "axios";
import React, { Component } from "react";
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
import AuthContext from "../context/auth-context";
import Event from "../components/event.component";
import Spinner from "../components/spinner.component";
const EventList = ({ events, user, updateEventsList, deleteEventHandler }) => {
    return (
        <div className='col-11 col-md-9 col-lg-8 mx-auto'>
            {events &&
                events.map((event) => (
                    <Event
                        event={event}
                        key={event._id}
                        user={user}
                        updateEventsList={updateEventsList}
                        deleteEventHandler={deleteEventHandler}
                    />
                ))}
        </div>
    );
};
export default class Events extends Component {
    state = {
        modal: false,
        title: "",
        description: "",
        price: "",
        date: "",
        events: null,
        isLoading: false,
    };
    static contextType = AuthContext;
    componentDidMount() {
        if (!this.state.events) {
            this.fetchEvents();
        }
    }
    fetchEvents = () => {
        this.setState({ isLoading: true });
        const query = `
            query {
                events{
                    _id
                    title
                    price
                    description
                    date 
                        creator {
                            _id
                            email
                        }
                    }
                }`;
        Axios.post(`${process.env.REACT_APP_API_URL}`, { query })
            .then((result) => {
                const data = result?.data?.data?.events;
                console.log(data);
                if (data) this.setState({ events: data.reverse() });
                this.setState({ isLoading: false });
            })
            .catch((err) => {
                console.log(err.response);
                this.setState({ isLoading: false });
            });
    };
    toggleModal = () => this.setState({ modal: !this.state.modal });
    createEvent = () => {
        // console.log(this.context)
        const valid =
            this.state.title.trim().length > 0 &&
            this.state.description.trim().length > 0 &&
            +this.state.price >= 0 &&
            this.state.date.trim().length > 0;
        if (valid) {
            let config = {
                headers: {
                    Authorization: `Bearer ${this.context.token}`,
                },
            };
            const query = `
                mutation CreateEvent($title:String!,$description:String!,$date:String!,$price:Float!){
                createEvent(eventInput:{
                    title:$title
                    description:$description
                    price:$price
                    date:$date
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
            const variables = {
                title: this.state.title,
                description: this.state.description,
                date: this.state.date,
                price: +this.state.price,
            };
            Axios.post(
                `${process.env.REACT_APP_API_URL}`,
                { query, variables },
                config,
            )
                .then((result) => {
                    console.log(result);
                    const data = result?.data?.data;
                    console.log(data);
                    if (!data.createEvent && result?.data.errors) {
                        this.context.logout();
                        this.props.history.push("/auth/signin");
                    } else {
                        // console.log(data.createEvent);
                        // let newEvents = this.state.events;
                        const newEvents = [
                            {
                                ...data.createEvent,
                                creator: { _id: this.context.userId },
                            },
                            ...this.state.events,
                        ];
                        console.log(newEvents);
                        this.setState({
                            events: newEvents,
                        });
                    }
                    // if (data) this.setState({ events: data });
                    this.toggleModal();
                })
                .catch((err) => console.log(err.response));
        }
    };
    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };
    updateEventsList = (updatedEvent) => {
        let events = this.state.events.map((event) => {
            if (event._id === updatedEvent._id) {
                event = { ...event, ...updatedEvent };
                event = {
                    ...event,
                    creator: { _id: this.context.userId },
                };
            }
            return event;
        });
        this.setState({
            events,
        });
    };
    deleteEventHandler = (id) => {
        const events = this.state.events.filter((event) => event._id !== id);
        this.setState({ events });
    };
    render() {
        return (
            <div className='row m-0'>
                <div className='col-10 col-md-9 col-lg-8 col-xl-7 mx-auto mt-5 my-sm-4 p-3 text-align-center border-secondary'>
                    <h4>Create your own Events !!</h4>
                    <Button
                        color={"secondary"}
                        onClick={this.toggleModal}
                        className='mt-2'>
                        Create Event
                    </Button>
                </div>
                {this.state.isLoading && (
                    <div className='col-12 d-flex justify-content-center'>
                        <Spinner height='100px' />
                    </div>
                )}

                <EventList
                    events={this.state.events}
                    user={this.context}
                    updateEventsList={this.updateEventsList}
                    deleteEventHandler={this.deleteEventHandler}
                />
                <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>
                        Modal title
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label>Title</Label>
                            <Input
                                onChange={this.handleChange}
                                type='text'
                                value={this.state.title}
                                name='title'></Input>
                        </FormGroup>

                        <FormGroup>
                            <Label>Price</Label>
                            <Input
                                onChange={this.handleChange}
                                type='number'
                                value={this.state.price}
                                name='price'></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label>Time</Label>
                            <Input
                                onChange={this.handleChange}
                                type='datetime-local'
                                value={this.state.date}
                                name='date'></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label>Description</Label>
                            <Input
                                onChange={this.handleChange}
                                type='textarea'
                                name='description'
                                value={this.state.description}
                                rows='3'></Input>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color='secondary' onClick={this.createEvent}>
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
