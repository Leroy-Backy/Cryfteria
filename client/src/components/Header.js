import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import {Link} from "react-router-dom";
import {useAuth} from "../context/AuthProvider";
import {useTransaction} from "../context/TransactionProvider";

export default function Header() {
  const {login, isLoggedIn} = useAuth();
  const {signFunction, currentAddress, connectWallet} = useTransaction();

  const loginSubmit = async () => {
    try {
      await login(signFunction);
    } catch (error) {
      
    }
  }
  
  return (
    <Navbar collapseOnSelect className="navbar-dark bg-dark" expand="sm">
      <Container>
        <Navbar.Brand className="fw-bold" as={Link} to="/" eventkey="/">Cryfteria</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isLoggedIn &&
              <>
                <Nav.Link as={Link} to="/user" eventKey="/user">
                  <div>Profile</div>
                </Nav.Link>
                <Nav.Link as={Link} to="/posts/top" eventKey="/posts/top">
                  <div>Top Posts</div>
                </Nav.Link>
                <Nav.Link as={Link} to="/posts" eventKey="/posts">
                  <div>Posts</div>
                </Nav.Link>
              </>
            }
          </Nav>
          <Nav>{isLoggedIn ?
            <Nav.Link as={Link} to="/logout" >
              <div>Logout</div>
            </Nav.Link>
            :
            <Nav.Link onClick={loginSubmit}>
              <div>Login</div>
            </Nav.Link>
          }</Nav>
          <Nav>{currentAddress ?
            <Navbar.Text>
              <div className="header-address">{currentAddress}</div>
            </Navbar.Text>
            :
            <Nav.Link onClick={connectWallet}>
              <div>Connect wallet</div>
            </Nav.Link>
          }</Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}