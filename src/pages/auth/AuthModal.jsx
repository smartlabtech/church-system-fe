import React from "react"
import {Modal, Text} from "@mantine/core"
import AuthScreen from "../../screens/AuthScreen"

const AuthModal = ({opened, open, close}) => {
  return (
    <Modal
      opened={opened}
      centered
      onClose={close}
      withCloseButton={false}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3
      }}
    >
      <AuthScreen />
      {/* <TwoStepVerification close={close} /> */}
    </Modal>
  )
}

export default AuthModal
