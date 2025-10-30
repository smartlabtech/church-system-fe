import React, {useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {register} from "../actions/userActions"
import {validEmailRegex, validMobileRegex} from "../myRegexp"
import {useTranslation} from "react-i18next"
import {
  Card,
  TextInput,
  PasswordInput,
  Button,
  Select,
  Group,
  Loader as MantineLoader,
  Stack,
  Radio,
  Text
} from "@mantine/core"
import {notifications} from "@mantine/notifications"
import Lottie from "react-lottie-player"
import no from "../assets/lottie/No.json"

function SignUp() {
  const dispatch = useDispatch()
  const {t} = useTranslation()

  const {loading} = useSelector((state) => state.userRegister)

  const [formData, setFormData] = useState({
    firstName: "",
    fatherName: "",
    birthDay: "",
    gender: "",
    email: "",
    mobile: "",
    password: ""
    // confirmPassword: ""
  })

  const handleChange = (field, value) => {
    setFormData({...formData, [field]: value})
  }

  const submitHandler = (e) => {
    e.preventDefault()

    const {
      firstName,
      fatherName,
      birthDay,
      gender,
      email,
      mobile,
      password
      // confirmPassword
    } = formData

    let pass = true
    const userData = {
      firstName,
      fatherName,
      gender,
      email,
      mobile,
      password
    }

    if (birthDay) {
      const [year, month, day] = birthDay.split("-")
      userData.birthday = {
        day: Number(day),
        month: Number(month),
        year: Number(year)
      }
    }

    // if (password !== confirmPassword) {
    //   notifications.show({
    //     loading: false,
    //     position: "bottom-center",
    //     color: "red",
    //     title: (
    //       <Group justify="space-between">
    //         <Text>{t("Passwords do not match")}</Text>
    //         <Lottie play loop animationData={no} style={{height: 120}} />
    //       </Group>
    //     ),
    //     autoClose: 3000,
    //     withCloseButton: false
    //   })
    //   pass = false
    // }

    if (password.length < 6) {
      notifications.show({
        loading: false,
        color: "red",
        title: (
          <Group justify="space-between">
            <Text>{t("Password minimum 6 Characters")}</Text>
            <Lottie play loop animationData={no} style={{height: 120}} />
          </Group>
        ),
        autoClose: 3000,
        withCloseButton: false
      })
      pass = false
    }

    if (!validMobileRegex.test(mobile)) {
      notifications.show({
        loading: false,
        color: "red",
        title: (
          <Group justify="space-between">
            <Text>{t("Main mobile Not True")}</Text>
            <Lottie play loop animationData={no} style={{height: 120}} />
          </Group>
        ),
        autoClose: 3000,
        withCloseButton: false
      })
      pass = false
    }

    if (!validEmailRegex.test(email)) {
      notifications.show({
        loading: false,
        color: "red",
        title: (
          <Group justify="space-between">
            <Text>{t("Not valid email")}</Text>
            <Lottie play loop animationData={no} style={{height: 120}} />
          </Group>
        ),
        autoClose: 3000,
        withCloseButton: false
      })
      pass = false
    }

    if (pass) {
      dispatch(register(userData))
    }
  }

  return (
    <Card shadow="sm" radius="sm" withBorder dir={t("Dir")}>
      <form onSubmit={submitHandler}>
        <Stack>
          <Group display={"flex"}>
            <TextInput
              flex={1}
              label={t("First_Name")}
              // placeholder={t("Enter_First_Name")}
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              required
            />
            <TextInput
              flex={1}
              label={t("Father_Name")}
              // placeholder={t("Enter_Father_Name")}
              value={formData.fatherName}
              onChange={(e) => handleChange("fatherName", e.target.value)}
              required
            />
          </Group>
          <TextInput
            label={t("Main_Mobile")}
            placeholder="01005678910"
            value={formData.mobile}
            required
            maxLength={11}
            minLength={11}
            onChange={(event) => {
              const input = event.currentTarget.value
              // Accept only numeric values
              if (/^\d*$/.test(input)) {
                handleChange("mobile", input)
              }
            }}
            type="tel" // Ensures numeric keyboard on mobile
            inputMode="numeric" // Further enforces numeric input
          />
          <TextInput
            label={t("Email")}
            placeholder="hay@gmail.com"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
            type="email"
          />

          <Radio.Group
            value={formData.gender}
            onChange={(value) => handleChange("gender", value)}
            label={t("Gender")}
            withAsterisk
            // required
          >
            <Group mt="xs">
              <Radio value="MALE" label={t("Male")} />
              <Radio value="FEMALE" label={t("Female")} />
            </Group>
          </Radio.Group>
          <TextInput
            label={t("Birthday")}
            value={formData.birthDay}
            onChange={(e) => handleChange("birthDay", e.target.value)}
            required
            type="date"
          />
          <PasswordInput
            label={t("Password")}
            placeholder="*******"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            required
          />
          {/* <PasswordInput
            label={t("Confirm_Password")}
            placeholder="*******"
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            required
          /> */}

          <Button type="submit" fullWidth loading={loading}>
            {t("Sign_Up")}
          </Button>
        </Stack>
      </form>
    </Card>
  )
}

export default SignUp
