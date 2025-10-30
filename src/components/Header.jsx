import {useDispatch, useSelector} from "react-redux"
import {LinkContainer} from "react-router-bootstrap"
import {logout} from "../actions/userActions"
import {SET_AUTH_MODAL} from "../constants/authModalConstants"

function Header() {
  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const {userInfo} = userLogin

  const logoutHandler = () => {
    dispatch(logout())
  }

  return (
    <>
      <header>
        <Navbar
          // fixed="top"
          bg="dark"
          variant="dark"
          expand="lg"
          collapseOnSelect
        >
          <Container>
            <LinkContainer to="/">
              <Navbar.Brand>
                <Image
                  src="https://media.geeksforgeeks.org/wp-content/uploads/20210425000233/test-300x297.png"
                  rounded
                />
              </Navbar.Brand>
            </LinkContainer>

            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Stacklapse id="basic-navbar-nav">
              <Nav className="ml-auto">
                {userInfo ? (
                  <NavDropdown
                    title={`Hello ${userInfo?.user.fullName}`}
                    id="username"
                  >
                    <LinkContainer to="/account">
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>

                    <LinkContainer to="/my-order">
                      <NavDropdown.Item>Orders</NavDropdown.Item>
                    </LinkContainer>

                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <Nav.Link
                    onClick={() =>
                      dispatch({
                        type: SET_AUTH_MODAL
                      })
                    }
                  >
                    <i className="fas fa-user"></i>Login
                  </Nav.Link>
                )}

                {userInfo && userInfo?.user.type === "ADMIN" && (
                  <NavDropdown title="Admin" id="adminmenue">
                    <LinkContainer to="/admin/userlist">
                      <NavDropdown.Item>Users</NavDropdown.Item>
                    </LinkContainer>

                    <LinkContainer to="/admin/productlist">
                      <NavDropdown.Item>Products</NavDropdown.Item>
                    </LinkContainer>

                    <LinkContainer to="/admin/orderlist">
                      <NavDropdown.Item>Orders</NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                )}
              </Nav>
            </Navbar.Stacklapse>
          </Container>
        </Navbar>
      </header>
    </>
  )
}

export default Header
