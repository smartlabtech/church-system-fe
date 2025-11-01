import React, {useState, useEffect} from "react"
import {Box, Button, Group, Text} from "@mantine/core"
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
      {isInstallable && showModal && (
        <Box
          style={{
            backgroundColor: "var(--mantine-color-blue-6)",
            color: "white",
            padding: "8px 16px",
            position: "sticky",
            top: 0,
            zIndex: 200,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}
        >
          <Group justify="space-between" wrap="nowrap" gap="md">
            <Text size="sm" style={{flex: 1}}>
              {t("Install_App")}
            </Text>
            <Group gap="xs">
              <Button
                onClick={handleInstallClick}
                size="xs"
                variant="white"
                color="blue"
              >
                {t("Install")}
              </Button>
              <Button
                onClick={() => setShowModal(false)}
                size="xs"
                variant="subtle"
                style={{color: "white"}}
              >
                ✕
              </Button>
            </Group>
          </Group>
        </Box>
      )}
    </>
  )
}

export default AppInstallPopup
