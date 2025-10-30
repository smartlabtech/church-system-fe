import React, {useState, useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"

import {listMyServantIn} from "../actions/servantInActions"
import {useTranslation} from "react-i18next"

import {
  Button,
  Card,
  Container,
  Divider,
  Group,
  Loader,
  SimpleGrid,
  Stack,
  Tabs,
  Text,
  Title,
  Badge,
  Paper,
  UnstyledButton,
  useMantineTheme
} from "@mantine/core"
import ControlAttendanceCard from "../components/ControlAttendanceCard"
import {useNavigate} from "react-router-dom"
import {useMediaQuery} from "@mantine/hooks"
import FollowUpScreen from "./FollowUp"
import {
  FaBinoculars,
  FaBullhorn,
  FaCashRegister,
  FaFingerprint,
  FaHornbill,
  FaPlus
} from "react-icons/fa"
import ControlAddUserCard from "../components/ControlAddUserCard"
import {
  GiBinoculars,
  GiCampingTent,
  GiHornedHelm,
  GiHornInternal,
  GiTelescopicBaton
} from "react-icons/gi"
import {LiaBinocularsSolid, LiaHornbill} from "react-icons/lia"
import {BiBible, BiStore} from "react-icons/bi"
import {FaBook} from "react-icons/fa"
import Gifts from "./gifts/Gifts"
import ServiceBooksView from "../components/dashboard/ServiceBooksView"

function ServantInScreen() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [t, i18n] = useTranslation()

  const [selectedCard, setSelectedCard] = useState(15)

  const userLogin = useSelector((state) => state.userLogin)
  const {userInfo} = userLogin

  const servantInListMy = useSelector((state) => state.servantInListMy)
  const {error, loading, servantIn} = servantInListMy

  const servantInList = useSelector((state) => state.servantInList)
  const {selected} = servantInList

  const theme = useMantineTheme()
  const isSmallScreen = useMediaQuery(`(max-width: ${theme.breakpoints.xl})`)

  useEffect(() => {
    if (userInfo && userInfo?.user?.authorizedKhadem) {
      dispatch(listMyServantIn(""))
    }
  }, [dispatch])

  const services = [
    {
      title: t("Follow_Up"),
      icon: <FaBinoculars size={"1.5rem"} />,
      color: "primary",
      available: true,
      description: t("Track_member_progress")
    },
    {
      title: t("Attendance"),
      icon: <FaFingerprint size={"1.5rem"} />,
      color: "accent",
      available: true,
      description: t("Mark_attendance")
    },
    {
      title: t("Bible_Study"),
      icon: <BiBible size={"1.5rem"} />,
      color: "blue",
      available: true,
      description: t("Study_scripture_and_manage_books")
    },
    {
      title: t("Announcements"),
      icon: <FaBullhorn size={"1.5rem"} />,
      color: "orange",
      available: true,
      description: t("Church_announcements")
    },
    {
      title: t("Events"),
      icon: <GiCampingTent size={"1.5rem"} />,
      color: "green",
      available: true,
      description: t("Upcoming_events")
    },
    {
      title: t("Store"),
      icon: <BiStore size={"1.5rem"} />,
      color: "purple",
      available: true,
      description: t("Church_store")
    }
  ]
  // Improved card design
  let items = services.map((item, index) => (
    <Card
      key={index}
      padding="lg"
      radius="md"
      withBorder
      style={{
        cursor: item.available ? "pointer" : "not-allowed",
        opacity: item.available ? 1 : 0.6,
        transition: "all 0.3s ease",
        backgroundColor: selectedCard === index
          ? "var(--mantine-color-primary-1)"
          : "white",
        borderColor: selectedCard === index
          ? "var(--mantine-color-primary-6)"
          : "var(--mantine-color-gray-3)",
        borderWidth: selectedCard === index ? "2px" : "1px",
        transform: selectedCard === index ? "scale(1.02)" : "scale(1)",
        boxShadow: selectedCard === index
          ? "var(--mantine-shadow-md)"
          : "var(--mantine-shadow-xs)"
      }}
      onClick={() => item.available && setSelectedCard(index)}
    >
      <Stack align="center" gap="xs">
        <div style={{
          color: item.available
            ? `var(--mantine-color-${item.color}-6)`
            : "var(--mantine-color-gray-5)"
        }}>
          {item.icon}
        </div>
        <Text size="sm" fw={600} ta="center">
          {item.title}
        </Text>
        {!item.available && (
          <Badge size="sm" color="gray" variant="light">
            {t("Coming_Soon")}
          </Badge>
        )}
      </Stack>
    </Card>
  ))
  return (
    <Container size="xl" px="md">
      <Stack gap="lg">
        {/* Header Section */}
        <Paper shadow="sm" radius="md" p="md" withBorder>
          <Group justify="space-between">
            <div>
              <Title order={2} c="primary.6">{t("Servant_Dashboard")}</Title>
              <Text size="sm" c="dimmed" mt="xs">{t("Manage_church_services")}</Text>
            </div>
            <ControlAddUserCard service={selected?.service} />
          </Group>
        </Paper>

        {/* Service Cards Grid */}
        <SimpleGrid cols={{ base: 2, sm: 3, lg: 6 }} spacing="md">
          {items}
        </SimpleGrid>

        {/* Content Area */}
        <Paper shadow="md" radius="lg" p="xl" withBorder >
          {selectedCard === 0 && <FollowUpScreen />}

          {selectedCard === 1 && <ControlAttendanceCard userInfo={userInfo} />}

          {selectedCard === 2 && <ServiceBooksView />}

          {selectedCard === 3 && (
            <Stack align="center" justify="center" h={300}>
              <Badge size="xl" color="gray" variant="light">
                {t("Coming_Soon")}
              </Badge>
              <Title order={3} c="dimmed">{t("Announcements")}</Title>
              <Text c="dimmed" ta="center">{t("This_feature_will_be_available_soon")}</Text>
            </Stack>
          )}

          {selectedCard === 4 && (
            <Stack align="center" justify="center" h={300}>
              <Badge size="xl" color="gray" variant="light">
                {t("Coming_Soon")}
              </Badge>
              <Title order={3} c="dimmed">{t("Events")}</Title>
              <Text c="dimmed" ta="center">{t("This_feature_will_be_available_soon")}</Text>
            </Stack>
          )}

          {selectedCard === 5 && <Gifts selectedService={selected?.service} />}
        </Paper>

        {/* Service List Status */}
        {loading ? (
          <Stack align="center" p="xl">
            <Loader size="lg" />
            <Text c="dimmed">{t("Loading_services")}</Text>
          </Stack>
        ) : !servantIn?.length && (
          <Paper shadow="sm" radius="md" p="lg" withBorder ta="center">
            <Badge color="yellow" variant="light" size="lg">
              {t("Not_Added_To_Service_Yet")}
            </Badge>
            <Text c="dimmed" mt="md">{t("Contact_admin_to_be_added")}</Text>
          </Paper>
        )}
      </Stack>
    </Container>
  )
}

export default ServantInScreen
