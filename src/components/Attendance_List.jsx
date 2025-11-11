import React, {useState, useEffect} from "react"
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
  Title,
  Card,
  Paper,
  ActionIcon,
  Tooltip
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

  // Automatically load all users when component mounts
  useEffect(() => {
    if (selected?.service?._id) {
      const filter = {
        serviceId: selected.service._id,
        requestType: "RESPONSE"
      }
      dispatch(getUsers(filter))
    }
  }, [selected?.service?._id, dispatch])

  const changeMaleStatus = () => {
    const newMale = !male
    setMale(newMale)
    setFemale(0)

    const filter = {
      serviceId: selected?.service?._id,
      requestType: "RESPONSE"
    }
    if (classId) filter.classId = classId
    if (newMale) filter.gender = ["MALE"]

    dispatch(getUsers(filter))
  }

  const changeFemaleStatus = () => {
    const newFemale = !female
    setFemale(newFemale)
    setMale(0)

    const filter = {
      serviceId: selected?.service?._id,
      requestType: "RESPONSE"
    }
    if (classId) filter.classId = classId
    if (newFemale) filter.gender = ["FEMALE"]

    dispatch(getUsers(filter))
  }

  const updateClassId = (id) => {
    setClassId(id)
    setMale(0)
    setFemale(0)

    const filter = {
      serviceId: selected?.service?._id,
      requestType: "RESPONSE"
    }
    if (id) filter.classId = id

    dispatch(getUsers(filter))
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
    <Stack w={"100%"} gap="lg">
      {/* Filter Controls */}
      <Paper shadow="sm" radius="md" p="md" withBorder>
        <Group justify="center" gap="md">
          <Select
            style={{ flex: 1, maxWidth: 300 }}
            data={selected?.service?.classes?.map((classData) => ({
              label: classData.name,
              value: classData._id
            }))}
            value={classId}
            onChange={(value) => updateClassId(value)}
            placeholder={t("All_Classes")}
            clearable
            clearButtonProps={{
              "aria-label": t("Clear_Filter")
            }}
          />
          <Button
            variant={male ? "filled" : "light"}
            color={male ? "blue" : "gray"}
            onClick={changeMaleStatus}
            leftSection={<FaMale size={18} />}
            size="md"
          >
            {t("Male")}
          </Button>
          <Button
            variant={female ? "filled" : "light"}
            color={female ? "pink" : "gray"}
            onClick={changeFemaleStatus}
            leftSection={<FaFemale size={18} />}
            size="md"
          >
            {t("Female")}
          </Button>
        </Group>
      </Paper>

      {/* Users List */}
      {loading ? (
        <Paper shadow="sm" radius="md" p="xl" withBorder>
          <Stack align="center" gap="md">
            <Loader size="lg" />
            <Text c="dimmed">{t("Loading_users")}...</Text>
          </Stack>
        </Paper>
      ) : users?.length ? (
        <Stack gap="md">
          {users.map((user, index) => (
            <Card
              key={index}
              shadow="sm"
              radius="md"
              padding="md"
              withBorder
              style={{
                transition: "transform 0.2s ease, box-shadow 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)"
                e.currentTarget.style.boxShadow = "var(--mantine-shadow-md)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "var(--mantine-shadow-sm)"
              }}
            >
              <Group justify="space-between" align="center">
                <Group gap="md">
                  <Avatar
                    src={user?.userDetails?.image}
                    radius="md"
                    size="lg"
                  />
                  <Stack gap={0}>
                    <Text size="sm" fw={500}>
                      {`${user?.userDetails?.firstName} ${
                        user?.userDetails?.fatherName
                      } ${user?.userDetails?.familyName || ""}`}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {user?.userDetails?.mobile || t("No_mobile")}
                    </Text>
                  </Stack>
                </Group>
                <Tooltip label={t("Mark_Attendance")} position="left" withArrow>
                  <ActionIcon
                    onClick={() => handleBarcode(user.userDetails._id)}
                    variant="filled"
                    color="green"
                    size="xl"
                    radius="md"
                  >
                    <FaThumbsUp size={20} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Card>
          ))}
        </Stack>
      ) : (
        <Paper shadow="sm" radius="md" p="xl" withBorder ta="center">
          <Stack align="center" gap="md">
            <Text size="lg" fw={500} c="dimmed">
              {t("No_users_found")}
            </Text>
            <Text size="sm" c="dimmed">
              {t("Try_adjusting_your_filters")}
            </Text>
          </Stack>
        </Paper>
      )}
    </Stack>
  )
}

export default AttendanceList
