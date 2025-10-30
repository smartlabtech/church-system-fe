import {Avatar, Button, Group, Input, Title} from "@mantine/core"
import {notifications} from "@mantine/notifications"
import React, {useState} from "react"
import {useTranslation} from "react-i18next"
import {BiSend} from "react-icons/bi"
import {useSelector} from "react-redux"

import axios from "axios"

const AskHere = () => {
  const [t, i18n] = useTranslation()

  const userLogin = useSelector((state) => state.userLogin)
  const {userInfo} = userLogin

  const [message, setMessage] = useState("")

  const messageHandler = async () => {
    if (message && userInfo?.user)
      notifications.show({
        id: "inquiry-send",
        // title: "nquiry Status",
        message: <Title size={"md"}>Sending Your Request</Title>,
        autoClose: false,
        loading: true,
        withCloseButton: false
      })

    const chat_id = "936772629"
    const botToken = "8188208271:AAF0j2N6Ypn9o4a5Z41nb7gJS_ZNU4RTplg"
    if (message && userInfo?.user) {
      await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        chat_id: chat_id,
        text: `${message}\nfrom:\n${userInfo.user._id}\n${userInfo.user}`
      })
      setMessage("")
    }
    notifications.update({
      id: "inquiry-send",
      message: <Title size={"md"}>Sent Successfully</Title>,
      autoClose: 3000,
      loading: false,
      withCloseButton: false
    })
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
          // transform: "scaleX(-1)",
          cursor: "pointer" // Optional: change cursor on hover
        }}
      />
    </Group>
  )
}

export default AskHere
