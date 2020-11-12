import React, { Component } from "react";
import {
    Form,
    FormGroup,
    Label,
    Input,
    FormFeedback,
    Button,
} from "reactstrap";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import SignIn from "../components/signin.component";
import SignUp from "../components/signup.component";
import "../stylesheets/auth.css";
export default class Auth extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            invalid: {},
            signin: true,
        };
        this.toggleMode = this.toggleMode.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
    }
    toggleMode = () => {
        this.setState({
            signin: !this.state.signin,
        });
    };
    validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };
    validatePassword = (pass) => pass.length >= 10;
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
            invalid: {
                ...this.state.invalid,
                [e.target.name]:
                    [e.target.name] === "email"
                        ? !this.validateEmail(e.target.value)
                        : !this.validatePassword(e.target.value),
            },
        });
    };

    submit = (e) => {
        e.preventDefault();
        const credentials = {
            email: this.state.email,
            password: this.state.password,
        };
        console.log(credentials);
    };
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Redirect from='/auth' to='/auth/signin' exact />
                    <Route path='/auth/signin' component={SignIn} />
                    <Route path='/auth/signup' component={SignUp} />
                </Switch>
            </BrowserRouter>
        );
    }
}
