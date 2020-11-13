import React, { Component } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import SignIn from "../components/signin.component";
import SignUp from "../components/signup.component";
import "../stylesheets/auth.css";
export default class Auth extends Component {
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
