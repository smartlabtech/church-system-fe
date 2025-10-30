import React, {useState} from "react"
import {
  Button,
  Modal,
  Radio,
  Group,
  Box,
  Stack,
  Title,
  Text,
  Card,
  Anchor,
  useMantineTheme,
  Divider,
  Accordion,
  Avatar
} from "@mantine/core"
import {useTranslation} from "react-i18next"
import {useMediaQuery} from "@mantine/hooks"
import {notifications} from "@mantine/notifications"
import Lottie from "react-lottie-player"
import {FaArrowLeft, FaArrowRight} from "react-icons/fa"

import bible from "../../assets/lottie/Bible.json"
import checking from "../../assets/lottie/Checking.json"
import no from "../../assets/lottie/Noo.json"
import wellDone from "../../assets/lottie/WellDone.json"
import OlympicRunningRace from "../../assets/lottie/OlympicRunningRace.json"

import axios from "axios"
import {useDispatch, useSelector} from "react-redux"
import {USER_SERVICE_META_SUCCESS} from "../../constants/userServiceMetaConstants"
import MarathonRules from "./MarathonRules"
import ENV from "../../utils/env"

const base_url = ENV.API_BASE_URL

const BibleMCQ = ({bibleMCQs, userInfo}) => {
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const theme = useMantineTheme()

  const isSmallScreen = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [selectedLabel, setSelectedLabel] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState([])

  const userServiceMeta = useSelector((state) => state.userServiceMeta)
  const {landingPage} = userServiceMeta

  const handleAnswerSelection = (payload) => {
    setSelectedAnswer(payload.value)
    setSelectedLabel(payload.label)
    setIsModalOpen(true)
  }

  const confirmAnswer = async () => {
    const now = new Date()

    // Extract year, month, day, hour, minute, second
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0") // Months are zero-based
    const day = String(now.getDate()).padStart(2, "0") // Get the day of the month
    const hour = String(now.getHours()).padStart(2, "0")
    const minute = String(now.getMinutes()).padStart(2, "0")
    const second = String(now.getSeconds()).padStart(2, "0")

    const payload = {
      serviceId: bibleMCQs[currentQuestionIndex].serviceId,
      MCQId: bibleMCQs[currentQuestionIndex]._id,
      MCQChoiceId: selectedAnswer,
      createdAt: `${year}-${month}-${day}T${hour}:${minute}:${second}.000Z`
    }
    try {
      notifications.show({
        id: "MCQ",
        loading: false,
        color: "transparent",
        // title: "جاري حفظ الصورة",
        message: (
          <Group justify="center">
            <Lottie play loop animationData={checking} style={{width: "50%"}} />
          </Group>
        ),
        autoClose: false,
        withCloseButton: false
      })

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${userInfo.token}`
        }
      }
      const {data} = await axios.post(`${base_url}/MCQ_Answer`, payload, config)

      if (data?.MCQChoiceId === data?.MCQTrueChoiceId) {
        dispatch({
          type: USER_SERVICE_META_SUCCESS,
          payload: {
            ...landingPage,
            score: landingPage?.score + data?.pointsGained
          }
        })
        notifications.update({
          id: "MCQ",
          loading: false,
          // title: "",
          message: (
            <Group justify="space-between" display={"flex"}>
              <Title
                flex={1}
                size={"md"}
              >{`حصلت علي ${data?.pointsGained} نقاط`}</Title>
              <Group flex={1}>
                <Lottie
                  play
                  loop
                  animationData={wellDone}
                  style={{width: "100%"}}
                />
              </Group>
            </Group>
          ),
          color: "transparent",
          autoClose: 2500,
          withCloseButton: false
        })
      } else {
        notifications.update({
          id: "MCQ",
          loading: false,
          message: (
            <Group align="center">
              <Lottie play loop animationData={no} style={{width: "100%"}} />
            </Group>
          ),
          color: "transparent",
          autoClose: 2000,
          withCloseButton: false
        })
      }
    } catch (error) {
      if (error?.response && error?.response?.data?.message)
        notifications.update({
          id: "MCQ",
          loading: false,
          title: <Title>{t("Save_error")}</Title>,
          message: <Text>{error?.response?.data?.message}</Text>,
          color: "red",
          autoClose: 5000,
          withCloseButton: true
        })
    }
    setUserAnswers((prev) => [
      ...prev,
      {
        question: bibleMCQs[currentQuestionIndex].question,
        answer: selectedAnswer
      }
    ])
    setIsModalOpen(false)

    if (currentQuestionIndex < bibleMCQs.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }

    // {
    //   notifications.show({
    //     bg: "transparent",
    //     loading: false,
    //     color: "transparent",
    //     title: (
    //       <Group justify="center">
    //         <Lottie play loop animationData={thanks} style={{width: "100%"}} />
    //       </Group>
    //     ),
    //     autoClose: 2500,
    //     withCloseButton: false
    //   })
    // }
  }

  return (
    bibleMCQs?.length > 0 && (
      <Stack
        dir="rtl"
        p={0}
        mx={isSmallScreen ? "0" : "15%"}
        gap={"0"}
        style={{alignItems: "center"}}
        align="center"
      >
        <Group
          justify="space-between"
          dir={t("Dir")}
          w={"100%"}
          // bg={"gray"}
          style={{borderRadius: "5px"}}
        >
          <Group>
            {userInfo?.user?.role === "admin" && <MarathonRules />}
            <Group gap={0} ta="center">
              {Array(3)
                .fill(0)
                .map((any, index) => (
                  <Lottie
                    key={index}
                    play
                    loop
                    animationData={OlympicRunningRace}
                    style={{width: "2rem"}}
                  />
                ))}
            </Group>
          </Group>
          <Group>
            <Avatar.Group>
              {/* to get the first 3 use .slice(0, 2) */}
              {landingPage?.todayRunners?.slice(0, 5).map((runner, index) => (
                <Avatar
                  key={index}
                  alt="no image here"
                  name={`${runner?.firstName} ${runner?.fatherName}`}
                  src={runner?.photo[0]?.imageUrl}
                />
              ))}
              {landingPage?.todayRunners?.length > 3 && (
                <Avatar>+{landingPage.todayRunners.length - 3}</Avatar>
              )}
            </Avatar.Group>
          </Group>
        </Group>
        <Accordion
          w={"100%"}
          p={0}
          m={0}
          defaultValue="Bible"
          styles={{
            item: {border: "1px solid transparent"},
            content: {padding: "0", margin: "0"},
            control: {padding: "0", margin: "0"}
          }}
        >
          <Accordion.Item value={"Bible"}>
            <Accordion.Control
              icon={
                <Lottie
                  play
                  loop
                  animationData={bible}
                  style={{width: "50px", padding: "0", margin: "0"}}
                />
              }
            >
              <Title size={"25px"}>دراسة الكتاب</Title>
            </Accordion.Control>
            <Accordion.Panel>
              <Card shadow="md" radius="md" w="100%" style={{gap: "5px"}}>
                <Group justify="space-between">
                  <FaArrowRight
                    style={{
                      visibility:
                        currentQuestionIndex == 0 ? "hidden" : "visible"
                    }}
                    onClick={() =>
                      setCurrentQuestionIndex(currentQuestionIndex - 1)
                    }
                  />
                  <Group gap={0}>
                    <Text ta={"center"} c={"gray"} size={"sm"}>{`${
                      bibleMCQs[currentQuestionIndex]?.bookService[0]?.book[0]
                        ?.name?.ar
                    } الاصحاح ${t(
                      bibleMCQs[currentQuestionIndex]?.chapter
                    )} من ${t(
                      bibleMCQs[currentQuestionIndex]?.fromVerse
                    )} الي ${t(
                      bibleMCQs[currentQuestionIndex]?.toVerse
                    )}`}</Text>
                  </Group>
                  <FaArrowLeft
                    style={{
                      visibility:
                        currentQuestionIndex < bibleMCQs?.length - 1
                          ? "visible"
                          : "hidden"
                    }}
                    onClick={() =>
                      setCurrentQuestionIndex(currentQuestionIndex + 1)
                    }
                  />
                </Group>
                <Divider />
                <Radio.Group
                  disabled={true}
                  label={
                    <Text size={"md"} fw={"bold"} c={"orange.4"}>
                      {bibleMCQs[currentQuestionIndex]?.question?.ar}{" "}
                      <Anchor>{`(${t(
                        bibleMCQs[currentQuestionIndex]?.points
                      )} نقطة)`}</Anchor>
                    </Text>
                  }
                  value={
                    bibleMCQs[currentQuestionIndex]?.answer
                      ? bibleMCQs[currentQuestionIndex]?.answer[0]?.MCQChoiceId
                      : selectedAnswer
                  }
                  onChange={(value) => {
                    // Find the selected choice to extract its label
                    const selectedChoice = bibleMCQs[
                      currentQuestionIndex
                    ]?.choices?.find((choice) => choice._id === value)
                    const selectedLabel = selectedChoice?.choice?.ar

                    // Pass both value and label
                    handleAnswerSelection({value, label: selectedLabel})
                  }}
                >
                  <Group mt="sm" justify="space-between">
                    {bibleMCQs[currentQuestionIndex]?.choices?.map(
                      (choice, index) => (
                        <Radio
                          c={
                            bibleMCQs[currentQuestionIndex]?.answer &&
                            bibleMCQs[currentQuestionIndex]?.answer[0]
                              ?.MCQChoiceId === choice._id
                              ? bibleMCQs[currentQuestionIndex]?.answer[0]
                                  ?.MCQChoiceId ===
                                bibleMCQs[currentQuestionIndex]?.answer[0]
                                  ?.MCQTrueChoiceId
                                ? "green"
                                : "red"
                              : bibleMCQs[currentQuestionIndex]?.answer &&
                                bibleMCQs[currentQuestionIndex]?.answer[0]
                                  ?.MCQTrueChoiceId === choice._id
                              ? "green"
                              : ""
                          }
                          // disabled={bibleMCQs[currentQuestionIndex]?.answer}
                          key={index}
                          value={choice._id}
                          label={choice.choice.ar}
                          w="40%"
                        />
                      )
                    )}
                  </Group>
                </Radio.Group>
              </Card>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
        {/* <Group justify="space-between" w={"100%"} mah={"100px"} m={0} p={0}>
        <Title size={"25px"}>دراسة الكتاب </Title>
        <Lottie
          play
          loop
          animationData={bible}
          style={{width: "60px", padding: "0", margin: "0"}}
        />
      </Group>
      <Card shadow="md" radius="md" w="100%" style={{gap: "5px"}}>
        <Group justify="space-between">
          <FaArrowRight
            style={{
              visibility: currentQuestionIndex == 0 ? "hidden" : "visible"
            }}
            onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
          />
          <Group gap={0}>
            <Text
              ta={"center"}
              c={"gray"}
              size={"sm"}
            >{`${"متي الاصحاح 1 من 5 الي 36"}`}</Text>
          </Group>
          <FaArrowLeft
            style={{
              visibility:
                currentQuestionIndex < bibleMCQs.length - 1
                  ? "visible"
                  : "hidden"
            }}
            onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
          />
        </Group>
        <Divider />
        <Radio.Group
          label={
            <Text size={"md"} fw={"bold"} c={"orange.4"}>
              {bibleMCQs[currentQuestionIndex].question}{" "}
              <Anchor>{`(1pts)`}</Anchor>
            </Text>
          }
          value={selectedAnswer}
          onChange={handleAnswerSelection}
        >
          <Group mt="sm" justify="space-between">
            {bibleMCQs[currentQuestionIndex].choices.map((choice, index) => (
              <Radio key={index} value={choice} label={choice} w="40%" />
            ))}
          </Group>
        </Radio.Group>
      </Card> */}

        <Modal
          dir="rtl"
          opened={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="تأكيد"
          centered
        >
          <Text>{`هل أنت متأكد من أجابتك ${selectedLabel}؟`}</Text>
          <Group position="right">
            <Button variant="default" onClick={() => setIsModalOpen(false)}>
              لا
            </Button>
            <Button onClick={confirmAnswer}>نعم</Button>
          </Group>
        </Modal>
      </Stack>
    )
  )
}

export default BibleMCQ
