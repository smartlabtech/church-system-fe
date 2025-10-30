import React, {useState} from "react"
import "./ShababEventsScreen.scss"
import events from "./eventList.json"
import paymenyMethods from "./paymenyMethods.json"
import {useDispatch, useSelector} from "react-redux"
import {validMobileRegex} from "../../myRegexp"
import {registerEvent} from "../../actions/shababEventRegisterActions"
import {
  Button,
  Card,
  Group,
  Modal,
  Stack,
  TextInput,
  Select,
  Text
} from "@mantine/core"

const ShababFollowUpScreen = () => {
  const currentDate = new Date()
  const dispatch = useDispatch()
  const shababEventRegister = useSelector((state) => state.shababEventRegister)
  const {loading} = shababEventRegister

  const [show, setShow] = useState(false)
  const [eventDetails, setEventDetails] = useState({})
  const [mainOrWaiting, setMainOrWaiting] = useState("")
  const [fullName, setFullName] = useState("")
  const [mobile, setMobile] = useState("")
  const [stage, setStage] = useState("")

  const handleEvent = (type, eventDetails) => {
    setEventDetails(eventDetails)
    setMainOrWaiting(type)
    setShow(true)
  }

  const handlePay = () => {
    let pass = true
    let payload = {
      event: eventDetails.name,
      cost: eventDetails.cost,
      mainOrWaiting: mainOrWaiting
    }

    if (fullName === "") {
      alert("اسمك مش مكتوب")
      pass = false
    } else {
      payload.fullName = fullName
    }

    if (!validMobileRegex.test(mobile)) {
      alert("رقم الموبايل غير صحيح")
      pass = false
    } else {
      payload.mobile = mobile
    }

    if (stage === "") {
      alert("اختار فصلك")
      pass = false
    } else {
      payload.class = stage
    }

    if (pass) {
      dispatch(registerEvent(payload))
    }
  }

  const options = [
    {value: "اولي", label: "اولي"},
    {value: "ثانيه", label: "ثانيه"},
    {value: "ثالثه", label: "ثالثه"},
    {value: "رابعة", label: "رابعة"},
    {value: "خامسة", label: "خامسة"},
    {value: "أخري", label: "أخري"}
  ]

  return (
    <div>
      <Modal
        opened={show}
        onClose={() => setShow(false)}
        title={eventDetails.name}
      >
        <Stack spacing="md">
          <TextInput
            label="الاسم ثلاثي (عربي)"
            placeholder="اكتب اسمك"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <TextInput
            label="رقم موبايل اللي طالع"
            placeholder="اكتب رقم موبايلك"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
          <Select
            label="فصلك"
            placeholder="اختر فصلك"
            data={options}
            onChange={(value) => setStage(value)}
          />
          <Stack spacing="xs">
            {paymenyMethods.map((method, index) => (
              <Card key={index} shadow="sm" padding="lg">
                <Group>
                  <img src={method.icon} alt="" style={{maxHeight: "25px"}} />
                  <Text>{method.name}</Text>
                </Group>
                <Text size="sm" color="dimmed">
                  {method.description}
                </Text>
                {method.note && (
                  <Text size="xs" color="red">
                    {method.note}
                  </Text>
                )}
              </Card>
            ))}
          </Stack>
          <Button onClick={handlePay} loading={loading}>
            تأكيد الحجز
          </Button>
        </Stack>
      </Modal>

      <Group position="center" spacing="md" style={{flexWrap: "wrap"}}>
        {events.map((event, index) => (
          <Card key={index} shadow="sm" padding="lg" style={{width: "300px"}}>
            <Text weight={500}>{event.name}</Text>
            {new Date(event.registrationEndDate) > currentDate ? (
              <Button mt="md" onClick={() => handleEvent("main", event)}>
                حجز
              </Button>
            ) : (
              <Button
                mt="md"
                onClick={() => handleEvent("waiting", event)}
                color="gray"
              >
                قائمة الانتظار
              </Button>
            )}
          </Card>
        ))}
      </Group>
    </div>
  )
}

export default ShababFollowUpScreen
