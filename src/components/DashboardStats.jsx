import React, {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {useTranslation} from "react-i18next"
import {useNavigate} from "react-router-dom"
import {
  Card,
  Group,
  Text,
  ThemeIcon,
  Stack,
  SimpleGrid,
  Loader,
  Badge,
  Paper,
  Title
} from "@mantine/core"
import {
  FaBirthdayCake,
  FaUserCheck,
  FaCalendarCheck
} from "react-icons/fa"
import {getDashboardStats} from "../actions/dashboardStatsActions"
import {SET_USERS_FILTERS} from "../constants/usersFiltersConstants"

function DashboardStats({serviceId}) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [t] = useTranslation()

  const dashboardStats = useSelector((state) => state.dashboardStats)
  const {loading, stats, error} = dashboardStats

  useEffect(() => {
    if (serviceId) {
      dispatch(getDashboardStats(serviceId))
    }
  }, [dispatch, serviceId])

  if (!serviceId) return null

  if (loading) {
    return (
      <Paper shadow="sm" radius="md" p="xl" withBorder>
        <Stack align="center" justify="center" style={{minHeight: 150}}>
          <Loader size="lg" />
          <Text size="sm" c="dimmed">
            {t("Loading_stats")}
          </Text>
        </Stack>
      </Paper>
    )
  }

  if (error) {
    return (
      <Paper shadow="sm" radius="md" p="md" withBorder>
        <Text c="red" size="sm">
          {error}
        </Text>
      </Paper>
    )
  }

  if (!stats) return null

  // Handle card click to navigate with filters
  const handleCardClick = (filterType) => {
    let filters = {
      birthdayMonthes: Array(12).fill(false),
      male: false,
      female: false,
      status: "IN_CHURCH",
      study: "",
      skill: ""
    }

    // Apply specific filters based on card type
    if (filterType === "birthdays") {
      // Set current month for birthday filter
      filters.birthdayMonthes[stats.currentMonth - 1] = true
    } else if (filterType === "attendance") {
      // Last 2 weeks attendance filter
      filters.lastAttendance = 2
    } else if (filterType === "followUp") {
      // Last 3 months follow-up filter
      filters.lastFollowup = 3
    }

    // Set filters in Redux
    dispatch({
      type: SET_USERS_FILTERS,
      payload: filters
    })

    // Navigate to follow-up page
    navigate("/dashboard/follow-up")
  }

  const statCards = [
    {
      title: t("This_Month_Birthdays"),
      value: stats.birthdays || 0,
      icon: <FaBirthdayCake size={24} />,
      color: "pink",
      description: t("Birthday_this_month_desc"),
      filterType: "birthdays"
    },
    {
      title: t("Need_Attendance_Follow_Up"),
      value: stats.attendance || 0,
      icon: <FaCalendarCheck size={24} />,
      color: "orange",
      description: t("Not_attended_2_weeks_desc"),
      filterType: "attendance"
    },
    {
      title: t("Need_Personal_Follow_Up"),
      value: stats.followUp || 0,
      icon: <FaUserCheck size={24} />,
      color: "red",
      description: t("Not_followed_up_3_months_desc"),
      filterType: "followUp"
    }
  ]

  return (
    <Paper shadow="sm" radius="md" p="md" withBorder>
      <Group justify="space-between" mb="md">
        <Title order={4} c="dimmed">
          {t("Quick_Stats")}
        </Title>
        <Badge color="blue" variant="light" size="sm">
          {t("Auto_Updated")}
        </Badge>
      </Group>

      <SimpleGrid cols={{base: 1, sm: 3}} spacing="md">
        {statCards.map((stat, index) => (
          <Card
            key={index}
            padding="lg"
            radius="md"
            withBorder
            onClick={() => handleCardClick(stat.filterType)}
            style={{
              borderWidth: "2px",
              borderColor: `var(--mantine-color-${stat.color}-3)`,
              backgroundColor: `var(--mantine-color-${stat.color}-0)`,
              transition: "all 0.3s ease",
              cursor: "pointer"
            }}
            styles={{
              root: {
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "var(--mantine-shadow-md)",
                  borderColor: `var(--mantine-color-${stat.color}-6)`
                }
              }
            }}
          >
            <Stack gap="sm">
              <Group justify="space-between">
                <ThemeIcon
                  size="xl"
                  radius="md"
                  variant="light"
                  color={stat.color}
                >
                  {stat.icon}
                </ThemeIcon>
                <div style={{textAlign: "right"}}>
                  <Text
                    size="2rem"
                    fw={700}
                    c={stat.color}
                    style={{lineHeight: 1}}
                  >
                    {stat.value}
                  </Text>
                  <Text size="xs" c="dimmed" fw={500}>
                    {stat.value === 1 ? t("person") : t("people")}
                  </Text>
                </div>
              </Group>

              <div>
                <Text size="sm" fw={600} c="dark">
                  {stat.title}
                </Text>
                <Text size="xs" c="dimmed" mt={4}>
                  {stat.description}
                </Text>
              </div>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>
    </Paper>
  )
}

export default DashboardStats
