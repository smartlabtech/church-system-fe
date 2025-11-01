import React, {useState} from "react"
import {FaFemale, FaMale, FaThumbsUp} from "react-icons/fa"
import {useDispatch, useSelector} from "react-redux"
import {getUsers, postAttend} from "../actions/userActions"
import {useTranslation} from "react-i18next"
import {
  Avatar,
  Button,
  Group,
  Stack,
  Select,
  Text,
  Loader,
  Anchor,
  Title
} from "@mantine/core"
import {notifications} from "@mantine/notifications"
import Lottie from "react-lottie-player"
import axios from "axios"

import wait from "../assets/lottie/Wait.json"
import errorX from "../assets/lottie/Error.json"
import ENV from "../utils/env"

const base_url = ENV.API_BASE_URL

function AttendanceList({userInfo}) {
  const dispatch = useDispatch()
  const {t} = useTranslation()

  const servantInList = useSelector((state) => state.servantInList)
  const {selected} = servantInList

  const userList = useSelector((state) => state.userList)
  const {users, loading} = userList
  const [classId, setClassId] = useState("")
  const [male, setMale] = useState(0)
  const [female, setFemale] = useState(0)

  const changeMaleStatus = () => {
    let filter = {classId}
    if (!male) filter.gender = ["MALE"]
    getList(filter)
    setMale(!male)
    setFemale(0)
  }

  const changeFemaleStatus = () => {
    let filter = {classId}
    if (!female) filter.gender = ["FEMALE"]
    getList(filter)
    setFemale(!female)
    setMale(0)
  }

  const updateClassId = (id) => {
    getList({classId: id})
    setClassId(id)
    setMale(0)
    setFemale(0)
  }

  const getList = (filter) => {
    if (filter.classId) {
      filter.serviceId = selected?.service?._id
      filter.requestType = "RESPONSE"
      dispatch(getUsers(filter))
    }
  }

  const handleBarcode = async (userId) => {
    // setUserId(userId)
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
        `${base_url}/user/find-to-attend?userId=${userId}&serviceId=${selected?.service?._id}`,
        config
      )

      if (data?.name) {
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

  return (
    <Stack w={"100%"}>
      <Group justify="center" spacing="md" gap={5} w={"100%"}>
        <Select
          p={0}
          m={0}
          data={selected?.service?.classes?.map((classData) => ({
            label: classData.name,
            value: classData._id
          }))}
          onChange={(value) => updateClassId(value)}
          placeholder={t("Select_Class")}
        />
        <Button
          m={2}
          p={2}
          disabled={!classId}
          variant={male ? "filled" : "outline"}
          onClick={changeMaleStatus}
        >
          <FaMale size={22} />
        </Button>
        <Button
          m={1}
          p={1}
          disabled={!classId}
          variant={female ? "filled" : "outline"}
          onClick={changeFemaleStatus}
        >
          <FaFemale size={22} />
        </Button>
      </Group>
      <Stack ta={"center"}>
        {loading ? (
          <Loader style={{alignSelf: "center"}} />
        ) : users?.length ? (
          users.map((user, index) => (
            <Group
              key={index}
              align="center"
              spacing="sm"
              justify="space-between"
            >
              <Group p={0} m={0}>
                <Avatar src={user?.userDetails?.image} radius="xl" size="lg" />
                <Stack spacing="xs">
                  <Text size="sm">
                    {`${user?.userDetails?.firstName} ${
                      user?.userDetails?.fatherName
                    } ${user?.userDetails?.familyName || ""}`}
                  </Text>
                </Stack>
              </Group>
              <Button onClick={() => handleBarcode(user.userDetails._id)}>
                <FaThumbsUp />
              </Button>
            </Group>
          ))
        ) : (
          <Text size="sm" c="dimmed">
            {t("Please_Select_Class_First")}
          </Text>
        )}
      </Stack>
    </Stack>
  )
}

export default AttendanceList
