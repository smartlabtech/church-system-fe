import {Modal} from "@mantine/core"
import React from "react"
import {useDispatch, useSelector} from "react-redux"

function SuccessModal() {
  const successAlert = useSelector((state) => state.successAlert)
  const {status, message} = successAlert

  return (
    <Modal opened={status}>
      <Modal.Body>
        <h3
          style={{
            fontWeight: "bold",
            color: "green",
            // fontSize: "14px",
            textAlign: "center"
          }}
        >
          {message}
        </h3>
      </Modal.Body>
    </Modal>
  )
}

export default SuccessModal
