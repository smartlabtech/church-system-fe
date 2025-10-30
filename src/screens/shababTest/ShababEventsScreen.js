import React, {useState} from "react"
import "./ShababEventsScreen.scss"
import events from "./eventList.json"
import paymenyMethods from "./paymenyMethods.json"
import {useDispatch, useSelector} from "react-redux"
import {validMobileRegex} from "../../myRegexp"
import {registerEvent} from "../../actions/shababEventRegisterActions"
import {
  Button,
  Loader,
  Modal,
  Text,
  Stack,
  Select,
  Group,
  TextInput
} from "@mantine/core"

const ShababEventsScreen = () => {
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
    <>
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
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
          <Select
            label="فصلك"
            data={options}
            placeholder="اختر فصلك"
            onChange={(value) => setStage(value)}
          />
          <Stack spacing="sm">
            {paymenyMethods.map((paymentMethod, index) => (
              <Stack
                key={index}
                spacing="xs"
                style={{border: "1px solid #ccc", padding: "10px"}}
              >
                <Group align="center">
                  <img
                    src={paymentMethod.icon}
                    alt="payment"
                    style={{maxHeight: "25px"}}
                  />
                  <Text weight={500}>{paymentMethod.name}</Text>
                </Group>
                <Text size="sm" color="dimmed">
                  {paymentMethod.description}
                </Text>
                {paymentMethod.note && (
                  <Text size="xs" color="red">
                    {paymentMethod.note}
                  </Text>
                )}
              </Stack>
            ))}
          </Stack>
          {loading ? (
            <Loader />
          ) : (
            <Button onClick={handlePay}>تأكيد الحجز</Button>
          )}
        </Stack>
      </Modal>

      <div id="events">
        {events.map(
          (event, index) =>
            new Date(event.waitingListEndDate) > currentDate && (
              <div className="event-details" key={index}>
                <div className="image">
                  <img
                    src={event.image}
                    alt="event"
                    style={{borderRadius: "5px"}}
                  />
                </div>
                {new Date(event.registrationEndDate) > new Date() && (
                  <>
                    {event.hurryNote && (
                      <Text size="sm" color="red">
                        الحق احجز مكانك دلوقت حتي لو بـ٥٠% من قيمة الاشتراك عشان
                        متكنش في قائمة الانتظار
                      </Text>
                    )}
                    <Button onClick={() => handleEvent("main", event)}>
                      <Text size="lg" weight={500} color="red">
                        حجز
                      </Text>
                      <Text>{event.cost} ج.م</Text>
                    </Button>
                  </>
                )}
                {new Date(event.registrationEndDate) < new Date() &&
                  new Date(event.waitingListEndDate) > new Date() && (
                    <Button onClick={() => handleEvent("waiting", event)}>
                      <Text size="lg" weight={500} color="red">
                        حجز في قائمة الانتظار
                      </Text>
                      <Text>{event.cost} ج.م</Text>
                    </Button>
                  )}
              </div>
            )
        )}
      </div>
    </>
  )
}

export default ShababEventsScreen
