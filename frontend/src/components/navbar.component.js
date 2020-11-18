import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import "../stylesheets/navbar.css";
import {
    Collapse,
    Navbar,
    NavbarToggler,
    Alert,
    Nav,
    NavItem,
} from "reactstrap";

const NavbarComponent = ({ user, logout }) => {
    const [error] = useState("");
    const [showError, setShowError] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    return (
        <div>
            <Alert
                color='danger'
                isOpen={showError}
                toggle={() => {
                    setShowError(false);
                }}>
                {error}
            </Alert>
            <Navbar expand='lg' className='justify-content-between'>
                <div>
                    <Link
                        to='/'
                        className='navbar-brand Raleway text-align-center'>
                        📝EasyBookings
                        {/* 📑📝📋 */}
                    </Link>
                    {/* <button
                        class='btn btn-outline-secondary my-2 my-sm-0'
                        type='submit'>
                        Toggle Theme
                    </button> */}
                </div>
                <NavbarToggler
                    onClick={toggle}
                    className={`position-relative ${
                        !isOpen ? "collapsed" : ""
                    }`}>
                    <span></span>
                    <span></span>
                    <span></span>
                </NavbarToggler>

                <Collapse
                    isOpen={isOpen}
                    navbar
                    className='justify-content-lg-between'>
                    <Nav className='row justify-content-center px-4' navbar>
                        <NavItem className='m-1 my-3 my-lg-1'>
                            <NavLink to='/events'>Events</NavLink>
                        </NavItem>

                        {user.token && (
                            <NavItem className='m-1 my-3 my-lg-1'>
                                <NavLink to='/bookings'>Bookings</NavLink>
                            </NavItem>
                        )}
                    </Nav>
                    {!user.token ? (
                        <div className='nav-item m-1 my-2 mt-lg-1'>
                            <NavLink to='/auth'>Sign In</NavLink>
                        </div>
                    ) : (
                        <div className='nav-item m-1 my-2 mt-lg-1'>
                            <span onClick={logout} className='link'>
                                Sign Out
                            </span>
                        </div>
                    )}
                </Collapse>
            </Navbar>
        </div>
    );
};
export default NavbarComponent;
