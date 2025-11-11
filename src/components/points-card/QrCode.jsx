import {useDisclosure} from "@mantine/hooks"
import {
  Modal,
  Button,
  Stack,
  Paper,
  Text,
  Group,
  ActionIcon,
  Tooltip,
  Center,
  Box,
  ThemeIcon,
  Divider,
  CopyButton
} from "@mantine/core"
import {useState} from "react"
import {useTranslation} from "react-i18next"
import QRCode from "react-qr-code"
import {FaQrcode, FaCopy, FaCheckCircle} from "react-icons/fa"

const QrCode = ({qrCode}) => {
  const [opened, {open, close}] = useDisclosure(false)
  const {t} = useTranslation()

  const [bgColor, setBgColor] = useState("#ffffff")
  const [fgColor, setFgColor] = useState("#000000")
  const [size, setSize] = useState(35)

  let qrProps = {
    bgColor: bgColor,
    fgColor: fgColor,
    size: size
  }

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        centered
        size="md"
        padding="xl"
        radius="md"
        withCloseButton={true}
        title={
          <Group gap="sm">
            <ThemeIcon size="lg" radius="md" variant="light" color="blue">
              <FaQrcode size={20} />
            </ThemeIcon>
            <Text size="lg" fw={600}>
              {t("My_QR_Code")}
            </Text>
          </Group>
        }
      >
        <Stack gap="lg" align="center">
          <Text size="sm" c="dimmed" ta="center">
            {t("Scan_this_QR_code_for_quick_identification")}
          </Text>

          <Paper
            shadow="sm"
            p="xl"
            radius="md"
            withBorder
            style={{
              backgroundColor: "white",
              display: "inline-block"
            }}
          >
            <Center>
              <QRCode
                value={qrCode}
                bgColor={qrProps.bgColor}
                fgColor={qrProps.fgColor}
                size={256}
                style={{
                  height: "auto",
                  maxWidth: "100%",
                  width: "100%"
                }}
              />
            </Center>
          </Paper>

          <Divider w="100%" />

          <Stack gap="xs" w="100%">
            <Text size="xs" c="dimmed" ta="center">
              {t("User_ID")}
            </Text>
            <Group justify="center" gap="xs">
              <Paper
                p="xs"
                radius="sm"
                bg="gray.0"
                style={{flex: 1, maxWidth: 300}}
              >
                <Text
                  size="xs"
                  ta="center"
                  ff="monospace"
                  style={{
                    wordBreak: "break-all",
                    userSelect: "all"
                  }}
                >
                  {qrCode}
                </Text>
              </Paper>
              <CopyButton value={qrCode} timeout={2000}>
                {({copied, copy}) => (
                  <Tooltip
                    label={copied ? t("Copied") : t("Copy_ID")}
                    withArrow
                    position="top"
                  >
                    <ActionIcon
                      color={copied ? "green" : "blue"}
                      variant="light"
                      onClick={copy}
                      size="lg"
                    >
                      {copied ? (
                        <FaCheckCircle size={16} />
                      ) : (
                        <FaCopy size={16} />
                      )}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            </Group>
          </Stack>
        </Stack>
      </Modal>

      {/* QR Code trigger button in header */}
      <Tooltip label={t("Show_QR_Code")} withArrow position="bottom">
        <ActionIcon
          variant="light"
          color="blue"
          size="lg"
          radius="md"
          onClick={open}
          style={{cursor: "pointer"}}
        >
          <QRCode
            value={qrCode}
            bgColor={qrProps.bgColor}
            fgColor={qrProps.fgColor}
            size={qrProps.size}
          />
        </ActionIcon>
      </Tooltip>
    </>
  )
}

export default QrCode
