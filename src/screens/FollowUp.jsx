import React, {useState, useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {useTranslation} from "react-i18next"
import {serviceBooksList} from "../actions/serviceBooksActions"
import {MCQ_GET_SUCCESS} from "../constants/MCQConstants"
import {UsersList} from "../components/UsersList"
import {getUsers, sendAttendanceReport} from "../actions/userActions"
import {USER_LIST_SUCCESS} from "../constants/userConstants"
import {GiBreakingChain, GiSparkPlug, GiSparkSpirit} from "react-icons/gi"
import {
  Button,
  Group,
  Stack,
  Text,
  Select,
  Container,
  Modal,
  Loader,
  Title,
  Notification,
  Divider,
  Menu,
  ActionIcon,
  Paper
} from "@mantine/core"
import UsersFiltersModal from "../components/UsersFiltersModal"
import ControlAddUserCard from "../components/ControlAddUserCard"
import {useLocation, useNavigate} from "react-router-dom"
import {FaAsterisk, FaStar, FaBinoculars} from "react-icons/fa"
import {FaWandMagicSparkles} from "react-icons/fa6"
import {
  BiDotsVertical,
  BiSearch,
  BiSolidFileArchive,
  BiSolidReport
} from "react-icons/bi"

function FollowUpScreen() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const [t] = useTranslation()

  const [selectedService, setSelectedService] = useState("")
  const [classId, setClassId] = useState("")
  const [errorModalOpened, setErrorModalOpened] = useState(false)
  const [successModalOpened, setSuccessModalOpened] = useState(false)

  const userLogin = useSelector((state) => state.userLogin)
  const {userInfo} = userLogin

  const usersFilters = useSelector((state) => state.usersFilters)
  const {filters, loading} = usersFilters

  const serviceData = localStorage.getItem("servantIn")

  useEffect(() => {
    if (!(serviceData || userInfo?.user?.servantIn?.length)) {
      navigate("/")
    } else {
      dispatch({type: USER_LIST_SUCCESS, payload: []})
      const parsedServiceData = JSON.parse(serviceData)
      if (parsedServiceData) {
        setSelectedService(parsedServiceData)
        // setClassId(parsedServiceData?.classes[0]?._id || "")

        // Automatically fetch users when page loads with default filter
        const filter = {
          serviceId: parsedServiceData._id,
          requestType: "RESPONSE",
          status: "IN_CHURCH",
          ...buildFilters(filters)
        }
        dispatch(getUsers(filter))
      }
    }
  }, [dispatch, serviceData, userInfo, navigate, location])

  const searchHandler = (id) => {
    setClassId(id)
    if (id) {
      const filter = {
        serviceId: selectedService._id,
        classId: id,
        requestType: "RESPONSE",
        status: "IN_CHURCH",
        ...buildFilters(filters)
      }
      dispatch(getUsers(filter))
    }
  }

  const assignedHandler = () => {
    if (classId) {
      const filter = {
        serviceId: selectedService._id,
        classId,
        requestType: "RESPONSE",
        status: "IN_CHURCH",
        assignedToId: userInfo.user._id,
        ...buildFilters(filters)
      }
      dispatch(getUsers(filter))
    }
  }

  const reportHandler = () => {
    console.log("test report")
    if (classId) {
      const filter = {
        serviceId: selectedService._id,
        classId,
        requestType: "REPORT",
        status: "IN_CHURCH",
        ...buildFilters(filters)
      }
      dispatch(getUsers(filter))
    }
  }

  const attendanceReportHandler = () => {
    if (classId) {
      const filter = {
        serviceId: selectedService._id,
        classId,
        requestType: "REPORT",
        status: "IN_CHURCH",
        ...buildFilters(filters)
      }
      dispatch(sendAttendanceReport(filter))
    }
  }

  const buildFilters = (filters) => {
    // Return empty object if filters is undefined or null
    if (!filters) return {}

    const gender = []
    const birthdayIn = []

    if (filters?.male) gender.push("MALE")
    if (filters?.female) gender.push("FEMALE")

    filters?.birthdayMonthes?.forEach((month, index) => {
      if (month) birthdayIn.push(index + 1)
    })

    return {
      ...(gender.length && {gender}),
      ...(filters.lastAttendance && {lastAttendance: filters.lastAttendance}),
      ...(filters.lastFollowup && {lastFollowUp: filters.lastFollowup}),
      ...(filters.status && {status: filters.status}),
      ...(birthdayIn.length && {birthdayIn}),
      ...(filters.study && {study: filters.study}),
      ...(filters.skill && {skill: filters.skill})
    }
  }

  return loading ? (
    <Loader />
  ) : (
    <Container size="xl" px="md">
      <Stack gap="lg">
        {/* Header */}
        <Paper shadow="sm" radius="md" p="md" withBorder>
          <Group justify="space-between">
            <div>
              <Title order={2} c="primary.6">
                <Group gap="xs">
                  <FaBinoculars size={24} />
                  {t("Follow_Up")}
                </Group>
              </Title>
              <Text size="sm" c="dimmed" mt="xs">
                {t("Track_and_manage_member_follow_up")}
              </Text>
            </div>
            <ControlAddUserCard service={selectedService} />
          </Group>
        </Paper>

        {/* Filters and Controls */}
        <Paper shadow="sm" radius="md" p="md" withBorder>
          <Group justify="space-between" gap="sm" wrap="wrap">
            {selectedService?.classes?.length > 0 && (
              <Select
                style={{ flex: 1, minWidth: 200 }}
                data={selectedService.classes.map((classData) => ({
                  label: classData.name,
                  value: classData._id
                }))}
                value={classId}
                onChange={searchHandler}
                placeholder={t("Select_Class")}
              />
            )}

            <Group gap="xs">
              <UsersFiltersModal
                searchHandler={searchHandler}
                classId={classId}
              />

              <ActionIcon
                variant="light"
                color="orange"
                size="lg"
                radius="md"
                onClick={assignedHandler}
                disabled={!classId}
                title={t("Assigned_To_Me")}
              >
                <FaWandMagicSparkles size={18} />
              </ActionIcon>

              <Menu
                transitionProps={{transition: "pop"}}
                withArrow
                position="bottom-end"
                withinPortal
              >
                <Menu.Target>
                  <ActionIcon variant="subtle" color="gray" size="lg">
                    <BiDotsVertical size={20} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    dir={t("Dir")}
                    onClick={reportHandler}
                    disabled={!classId}
                    leftSection={<BiSolidReport size={16} />}
                  >
                    {t("Send_To_Email")}
                  </Menu.Item>

                  <Menu.Item
                    dir={t("Dir")}
                    onClick={attendanceReportHandler}
                    disabled={!classId}
                    leftSection={<BiSolidReport size={16} />}
                  >
                    {t("Attendance_Report")}
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Group>
        </Paper>

        {/* User List */}
        <UsersList classId={classId} selectedService={selectedService} />
      </Stack>
    </Container>
  )
}

export default FollowUpScreen
