import React, {useState, useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {useTranslation} from "react-i18next"
import {SET_USERS_FILTERS} from "../constants/usersFiltersConstants"
import {
  Box,
  Button,
  Divider,
  Group,
  Drawer,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  ActionIcon,
  Tooltip,
  Paper,
  ThemeIcon,
  Badge
} from "@mantine/core"
import {useMediaQuery} from "@mantine/hooks"
import {
  FaFilter,
  FaMale,
  FaFemale,
  FaBirthdayCake,
  FaCalendarAlt,
  FaUserCheck,
  FaCheckCircle,
  FaGraduationCap
} from "react-icons/fa"

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
        status: "IN_CHURCH",
        study: "",
        skill: ""
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

  const updateStudy = (value) => {
    let newFilters = filters
    newFilters["study"] = value
    dispatch({
      type: SET_USERS_FILTERS,
      payload: newFilters
    })
  }

  const updateSkill = (value) => {
    let newFilters = filters
    newFilters["skill"] = value
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
        status: "IN_CHURCH",
        study: "",
        skill: ""
      }
    })
  }

  const setFilter = () => {
    searchHandler(classId)
    setShow(false)
  }

  return (
    <>
      <Tooltip label={t("Filters")} position="bottom" withArrow>
        <ActionIcon
          variant="light"
          color="blue"
          size="lg"
          radius="md"
          onClick={() => setShow(true)}
        >
          <FaFilter size={18} />
        </ActionIcon>
      </Tooltip>

      <Drawer
        opened={show}
        onClose={() => setShow(false)}
        position="right"
        size="lg"
        title={
          <Group gap="xs">
            <ThemeIcon size="lg" radius="md" variant="light" color="blue">
              <FaFilter size={18} />
            </ThemeIcon>
            <Text size="lg" fw={600}>{t("Filter_Options")}</Text>
          </Group>
        }
        padding="md"
      >
        <Stack gap="lg" style={{direction: t("Dir")}}>
          {/* Gender Filter Section */}
          <Paper p="md" radius="md" withBorder>
            <Stack gap="sm">
              <Group gap="xs">
                <ThemeIcon size="sm" radius="md" variant="light" color="blue">
                  <FaMale size={12} />
                </ThemeIcon>
                <Text size="sm" fw={600} c="dimmed">{t("Gender")}</Text>
              </Group>
              <Group grow>
                <Button
                  variant={filters?.male ? "filled" : "light"}
                  color={filters?.male ? "blue" : "gray"}
                  onClick={() => changeMaleStatus()}
                  leftSection={<FaMale size={14} />}
                  styles={(theme) => ({
                    root: {
                      transition: 'all 0.2s ease'
                    }
                  })}
                >
                  {t("Male")}
                </Button>
                <Button
                  variant={filters?.female ? "filled" : "light"}
                  color={filters?.female ? "pink" : "gray"}
                  onClick={() => changeFemaleStatus()}
                  leftSection={<FaFemale size={14} />}
                  styles={(theme) => ({
                    root: {
                      transition: 'all 0.2s ease'
                    }
                  })}
                >
                  {t("Female")}
                </Button>
              </Group>
            </Stack>
          </Paper>

          {/* Birthday Month Filter Section */}
          <Paper p="md" radius="md" withBorder>
            <Stack gap="sm">
              <Group gap="xs">
                <ThemeIcon size="sm" radius="md" variant="light" color="pink">
                  <FaBirthdayCake size={12} />
                </ThemeIcon>
                <Text size="sm" fw={600} c="dimmed">{t("His_Birthday_In")}</Text>
                {filters?.birthdayMonthes?.some(m => m) && (
                  <Badge size="sm" color="pink" variant="light">
                    {filters.birthdayMonthes.filter(m => m).length}
                  </Badge>
                )}
              </Group>
              <SimpleGrid cols={{base: 3, xs: 4, sm: 6}} spacing="xs">
                {filters?.birthdayMonthes?.map((month, index) => (
                  <Button
                    key={index}
                    size="xs"
                    variant={month ? "filled" : "light"}
                    color={month ? "pink" : "gray"}
                    onClick={() => updateBirthdayMonth(index)}
                    styles={(theme) => ({
                      root: {
                        transition: 'all 0.2s ease'
                      }
                    })}
                  >
                    {t(index + 1)}
                  </Button>
                ))}
              </SimpleGrid>
            </Stack>
          </Paper>

          {/* Last Attendance Filter Section */}
          <Paper p="md" radius="md" withBorder>
            <Stack gap="sm">
              <Group gap="xs">
                <ThemeIcon size="sm" radius="md" variant="light" color="green">
                  <FaCalendarAlt size={12} />
                </ThemeIcon>
                <Text size="sm" fw={600} c="dimmed">{t(`Last_Attendance_From_X_Weeks`)}</Text>
                {filters?.lastAttendance && (
                  <Badge size="sm" color="green" variant="light">
                    {filters.lastAttendance} {t("weeks")}
                  </Badge>
                )}
              </Group>
              <SimpleGrid cols={{base: 3, xs: 3, sm: 6}} spacing="xs">
                {Array(6)
                  .fill(0)
                  .map((val, index) => (
                    <Button
                      key={index}
                      size="xs"
                      variant={
                        filters?.lastAttendance == index + 1
                          ? "filled"
                          : "light"
                      }
                      color={
                        filters?.lastAttendance == index + 1
                          ? "green"
                          : "gray"
                      }
                      onClick={() => updateLastAttendance(index)}
                      styles={(theme) => ({
                        root: {
                          transition: 'all 0.2s ease'
                        }
                      })}
                    >
                      {t(index + 1)}
                    </Button>
                  ))}
              </SimpleGrid>
            </Stack>
          </Paper>

          {/* Last Follow-up Filter Section */}
          <Paper p="md" radius="md" withBorder>
            <Stack gap="sm">
              <Group gap="xs">
                <ThemeIcon size="sm" radius="md" variant="light" color="orange">
                  <FaUserCheck size={12} />
                </ThemeIcon>
                <Text size="sm" fw={600} c="dimmed">{t(`Last_Followup_From_X_Monthes`)}</Text>
                {filters?.lastFollowup && (
                  <Badge size="sm" color="orange" variant="light">
                    {filters.lastFollowup} {t("months")}
                  </Badge>
                )}
              </Group>
              <SimpleGrid cols={{base: 3, xs: 3, sm: 6}} spacing="xs">
                {Array(6)
                  .fill(0)
                  .map((val, index) => (
                    <Button
                      key={index}
                      size="xs"
                      variant={
                        filters?.lastFollowup == index + 1
                          ? "filled"
                          : "light"
                      }
                      color={
                        filters?.lastFollowup == index + 1
                          ? "orange"
                          : "gray"
                      }
                      onClick={() => updateLastFollowUp(index)}
                      styles={(theme) => ({
                        root: {
                          transition: 'all 0.2s ease'
                        }
                      })}
                    >
                      {t(index + 1)}
                    </Button>
                  ))}
              </SimpleGrid>
            </Stack>
          </Paper>

          {/* Availability Status Filter Section */}
          <Paper p="md" radius="md" withBorder>
            <Stack gap="sm">
              <Group gap="xs">
                <ThemeIcon size="sm" radius="md" variant="light" color="teal">
                  <FaCheckCircle size={12} />
                </ThemeIcon>
                <Text size="sm" fw={600} c="dimmed">{t("Avalability")}</Text>
                {filters?.status && (
                  <Badge size="sm" color="teal" variant="light">
                    {t(filters.status)}
                  </Badge>
                )}
              </Group>
              <SimpleGrid cols={{base: 1, xs: 2, sm: 3}} spacing="xs">
                {[
                  "IN_CHURCH",
                  "OTHER_CHURCH",
                  "TRAVEL",
                  "IMMIGRANT",
                  "WRONG_DATA"
                ].map((val, index) => (
                  <Button
                    key={index}
                    size="xs"
                    variant={filters?.status == val ? "filled" : "light"}
                    color={filters?.status == val ? "teal" : "gray"}
                    onClick={() => updateStatus(val)}
                    styles={(theme) => ({
                      root: {
                        transition: 'all 0.2s ease'
                      }
                    })}
                  >
                    {t(val)}
                  </Button>
                ))}
              </SimpleGrid>
            </Stack>
          </Paper>

          {/* Education & Skills Filter Section */}
          <Paper p="md" radius="md" withBorder>
            <Stack gap="sm">
              <Group gap="xs">
                <ThemeIcon size="sm" radius="md" variant="light" color="violet">
                  <FaGraduationCap size={12} />
                </ThemeIcon>
                <Text size="sm" fw={600} c="dimmed">{t("Education_and_Professional_Info")}</Text>
                {(filters?.study || filters?.skill) && (
                  <Badge size="sm" color="violet" variant="light">
                    {[filters?.study, filters?.skill].filter(Boolean).length}
                  </Badge>
                )}
              </Group>
              <SimpleGrid cols={{base: 1, sm: 2}} spacing="xs">
                <TextInput
                  label={t("Study")}
                  placeholder={t("Study_placeholder")}
                  value={filters?.study || ""}
                  onChange={(e) => updateStudy(e.target.value)}
                  styles={(theme) => ({
                    input: {
                      transition: 'all 0.2s ease'
                    }
                  })}
                />
                <TextInput
                  label={t("Skills")}
                  placeholder={t("Skills_placeholder")}
                  value={filters?.skill || ""}
                  onChange={(e) => updateSkill(e.target.value)}
                  styles={(theme) => ({
                    input: {
                      transition: 'all 0.2s ease'
                    }
                  })}
                />
              </SimpleGrid>
            </Stack>
          </Paper>

          {/* Action Buttons */}
          <Paper p="md" radius="md" withBorder style={{ marginTop: 'auto' }}>
            <Group justify="space-between" gap="md">
              <Button
                onClick={() => clearFilter()}
                variant="light"
                color="gray"
                flex={1}
                size="md"
                styles={(theme) => ({
                  root: {
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-1px)'
                    }
                  }
                })}
              >
                {t("Clear_Filter")}
              </Button>
              <Button
                onClick={() => setFilter()}
                variant="gradient"
                gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
                leftSection={<FaFilter size={14} />}
                flex={1}
                size="md"
                styles={(theme) => ({
                  root: {
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-1px)'
                    }
                  }
                })}
              >
                {t("Set_Filter")}
              </Button>
            </Group>
          </Paper>
        </Stack>
      </Drawer>
    </>
  )
}

export default UsersFiltersModal
