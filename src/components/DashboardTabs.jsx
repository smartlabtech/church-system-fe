import React from "react"
import {LinkContainer} from "react-router-bootstrap"

function DashboardTabs() {
  return (
    <Nav className="justify-content-center mb-4">
      <Nav.Item>
        <LinkContainer to="/dashboard">
          <Nav.Link>Dashboard</Nav.Link>
        </LinkContainer>
      </Nav.Item>

      <Nav.Item>
        <LinkContainer to="/sales/orders">
          <Nav.Link>Orders</Nav.Link>
        </LinkContainer>
      </Nav.Item>

      {/* <Nav.Item>
        <LinkContainer to="/sales/manifest">
          <Nav.Link>Manifest</Nav.Link>
        </LinkContainer>
      </Nav.Item>

      <Nav.Item>
        <LinkContainer to="/sales/commission">
          <Nav.Link>Commission</Nav.Link>
        </LinkContainer>
      </Nav.Item> */}
    </Nav>
  )
}

export default DashboardTabs
