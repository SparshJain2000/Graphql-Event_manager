import React from "react";
import { NavLink } from "react-router-dom";
import { Nav, NavItem } from "reactstrap";
export default function authNav() {
    return (
        <Nav className='d-flex flex-row justify-content-center'>
            <NavItem className='m-2'>
                <NavLink to='/auth/signin'>Sign In</NavLink>
            </NavItem>
            <NavItem className='m-2'>
                <NavLink to='/auth/signup'>Sign Up</NavLink>
            </NavItem>
        </Nav>
    );
}
