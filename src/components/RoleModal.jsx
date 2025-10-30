import React from "react"
import {useDispatch, useSelector} from "react-redux"

import {RESET_ROLE_MODAL} from "../constants/modalsConstants"
import {updateRole_AuthorizedKhadem} from "../actions/adminActions"
import {Button, Group, Modal} from "@mantine/core"

function RoleModal() {
  const dispatch = useDispatch()

  const roleModal = useSelector((state) => state.roleModal)
  const {status, data} = roleModal

  const updateRoleHandler = (role) => {
    dispatch({type: RESET_ROLE_MODAL})
    dispatch(
      updateRole_AuthorizedKhadem(
        data.listData,
        data.index,
        data.indexData._id,
        role
      )
    )
  }

  return (
    <Modal opened={status} onClose={() => dispatch({type: RESET_ROLE_MODAL})}>
      <Modal.Header>
        <Modal.Title>Update Role</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Group
          className="m-0 p-0 justify-content-center"
          style={{width: "100%"}}
        >
          <Button
            variant="outline-danger"
            className="m-1 p-3 rounded"
            size="sm"
            style={{width: "45%"}}
            onClick={() => updateRoleHandler("admin")}
          >
            ADMIN
          </Button>
          <Button
            variant="outline-danger"
            className="m-1 p-3 rounded"
            size="sm"
            style={{width: "45%"}}
            onClick={() => updateRoleHandler("user")}
          >
            USER
          </Button>
        </Group>
      </Modal.Body>
    </Modal>
  )
}

export default RoleModal
