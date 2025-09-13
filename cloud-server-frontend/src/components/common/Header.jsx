import React, { useContext } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../Auth.jsx"; 

const Header = () => {

  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <Navbar expand="lg" className="shadow-sm py-3 header-bg" sticky="top">
      <div className="container">
        <Navbar.Brand as={Link} to="/servers" className="fw-bold logo">
          <i className="bi bi-cloud-fill me-2 text-primary"></i>
          <span className="text-primary">Cloud Server</span> Manager
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {user ? (
              <>
                <Nav.Link as={Link} to="/servers" className={`nav-link ${isActive("/servers") ? "active-link" : ""}`}>
                  <i className="bi bi-server me-1"></i> Servers
                </Nav.Link>

                <Nav.Link onClick={logout} style={{ cursor: "pointer" }} className="nav-link text-danger">
                  <i className="bi bi-box-arrow-right me-1"></i> Logout
                </Nav.Link>
              </>
            ) : (
              <Nav.Link as={Link} to="/" className={`nav-link ${isActive("/") ? "active-link" : ""}`} >
                <i className="bi bi-box-arrow-in-right me-1"></i> Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default Header;
