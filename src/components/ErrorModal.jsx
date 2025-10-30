import {Modal, Title} from "@mantine/core"
import React from "react"
import {useDispatch, useSelector} from "react-redux"

function ErrorModal() {
  const errorAlert = useSelector((state) => state.errorAlert)
  const {status, message} = errorAlert

  return (
    <Modal opened={status}>
      <Modal.Body>
        <Title
          style={{
            fontWeight: "bold",
            color: "red",
            // fontSize: "14px",
            textAlign: "center"
          }}
        >
          {message}
        </Title>
      </Modal.Body>
    </Modal>
  )
}

export default ErrorModal
