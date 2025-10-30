import React, {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {useTranslation} from "react-i18next"
import {SET_AUTH_SCREEN} from "../constants/authScreenConstants"
import SignIn from "../components/SignIn"
import ForgetPW from "../components/ForgetPW"
import SignUp from "../components/SignUp"
import {Button, Divider, Group, Stack, Title} from "@mantine/core"

function AuthScreen({history}) {
  const dispatch = useDispatch()
  const {t, i18n} = useTranslation()

  const userInfo = useSelector((state) => state.userLogin?.userInfo)
  const screen = useSelector((state) => state.authScreen?.screen)

  useEffect(() => {
    if (userInfo) {
      history.push("/")
    } else {
      dispatch({type: SET_AUTH_SCREEN, payload: "sign in"})
    }
  }, [userInfo, history, dispatch])

  const toggleLanguage = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar"
    localStorage.setItem("lang", newLang)
    localStorage.setItem("dir", newLang === "ar" ? "rtl" : "ltr")
    i18n.changeLanguage(newLang)
  }

  return (
    <Stack dir={t("Dir")}>
      <Group justify="space-between">
        <Title size={"xl"}>
          {screen === "sign in"
            ? t("Sign_In")
            : screen === "sign up"
            ? t("Sign_Up")
            : t("Forget_Password")}
        </Title>
        <Button variant="outline" onClick={toggleLanguage}>
          {i18n.language === "ar" ? "English" : "\u0639\u0631\u0628\u064a"}
        </Button>
      </Group>
      <Divider />
      <Group justify="center">
        <Button
          variant={
            screen === "sign in" || screen === "forget pw"
              ? "filled"
              : "outline"
          }
          onClick={() => dispatch({type: SET_AUTH_SCREEN, payload: "sign in"})}
        >
          {t("Sign_In")}
        </Button>
        <Button
          variant={screen === "sign up" ? "filled" : "outline"}
          onClick={() => dispatch({type: SET_AUTH_SCREEN, payload: "sign up"})}
        >
          {t("Sign_Up")}
        </Button>
      </Group>

      <Stack>
        {screen === "sign in" && <SignIn />}
        {screen === "forget pw" && <ForgetPW />}
        {screen === "sign up" && <SignUp />}
      </Stack>
    </Stack>
  )
}

export default AuthScreen
