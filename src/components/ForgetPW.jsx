import React, {useState} from "react"
import {Link} from "react-router-dom"
import {useDispatch, useSelector} from "react-redux"
import {forgetPassword} from "../actions/userActions"
import {SET_AUTH_SCREEN} from "../constants/authScreenConstants"
import {validMobileRegex} from "../myRegexp"
import {useTranslation} from "react-i18next"
import {
  Card,
  TextInput,
  Button,
  Group,
  Text,
  Loader,
  Stack,
  Anchor
} from "@mantine/core"
import {notifications} from "@mantine/notifications"
import Lottie from "react-lottie-player"
import no from "../assets/lottie/No.json"

function ForgetPW() {
  const dispatch = useDispatch()
  const {t} = useTranslation()

  const [mobile, setMobile] = useState("")

  const {error, loading, result} = useSelector(
    (state) => state.userForgetPassword
  )

  const submitHandler = (e) => {
    e.preventDefault()
    if (validMobileRegex.test(mobile)) {
      dispatch(forgetPassword(mobile))
    } else {
      notifications.show({
        loading: false,
        color: "red",
        title: (
          <Group justify="space-between">
            <Text>{t("Not Valid Mobile Number")}</Text>
            <Lottie play loop animationData={no} style={{height: 120}} />
          </Group>
        ),
        autoClose: 3000,
        withCloseButton: false
      })
    }
  }

  return (
    <Card shadow="sm" radius="sm" withBorder dir={t("Dir")}>
      <form onSubmit={submitHandler}>
        <Stack>
          <TextInput
            label={t("Main_Mobile")}
            placeholder="01005678910"
            value={mobile}
            maxLength={11}
            minLength={11}
            onChange={(event) => {
              const input = event.currentTarget.value
              // Accept only numeric values
              if (/^\d*$/.test(input)) {
                setMobile(input)
              }
            }}
            type="tel" // Ensures numeric keyboard on mobile
            inputMode="numeric" // Further enforces numeric input
            required
          />

          {loading ? (
            <Loader size="sm" />
          ) : (
            <Button type="submit">{t("Send_New_Password")}</Button>
          )}

          <Text ta={"center"}>
            {t("Already_Have_An_Account")}{" "}
            <Anchor
              c={"blue"}
              style={{
                cursor: "pointer",
                textDecoration: "underline"
              }}
              onClick={() =>
                dispatch({type: SET_AUTH_SCREEN, payload: "sign in"})
              }
            >
              {t("Sign_In")}
            </Anchor>
          </Text>
        </Stack>
      </form>
    </Card>
  )
}

export default ForgetPW
