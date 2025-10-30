import React, {useState, useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"

import {setServedBy} from "../actions/servedByActions"
import {postAttend} from "../actions/userActions"
import {SERVED_BY_CLEAR} from "../constants/servedByConstants"
import {useTranslation} from "react-i18next"
import {Button, Group, Loader, Stack, Text, Tabs, Card} from "@mantine/core"
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
      <Stack w={"100%"} style={{alignItems: "center"}}>
        <Group w={"100%"} justify="center" mt={10}>
          <Card
            p={5}
            m={0}
            flex={1}
            style={{
              alignItems: "center",
              gap: "10px",
              boxShadow: selectedCard === 1 ? "var(--mantine-shadow-md)" : "",
              transform: selectedCard === 1 ? "scale(1.05)" : ""
            }}
            onClick={() => setSelectedCard(1)}
          >
            <FaQrcode size={"1.3rem"} />
            <Text ta={"center"} size="xs">
              {t("Camera_Scan")}
            </Text>
          </Card>
          <Card
            p={5}
            m={0}
            flex={1}
            style={{
              alignItems: "center",
              gap: "10px",
              boxShadow: selectedCard === 2 ? "var(--mantine-shadow-md)" : "",
              transform: selectedCard === 2 ? "scale(1.05)" : ""
            }}
            onClick={() => setSelectedCard(2)}
          >
            <FaPhone size={"1.3rem"} />
            <Text ta={"center"} size="xs">
              {t("User_Mobile")}
            </Text>
          </Card>
          <Card
            p={5}
            m={0}
            flex={1}
            style={{
              alignItems: "center",
              gap: "10px",
              boxShadow: selectedCard === 3 ? "var(--mantine-shadow-md)" : "",
              transform: selectedCard === 3 ? "scale(1.05)" : ""
            }}
            onClick={() => setSelectedCard(3)}
          >
            <FaBarcode size={"1.3rem"} />
            <Text ta={"center"} size="xs">
              {t("BC_Scanner")}
            </Text>
          </Card>
          <Card
            p={5}
            m={0}
            flex={1}
            style={{
              alignItems: "center",
              gap: "10px",
              boxShadow: selectedCard === 4 ? "var(--mantine-shadow-md)" : "",
              transform: selectedCard === 4 ? "scale(1.05)" : ""
            }}
            onClick={() => setSelectedCard(4)}
          >
            <FaList size={"1.3rem"} />
            <Text ta={"center"} size="xs">
              {t("List")}
            </Text>
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
