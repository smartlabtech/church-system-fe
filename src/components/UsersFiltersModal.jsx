import React, {useState, useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {useTranslation} from "react-i18next"
import {SET_USERS_FILTERS} from "../constants/usersFiltersConstants"
import {
  Box,
  Button,
  Divider,
  Group,
  Modal,
  SimpleGrid,
  Stack,
  Text
} from "@mantine/core"
import {FaFilter} from "react-icons/fa"

function UsersFiltersModal({searchHandler, classId}) {
  const dispatch = useDispatch()
  const [t, i18n] = useTranslation()

  const [show, setShow] = useState(false)

  const usersFilters = useSelector((state) => state.usersFilters)
  const {filters} = usersFilters

  useEffect(() => {
    dispatch({
      type: SET_USERS_FILTERS,
      payload: {
        birthdayMonthes: Array(12).fill(false),
        male: false,
        female: false,
        status: "IN_CHURCH"
      }
    })
  }, [dispatch])

  const changeMaleStatus = () => {
    let newFilters = filters
    newFilters["male"] = !newFilters["male"]
    dispatch({
      type: SET_USERS_FILTERS,
      payload: newFilters
    })
  }

  const changeFemaleStatus = () => {
    let newFilters = filters
    newFilters["female"] = !newFilters["female"]
    dispatch({
      type: SET_USERS_FILTERS,
      payload: newFilters
    })
  }

  const updateBirthdayMonth = (index) => {
    let newFilters = filters
    newFilters.birthdayMonthes[index] = !newFilters.birthdayMonthes[index]
    dispatch({
      type: SET_USERS_FILTERS,
      payload: newFilters
    })
  }

  const updateLastAttendance = (index) => {
    let newFilters = filters
    newFilters["lastAttendance"] = index + 1
    dispatch({
      type: SET_USERS_FILTERS,
      payload: newFilters
    })
  }

  const updateLastFollowUp = (index) => {
    let newFilters = filters
    newFilters["lastFollowup"] = index + 1
    dispatch({
      type: SET_USERS_FILTERS,
      payload: newFilters
    })
  }

  const updateStatus = (status) => {
    let newFilters = filters
    newFilters["status"] = status
    dispatch({
      type: SET_USERS_FILTERS,
      payload: newFilters
    })
  }

  const clearFilter = () => {
    dispatch({
      type: SET_USERS_FILTERS,
      payload: {
        birthdayMonthes: Array(12).fill(false),
        male: false,
        female: false,
        status: "IN_CHURCH"
      }
    })
  }

  const setFilter = () => {
    searchHandler(classId)
    setShow(false)
  }

  return (
    <>
      <FaFilter onClick={() => setShow(true)} />
      <Modal opened={show} onClose={() => setShow(false)}>
        <Modal.Body style={{direction: t("Dir")}}>
          <Stack>
            <Group justify="center">
              <Button
                variant={filters?.male ? "gradient" : "outline"}
                onClick={() => changeMaleStatus()}
              >
                {t("Male")}
              </Button>
              <Button
                variant={filters?.female ? "gradient" : "outline"}
                onClick={() => changeFemaleStatus()}
              >
                {t("Female")}
              </Button>
            </Group>
            <Divider />

            <Stack align="center">
              <Text>{t("His_Birthday_In")}</Text>
              <SimpleGrid cols={{base: 6, xs: 12, xl: 12}}>
                {filters?.birthdayMonthes?.map((month, index) => (
                  <Button
                    m={0}
                    p={6}
                    size="xs"
                    key={index}
                    variant={month ? "gradient" : "outline"}
                    onClick={() => updateBirthdayMonth(index)}
                  >
                    {t(index + 1)}
                  </Button>
                ))}
              </SimpleGrid>
            </Stack>
            <Divider />

            <Stack align="center">
              <Text>{t(`Last_Attendance_From_X_Weeks`)}</Text>
              <SimpleGrid cols={{base: 6, xs: 12, xl: 12}}>
                {Array(6)
                  .fill(0)
                  .map((val, index) => (
                    <Button
                      m={0}
                      p={6}
                      key={index}
                      variant={
                        filters?.lastAttendance == index + 1
                          ? "gradient"
                          : "outline"
                      }
                      onClick={() => updateLastAttendance(index)}
                    >
                      {t(index + 1)}
                    </Button>
                  ))}
              </SimpleGrid>
            </Stack>
            <Divider />

            <Stack align="center">
              <Text>{t(`Last_Followup_From_X_Monthes`)}</Text>
              <SimpleGrid cols={{base: 6, xs: 12, xl: 12}}>
                {Array(6)
                  .fill(0)
                  .map((val, index) => (
                    <Button
                      m={0}
                      p={6}
                      key={index}
                      variant={
                        filters?.lastFollowup == index + 1
                          ? "gradient"
                          : "outline"
                      }
                      onClick={() => updateLastFollowUp(index)}
                    >
                      {t(index + 1)}
                    </Button>
                  ))}
              </SimpleGrid>
            </Stack>
            <Divider />

            <Stack align="center">
              <Text>{t("Avalability")}</Text>
              <SimpleGrid cols={{base: 2, xs: 12, xl: 12}} style={{gap: "6px"}}>
                {[
                  "IN_CHURCH",
                  "OTHER_CHURCH",
                  "TRAVEL",
                  "IMMIGRANT",
                  "WRONG_DATA"
                ].map((val, index) => (
                  <Button
                    m={0}
                    p={6}
                    key={index}
                    size="sm"
                    fz={"xs"}
                    variant={filters?.status == val ? "gradient" : "outline"}
                    onClick={() => updateStatus(val)}
                  >
                    {t(val)}
                  </Button>
                ))}
              </SimpleGrid>
            </Stack>
            <Divider />

            <Group justify="center">
              <Button onClick={() => setFilter()} variant="filled">
                {t("Set_Filter")}
              </Button>
              <Button onClick={() => clearFilter()} variant="light">
                {t("Clear_Filter")}
              </Button>
            </Group>
          </Stack>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default UsersFiltersModal
