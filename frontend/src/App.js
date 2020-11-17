import "bootstrap/dist/css/bootstrap.min.css";
import React, { Component } from "react";
import {
    BrowserRouter,
    Redirect,
    Route,
    Switch,
    withRouter,
} from "react-router-dom";
import Bookings from "./pages/bookings.page";
import Auth from "./pages/auth.page";
import Events from "./pages/events.page";
import Navbar from "./components/navbar.component";
import Footer from "./components/footer.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import AuthContext from "./context/auth-context";
class App extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        token: null,
        userId: null,
    };
    componentDidMount() {
        if (localStorage.getItem("theme")) {
            document.body.classList = localStorage.getItem("theme");
        } else localStorage.setItem("theme", "light");

        if (sessionStorage.getItem("user")) {
            const user = JSON.parse(sessionStorage.getItem("user"));
            console.log(new Date(user.expiry) > new Date());
            if (new Date(user.expiry) < new Date()) {
                console.log("EXPIRED !!!");
                this.logout();
            } else this.setState({ ...user });
        } else sessionStorage.setItem("user", JSON.stringify(this.state));
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
    login = (token, userId) => {
        this.setState({ token, userId });
        sessionStorage.setItem(
            "user",
            JSON.stringify({
                token,
                userId,
                expiry: new Date(new Date().getTime() + 60000 * 1),
            }),
        );
    };
    logout = () => {
        this.setState({ token: null, userId: null });
        sessionStorage.removeItem("user");
    };
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
                                {this.state.token && (
                                    <Route
                                        path='/bookings'
                                        component={Bookings}
                                    />
                                )}
                                {this.state.token && (
                                    <Redirect from='/auth' to='/events' />
                                )}
                                {!this.state.token && (
                                    <Route path='/auth' component={Auth} />
                                )}
                                {this.state.token && (
                                    <Redirect from='/' exact to='/events' />
                                )}
                                <Route path='/events' component={Events} />
                                {!this.state.token && (
                                    <Redirect to='/auth' exact />
                                )}
                            </Switch>
                        </main>
                        <Footer />
                    </AuthContext.Provider>
                </React.Fragment>
            </BrowserRouter>
        );
    }
}

export default App;
