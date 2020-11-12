import React, { useState, useRef } from "react";
import { NavLink, Link } from "react-router-dom";
import { CustomInput, Form, FormGroup, Label } from "reactstrap";
import { useHistory } from "react-router";
import "../stylesheets/navbar.css";
import {
    Collapse,
    Navbar,
    NavbarToggler,
    Alert,
    NavbarBrand,
    Nav,
    NavItem,
} from "reactstrap";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//     faUser,
//     faLock,
//     faSignOutAlt,
//     faUserPlus,
// } from "@fortawesome/free-solid-svg-icons";
// import { faFacebook, faGoogle } from "@fortawesome/free-brands-svg-icons";

const NavbarComponent = ({ user, logout }) => {
    const [error, setError] = useState("");
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
                        EasyBookings
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
                            <a onClick={logout} style={{ cursor: "pointer" }}>
                                Sign Out
                            </a>
                        </div>
                    )}
                    {/* {!props.user ? (
                        <Nav
                            className='row ml-auto align-content-center justify-content-center mt-3 mt-lg-0'
                            style={{ minWidth: "33%" }}>
                            <Toast
                                className='my-auto mx-1'
                                style={{
                                    border: "1px solid #F04C63",
                                }}>
                                <div className='toast-header '>
                                    <strong className='mx-auto'>
                                        Job Seekers
                                    </strong>
                                </div>
                                <ToastBody className='row justify-content-around mx-1 font-18px'>
                                    <div>
                                        <Link
                                            to='/user/login'
                                            className='text-js-primary'
                                            // onClick={toggleModal}
                                        >
                                            Login
                                        </Link>
                                    </div>
                                    <div className=''>
                                        <Link
                                            to='/user/signup'
                                            className='badge badge-lg badge-js-primary p-2 ml-1'>
                                            Sign Up
                                        </Link>
                                    </div>
                                </ToastBody>
                            </Toast>
                            <Toast
                                className=' my-auto mx-1'
                                style={{
                                    border: "1px solid #0A4F70",
                                }}>
                                <div className='toast-header px-auto'>
                                    <strong className='mx-auto'>
                                        Employers
                                    </strong>
                                </div>
                                <ToastBody className='row justify-content-around mx-1 font-18px'>
                                    <div>
                                        <Link
                                            to='/employer/login'
                                            className='text-emp-primary'
                                            // onClick={toggleModalEmployer}
                                        >
                                            Login
                                        </Link>
                                    </div>
                                    <div className=''>
                                        <a
                                            href='/employer/signup'
                                            className='badge badge-lg badge-emp-primary p-2 ml-1'>
                                            Sign Up
                                        </a>
                                    </div>
                                </ToastBody>
                            </Toast>
                        </Nav>
                    ) : (
                        <Nav className='mt-3 mt-lg-0 ml-auto mx-0 row justify-content-center'>
                            <ButtonDropdown
                                isOpen={buttonDropdown}
                                toggle={toggleButtonDropdown}>
                                <Link
                                    id='caret'
                                    to={`${
                                        props.user.role === "Employer"
                                            ? "/employer"
                                            : "/profile"
                                    }`}
                                    className={`btn btn-emp-primary`}
                                    style={{ width: "max-content" }}>
                                    <FontAwesomeIcon
                                        icon={
                                            props.user.role === "Employer"
                                                ? faUserPlus
                                                : faUser
                                        }
                                        className='mr-2'
                                    />
                                    {props.user.firstName}
                                </Link>
                                <DropdownToggle caret color={"emp-primary"} />
                                <DropdownMenu
                                    right
                                    // direction='right'
                                    // nav={true}
                                    // style={{ zIndex: 1001 }}
                                >
                                    {props.user.role === "Employer" ? (
                                        <Link
                                            to='/employer'
                                            className='dropdown-item'>
                                            Dashboard
                                        </Link>
                                    ) : (
                                        <Link
                                            to='/profile/'
                                            className='dropdown-item'>
                                            View Profile
                                        </Link>
                                    )}
                                    <DropdownItem divider />
                                    <DropdownItem
                                        onClick={() => {
                                            axios
                                                .get(`/api/user/logout`)
                                                .then((user) => {
                                                    console.log(
                                                        `logout${user}`,
                                                    );
                                                    props.setUser(null);
                                                    history.push("/");
                                                })
                                                .catch((err) => {
                                                    console.log(err.response);
                                                });
                                        }}>
                                        Log Out
                                        <FontAwesomeIcon
                                            icon={faSignOutAlt}
                                            className='ml-3'
                                        />
                                    </DropdownItem>
                                </DropdownMenu>
                            </ButtonDropdown>
                        </Nav>
                    )} */}
                </Collapse>
            </Navbar>
        </div>
    );
};
export default NavbarComponent;
