import React, {useEffect, useRef, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {validMobileRegex} from "../myRegexp"
import {postAttend} from "../actions/userActions"
import {SERVED_BY_CLEAR} from "../constants/servedByConstants"
import {useTranslation} from "react-i18next"
import {
  Anchor,
  Avatar,
  Button,
  Group,
  Image,
  Loader,
  Stack,
  Text,
  TextInput,
  Title
} from "@mantine/core"
import {notifications} from "@mantine/notifications"

import Lottie from "react-lottie-player"
import axios from "axios"

import wait from "../assets/lottie/Wait.json"
import errorX from "../assets/lottie/Error.json"
import ENV from "../utils/env"

const base_url = ENV.API_BASE_URL

function MobileSearch({userInfo}) {
  const [t, i18n] = useTranslation()
  const inputRef = useRef(null) // Reference to the input field

  const servantInList = useSelector((state) => state.servantInList)
  const {selected} = servantInList

  const setClassHandler = async (classId, userId, mobile) => {
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
                checkMobileHandler(mobile)
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

  const checkMobileHandler = async (mobileNumber) => {
    if (mobileNumber.length == 11) {
      inputRef.current.blur() // Remove focus from the input field
      if (validMobileRegex.test(mobileNumber)) {
        // dispatch({type: SERVED_BY_CLEAR})

        // dispatch({type: "FIND_TO_ATTEND_SUCCESS", payload: {}})
        let selectedServiceId = ""
        const selectedService = localStorage.getItem("servantIn")
        if (selectedService)
          selectedServiceId = JSON.parse(selectedService)?._id
        if (selectedServiceId) {
          try {
            notifications.show({
              id: "Attendance",
              loading: false,
              color: "transparent",
              message: (
                <Group justify="center">
                  <Lottie
                    play
                    loop
                    animationData={wait}
                    style={{width: "50%"}}
                  />
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
              `${base_url}/user/find-to-attend?mobile=${mobileNumber}&serviceId=${selectedServiceId}`,
              config
            )
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
                          setClassHandler(
                            item.classData._id,
                            data.userId,
                            mobileNumber
                          )
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
            } else console.log(data)
          } catch (error) {
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
                autoClose: 3000,
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
    }
  }

  return (
    <Stack w={"100%"}>
      <TextInput
        ref={inputRef}
        label={t("Main_Mobile")}
        placeholder="0127321..."
        maxLength={11}
        minLength={11}
        onChange={(event) => {
          const input = event.currentTarget.value
          // Accept only numeric values
          if (/^\d*$/.test(input)) {
            checkMobileHandler(input)
          }
        }}
        type="tel" // Ensures numeric keyboard on mobile
        inputMode="numeric" // Further enforces numeric input
        required
      />
    </Stack>
  )
}

export default MobileSearch
