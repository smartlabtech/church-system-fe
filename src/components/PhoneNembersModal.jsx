import React, {useState, useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {useTranslation} from "react-i18next"

import {CallNumber} from "./CallNumber"
import {Group, Modal, Stack} from "@mantine/core"
import {FaPhone, FaWhatsapp} from "react-icons/fa"

const PhoneNumbersModal = ({userDetails}) => {
  const [t, i18n] = useTranslation()

  const [show, setShow] = useState(false)

  function sendMessage() {
    const phoneNumber = userDetails.mobile // Replace with the actual number
    const message = `اهلا ${userDetails.firstName}` // Customize your message
    const url = `https://wa.me/+2${phoneNumber}?text=${encodeURIComponent(
      message
    )}`
    window.open(url, "_blank")
  }

  return (
    <>
      <Group gap={"lg"}>
        <FaPhone size={"1rem"} onClick={() => setShow(true)} />
        <FaWhatsapp color="green" size={"1rem"} onClick={() => sendMessage()} />
      </Group>
      <Modal
        opened={show}
        onClose={() => setShow(false)}
        withCloseButton={false}
        centered
      >
        <Modal.Body style={{direction: t("Dir")}}>
          <Stack>
            {userDetails?.mobile && userDetails?.mobile != "" && (
              <CallNumber type={"Main_Mobile"} number={userDetails?.mobile} />
            )}

            {userDetails?.anotherMobile && userDetails?.anotherMobile != "" && (
              <CallNumber
                type={"Another_Mobile"}
                number={userDetails?.anotherMobile}
              />
            )}

            {userDetails?.homePhone && userDetails?.homePhone != "" && (
              <CallNumber type={"Home_Phone"} number={userDetails?.homePhone} />
            )}

            {userDetails?.motherMobile && userDetails?.motherMobile != "" && (
              <CallNumber
                type={"Mother_Mobile"}
                number={userDetails.motherMobile}
              />
            )}

            {userDetails?.fatherMobile && userDetails?.fatherMobile != "" && (
              <CallNumber
                type={"Father_Mobile"}
                number={userDetails.fatherMobile}
              />
            )}
          </Stack>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default PhoneNumbersModal
