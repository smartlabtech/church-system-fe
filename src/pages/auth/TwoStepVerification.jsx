import {useState} from "react"
import {Stepper, Button, Group, TextInput} from "@mantine/core"
import {validMobileRegex} from "../../myRegexp"
import {notifications} from "@mantine/notifications"
import axios from "axios"
import {USER_LOGIN_SUCCESS} from "../../redux/user/userConstants"
import {useDispatch} from "react-redux"
import {useNavigate} from "react-router-dom"
import {getMyOffers} from "../../redux/courierOffers/courierOffersAction"
import Lottie from "react-lottie-player"
import no from "../assets/lottie/No.json"
import ENV from "../../utils/env"

const TwoStepVerification = ({close}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [active, setActive] = useState(0)
  const [mobileNumber, setMobileNumber] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [buttonStatus, setButtonStatus] = useState(false)

  const url = ENV.API_BASE_URL

  const config = {
    headers: {
      "Content-type": "application/json"
    }
  }

  const controller = new AbortController()
  const signal = controller.signal

  const timeoutId = setTimeout(() => {
    controller.abort()
  }, 2000)

  const nextStep = async () => {
    setButtonStatus(true)
    notifications.show({
      id: "phone regexp",
      loading: true,
      title: t("Verifying_mobile_number"),
      autoClose: false,
      withCloseButton: false
    })

    if (!validMobileRegex.test(mobileNumber.trim())) {
      setButtonStatus(false)
      notifications.update({
        id: "phone regexp",
        loading: false,
        title: t("Invalid_mobile_number"),
        message: t("Please_ensure_11_digits"),
        autoClose: false,
        withCloseButton: true
      })
    } else {
      notifications.update({
        id: "phone regexp",
        loading: true,
        title: t("Sending_verification_code"),
        autoClose: false,
        withCloseButton: false
      })
      try {
        const body = {
          phone: mobileNumber
        }
        const {data} = await axios.post(`${url}/auth/otp`, body, config)

        clearTimeout(timeoutId)

        notifications.update({
          id: "phone regexp",
          loading: false,
          title: t("Verification_code_sent"),
          message: t("Please_check_messages"),
          autoClose: 7000,
          withCloseButton: false
        })
        setButtonStatus(false)
        setActive((current) => (current < 1 ? current + 1 : current))
      } catch (error) {
        setActive((current) => (current < 1 ? current + 1 : current))
        setButtonStatus(false)
        notifications.update({
          id: "phone regexp",
          loading: false,
          color: "red",
          title: t("Send_failed"),
          message:
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
          autoClose: 5000,
          withCloseButton: true
        })
      }
    }
  }

  const prevStep = () => {
    setActive((current) => (current > 0 ? current - 1 : current))
  }

  const verifyOTP = async () => {
    // if (verificationCode?.length == 8)
    if (verificationCode?.length == 6) {
      setButtonStatus(true)
      notifications.show({
        id: "verify",
        loading: true,
        title: t("Verifying"),
        autoClose: false,
        withCloseButton: false
      })

      try {
        const body = {
          otp: verificationCode,
          newPassword: verificationCode,
          phone: mobileNumber
        }
        const {data} = await axios.post(
          `${url}/auth/reset-password/`,
          body,
          config
        )

        clearTimeout(timeoutId)
        // Handle success (e.g., update notifications or move to the next step)
        notifications.update({
          id: "verify",
          loading: false,
          color: "green",
          title: t("Registration_successful"),
          autoClose: 3000,
          withCloseButton: false
        })
        setButtonStatus(false)
        dispatch({
          type: USER_LOGIN_SUCCESS,
          payload: data
        })
        localStorage.setItem("phone", mobileNumber)
        localStorage.setItem("password", verificationCode)
        if (data?.user?.type === "COURIER") {
          dispatch(getMyOffers(data.token))
          navigate(`/courier`)
        }
        close()
      } catch (error) {
        setButtonStatus(false)
        notifications.update({
          id: "verify",
          loading: false,
          color: "red",
          title: t("Verification_error"),
          message:
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
          autoClose: 5000,
          withCloseButton: true
        })
      }
    } else {
      notifications.show({
        id: "verify",
        loading: false,
        color: "red",
        title: (
          <Group justify="space-between">
            <Text>
              {t("يرجي اضافة رقم التأكيد المكون من 6 ارقام المرسل لك في رسالة")}
            </Text>
            <Lottie play loop animationData={no} style={{height: 120}} />
          </Group>
        ),
        autoClose: 5000,
        withCloseButton: false
      })
    }
  }

  return (
    <>
      <Stepper active={active} size="sm" style={{direction: "rtl"}}>
        <Stepper.Step label="رقم التليفون">
          <TextInput
            label="رقم تليفون (متصل بالواتساب)"
            placeholder="رقم تليفونك المحمول"
            maxLength={11}
            minLength={11}
            value={mobileNumber}
            onChange={(event) => {
              const input = event.currentTarget.value
              // Accept only numeric values
              if (/^\d*$/.test(input)) {
                setMobileNumber(input)
              }
            }}
            required
            type="tel" // Ensures numeric keyboard on mobile
            inputMode="numeric" // Further enforces numeric input
            style={{direction: "rtl"}}
          />
        </Stepper.Step>

        <Stepper.Step label="كود التأكيد">
          <TextInput
            label="كود التأكيد المرسل اليك"
            placeholder="6 أرقام"
            maxLength={6}
            minLength={6}
            // label="كود التأكيد المرسل اليك"
            // placeholder="ZBM..HFT"
            // maxLength={8}
            // minLength={8}
            value={verificationCode}
            onChange={(event) => {
              const input = event.currentTarget.value
              // Accept only numeric values
              if (/^\d*$/.test(input)) {
                setVerificationCode(input)
              }
            }}
            required
            // type="number" // Ensures numeric keyboard on mobile
            // inputMode="numeric" // Further enforces numeric input
            type="text" // Ensures numeric keyboard on mobile
            inputMode="text" // Further enforces numeric input
            style={{direction: "rtl"}}
          />
        </Stepper.Step>
      </Stepper>

      <Group justify="center" mt="xs">
        {active != 0 && (
          <Button variant="default" onClick={prevStep} disabled={buttonStatus}>
            رجوع
          </Button>
        )}
        {active == 0 && (
          <Button onClick={nextStep} disabled={buttonStatus}>
            ارسال كود التفعيل لهذا الرقم
          </Button>
        )}
        {active == 1 && (
          <Button onClick={verifyOTP} disabled={buttonStatus}>
            تأكيد
          </Button>
        )}
      </Group>
    </>
  )
}

export default TwoStepVerification
