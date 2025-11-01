import React, {useState, useEffect, useRef} from "react"
import {useDispatch, useSelector} from "react-redux"
import {
  Box,
  Button,
  Text,
  LoadingOverlay,
  Group,
  Title,
  Avatar
} from "@mantine/core"
import {AiOutlineCamera} from "react-icons/ai"
import {BrowserQRCodeReader} from "@zxing/browser"
import {postAttend} from "../actions/userActions"
import {SERVED_BY_CLEAR} from "../constants/servedByConstants"

import {notifications} from "@mantine/notifications"

import Lottie from "react-lottie-player"
import axios from "axios"

import wait from "../assets/lottie/Wait.json"
import errorX from "../assets/lottie/Error.json"
import {useTranslation} from "react-i18next"
import ENV from "../utils/env"

const base_url = ENV.API_BASE_URL

function QrCodeReader({userInfo}) {
  const [t, i18n] = useTranslation()

  const servantInList = useSelector((state) => state.servantInList)
  const {selected} = servantInList

  const [scanned, setScanned] = useState(false)
  const [loading, setLoading] = useState(false)
  const [cameraOpen, setCameraOpen] = useState(false) // State for "Open Camera" button

  const videoRef = useRef(null)
  const qrCodeReaderRef = useRef(new BrowserQRCodeReader())

  useEffect(() => {
    if (!selected?.service || !selected?.service?._id || !cameraOpen) {
      return
    }

    const codeReader = qrCodeReaderRef.current

    // Start decoding with a callback function
    codeReader
      .decodeFromVideoDevice(undefined, videoRef.current, (result) => {
        if (result) {
          sendQRHandler(result.text)
        }
      })
      .catch((err) => console.error("QR Reader Error:", err))

    return () => {
      // Stop the video stream on cleanup
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject
        const tracks = stream.getTracks()
        tracks.forEach((track) => track.stop())
        videoRef.current.srcObject = null
      }
    }
  }, [scanned, cameraOpen])

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

  const sendQRHandler = async (userId) => {
    if (!userId || scanned) return // Prevent duplicate processing
    setScanned(true)
    setLoading(true)
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
        setLoading(false)
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
        } else console.log(data)
      } catch (error) {
        setLoading(false)

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

  // const restartScan = () => {
  //   setScanned(false)
  //   if (videoRef.current && videoRef.current.srcObject) {
  //     const stream = videoRef.current.srcObject
  //     const tracks = stream.getTracks()
  //     tracks.forEach((track) => track.stop())
  //     videoRef.current.srcObject = null
  //   }
  // }
  const openCameraHandler = () => {
    setCameraOpen(true) // Set the cameraOpen state to true
  }
  return (
    <Box
      sx={{
        position: "relative",
        maxWidth: 400,
        margin: "0 auto",
        textAlign: "center",
        padding: "1rem",
        border: "1px solid #e9ecef",
        borderRadius: "8px",
        backgroundColor: "#f8f9fa"
      }}
    >
      <LoadingOverlay visible={loading} />
      {!cameraOpen && ( // Show "Open Camera" button if the camera is not open
        <Button
          leftSection={<AiOutlineCamera />}
          mt="md"
          variant="outline"
          fullWidth
          onClick={openCameraHandler}
        >
          {t("Open_Camera")}
        </Button>
      )}

      {cameraOpen && ( // Show the video only when the camera is open
        <video ref={videoRef} style={{width: "100%", borderRadius: "8px"}} />
      )}
    </Box>
  )
}

export default QrCodeReader
