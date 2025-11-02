import {Avatar, Button, Group, Input, Title} from "@mantine/core"
import {notifications} from "@mantine/notifications"
import React, {useState} from "react"
import {useTranslation} from "react-i18next"
import {BiSend} from "react-icons/bi"
import {useSelector, useDispatch} from "react-redux"
import {sendMessage} from "../../actions/communicationActions"

const AskHere = () => {
  const [t, i18n] = useTranslation()
  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const {userInfo} = userLogin

  const servedBy = useSelector((state) => state.servedBy)
  const selectedService = servedBy?.service

  // Get serviceId - try multiple possible locations
  const serviceId = selectedService?.serviceId || selectedService?._id || servedBy?.userInfo?.serviceId

  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)

  const messageHandler = async () => {
    if (!message || !userInfo?.user || isSending) return

    // Check if service is selected
    if (!serviceId) {
      notifications.show({
        message: <Title size={"md"}>{t("Please_select_service_first") || "Please select a service first"}</Title>,
        autoClose: 3000,
        color: "yellow"
      })
      return
    }

    setIsSending(true)
    notifications.show({
      id: "inquiry-send",
      message: <Title size={"md"}>Sending Your Request</Title>,
      autoClose: false,
      loading: true,
      withCloseButton: false
    })

    try {
      await dispatch(sendMessage(message, serviceId))
      setMessage("")
      notifications.update({
        id: "inquiry-send",
        message: <Title size={"md"}>Sent Successfully</Title>,
        autoClose: 3000,
        loading: false,
        withCloseButton: false,
        color: "green"
      })
    } catch (error) {
      notifications.update({
        id: "inquiry-send",
        message: <Title size={"md"}>Failed to send. Please try again.</Title>,
        autoClose: 3000,
        loading: false,
        withCloseButton: true,
        color: "red"
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Group
      p="md"
      style={{
        border: "2px solid var(--mantine-color-gray-3)",
        borderRadius: "var(--mantine-radius-md)",
        backgroundColor: "var(--mantine-color-gray-0)",
        width: "100%",
        transition: "all 0.3s ease"
      }}
      gap="sm"
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--mantine-color-primary-4)"
        e.currentTarget.style.boxShadow = "0 0 0 1px var(--mantine-color-primary-2)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--mantine-color-gray-3)"
        e.currentTarget.style.boxShadow = "none"
      }}
    >
      <Avatar
        src={userInfo?.image || userInfo?.user?.image}
        alt="it's me"
        size="md"
      />
      <Input
        placeholder="سؤال محيرني عاوز حد يجاوبني عليه"
        onChange={(e) => setMessage(e.target.value)}
        styles={{
          input: {
            // textAlign: t("Dir") === "rtl" ? "right" : "left" // Align text
            textAlign: "right"
          }
        }}
        value={message}
        style={{flex: 1}}
      />
      <BiSend
        fontSize="2rem"
        onClick={() => messageHandler()}
        style={{
          cursor: isSending ? "not-allowed" : "pointer",
          opacity: isSending ? 0.5 : 1
        }}
      />
    </Group>
  )
}

export default AskHere
