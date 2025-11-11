import React, {useState} from "react"
import {useDisclosure, useMediaQuery} from "@mantine/hooks"

import {useDispatch, useSelector} from "react-redux"
import {useTranslation} from "react-i18next"
import {
  Button,
  Group,
  Loader,
  Stack,
  Avatar,
  Card,
  Text,
  Divider,
  Title,
  useMantineTheme,
  Anchor,
  Modal,
  ActionIcon,
  Badge,
  SimpleGrid
} from "@mantine/core"

import UserMoreModal from "./UserMoreModal"
import PhotoModal from "./PhotoModal"
import {deleteServedBy} from "../actions/servedByActions"
import {updateLastFollowUp} from "../actions/userServiceMetaActions"

import avatar from "../assets/photo/avatar.png"
import PhoneNumbersModal from "./PhoneNembersModal"
import {FaBirthdayCake, FaShare, FaShareAlt} from "react-icons/fa"
import {LiaBirthdayCakeSolid} from "react-icons/lia"
import {notifications} from "@mantine/notifications"

import axios from "axios"
import ENV from "../utils/env"

const base_url = ENV.API_BASE_URL

export const UsersList = ({classId, selectedService}) => {
  const theme = useMantineTheme()
  const isSmallScreen = useMediaQuery(`(max-width: ${theme.breakpoints.xl})`)

  const [opened, {open, close}] = useDisclosure(false)
  const [selectedUser, setSelectedUser] = useState({})
  const [buttonStatus, setButtonStatus] = useState(false)

  const dispatch = useDispatch()
  const {t} = useTranslation()

  const [status, setStatus] = useState(false)
  const [userImage, setUserImage] = useState("")

  const userList = useSelector((state) => state.userList)
  const {users, loading} = userList

  const userLogin = useSelector((state) => state.userLogin)
  const {userInfo} = userLogin

  const onDelete = (index, userId) => {
    const payload = {
      userId,
      classId,
      serviceId: selectedService._id
    }
    dispatch(deleteServedBy(users, index, payload))
  }

  const onFollowUp = (userId) => {
    const payload = {
      userId,
      serviceId: selectedService._id
    }
    dispatch(updateLastFollowUp(payload))
  }

  const onShare = (userData) => {
    if (navigator.share) {
      navigator
        .share({
          title: `${userData?.firstName} ${t("Contact_Information")}`,
          text: `${t("Full_Name")}: ${userData?.firstName} ${
            userData?.fatherName
          } ${userData?.grandFaName || ""}\n${t("Main_Mobile")}: ${
            userData?.mobile || ""
          }\n`
        })
        .then(() => console.log("Contact shared successfully"))
        .catch((error) => console.error("Error sharing contact", error))
    } else {
      alert(t("Web_Share_API_Not_Supported"))
    }
  }

  const showImage = (image) => {
    setUserImage(image)
    setStatus(true)
  }

  const dt = new Date()
  let month = dt.getMonth() + 1
  let day = dt.getDate()

  if (loading) {
    return <Loader />
  }

  const managePoints = (selectedUserDetaisl) => {
    setSelectedUser(selectedUserDetaisl)
    open()
  }

  const updatePoint = async (points) => {
    notifications.show({
      id: "profile Update",
      loading: true,
      title: t("Saving_data"),
      autoClose: false,
      withCloseButton: false
    })

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`
      }
    }

    const values = {
      serviceId: selectedService._id,
      userId: selectedUser._id,
      points: points
    }
    console.log(values)
    try {
      const {data} = await axios.post(
        `${base_url}/user-service-meta/send-points`,
        values,
        config
      )
      console.log(data)
      notifications.update({
        id: "profile Update",
        loading: false,
        title: t("Updated_successfully"),
        color: "green",
        autoClose: 2000,
        withCloseButton: false
      })

      close()
    } catch (error) {
      notifications.update({
        id: "profile Update",
        loading: false,
        title: t("Save_error"),
        color: "red",
        autoClose: 2000,
        withCloseButton: false
      })
    }
    setButtonStatus(false)
  }

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={`${selectedUser?.firstName} ${t("Points")}`}
      >
        <Stack align="center">
          <Group justify="center">
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <Button
                  disabled={buttonStatus}
                  bg={"green"}
                  size="xs"
                  key={index}
                  onClick={() => updatePoint((index + 1) * 5)}
                >
                  {(index + 1) * 5}
                </Button>
              ))}
          </Group>
          <Divider />
          <Group justify="center">
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <Button
                  disabled={buttonStatus}
                  bg={"red"}
                  size="xs"
                  key={index}
                  onClick={() => updatePoint((index + 1) * -5)}
                >
                  {(index + 1) * -5}
                </Button>
              ))}
          </Group>
        </Stack>
      </Modal>

      <SimpleGrid cols={{ base: 1, sm: 1, md: 2, lg: 2, xl: 3 }} spacing="md">
        {users?.map((user, index) => (
        <Card
          key={index}
          shadow="sm"
          radius="md"
          withBorder
          style={{direction: t("Dir")}}
          padding="sm"
        >
          <Group style={{display: "flex"}}>
            <Group flex={1.5}>
              <Avatar
                src={user?.userDetails?.image}
                size="md"
                onClick={() => showImage(user?.userDetails?.image || avatar)}
                style={{cursor: "pointer"}}
              />
              <Stack gap={0}>
                <Text fw={500} size="sm">{`${user?.userDetails?.firstName} ${user?.userDetails?.fatherName} ${user?.userDetails?.familyName || ""}`}</Text>
                <Group gap="xs">
                  {user?.userDetails?.authorizedKhadem && (
                    <>
                      <Text size="xs" c="red" fw="bold">
                        {t("Khadem")}
                      </Text>
                      <Divider orientation="vertical" />
                    </>
                  )}

                  {(month - user?.userDetails?.birthday?.month == 0 ||
                    month - user?.userDetails?.birthday?.month == 1) && (
                    <>
                      <LiaBirthdayCakeSolid size={14} color="red" />
                      <Divider orientation="vertical" />
                    </>
                  )}

                  <Text
                    size="xs"
                    onClick={() => managePoints(user?.userDetails)}
                  >
                    <Anchor
                      style={{
                        textDecoration: "underline",
                        cursor: "pointer"
                      }}
                    >
                      {user?.userDetails?.more?.score || 0}
                    </Anchor>{" "}
                    {t("pt")}
                  </Text>
                </Group>
              </Stack>
              <Divider orientation="vertical" />
            </Group>
            <Group gap="sm">
              <PhoneNumbersModal userDetails={user?.userDetails} />
              <ActionIcon
                variant="subtle"
                color="gray"
                size="sm"
                onClick={() => onShare(user.userDetails)}
              >
                <FaShareAlt size={14} />
              </ActionIcon>
            </Group>
          </Group>
          <Divider my="xs" />

          <Group justify="space-between" m={0} p={0}>
            <Stack gap={2}>
              <Group gap="sm" justify="space-between" p={0} m={0}>
                <Text size="xs" c="dimmed">
                  {`${t("Attendance")}: ${
                    user?.userDetails?.more?.lastAttendance?.split("T")[0] ||
                    "---"
                  }`}
                </Text>
                <Text size="xs" c="dimmed">
                  {`${t("Follow_Up")}: ${
                    user?.userDetails?.more?.lastFollowUp?.split("T")[0] ||
                    "---"
                  }`}
                </Text>
              </Group>
              <Text size="xs" c="dimmed">
                {`${t("Bible_Last_10")}: ${user?.userDetails?.bibleFollowUp}`}
              </Text>
            </Stack>
            <Group justify="end">
              <UserMoreModal
                index={index}
                classId={classId}
                userDetails={user.userDetails}
                onDelete={onDelete}
                onFollowUp={onFollowUp}
                selectedService={selectedService}
              />
            </Group>
          </Group>
        </Card>
        ))}
      </SimpleGrid>

      <PhotoModal
        userImage={userImage}
        status={status}
        onHide={() => setStatus(false)}
      />
    </>
  )
}
