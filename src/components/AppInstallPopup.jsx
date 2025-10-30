import React, {useState, useEffect} from "react"
import {Button, Group, Modal, Text} from "@mantine/core"
import {useTranslation} from "react-i18next"

function AppInstallPopup() {
  const {t} = useTranslation()

  const [isInstallable, setIsInstallable] = useState(false)
  const [showModal, setShowModal] = useState(true)
  const [deferredPrompt, setDeferredPrompt] = useState(null)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      )
    }
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()

      const choiceResult = await deferredPrompt.userChoice
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt")
      } else {
        console.log("User dismissed the install prompt")
      }

      setDeferredPrompt(null)
      setIsInstallable(false)
      setShowModal(false)
    }
  }

  return (
    <>
      {/* {isInstallable && (
        <Modal
          opened={showModal}
          onClose={() => setShowModal(false)}
          title="Install App"
        >
          <Text>Install church app for a better experience!</Text>
          <Button onClick={handleInstallClick}>Install</Button>
        </Modal>
      )} */}
      {isInstallable && (
        <Group
          justify="space-between"
          w={"100%"}
          dir={t("Dir")}
          wrap="nowrap"
          gap="xs"
        >
          <Text size="xs" style={{flex: 1, minWidth: 0, fontSize: "0.75rem"}}>{t("Install_App")}</Text>
          <Button onClick={handleInstallClick} size="xs" style={{flexShrink: 0, fontSize: "0.7rem", padding: "4px 12px", height: "28px"}}>{t("Install")}</Button>
        </Group>
      )}

      {/* Trigger Modal
      {isInstallable && (
        <Button onClick={() => setShowModal(true)}>Show Install Popup</Button>
      )} */}
    </>
  )
}

export default AppInstallPopup
