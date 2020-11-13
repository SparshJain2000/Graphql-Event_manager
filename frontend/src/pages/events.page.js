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
const Event = ({ event }) => {
    return (
        <div className='border-secondary p-2 my-2' key={event._id}>
            <h3>{event.title}</h3>
            <h6>{event.price}</h6>
            <p>{event.description}</p>
            <p>{event.creator.email}</p>
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
    };
    static contextType = AuthContext;
    componentDidMount() {
        if (!this.state.events) {
            this.fetchEvents();
        }
    }
    fetchEvents = () => {
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
        Axios.post(`http://localhost:8080/graphql`, { query })
            .then((result) => {
                const data = result?.data?.data?.events;
                console.log(data);
                if (data) this.setState({ events: data });
            })
            .catch((err) => console.log(err.response));
    };
    toggleModal = () => this.setState({ modal: !this.state.modal });
    createEvent = () => {
        // console.log(this.context);
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
                mutation {
                createEvent(eventInput:{
                    title:"${this.state.title}"
                    description:"${this.state.description}"
                    price:${+this.state.price}
                    date:"${this.state.date}"
                }){
                    title
                    price
                    _id    
                }
                }
            `;
            Axios.post(`http://localhost:8080/graphql`, { query }, config)
                .then((result) => {
                    console.log(result);
                    const data = result?.data?.data;
                    console.log(data);
                    if (!data.createEvent && result?.data.errors) {
                        this.context.logout();
                        this.props.history.push("/auth/signin");
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
                <div className='col-11 col-md-9 col-lg-8 mx-auto'>
                    {this.state.events &&
                        this.state.events
                            .reverse()
                            .map((event) => (
                                <Event event={event} key={event._id} />
                            ))}
                </div>
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
