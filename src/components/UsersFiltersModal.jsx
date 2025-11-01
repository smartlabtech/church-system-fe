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
import {useMediaQuery} from "@mantine/hooks"
import {FaFilter} from "react-icons/fa"

function UsersFiltersModal({searchHandler, classId}) {
  const dispatch = useDispatch()
  const [t, i18n] = useTranslation()
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isSmallScreen = useMediaQuery('(max-width: 480px)')

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
      <Modal
        opened={show}
        onClose={() => setShow(false)}
        size="lg"
        fullScreen={isMobile}
        title={t("Filter_Options")}
        centered
      >
        <Modal.Body style={{direction: t("Dir"), padding: "1rem"}}>
          <Stack gap="md">
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
              <Text fw={500}>{t("His_Birthday_In")}</Text>
              <SimpleGrid cols={{base: 3, xs: 4, sm: 6, md: 12}} spacing="xs" w="100%">
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
              <Text fw={500}>{t(`Last_Attendance_From_X_Weeks`)}</Text>
              <SimpleGrid cols={{base: 3, xs: 3, sm: 6}} spacing="xs" w="100%">
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
              <Text fw={500}>{t(`Last_Followup_From_X_Monthes`)}</Text>
              <SimpleGrid cols={{base: 3, xs: 3, sm: 6}} spacing="xs" w="100%">
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
              <Text fw={500}>{t("Avalability")}</Text>
              <SimpleGrid cols={{base: 1, xs: 2, sm: 3, md: 5}} spacing="xs" w="100%">
                {[
                  "IN_CHURCH",
                  "OTHER_CHURCH",
                  "TRAVEL",
                  "IMMIGRANT",
                  "WRONG_DATA"
                ].map((val, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant={filters?.status == val ? "gradient" : "outline"}
                    onClick={() => updateStatus(val)}
                    styles={{
                      root: {
                        fontSize: '0.75rem',
                        padding: '0.5rem'
                      }
                    }}
                  >
                    {t(val)}
                  </Button>
                ))}
              </SimpleGrid>
            </Stack>
            <Divider />

            <Group justify="center" gap="md" mt="md">
              <Button
                onClick={() => setFilter()}
                variant="filled"
                fullWidth={isSmallScreen}
                flex={isSmallScreen ? undefined : 1}
              >
                {t("Set_Filter")}
              </Button>
              <Button
                onClick={() => clearFilter()}
                variant="light"
                fullWidth={isSmallScreen}
                flex={isSmallScreen ? undefined : 1}
              >
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
