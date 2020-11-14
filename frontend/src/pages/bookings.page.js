import Axios from "axios";
import React, { Component } from "react";
import AuthContext from "../context/auth-context";
import Spinner from "../components/spinner.component";
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
                `http://localhost:8080/graphql`,
                { query },
                {
                    headers: {
                        Authorization: `Bearer ${this.context.token}`,
                    },
                },
            )
                .then((result) => {
                    const data = result?.data?.data?.bookings;
                    console.log(data);
                    if (data) this.setState({ bookings: data.reverse() });
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
            <div>
                <h1>Bookings Working 🥳</h1>
                {this.state.isLoading ? (
                    <div className='col-12 d-flex justify-content-center'>
                        <Spinner height='100px' />
                    </div>
                ) : (
                    this.state.bookings &&
                    this.state.bookings.map((booking) => (
                        <div>
                            <p>{booking._id}</p>
                            <p>
                                {new Intl.DateTimeFormat("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                }).format(new Date(booking.createdAt))}
                            </p>
                            <p>
                                {new Intl.DateTimeFormat("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                }).format(new Date(booking.updatedAt))}
                            </p>
                            <p>{booking.event.title}</p>
                            <p>
                                {new Intl.DateTimeFormat("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                }).format(new Date(booking.event.date))}
                            </p>
                        </div>
                    ))
                )}
            </div>
        );
    }
}
