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
class App extends Component {
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
    render() {
        return (
            <BrowserRouter>
                <React.Fragment>
                    <Navbar />
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
                            <Redirect from='/' to='auth' exact />
                            <Route path='/auth' component={Auth} />
                            <Route path='/bookings' component={Bookings} />
                            <Route path='/events' component={Events} />
                        </Switch>
                    </main>
                </React.Fragment>
            </BrowserRouter>
        );
    }
}

export default App;
