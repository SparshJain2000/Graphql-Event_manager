import "bootstrap/dist/css/bootstrap.min.css";
import React, { Component } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Bookings from "./pages/bookings.page";
import Auth from "./pages/auth.page";
import Events from "./pages/events.page";
import Navbar from "./components/navbar.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSun,
    faMoon,
    faEye,
    faLightbulb,
} from "@fortawesome/free-solid-svg-icons";
import AuthContext from "./context/auth-context";
class App extends Component {
    state = {
        token: null,

        userId: null,
    };
    componentDidMount() {
        console.log(document.body.classList);
        if (localStorage.getItem("theme")) {
            document.body.classList = localStorage.getItem("theme");
        } else localStorage.setItem("theme", "light");
    }
    changeTheme() {
        console.log(localStorage.getItem("theme"));
        if (localStorage.getItem("theme")) {
            const theme =
                localStorage.getItem("theme") === "light" ? "dark" : "light";

            document.body.classList = theme;
            localStorage.setItem("theme", theme);
        } else localStorage.setItem("theme", "light");
    }
    login = (token, userId, tokenExpiration) =>
        this.setState({ token, userId });
    logout = () => this.setState({ token: null, userId: null });
    render() {
        return (
            <BrowserRouter>
                <React.Fragment>
                    <AuthContext.Provider
                        value={{
                            token: this.state.token,
                            userId: this.state.userId,
                            login: this.login,
                            logout: this.logout,
                        }}>
                        <Navbar user={this.state} logout={this.logout} />
                        <button
                            className='btn btn-round btn-theme'
                            onClick={this.changeTheme}>
                            <FontAwesomeIcon
                                icon={
                                    localStorage.getItem("theme") === "light"
                                        ? faLightbulb
                                        : faLightbulb
                                }
                            />
                        </button>
                        <main>
                            <Switch>
                                {!this.state.token && (
                                    <Redirect from='/' to='/auth' exact />
                                )}
                                {this.state.token && (
                                    <Redirect from='/' to='/events' exact />
                                )}
                                {this.state.token && (
                                    <Redirect from='/auth' to='/events' exact />
                                )}
                                {!this.state.token && (
                                    <Route path='/auth' component={Auth} />
                                )}
                                {this.state.token && (
                                    <Route
                                        path='/bookings'
                                        component={Bookings}
                                    />
                                )}
                                <Route path='/events' component={Events} />
                            </Switch>
                        </main>
                    </AuthContext.Provider>
                </React.Fragment>
            </BrowserRouter>
        );
    }
}

export default App;
