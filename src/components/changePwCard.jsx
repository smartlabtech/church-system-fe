import React, {useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {changePassword} from "../actions/userActions"
import {useTranslation} from "react-i18next"
import {
  Card,
  TextInput,
  Button,
  Loader as MantineLoader,
  Group,
  PasswordInput,
  Stack,
  Text
} from "@mantine/core"
import {notifications} from "@mantine/notifications"
import Lottie from "react-lottie-player"

import no from "../assets/lottie/No.json"
function ChangePwCard() {
  const dispatch = useDispatch()
  const [t] = useTranslation()

  const userChangePassword = useSelector((state) => state.userChangePassword)
  const {loading} = userChangePassword

  const [password, setPassword] = useState("")

  const submitHandler = (e) => {
    e.preventDefault()
    if (password.length < 6) {
      notifications.show({
        loading: false,
        color: "red",
        title: (
          <Group justify="space-between">
            <Text>{t("Minimum 6 characters please")}</Text>
            <Lottie play loop animationData={no} style={{height: 120}} />
          </Group>
        ),
        autoClose: 3000,
        withCloseButton: false
      })
    } else {
      dispatch(changePassword({password}))
    }
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder dir={t("Dir")}>
      <form onSubmit={submitHandler}>
        <Stack>
          <PasswordInput
            label={t("New_Password")}
            placeholder="*******"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button disabled={loading} type="submit">
            {t("Update")}
          </Button>
        </Stack>
      </form>
    </Card>
  )
}

export default ChangePwCard
