import React from "react"
import {Group, Modal, AspectRatio, Image} from "@mantine/core"

const PhotoModal = ({userImage, status, onHide}) => {
  return (
    <Modal
      opened={status}
      onClose={() => onHide(false)}
      centered
      withCloseButton={false}
      size="sm"
      styles={{modal: {borderRadius: "15px"}}}
    >
      <Group justify="center" style={{width: "100%"}}>
        <AspectRatio ratio={1} style={{width: "100%", maxWidth: 400}}>
          <Image src={userImage} alt="User" radius="lg" fit="cover" />
        </AspectRatio>
      </Group>
    </Modal>
  )
}

export default PhotoModal
