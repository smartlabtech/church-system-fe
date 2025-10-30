import React, {useState, useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"

import {useTranslation} from "react-i18next"
import {
  RESET_ADD_UPDATE_USER_MODAL,
  SET_ADD_UPDATE_USER_MODAL
} from "../constants/modalsConstants"
import {Button, Group, Stack, Text} from "@mantine/core"
import AddUpdateUserModal from "./Add_UpdateUserModal"
import {FaPlus} from "react-icons/fa"

function ControlAddUserCard({service}) {
  const dispatch = useDispatch()
  const [t, i18n] = useTranslation()

  const add_updateUserModal = useSelector((state) => state.add_updateUserModal)
  const {status} = add_updateUserModal

  const onShow = (status, type) => {
    if (type == "addUser" || type == "-")
      status
        ? dispatch({type: SET_ADD_UPDATE_USER_MODAL})
        : dispatch({type: RESET_ADD_UPDATE_USER_MODAL})
  }
  return (
    <>
      <AddUpdateUserModal
        serviceId={service?._id}
        status={status || status}
        classes={service?.classes}
        onShow={onShow}
      />
      <Group
        onClick={() => onShow(true, "addUser")}
        className="m-0 p-0 module card"
        style={{direction: t("Dir")}}
      >
        <Button variant="gradient" rightSection={<FaPlus />}>
          {t("Add_User")}
        </Button>
      </Group>
    </>
  )
}

export default ControlAddUserCard
