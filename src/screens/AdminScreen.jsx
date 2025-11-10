import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { useTranslation } from "react-i18next"
import {
  Badge,
  Card,
  Container,
  Grid,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
  ThemeIcon
} from "@mantine/core"
import { FaUsers, FaChurch, FaChartLine, FaCog, FaBook, FaList, FaGlobe } from "react-icons/fa"

function AdminScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    if (!userInfo || userInfo?.user?.role !== "admin") {
      navigate("/")
    }
  }, [navigate, userInfo])

  const adminCards = [
    {
      title: t("Servant_Management"),
      description: t("Manage_church_servants_and_roles"),
      icon: <FaUsers size={24} />,
      color: "blue",
      path: "/admin-panel/servant-management",
      stats: t("Manage_Servants")
    },
    {
      title: t("Service_Management"),
      description: t("Manage_church_services_and_points"),
      icon: <FaChurch size={24} />,
      color: "green",
      path: "/admin-panel/service-management",
      stats: t("Manage_Services_Classes")
    },
    {
      title: t("Book_Management"),
      description: t("Manage_biblical_books"),
      icon: <FaBook size={24} />,
      color: "purple",
      path: "/admin-panel/book-management",
      stats: t("Manage_Books")
    },
    {
      title: t("Church_Management"),
      description: t("Manage_church_settings_and_timezone"),
      icon: <FaGlobe size={24} />,
      color: "teal",
      path: "/admin-panel/church-management",
      stats: t("Manage_Church_Settings")
    },
    {
      title: t("Reports_Analytics"),
      description: t("View_church_statistics_and_reports"),
      icon: <FaChartLine size={24} />,
      color: "orange",
      path: null,
      stats: t("Coming_Soon"),
      disabled: true
    },
    {
      title: t("Settings"),
      description: t("Configure_system_settings"),
      icon: <FaCog size={24} />,
      color: "gray",
      path: null,
      stats: t("Coming_Soon"),
      disabled: true
    }
  ]

  return (
    <Container size="xl" px="md">
      <Stack gap="lg">
        {/* Header */}
        <Paper shadow="sm" radius="md" p="md" withBorder>
          <div>
            <Title order={2} c="primary.6">{t("Admin_Dashboard")}</Title>
            <Text size="sm" c="dimmed" mt="xs">{t("Welcome_to_admin_control_panel")}</Text>
          </div>
        </Paper>

        {/* Quick Access Cards */}
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
          {adminCards.map((card, index) => (
            <Card
              key={index}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              style={{
                cursor: card.disabled ? "not-allowed" : "pointer",
                opacity: card.disabled ? 0.6 : 1,
                transition: "all 0.3s ease"
              }}
              onClick={() => !card.disabled && card.path && navigate(card.path)}
              onMouseEnter={(e) => {
                if (!card.disabled) {
                  e.currentTarget.style.transform = "translateY(-4px)"
                  e.currentTarget.style.boxShadow = "var(--mantine-shadow-lg)"
                }
              }}
              onMouseLeave={(e) => {
                if (!card.disabled) {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "var(--mantine-shadow-sm)"
                }
              }}
            >
              <Stack gap="md">
                <ThemeIcon
                  size="xl"
                  radius="md"
                  color={card.color}
                  variant="light"
                >
                  {card.icon}
                </ThemeIcon>
                <div>
                  <Text size="lg" fw={600}>{card.title}</Text>
                  <Text size="sm" c="dimmed" mt="xs">
                    {card.description}
                  </Text>
                </div>
                <Badge
                  size="lg"
                  variant={card.disabled ? "light" : "filled"}
                  color={card.disabled ? "gray" : card.color}
                >
                  {card.stats}
                </Badge>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>

        {/* Statistics Overview */}
        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Paper shadow="sm" radius="md" p="md" withBorder>
              <Group justify="space-between">
                <div>
                  <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                    {t("Total_Servants")}
                  </Text>
                  <Text fw={700} size="xl">--</Text>
                </div>
                <ThemeIcon color="blue" variant="light" size="xl" radius="md">
                  <FaUsers size={20} />
                </ThemeIcon>
              </Group>
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Paper shadow="sm" radius="md" p="md" withBorder>
              <Group justify="space-between">
                <div>
                  <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                    {t("Active_Services")}
                  </Text>
                  <Text fw={700} size="xl">--</Text>
                </div>
                <ThemeIcon color="green" variant="light" size="xl" radius="md">
                  <FaChurch size={20} />
                </ThemeIcon>
              </Group>
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Paper shadow="sm" radius="md" p="md" withBorder>
              <Group justify="space-between">
                <div>
                  <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                    {t("Total_Members")}
                  </Text>
                  <Text fw={700} size="xl">--</Text>
                </div>
                <ThemeIcon color="orange" variant="light" size="xl" radius="md">
                  <FaChartLine size={20} />
                </ThemeIcon>
              </Group>
            </Paper>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  )
}

export default AdminScreen