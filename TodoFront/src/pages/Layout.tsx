import { Outlet, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Nav, Navbar } from "react-bootstrap";

const Layout = () => {
  return (
    <>
      <Navbar bg="dark" expand="lg" data-bs-theme="dark">
        <Navbar.Brand>Task Manager</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/Tasks">
              Tasks
            </Nav.Link>
            <Nav.Link as={Link} to="/Activities">
              Activities
            </Nav.Link>
            <Nav.Link as={Link} to="/Stats">
              Stats
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Outlet />
    </>
  );
};

export default Layout;
