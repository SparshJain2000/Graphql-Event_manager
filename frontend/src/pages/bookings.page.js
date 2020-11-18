import Axios from "axios";
import React, { Component } from "react";
import AuthContext from "../context/auth-context";
import Spinner from "../components/spinner.component";
import Booking from "../components/booking.component";
const BookingList = ({ bookings, cancelBooking }) =>
    bookings.map((booking) => (
        <Booking
            booking={booking}
            cancelBooking={cancelBooking}
            key={booking._id}
        />
    ));
export default class Bookings extends Component {
    state = {
        bookings: null,
        isLoading: false,
    };
    static contextType = AuthContext;
    componentDidMount() {
        if (!this.state.bookings) this.fetchBookings();
    }
    fetchBookings = () => {
        this.setState({ isLoading: true });
        const query = `
            query{
                bookings{
                    _id
                    createdAt
                    updatedAt
                    event{
                        _id
                        title
                        date
                    }
                }
            }
        `;

        if (this.context.token)
            Axios.post(
                `/graphql`,
                { query },
                {
                    headers: {
                        Authorization: `Bearer ${this.context.token}`,
                    },
                },
            )
                .then((result) => {
                    const data = result?.data?.data;
                    if (!data.bookings && result?.data.errors) {
                        this.context.logout();
                        this.props.history.push("/auth/signin");
                    } else {
                        console.log(data);
                        this.setState({
                            bookings: data.bookings.reverse(),
                        });
                        this.setState({ isLoading: false });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    console.log(err.response);
                    this.setState({ isLoading: false });
                });
    };
    cancelBooking = (id) => {
        console.log(id);
        const query = `
        mutation {
            cancelBooking(bookingId:"${id}"){
                title
                _id
                creator{
                    email
                }   
            }
        }
        `;
        if (this.context.token)
            Axios.post(
                `/graphql`,
                { query },
                {
                    headers: {
                        Authorization: `Bearer ${this.context.token}`,
                    },
                },
            )
                .then((result) => {
                    const data = result?.data?.data?.cancelBooking;
                    console.log(data);
                    if (data) {
                        let { bookings } = this.state;
                        bookings = bookings.filter(
                            (booking) => booking._id !== id,
                        );
                        this.setState({ bookings });
                    }
                    this.setState({ isLoading: false });
                })
                .catch((err) => {
                    console.log(err);
                    console.log(err.response);
                    this.setState({ isLoading: false });
                });
    };
    render() {
        return (
            <div className='col-12 col-sm-10 col-md-9 col-lg-7 mx-auto my-3 mt-5 mt-sm-3'>
                <h2 className='text-align-center my-3'>Your Bookings 📜</h2>
                {this.state.isLoading ? (
                    <div className='col-12 d-flex justify-content-center'>
                        <Spinner height='100px' />
                    </div>
                ) : (
                    this.state.bookings && (
                        <BookingList
                            bookings={this.state.bookings}
                            cancelBooking={this.cancelBooking}
                        />
                    )
                )}
            </div>
        );
    }
}
