import React, { Component } from "react";
import {
    Form,
    FormGroup,
    Label,
    Input,
    FormFeedback,
    Button,
    Alert,
} from "reactstrap";
import { Link } from "react-router-dom";
import AuthNav from "./authNav.component";
import "../stylesheets/auth.css";
import axios from "axios";
import AuthContext from "../context/auth-context";
export default class Signin extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            invalid: {},
            signin: true,
            visible: false,
            mess: "",
        };
        this.toggleMode = this.toggleMode.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
        this.submit = this.submit.bind(this);
    }
    toggleMode = () => {
        this.setState({
            signin: !this.state.signin,
        });
    };
    validateEmail = (email) => {
        const re = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        return re.test(email);
    };
    validatePassword = (pass) => pass.length >= 8;
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
            invalid: {
                ...this.state.invalid,
                [e.target.name]:
                    e.target.name === "email"
                        ? this.validateEmail(e.target.value)
                        : this.validatePassword(e.target.value),
            },
        });
    };

    submit = (e) => {
        e.preventDefault();
        if (this.state.invalid.password && this.state.invalid.email) {
            const credentials = {
                email: this.state.email,
                password: this.state.password,
            };

            const query = `
                mutation {
                    createUser(userInput:{email:"${credentials.email}",password:"${credentials.password}"}){
                        userId
                        token
                        tokenExpiration
                    }
                }

            `;

            axios
                .post(`${process.env.REACT_APP_API_URL}`, { query })
                .then((data) => {
                    console.log(data);
                    if (data.data.errors) {
                        this.setState({
                            visible: true,
                            mess: data.data.errors[0].message,
                        });
                    } else {
                        const userData = data?.data?.data?.createUser;
                        if (userData && userData.token) {
                            this.context.login(
                                userData.token,
                                userData.userId,
                                userData.tokenExpiration,
                            );
                            this.props.history.push("/events");
                        }
                    }
                })
                .catch((err) => {
                    console.log("err", err.response);

                    this.setState({
                        visible: true,
                        mess: "Something went wrong! Please try again later.",
                    });
                });
        }
    };
    onDismiss = () => this.setState({ visible: false });

    render() {
        return (
            <div>
                <Alert
                    color='danger'
                    isOpen={this.state.visible}
                    toggle={this.onDismiss}>
                    {this.state.mess}
                </Alert>
                <AuthNav />
                <Form
                    className='my-form col-10 col-md-8 col-lg-6 mx-auto my-4 p-3 border-highlight'
                    onSubmit={this.submit}>
                    <h3>Sign Up</h3>
                    <FormGroup>
                        <Label>E-mail</Label>
                        <Input
                            type='email'
                            invalid={
                                this.state.invalid.email === undefined
                                    ? false
                                    : !this.state.invalid.email
                            }
                            name='email'
                            onChange={this.handleChange}></Input>
                        <FormFeedback>Please enter a valid E-mail</FormFeedback>
                    </FormGroup>
                    <FormGroup>
                        <Label>Password</Label>
                        <Input
                            type='password'
                            name='password'
                            invalid={
                                this.state.invalid.password === undefined
                                    ? false
                                    : !this.state.invalid.password
                            }
                            onChange={this.handleChange}></Input>
                        <FormFeedback>
                            Password length should be at least 8 chars
                        </FormFeedback>
                    </FormGroup>
                    <FormGroup>
                        <div className='row justify-content-between'>
                            <span className='col-12 col-md-8'>
                                Already have an account?{" "}
                                <Link
                                    to='/auth/signin'
                                    className='color-secondary my-1'>
                                    Sign In
                                </Link>
                            </span>
                            <span className='col-12 col-md-4 d-flex flex-row justify-content-md-end'>
                                <Button
                                    color={"outline-secondary"}
                                    type='submit'
                                    className='mt-3 mt-sm-1'>
                                    Sign up
                                </Button>
                            </span>
                        </div>
                    </FormGroup>
                </Form>
            </div>
        );
    }
}
