import React, {useState} from "react"
import {Link} from "react-router-dom"
import {useDispatch, useSelector} from "react-redux"
import {login} from "../actions/userActions"
import {validMobileRegex} from "../myRegexp"
import {SET_AUTH_SCREEN} from "../constants/authScreenConstants"
import {useTranslation} from "react-i18next"
import {
  Card,
  TextInput,
  PasswordInput,
  Button,
  Text,
  Stack
} from "@mantine/core"

function SignIn() {
  const dispatch = useDispatch()
  const {t} = useTranslation()

  const {error, loading, userInfo} = useSelector((state) => state.userLogin)

  const [mobile, setMobile] = useState("")
  const [ID, setID] = useState("")
  const [password, setPassword] = useState("")
  const [signInBy, setSignInBy] = useState("mobile")

  const submitHandler = (e) => {
    e.preventDefault()
    let pass = false
    let data = {}

    if (mobile !== "" && validMobileRegex.test(mobile)) {
      pass = true
      data["mobile"] = mobile
    } else if (ID !== "") {
      pass = true
      data["id"] = ID
    }

    if (pass) dispatch(login(data, password, "SIGNIN"))
  }

  return (
    <Card shadow="sm" radius="sm" withBorder dir={t("Dir")}>
      <form onSubmit={submitHandler}>
        <Stack>
          {/* <Radio.Group
            style={{alignSelf: "center"}}
            value={signInBy}
            onChange={(value) => {
              setSignInBy(value)
              setMobile("")
              setID("")
            }}
            // label={t("Sign_In_By")}
            // description="This is anonymous"
            withAsterisk
          >
            <Group mt="xs">
              <Radio value="mobile" label={t("By_Mobile")} />
              <Radio value="ID" label={t("By_ID")} />
            </Group>
          </Radio.Group> */}

          {signInBy === "mobile" ? (
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
          ) : (
            <TextInput
              label={t("Your_Id")}
              placeholder="6373bfdfd85ad3dceffb0d3d9a"
              value={ID}
              onChange={(e) => setID(e.target.value)}
              required
            />
          )}

          <PasswordInput
            label={t("Password")}
            placeholder={t("******")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" loading={loading} fullWidth>
            {t("Sign_In")}
          </Button>

          <Text
            ta={"center"}
            size="sm"
            c="blue"
            style={{
              cursor: "pointer",
              textDecoration: "underline"
            }}
            onClick={() =>
              dispatch({type: SET_AUTH_SCREEN, payload: "forget pw"})
            }
          >
            {t("Forget_Password")}
          </Text>
        </Stack>
      </form>
    </Card>
  )
}

export default SignIn
