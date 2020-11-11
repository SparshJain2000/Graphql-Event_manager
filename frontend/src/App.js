import "./App.css";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Bookings from "./components/bookings.component";
import Auth from "./components/auth.component";
import Events from "./components/events.component";
function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Redirect from='/' to='auth' exact />

                <Route path='/auth' component={Auth} />
                <Route path='/bookings' component={Bookings} />
                <Route path='/events' component={Events} />
            </Switch>
        </BrowserRouter>
    );
}

export default App;
