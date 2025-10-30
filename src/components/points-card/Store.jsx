import {useDisclosure} from "@mantine/hooks"
import {Modal, Button, Stack, Anchor, Text, Title} from "@mantine/core"
import {useTranslation} from "react-i18next"
import Lottie from "react-lottie-player"
import cart from "../../assets/lottie/Cart.json"
import gift from "../../assets/lottie/Gift.json"
import gift_box from "../../assets/lottie/GiftBox.json"
import gift_store from "../../assets/lottie/GiftStore.json"
import {useNavigate} from "react-router-dom"

const Store = () => {
  const {t} = useTranslation()
  const navigate = useNavigate()

  const [opened, {open, close}] = useDisclosure(false)

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title=""
        centered
        withCloseButton={false}
      >
        <Stack align="center">
          <Title>Coming Soon</Title>
          <Lottie
            play
            loop
            animationData={gift_store}
            style={{width: "100%"}}
          />
        </Stack>
      </Modal>

      <Stack align="center" gap={0} flex={1} onClick={() => navigate("store")}>
        <Lottie play loop animationData={cart} style={{height: 40}} />
        {/* <Lottie play loop animationData={gift_box} style={{height: 100}} /> */}
        {/* <Lottie play loop animationData={gift} style={{height: 120}} /> */}
      </Stack>
    </>
  )
}

export default Store
