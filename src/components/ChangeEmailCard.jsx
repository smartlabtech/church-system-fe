import React, {useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {updateUserProfile} from "../actions/userActions"
import {validEmailRegex} from "../myRegexp"
import {useTranslation} from "react-i18next"
import {
  Card,
  TextInput,
  Button,
  Loader as MantineLoader,
  Group,
  Stack
} from "@mantine/core"
import {notifications} from "@mantine/notifications"
import Lottie from "react-lottie-player"
import no from "../assets/lottie/No.json"

function ChangeEmailCard() {
  const dispatch = useDispatch()
  const [t] = useTranslation()

  const userLogin = useSelector((state) => state.userLogin)
  const {userInfo} = userLogin

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile)
  const {loading} = userUpdateProfile

  const [email, setEmail] = useState(userInfo?.user.email || "")

  const submitHandler = () => {
    let pass = true
    let updateProfile = {}

    if (email !== userInfo?.user.email) {
      updateProfile["email"] = email
    } else {
      pass = false
      notifications.show({
        loading: false,
        color: "red",
        title: (
          <Group justify="space-between">
            <Text>{t("Not Change to Update")}</Text>
            <Lottie play loop animationData={no} style={{height: 120}} />
          </Group>
        ),
        autoClose: 3000,
        withCloseButton: false
      })
    }

    if (!validEmailRegex.test(email)) {
      pass = false
      notifications.show({
        loading: false,
        color: "red",
        title: (
          <Group justify="space-between">
            <Text>{t("Not Valid Email")}</Text>
            <Lottie play loop animationData={no} style={{height: 120}} />
          </Group>
        ),
        autoClose: 3000,
        withCloseButton: false
      })
    }

    if (pass) dispatch(updateUserProfile(updateProfile))
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder dir={t("Dir")}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          submitHandler()
        }}
      >
        <Stack>
          <TextInput
            label={t("E-mail")}
            placeholder="hany@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
          />

          <Button disabled={loading} type="submit">
            {t("Update")}
          </Button>
        </Stack>
      </form>
    </Card>
  )
}

export default ChangeEmailCard
