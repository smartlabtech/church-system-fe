// https://www.youtube.com/watch?v=rIspSL5UIJc

import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"

import {postAttend} from "../actions/userActions"
import {SERVED_BY_CLEAR} from "../constants/servedByConstants"
import {useTranslation} from "react-i18next"
import {Avatar, Button, Group, Loader, Stack, Text, Title} from "@mantine/core"
import barcode_reader from "../assets/lottie/BarcodeReader.json"

import {notifications} from "@mantine/notifications"

import Lottie from "react-lottie-player"
import axios from "axios"

import wait from "../assets/lottie/Wait.json"
import errorX from "../assets/lottie/Error.json"
import ENV from "../utils/env"

const base_url = ENV.API_BASE_URL

const KeyListner = ({userInfo}) => {
  const dispatch = useDispatch()
  const [t, i18n] = useTranslation()

  const servantInList = useSelector((state) => state.servantInList)
  const {selected} = servantInList

  const findToAttend = useSelector((state) => state.findToAttend)
  const {userData, loading, error} = findToAttend

  useEffect(() => {
    var barcode = ""
    document.addEventListener("keydown", function (eve) {
      // if (interval) clearInterval(interval)
      if (eve.code == "Enter") {
        if (barcode && selected?.service?._id) handleBarcode(barcode)
        barcode = ""
        return
      }
      if (eve.key !== "Shift") {
        barcode += eve.key
        // interval = setInterval(() => (barcode = ""), 50)
      }
    })
  }, [])

  const setClassHandler = async (classId, userId) => {
    notifications.update({
      id: "assignClass",
      loading: true,
      color: "blue",
      withCloseButton: false
    })
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${userInfo.token}`
        }
      }
      const {data} = await axios.post(
        `${base_url}/servedBy`,
        {classId: classId, userId: userId},
        config
      )

      notifications.update({
        id: "assignClass",
        loading: false,
        title: (
          <Title ta={"center"} size={"md"}>
            {t("You_can_mark_attendance_now")}
          </Title>
        ),
        color: "transparent",
        withCloseButton: true,
        message: (
          <Group justify="center" h={"100%"}>
            <Button
              size="xs"
              onClick={() => {
                notifications.update({
                  id: "assignClass",
                  autoClose: 0
                })
                sendQRHandler(userId)
              }}
            >
              {t("Attendance")}
            </Button>
          </Group>
        )
      })
    } catch (error) {
      console.log(error)
      if (error?.response && error?.response?.data?.message)
        notifications.update({
          id: "Attendance",
          loading: false,
          title: (
            <Title ta={"center"} size={"md"}>
              {error?.response?.data?.message}
            </Title>
          ),
          message: (
            <Group w={"100%"} justify="center">
              <Lottie play loop animationData={errorX} style={{width: "50%"}} />
            </Group>
          ),
          color: "transparent",
          autoClose: 3000,
          withCloseButton: false
        })
    }
  }
  let scanned = false
  const handleBarcode = async (userId) => {
    if (!userId || scanned) return // Prevent duplicate processing
    scanned = true
    let selectedServiceId = ""
    const selectedService = localStorage.getItem("servantIn")
    if (selectedService) selectedServiceId = JSON.parse(selectedService)?._id
    if (selectedServiceId) {
      try {
        notifications.show({
          id: "Attendance",
          loading: false,
          color: "transparent",
          message: (
            <Group justify="center">
              <Lottie play loop animationData={wait} style={{width: "50%"}} />
            </Group>
          ),
          autoClose: false,
          withCloseButton: false
        })
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${userInfo.token}`
          }
        }
        const {data} = await axios.get(
          `${base_url}/user/find-to-attend?userId=${userId}&serviceId=${selectedServiceId}`,
          config
        )
        scanned = false
        if (data?.classes?.length) {
          notifications.update({
            id: "Attendance",
            autoClose: 0
          })

          notifications.show({
            id: "assignClass",
            loading: false,
            title: (
              <Title ta={"center"} size={"md"}>
                {t("Not_Added_To_Service_Yet")}
              </Title>
            ),
            message: (
              <Group justify="center" h={"100%"}>
                {data.classes.map((item, index) => (
                  <Button
                    key={index}
                    size="xs"
                    onClick={() =>
                      setClassHandler(item.classData._id, data.userId)
                    }
                  >
                    {item.classData.name}
                  </Button>
                ))}
              </Group>
            ),
            color: "transparent",
            autoClose: false,
            withCloseButton: true
          })
        } else if (data?.name) {
          notifications.update({
            id: "Attendance",
            loading: false,
            message: (
              <Group justify="center">
                <Avatar src={data.image} alt="it's me" size="xl" />
                <Title size={"md"}>{data.name}</Title>
              </Group>
            ),
            color: "transparent",
            autoClose: 3000,
            withCloseButton: false
          })
        }
      } catch (error) {
        scanned = false
        if (error?.response && error?.response?.data?.message)
          notifications.update({
            id: "Attendance",
            loading: false,
            title: (
              <Title ta={"center"} size={"md"}>
                {error?.response?.data?.message}
              </Title>
            ),
            message: (
              <Group w={"100%"} justify="center">
                <Lottie
                  play
                  loop
                  animationData={errorX}
                  style={{width: "50%"}}
                />
              </Group>
            ),
            color: "transparent",
            autoClose: 1400,
            withCloseButton: false
          })
      }
    } else {
      notifications.show({
        id: "Error",
        loading: false,
        color: "red",
        title: <Text>Error</Text>,
        message: <Text>Select Your Service Please</Text>,
        autoClose: 5000,
        withCloseButton: false
      })
    }
  }
  // const clearBarcode = () => {
  //   document.querySelector("#last-barcode").innerHTML = ""
  // }

  return (
    <Stack>
      <Stack align="center">
        {/* <Title>{t("Scan_Now")}</Title> */}
        <Lottie
          play
          loop
          animationData={barcode_reader}
          style={{width: "100%", maxWidth: "30rem"}}
        />
      </Stack>

      {/* <div id="last-barcode"></div> */}
    </Stack>
  )
}

export default KeyListner
