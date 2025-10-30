import React, {useEffect} from "react"
import {useTranslation} from "react-i18next"
import {useDispatch, useSelector} from "react-redux"
import {
  RESET_SERVEDBYMODAL,
  SET_SERVEDBYMODAL,
  SET_SERVEDBYSERVICE
} from "../constants/servedByConstants"
import {getUserServiceMeta} from "../actions/userServiceMetaActions"
import {Button, Group, Modal, Title, Stack, Text} from "@mantine/core"

export function getHoursDiff(startDate, endDate) {
  const msInHour = 1000 * 60 * 60
  return Math.abs(endDate - startDate) / msInHour
}

function ServedByModal({userInfo}) {
  const dispatch = useDispatch()
  const {t} = useTranslation()

  const servedBy = useSelector((state) => state.servedBy)
  const {status} = servedBy

  useEffect(() => {
    if (userInfo?.user?.servedBy?.length == 1) {
      localStorage.setItem(
        "servedBy",
        JSON.stringify(userInfo?.user?.servedBy[0])
      )
      dispatch(getUserServiceMeta(userInfo?.user?.servedBy[0].serviceId))
      dispatch({
        type: SET_SERVEDBYSERVICE,
        payload: userInfo?.user?.servedBy[0]
      })
    } else {
      if (
        getHoursDiff(
          localStorage.getItem("servedByLastUpdate") || 0,
          Date.now()
        ) > 0.25
      ) {
        if (userInfo?.user?.servedBy?.length) {
          localStorage.removeItem("servedBy")
          dispatch({type: SET_SERVEDBYMODAL})
        }
      } else {
        let currentService = localStorage.getItem("servedBy")
        if (currentService) {
          currentService = JSON.parse(currentService)
          dispatch(getUserServiceMeta(currentService.serviceId))
          dispatch({
            type: SET_SERVEDBYSERVICE,
            payload: currentService
          })
        }
      }
    }
  }, [dispatch])

  const serviceHandler = (service) => {
    dispatch(getUserServiceMeta(service.serviceId))
    localStorage.setItem("servedByLastUpdate", Date.now())
    localStorage.setItem("servedBy", JSON.stringify(service))
    dispatch({
      type: SET_SERVEDBYSERVICE,
      payload: service
    })
    dispatch({type: RESET_SERVEDBYMODAL})
  }

  return (
    <>
      <Modal
        opened={status}
        onClose={() => dispatch({type: RESET_SERVEDBYMODAL})}
        title={t("Select_Your_Service")}
        centered
        transitionProps={{transition: "scale", duration: 500}}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3
        }}
      >
        <Stack>
          {userInfo?.user?.servedBy?.map((service, index) => (
            <Button key={index} onClick={() => serviceHandler(service)}>
              {service?.name}
            </Button>
          ))}
        </Stack>
      </Modal>
      {userInfo?.user?.servedBy?.length === 0 && (
        <Stack align="center">
          <Text size="lg" fw={900} align="center" c={"red"}>
            روح للخادم بتاعك في خدمتك و هو هيضيفك
          </Text>
        </Stack>
      )}
    </>
  )
}

export default ServedByModal
