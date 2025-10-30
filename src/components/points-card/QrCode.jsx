import {useDisclosure} from "@mantine/hooks"
import {Modal, Button, Stack} from "@mantine/core"
import {useState} from "react"
import QRCode from "react-qr-code"

const QrCode = ({qrCode}) => {
  const [opened, {open, close}] = useDisclosure(false)

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
        title="Authentication"
        centered
        style={{textAlign: "center"}}
        withCloseButton={false}
      >
        <QRCode
          //   id="hmmm"
          value={qrCode}
          bgColor={qrProps.bgColor}
          fgColor={qrProps.fgColor}
          style={{alignSelf: "center", width: "100%"}}
        />
      </Modal>
      <Stack onClick={open}>
        <QRCode
          // id="hmmm"
          value={qrCode}
          bgColor={qrProps.bgColor}
          fgColor={qrProps.fgColor}
          size={qrProps.size}
        />
      </Stack>
    </>
  )
}

export default QrCode
