import {Modal} from "@mantine/core"
import React, {useState} from "react"

function confirmUpdatesModal({show}) {
  const [PW, setPW] = useState("")

  return (
    <Modal opened={true} onClose={handleClose}>
      <Modal.Header>
        <Modal.Title>Confirm Update</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* password */}
        <Form.Label htmlFor="check-pw" className="update-create-form-label">
          password
        </Form.Label>
        <Form.Control
          id="check-pw"
          className="update-create-form-control-right rounded"
          type="password"
          onChange={(e) => setPW(e.target.value)}
        ></Form.Control>
        <Button variant="primary" onClick={handleShow}>
          Confirm
        </Button>
      </Modal.Body>
    </Modal>
  )
}

export default confirmUpdatesModal
