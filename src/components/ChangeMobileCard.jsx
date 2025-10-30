import React, {useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {updateUserProfile} from "../actions/userActions"
import {validMobileRegex} from "../myRegexp"
import {useTranslation} from "react-i18next"
import {
  Card,
  TextInput,
  Button,
  Group,
  Stack,
  Divider,
  Loader
} from "@mantine/core"
import {notifications} from "@mantine/notifications"
import Lottie from "react-lottie-player"
import no from "../assets/lottie/No.json"

function ChangeMobileCard() {
  const dispatch = useDispatch()
  const [t] = useTranslation()

  const userLogin = useSelector((state) => state.userLogin)
  const {userInfo} = userLogin

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile)
  const {loading} = userUpdateProfile

  const [mobile, setMobile] = useState(userInfo?.user.mobile || "")

  const submitHandler = () => {
    let pass = true
    let updateProfile = {}

    if (mobile !== userInfo?.user.mobile) {
      updateProfile["mobile"] = mobile
    } else {
      pass = false
      notifications.show({
        loading: false,
        color: "red",
        title: (
          <Group justify="space-between">
            <Text>{t("Not_Change_To_Update")}</Text>
            <Lottie play loop animationData={no} style={{height: 120}} />
          </Group>
        ),
        autoClose: 3000,
        withCloseButton: false
      })
    }

    if (!validMobileRegex.test(mobile)) {
      pass = false
      notifications.show({
        loading: false,
        color: "red",
        title: (
          <Group justify="space-between">
            <Text>{t("Wrong_Mobile_Number")}</Text>
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
            label={t("Main_Mobile")}
            placeholder="0127321..."
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

          <Button disabled={loading} type="submit">
            {t("Update")}
          </Button>
        </Stack>
      </form>
    </Card>
  )
}

export default ChangeMobileCard
