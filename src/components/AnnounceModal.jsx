import React from "react"
import {useDispatch, useSelector} from "react-redux"

import {RESET_ANNOUNCE} from "../constants/announceConstants"
import {SET_AUTH_MODAL} from "../constants/authModalConstants"
import {Button, Group, Modal} from "@mantine/core"

function AnnounceModal() {
  const dispatch = useDispatch()

  const announce = useSelector((state) => state.announce)
  const {status, message} = announce

  const signUpHandler = () => {
    dispatch({type: RESET_ANNOUNCE})
    dispatch({type: SET_AUTH_MODAL})
  }

  return (
    <Modal opened={status} onClose={() => dispatch({type: RESET_ANNOUNCE})}>
      <Modal.Header>
        <Modal.Title>YOUR FIRST ORDER</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Group
          className="p-0 m-0 justify-content-center"
          style={{width: "100%"}}
        >
          <div>
            <p
              className="p-0 m-0 fa fa-gift"
              style={{
                fontSize: "90px",
                color: "#ed5c65"
              }}
            >
              10%
            </p>
            <p
              style={{
                fontSize: "90px",
                color: "#ed5c65"
              }}
            >
              FREE
            </p>
          </div>
          {/* <h4>ENJOY YOUR FIRST ORDER</h4> */}
        </Group>

        <p>
          Register now and receive your{" "}
          <span style={{fontSize: "14px", color: "#ed5c65"}}>
            10% DISCOUNT CODE
          </span>{" "}
          on your registered{" "}
          <span style={{fontSize: "14px", color: "#ed5c65"}}>
            mobile number
          </span>
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Group className="justify-content-center" style={{width: "100%"}}>
          <Button
            variant="outline-danger"
            className="rounded"
            // size="sm"
            style={{width: "50%"}}
            onClick={() => signUpHandler()}
          >
            Register
          </Button>
        </Group>
      </Modal.Footer>
    </Modal>
  )
}

export default AnnounceModal
