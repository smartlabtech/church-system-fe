import React, {useState, useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"

import {
  RESET_SERVANTINMODAL,
  SET_SERVANTINMODAL,
  SET_SERVANTINSERVICE
} from "../constants/servantInConstants"
import {useTranslation} from "react-i18next"
import {Button, Modal, Stack, Title} from "@mantine/core"
import {getHoursDiff} from "./ServedByListModal"

function ServantInListModal({myList}) {
  const dispatch = useDispatch()

  const [t, i18n] = useTranslation()

  const servantInList = useSelector((state) => state.servantInList)
  const {status, selected} = servantInList

  useEffect(() => {
    if (
      getHoursDiff(
        localStorage.getItem("servedInLastUpdate") || 0,
        Date.now()
      ) >
      7 * 24
    ) {
      dispatch({type: SET_SERVANTINMODAL})
      localStorage.setItem(
        "servantIn",
        JSON.stringify(myList[0].serviceData[0])
      )
      dispatch({
        type: SET_SERVANTINSERVICE,
        payload: {
          service: myList[0].serviceData[0]
        }
      })
    } else {
      let servantInSaved = localStorage.getItem("servantIn")
      if (servantInSaved) {
        dispatch({
          type: SET_SERVANTINSERVICE,
          payload: {
            service: JSON.parse(servantInSaved)
          }
        })
      }
    }
  }, [dispatch])

  const serviceHandler = (service) => {
    localStorage.setItem("servedInLastUpdate", Date.now())
    localStorage.setItem("servantIn", JSON.stringify(service))
    dispatch({
      type: SET_SERVANTINSERVICE,
      payload: {service: service}
    })
    dispatch({type: RESET_SERVANTINMODAL})
  }

  return (
    <Modal
      opened={status}
      onClose={() => dispatch({type: RESET_SERVANTINMODAL})}
      withCloseButton={false}
      centered
      title={t("Select_Your_Service")}
      transitionProps={{transition: "scale", duration: 500}}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3
      }}
    >
      <Stack>
        {myList?.map((service, index) => (
          <Button
            key={index}
            onClick={() => serviceHandler(service.serviceData[0])}
          >
            {service.serviceData[0].name}
          </Button>
        ))}
      </Stack>
    </Modal>
  )
}

export default ServantInListModal
