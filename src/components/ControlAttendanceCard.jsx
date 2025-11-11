import React, {useState, useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"

import {setServedBy} from "../actions/servedByActions"
import {postAttend} from "../actions/userActions"
import {SERVED_BY_CLEAR} from "../constants/servedByConstants"
import {useTranslation} from "react-i18next"
import {Button, Group, Loader, Stack, Text, Paper, Card, ThemeIcon} from "@mantine/core"
import KeyListner from "./KeyListner"
import QrCodeReader from "./QrCodeReader"
import MobileSearch from "./MobileSearch"
import AttendanceList from "./Attendance_List"

import {FaPhone, FaBarcode, FaCamera, FaQrcode, FaList} from "react-icons/fa"

function ControlAttendanceCard({userInfo}) {
  const dispatch = useDispatch()
  const [t, i18n] = useTranslation()

  const [selectedCard, setSelectedCard] = useState(0)
  // const findToAttend = useSelector((state) => state.findToAttend)
  // const {userData, loading, error} = findToAttend

  const servantInList = useSelector((state) => state.servantInList)
  const {selected} = servantInList

  // const servedBy = useSelector((state) => state.servedBy)
  // const {
  //   userInfo: servedByData,
  //   loading: servedByLoading,
  //   error: servedByError
  // } = servedBy

  const setClassHandler = (classId, userId) => {
    dispatch(setServedBy(classId, userId))
  }

  const attendHandler = (serviceId, userId) => {
    dispatch({type: SERVED_BY_CLEAR})
    dispatch(postAttend(`?userId=${userId}&serviceId=${serviceId}`))
  }
  return (
    selected?.service && (
      <Stack w={"100%"} gap="lg">
        {/* Method Selection */}
        <Group justify="center" gap="md">
          <Card
            p="md"
            radius="md"
            withBorder
            style={{
              flex: 1,
              cursor: "pointer",
              transition: "all 0.2s ease",
              backgroundColor: selectedCard === 1 ? "var(--mantine-color-blue-0)" : "transparent",
              borderColor: selectedCard === 1 ? "var(--mantine-color-blue-6)" : "var(--mantine-color-gray-3)",
              borderWidth: selectedCard === 1 ? "2px" : "1px"
            }}
            onClick={() => setSelectedCard(1)}
            onMouseEnter={(e) => {
              if (selectedCard !== 1) {
                e.currentTarget.style.transform = "translateY(-2px)"
                e.currentTarget.style.boxShadow = "var(--mantine-shadow-md)"
              }
            }}
            onMouseLeave={(e) => {
              if (selectedCard !== 1) {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = ""
              }
            }}
          >
            <Stack align="center" gap="xs">
              <ThemeIcon
                size="xl"
                radius="md"
                variant={selectedCard === 1 ? "filled" : "light"}
                color={selectedCard === 1 ? "blue" : "gray"}
              >
                <FaQrcode size={20} />
              </ThemeIcon>
              <Text
                ta="center"
                size="xs"
                fw={selectedCard === 1 ? 600 : 500}
                c={selectedCard === 1 ? "blue" : "dimmed"}
                style={{ minHeight: "2.5rem", display: "flex", alignItems: "center" }}
              >
                {t("Camera_Scan")}
              </Text>
            </Stack>
          </Card>

          <Card
            p="md"
            radius="md"
            withBorder
            style={{
              flex: 1,
              cursor: "pointer",
              transition: "all 0.2s ease",
              backgroundColor: selectedCard === 2 ? "var(--mantine-color-blue-0)" : "transparent",
              borderColor: selectedCard === 2 ? "var(--mantine-color-blue-6)" : "var(--mantine-color-gray-3)",
              borderWidth: selectedCard === 2 ? "2px" : "1px"
            }}
            onClick={() => setSelectedCard(2)}
            onMouseEnter={(e) => {
              if (selectedCard !== 2) {
                e.currentTarget.style.transform = "translateY(-2px)"
                e.currentTarget.style.boxShadow = "var(--mantine-shadow-md)"
              }
            }}
            onMouseLeave={(e) => {
              if (selectedCard !== 2) {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = ""
              }
            }}
          >
            <Stack align="center" gap="xs">
              <ThemeIcon
                size="xl"
                radius="md"
                variant={selectedCard === 2 ? "filled" : "light"}
                color={selectedCard === 2 ? "blue" : "gray"}
              >
                <FaPhone size={20} />
              </ThemeIcon>
              <Text
                ta="center"
                size="xs"
                fw={selectedCard === 2 ? 600 : 500}
                c={selectedCard === 2 ? "blue" : "dimmed"}
                style={{ minHeight: "2.5rem", display: "flex", alignItems: "center" }}
              >
                {t("User_Mobile")}
              </Text>
            </Stack>
          </Card>

          <Card
            p="md"
            radius="md"
            withBorder
            style={{
              flex: 1,
              cursor: "pointer",
              transition: "all 0.2s ease",
              backgroundColor: selectedCard === 3 ? "var(--mantine-color-blue-0)" : "transparent",
              borderColor: selectedCard === 3 ? "var(--mantine-color-blue-6)" : "var(--mantine-color-gray-3)",
              borderWidth: selectedCard === 3 ? "2px" : "1px"
            }}
            onClick={() => setSelectedCard(3)}
            onMouseEnter={(e) => {
              if (selectedCard !== 3) {
                e.currentTarget.style.transform = "translateY(-2px)"
                e.currentTarget.style.boxShadow = "var(--mantine-shadow-md)"
              }
            }}
            onMouseLeave={(e) => {
              if (selectedCard !== 3) {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = ""
              }
            }}
          >
            <Stack align="center" gap="xs">
              <ThemeIcon
                size="xl"
                radius="md"
                variant={selectedCard === 3 ? "filled" : "light"}
                color={selectedCard === 3 ? "blue" : "gray"}
              >
                <FaBarcode size={20} />
              </ThemeIcon>
              <Text
                ta="center"
                size="xs"
                fw={selectedCard === 3 ? 600 : 500}
                c={selectedCard === 3 ? "blue" : "dimmed"}
                style={{ minHeight: "2.5rem", display: "flex", alignItems: "center" }}
              >
                {t("BC_Scanner")}
              </Text>
            </Stack>
          </Card>

          <Card
            p="md"
            radius="md"
            withBorder
            style={{
              flex: 1,
              cursor: "pointer",
              transition: "all 0.2s ease",
              backgroundColor: selectedCard === 4 ? "var(--mantine-color-blue-0)" : "transparent",
              borderColor: selectedCard === 4 ? "var(--mantine-color-blue-6)" : "var(--mantine-color-gray-3)",
              borderWidth: selectedCard === 4 ? "2px" : "1px"
            }}
            onClick={() => setSelectedCard(4)}
            onMouseEnter={(e) => {
              if (selectedCard !== 4) {
                e.currentTarget.style.transform = "translateY(-2px)"
                e.currentTarget.style.boxShadow = "var(--mantine-shadow-md)"
              }
            }}
            onMouseLeave={(e) => {
              if (selectedCard !== 4) {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = ""
              }
            }}
          >
            <Stack align="center" gap="xs">
              <ThemeIcon
                size="xl"
                radius="md"
                variant={selectedCard === 4 ? "filled" : "light"}
                color={selectedCard === 4 ? "blue" : "gray"}
              >
                <FaList size={20} />
              </ThemeIcon>
              <Text
                ta="center"
                size="xs"
                fw={selectedCard === 4 ? 600 : 500}
                c={selectedCard === 4 ? "blue" : "dimmed"}
                style={{ minHeight: "2.5rem", display: "flex", alignItems: "center" }}
              >
                {t("List")}
              </Text>
            </Stack>
          </Card>
        </Group>
        <Group w={"100%"} justify="center" p={0} m={0}>
          {selectedCard === 1 && <QrCodeReader userInfo={userInfo} />}

          {selectedCard === 2 && <MobileSearch userInfo={userInfo} />}

          {selectedCard === 3 && <KeyListner userInfo={userInfo} />}

          {selectedCard === 4 && <AttendanceList userInfo={userInfo} />}
        </Group>
        {/* {loading ? (
        <Loader />
      ) : (
        <>
          <Group className="p-0 m-0" style={{width: "100%"}}>
            {error?.message && (
              <>
                <h5 style={{color: "red"}}>{error.message}</h5>
                <i
                  className="bi bi-x-circle-fill"
                  style={{fontSize: "65px", color: "red"}}
                ></i>
              </>
            )}
            {userData?.image && (
              <Stack className="p-0 m-0" xs={12} sm={12}>
                <img
                  src={userData.image}
                  className="rounded-circle"
                  style={{width: "100px", height: "100px"}}
                  alt="Avatar"
                />
              </Stack>
            )}
            {userData?.name && (
              <Stack className="pt-3 m-0" xs={12} sm={12}>
                <h5>{userData.name}</h5>
              </Stack>
            )}
          </Group>

          {userData?.classes?.length ? (
            <>
              {servedByLoading && <Loader />}
              {servedByData?._id && (
                <Button
                  className="rounded"
                  variant="outline-success"
                  style={{margin: "2px"}}
                  onClick={() => attendHandler(service._id, userData.userId)}
                >
                  {t("Attend")}
                </Button>
              )}
              {!servedByLoading && !servedByData?._id && (
                <>
                  <h5 style={{color: "red", margin: "5px"}}>
                    {t("Not_Added_To_Service_Yet")}
                  </h5>
                  {userData.classes.map((item, index) => (
                    <Button
                      key={index}
                      className="rounded"
                      style={{margin: "2px"}}
                      variant="outline-primary"
                      onClick={() =>
                        setClassHandler(item.classData._id, userData.userId)
                      }
                    >
                      {item.classData.name}
                    </Button>
                  ))}
                </>
              )}
            </>
          ) : (
            userData?.name && (
              <i
                className="bi bi-check-circle-fill"
                style={{fontSize: "65px", color: "green"}}
              ></i>
            )
          )}
        </>
      )} */}
      </Stack>
    )
  )
}

export default ControlAttendanceCard
