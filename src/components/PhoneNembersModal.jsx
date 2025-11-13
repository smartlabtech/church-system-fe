import React, {useState, useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {useTranslation} from "react-i18next"

import {CallNumber} from "./CallNumber"
import {Group, Modal, Stack, ActionIcon, Tooltip, Text, Anchor, Paper, Divider} from "@mantine/core"
import {FaPhone, FaWhatsapp} from "react-icons/fa"
import {notifications} from "@mantine/notifications"

// Component to display phone number with call and WhatsApp actions
const PhoneNumberRow = ({type, number, userName, t, isHomePhone = false}) => {
  const sendWhatsAppMessage = () => {
    const message = `اهلا ${userName}`
    const url = `https://wa.me/+2${number}?text=${encodeURIComponent(message)}`
    window.open(url, "_blank")
  }

  return (
    <Paper p="xs" withBorder radius="md">
      <Group justify="space-between" wrap="nowrap">
        <Text size="sm" fw={500}>
          {t(type)}
        </Text>
        <Group gap="xs">
          <Tooltip label={t("Call")} withArrow>
            <ActionIcon
              variant="light"
              color="blue"
              size="md"
              component="a"
              href={`tel:${number}`}
            >
              <FaPhone size={14} />
            </ActionIcon>
          </Tooltip>
          {!isHomePhone && (
            <Tooltip label={t("Send_WhatsApp_Message")} withArrow>
              <ActionIcon
                variant="light"
                color="green"
                size="md"
                onClick={sendWhatsAppMessage}
              >
                <FaWhatsapp size={14} />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
      </Group>
    </Paper>
  )
}

const PhoneNumbersModal = ({userDetails}) => {
  const [t, i18n] = useTranslation()

  const [show, setShow] = useState(false)

  function sendMessage() {
    if (!userDetails.mobile || userDetails.mobile === "") {
      notifications.show({
        title: t("Error"),
        message: t("No_mobile_number_available"),
        color: "red"
      })
      return
    }

    const phoneNumber = userDetails.mobile // Replace with the actual number
    const message = `اهلا ${userDetails.firstName}` // Customize your message
    const url = `https://wa.me/+2${phoneNumber}?text=${encodeURIComponent(
      message
    )}`
    window.open(url, "_blank")
  }

  const hasMobile = userDetails.mobile && userDetails.mobile !== ""

  return (
    <>
      <Group gap={"lg"}>
        <ActionIcon
          variant="subtle"
          color="gray"
          size="sm"
          onClick={() => setShow(true)}
        >
          <FaPhone size={"1rem"} />
        </ActionIcon>

        <Tooltip
          label={hasMobile ? t("Send_WhatsApp_Message") : t("No_mobile_number_available")}
          withArrow
        >
          <ActionIcon
            variant="subtle"
            color={hasMobile ? "green" : "gray"}
            size="sm"
            onClick={() => sendMessage()}
            disabled={!hasMobile}
            style={{ opacity: hasMobile ? 1 : 0.5, cursor: hasMobile ? 'pointer' : 'not-allowed' }}
          >
            <FaWhatsapp size={"1rem"} />
          </ActionIcon>
        </Tooltip>
      </Group>
      <Modal
        opened={show}
        onClose={() => setShow(false)}
        withCloseButton={false}
        centered
        title={t("Contact_Via")}
      >
        <Modal.Body style={{direction: t("Dir")}}>
          <Stack gap="md">
            {userDetails?.mobile && userDetails?.mobile != "" && (
              <PhoneNumberRow
                type="Main_Mobile"
                number={userDetails?.mobile}
                userName={userDetails.firstName}
                t={t}
              />
            )}

            {userDetails?.anotherMobile && userDetails?.anotherMobile != "" && (
              <PhoneNumberRow
                type="Another_Mobile"
                number={userDetails?.anotherMobile}
                userName={userDetails.firstName}
                t={t}
              />
            )}

            {userDetails?.homePhone && userDetails?.homePhone != "" && (
              <PhoneNumberRow
                type="Home_Phone"
                number={userDetails?.homePhone}
                userName={userDetails.firstName}
                t={t}
                isHomePhone={true}
              />
            )}

            {userDetails?.motherMobile && userDetails?.motherMobile != "" && (
              <PhoneNumberRow
                type="Mother_Mobile"
                number={userDetails.motherMobile}
                userName={userDetails.firstName}
                t={t}
              />
            )}

            {userDetails?.fatherMobile && userDetails?.fatherMobile != "" && (
              <PhoneNumberRow
                type="Father_Mobile"
                number={userDetails.fatherMobile}
                userName={userDetails.firstName}
                t={t}
              />
            )}
          </Stack>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default PhoneNumbersModal
