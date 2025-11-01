import React, {useEffect, useState} from "react"
import {Routes, Route, useNavigate, useLocation} from "react-router-dom"
import {useDispatch, useSelector} from "react-redux"
import {
  Box,
  Group,
  Stack,
  Text,
  UnstyledButton,
  Container,
  Loader,
  Center,
  Burger,
  Drawer,
  Button,
  Divider,
  Badge
} from "@mantine/core"
import {useDisclosure} from "@mantine/hooks"
import {
  FaHome,
  FaTachometerAlt,
  FaStore,
  FaUserCog,
  FaUser,
  FaUsers,
  FaChurch,
  FaBook,
  FaFingerprint,
  FaBullhorn
} from "react-icons/fa"
import {MdDashboard} from "react-icons/md"
import {GiCampingTent} from "react-icons/gi"
import {BiStore} from "react-icons/bi"

// Import screens
import HomeScreen from "../screens/HomeScreen"
import ServantInScreen from "../screens/ServantInScreen"
import AccountScreen from "../screens/AccountScreen"
import FollowUpScreen from "../screens/FollowUp"
import AdminScreen from "../screens/AdminScreen"
import StoreScreen from "../screens/store/StoreScreen"
import ServiceManagementScreen from "../screens/ServiceManagementScreen"
import ServantManagementScreen from "../screens/ServantManagementScreen"
import BookManagementScreen from "../screens/BookManagementScreen"
import BibleStudyScreen from "../screens/BibleStudyScreen"
import AttendanceScreen from "../screens/AttendanceScreen"
import AnnouncementsScreen from "../screens/AnnouncementsScreen"
import EventsScreen from "../screens/EventsScreen"
import StoreScreenDashboard from "../screens/StoreScreenDashboard"
import NotFound from "../pages/not-found/NotFound"
import PrivacyPolicy from "../pages/privacy-policy/PrivacyPolicy "
import AuthModal from "../pages/auth/AuthModal"
import TopRightMenu from "./top-right-menu/TopRightMenu"
import QrCode from "../components/points-card/QrCode"
import AppInstallPopup from "../components/AppInstallPopup"
import ServantInListModal from "../components/ServantInListModal"
import {SET_SERVANTINMODAL} from "../constants/servantInConstants"
import {SET_SERVEDBYMODAL} from "../constants/servedByConstants"
import {listMyServantIn} from "../actions/servantInActions"
import {useTranslation} from "react-i18next"

export function SimpleLayout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const {t} = useTranslation()

  const [mobileOpened, {toggle: toggleMobile, close: closeMobile}] =
    useDisclosure(false)
  const [authOpened, {open: openAuth, close: closeAuth}] = useDisclosure(false)

  const userLogin = useSelector((state) => state.userLogin)
  const {userInfo, loading} = userLogin

  const servantInList = useSelector((state) => state.servantInList)
  const {selected} = servantInList

  const servantInListMy = useSelector((state) => state.servantInListMy)
  const {servantIn: myServantList} = servantInListMy

  const servedBy = useSelector((state) => state.servedBy)
  const {service} = servedBy

  // Fetch servant's services when they're authorized
  useEffect(() => {
    if (userInfo && userInfo?.user?.authorizedKhadem) {
      dispatch(listMyServantIn(""))
    }
  }, [dispatch, userInfo])

  // Main navigation items (shown in header)
  const mainNavItems = [
    {path: "/", label: t("Home"), icon: <FaHome size={18} />, public: true},
    {
      path: "/store",
      label: t("Store"),
      icon: <FaStore size={18} />,
      requireAuth: true
    }
  ]

  // Dashboard navigation items (shown in sidebar when in regular dashboard)
  const dashboardNavItems = [
    {
      path: "/dashboard",
      label: t("Dashboard"),
      icon: <MdDashboard size={18} />,
      requireAuth: true,
      requireServant: true
    },
    {
      path: "/dashboard/follow-up",
      label: t("Follow_Up"),
      icon: <FaUsers size={18} />,
      requireAuth: true,
      requireServant: true
    },
    {
      path: "/dashboard/attendance",
      label: t("Attendance"),
      icon: <FaFingerprint size={18} />,
      requireAuth: true,
      requireServant: true
    },
    {
      path: "/dashboard/bible-study",
      label: t("Bible_Study"),
      icon: <FaBook size={18} />,
      requireAuth: true,
      requireServant: true
    },
    {
      path: "/dashboard/announcements",
      label: t("Announcements"),
      icon: <FaBullhorn size={18} />,
      requireAuth: true,
      requireServant: true
    },
    {
      path: "/dashboard/events",
      label: t("Events"),
      icon: <GiCampingTent size={18} />,
      requireAuth: true,
      requireServant: true
    },
    {
      path: "/dashboard/store",
      label: t("Store"),
      icon: <BiStore size={18} />,
      requireAuth: true,
      requireServant: true
    }
  ]

  // Admin navigation items (shown in sidebar when in admin panel)
  const adminNavItems = [
    {
      path: "/admin-panel",
      label: t("Admin_Overview"),
      icon: <FaUserCog size={18} />,
      requireAuth: true,
      requireAdmin: true
    },
    {
      path: "/admin-panel/servant-management",
      label: t("Servant_Management"),
      icon: <FaUsers size={18} />,
      requireAuth: true,
      requireAdmin: true
    },
    {
      path: "/admin-panel/service-management",
      label: t("Service_Management"),
      icon: <FaChurch size={18} />,
      requireAuth: true,
      requireAdmin: true
    },
    {
      path: "/admin-panel/book-management",
      label: t("Book_Management"),
      icon: <FaBook size={18} />,
      requireAuth: true,
      requireAdmin: true
    }
  ]

  const visibleMainNavItems = mainNavItems.filter((item) => {
    if (item.requireAuth && !userInfo) return false
    if (item.requireAdmin && userInfo?.user?.role !== "admin") return false
    if (item.requireServant && !userInfo?.user?.authorizedKhadem) return false
    return true
  })

  const visibleDashboardItems = dashboardNavItems.filter((item) => {
    if (item.requireAuth && !userInfo) return false
    if (item.requireAdmin && userInfo?.user?.role !== "admin") return false
    if (item.requireServant && !userInfo?.user?.authorizedKhadem) return false
    return true
  })

  const visibleAdminItems = adminNavItems.filter((item) => {
    if (item.requireAuth && !userInfo) return false
    if (item.requireAdmin && userInfo?.user?.role !== "admin") return false
    return true
  })

  // Check if we're in dashboard area or admin area
  const isDashboardArea = location.pathname.startsWith("/dashboard")
  const isAdminArea = location.pathname.startsWith("/admin-panel")

  if (loading) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    )
  }

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        height: "105vh",
        overflow: "hidden"
      }}
    >
      <AuthModal opened={authOpened} open={openAuth} close={closeAuth} />

      {/* ServantInListModal for dashboard service selection */}
      {myServantList && myServantList.length > 0 && (
        <ServantInListModal myList={myServantList} />
      )}

      {/* App Install Notification - Top Bar */}
      <AppInstallPopup />

      {/* Header */}
      <Box
        component="header"
        style={{
          borderBottom: "1px solid var(--mantine-color-gray-3)",
          boxShadow: "var(--mantine-shadow-sm)",
          backgroundColor: "white",
          position: "sticky",
          top: 0,
          zIndex: 100
        }}
      >
        <Container size="xl">
          <Group h={60} justify="space-between">
            {/* Left side - Logo and Navigation */}
            <Group gap="md">
              {/* Mobile menu burger - show on small and medium screens */}
              <Burger
                opened={mobileOpened}
                onClick={toggleMobile}
                hiddenFrom="lg"
                size="sm"
              />

              {/* Logo */}
              <UnstyledButton onClick={() => navigate("/")}>
                <Group gap="xs">
                  <Box
                    style={{
                      padding: "8px",
                      borderRadius: "8px",
                      background: "var(--mantine-color-primary-1)",
                      color: "var(--mantine-color-primary-6)"
                    }}
                  >
                    <FaHome size={20} />
                  </Box>
                  <Stack gap={0} visibleFrom="sm">
                    <Text size="sm" fw={600} c="primary.6">
                      كنيسة القديس مارمرقس
                    </Text>
                    <Text size="xs" c="dimmed">
                      Saint Mark Church - Maadi
                    </Text>
                  </Stack>
                </Group>
              </UnstyledButton>

              {/* Desktop Navigation - only show on large screens */}
              <Group gap="xs" visibleFrom="lg">
                <Divider orientation="vertical" h={30} />
                {visibleMainNavItems.map((item) => (
                  <UnstyledButton
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "6px",
                      backgroundColor:
                        location.pathname === item.path
                          ? "var(--mantine-color-primary-1)"
                          : "transparent",
                      color:
                        location.pathname === item.path
                          ? "var(--mantine-color-primary-6)"
                          : "inherit",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <Group gap="xs">
                      {item.icon}
                      <Text size="sm" fw={500}>
                        {item.label}
                      </Text>
                    </Group>
                  </UnstyledButton>
                ))}

                {/* Dashboard button for authorized servants */}
                {userInfo?.user?.authorizedKhadem && (
                  <UnstyledButton
                    onClick={() => navigate("/dashboard")}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "6px",
                      backgroundColor: location.pathname.startsWith(
                        "/dashboard"
                      )
                        ? "var(--mantine-color-primary-1)"
                        : "transparent",
                      color: location.pathname.startsWith("/dashboard")
                        ? "var(--mantine-color-primary-6)"
                        : "inherit",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <Group gap="xs">
                      <MdDashboard size={18} />
                      <Text size="sm" fw={500}>
                        {t("Dashboard")}
                      </Text>
                    </Group>
                  </UnstyledButton>
                )}

                {/* Admin Dashboard button for admin users */}
                {userInfo?.user?.role === "admin" && (
                  <UnstyledButton
                    onClick={() => navigate("/admin-panel")}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "6px",
                      backgroundColor: location.pathname.startsWith(
                        "/admin-panel"
                      )
                        ? "var(--mantine-color-secondary-2)"
                        : "transparent",
                      color: location.pathname.startsWith("/admin-panel")
                        ? "var(--mantine-color-secondary-6)"
                        : "inherit",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <Group gap="xs">
                      <FaUserCog size={18} />
                      <Text size="sm" fw={500}>
                        {t("Admin_Dashboard")}
                      </Text>
                    </Group>
                  </UnstyledButton>
                )}
              </Group>

              {/* Service Selector for regular users (public pages) */}
              {!location.pathname.startsWith("/dashboard") &&
                !location.pathname.startsWith("/admin-panel") &&
                userInfo?.user?.servedBy?.length > 0 && (
                  <>
                    <Divider orientation="vertical" h={30} visibleFrom="sm" />
                    <Button
                      size="xs"
                      variant="subtle"
                      onClick={() => dispatch({type: SET_SERVEDBYMODAL})}
                    >
                      {service?.name || t("Select_Service")}
                    </Button>
                  </>
                )}

              {/* Service Selector for servants (dashboard pages) */}
              {location.pathname.startsWith("/dashboard") && (
                <>
                  <Divider orientation="vertical" h={30} visibleFrom="sm" />
                  <Button
                    size="xs"
                    variant="subtle"
                    onClick={() => dispatch({type: SET_SERVANTINMODAL})}
                  >
                    {selected?.service?.name || t("Select_Service")}
                  </Button>
                </>
              )}
            </Group>

            {/* Right side - User menu */}
            <Group gap="md">
              {userInfo?.user ? (
                <>
                  <QrCode qrCode={userInfo?.user?._id} />
                  <TopRightMenu userInfo={userInfo} />
                </>
              ) : (
                <Button onClick={openAuth} variant="filled" size="sm">
                  {t("Sign_In")}
                </Button>
              )}
            </Group>
          </Group>
        </Container>
      </Box>

      {/* Mobile Navigation Drawer */}
      <Drawer
        opened={mobileOpened}
        onClose={closeMobile}
        title={
          <Text fw={600} size="lg" c="primary.6">
            {t("Menu")}
          </Text>
        }
        size="xs"
      >
        <Stack gap="xs">
          {/* Main navigation items */}
          {visibleMainNavItems.map((item) => (
            <UnstyledButton
              key={item.path}
              onClick={() => {
                navigate(item.path)
                closeMobile()
              }}
              style={{
                padding: "10px",
                borderRadius: "6px",
                backgroundColor:
                  location.pathname === item.path
                    ? "var(--mantine-color-primary-1)"
                    : "transparent",
                transition: "all 0.2s ease"
              }}
            >
              <Group gap="sm">
                <Box
                  c={location.pathname === item.path ? "primary.6" : "inherit"}
                >
                  {item.icon}
                </Box>
                <Text
                  size="sm"
                  fw={location.pathname === item.path ? 600 : 400}
                  c={location.pathname === item.path ? "primary.6" : "inherit"}
                >
                  {item.label}
                </Text>
              </Group>
            </UnstyledButton>
          ))}

          {/* Dashboard section for authorized servants */}
          {userInfo?.user?.authorizedKhadem && (
            <>
              <Divider
                my="xs"
                label={t("Servant_Dashboard")}
                labelPosition="left"
              />
              {visibleDashboardItems.map((item) => (
                <UnstyledButton
                  key={item.path}
                  onClick={() => {
                    navigate(item.path)
                    closeMobile()
                  }}
                  style={{
                    padding: "10px",
                    borderRadius: "6px",
                    backgroundColor:
                      location.pathname === item.path
                        ? "var(--mantine-color-primary-1)"
                        : "transparent",
                    transition: "all 0.2s ease"
                  }}
                >
                  <Group gap="sm">
                    <Box
                      c={
                        location.pathname === item.path
                          ? "primary.6"
                          : "inherit"
                      }
                    >
                      {item.icon}
                    </Box>
                    <Text
                      size="sm"
                      fw={location.pathname === item.path ? 600 : 400}
                      c={
                        location.pathname === item.path
                          ? "primary.6"
                          : "inherit"
                      }
                    >
                      {item.label}
                    </Text>
                  </Group>
                </UnstyledButton>
              ))}
            </>
          )}

          {/* Admin section for admin users */}
          {userInfo?.user?.role === "admin" && (
            <>
              <Divider my="xs" label={t("Admin_Panel")} labelPosition="left" />
              {visibleAdminItems.map((item) => (
                <UnstyledButton
                  key={item.path}
                  onClick={() => {
                    navigate(item.path)
                    closeMobile()
                  }}
                  style={{
                    padding: "10px",
                    borderRadius: "6px",
                    backgroundColor:
                      location.pathname === item.path
                        ? "var(--mantine-color-secondary-2)"
                        : "transparent",
                    transition: "all 0.2s ease"
                  }}
                >
                  <Group gap="sm">
                    <Box
                      c={
                        location.pathname === item.path
                          ? "secondary.6"
                          : "inherit"
                      }
                    >
                      {item.icon}
                    </Box>
                    <Text
                      size="sm"
                      fw={location.pathname === item.path ? 600 : 400}
                      c={
                        location.pathname === item.path
                          ? "secondary.6"
                          : "inherit"
                      }
                    >
                      {item.label}
                    </Text>
                  </Group>
                </UnstyledButton>
              ))}
            </>
          )}
        </Stack>
      </Drawer>

      {/* Main Content */}
      <Box
        style={{
          flex: 1,
          backgroundColor: "var(--mantine-color-gray-0)",
          overflowY: "auto",
          overflowX: "hidden",
          position: "relative",
          minHeight: 0
        }}
      >
        {isDashboardArea || isAdminArea ? (
          <Box style={{display: "flex", width: "100%", minHeight: "100%"}}>
            {/* Sidebar - Desktop Only */}
            <Box
              visibleFrom="md"
              style={{
                width: 250,
                backgroundColor: isAdminArea ? "#fef9e7" : "white",
                borderRight: "1px solid var(--mantine-color-gray-3)",
                padding: "20px",
                position: "fixed",
                left: 0,
                top: 60,
                height: "calc(100vh - 60px)",
                overflowY: "auto",
                zIndex: 50
              }}
            >
              <Stack gap="xs">
                <Text size="sm" fw={600} c="dimmed" mb="sm">
                  {isAdminArea ? t("Admin_Navigation") : t("Navigation")}
                </Text>
                {(isAdminArea ? visibleAdminItems : visibleDashboardItems).map(
                  (item) => (
                    <UnstyledButton
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      style={{
                        padding: "10px 12px",
                        borderRadius: "6px",
                        backgroundColor:
                          location.pathname === item.path
                            ? isAdminArea
                              ? "var(--mantine-color-secondary-2)"
                              : "var(--mantine-color-primary-1)"
                            : "transparent",
                        width: "100%",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <Group gap="sm">
                        <Box
                          c={
                            location.pathname === item.path
                              ? isAdminArea
                                ? "secondary.6"
                                : "primary.6"
                              : "dimmed"
                          }
                        >
                          {item.icon}
                        </Box>
                        <Text
                          size="sm"
                          fw={location.pathname === item.path ? 600 : 400}
                          c={
                            location.pathname === item.path
                              ? isAdminArea
                                ? "secondary.6"
                                : "primary.6"
                              : "inherit"
                          }
                        >
                          {item.label}
                        </Text>
                      </Group>
                    </UnstyledButton>
                  )
                )}
              </Stack>
            </Box>

            {/* Content */}
            <Box
              style={{
                flex: 1,
                minWidth: 0,
                overflowY: "auto",
                overflowX: "hidden",
                paddingTop: "20px",
                paddingBottom: "100px",
                height: "100%"
              }}
              sx={{
                marginLeft: "250px",
                "@media (max-width: 991px)": {
                  marginLeft: 0
                }
              }}
            >
              <Routes>
                <Route path="/dashboard" element={<ServantInScreen />} />
                <Route
                  path="/dashboard/follow-up"
                  element={<FollowUpScreen />}
                />
                <Route
                  path="/dashboard/attendance"
                  element={<AttendanceScreen />}
                />
                <Route
                  path="/dashboard/bible-study"
                  element={<BibleStudyScreen />}
                />
                <Route
                  path="/dashboard/announcements"
                  element={<AnnouncementsScreen />}
                />
                <Route path="/dashboard/events" element={<EventsScreen />} />
                <Route
                  path="/dashboard/store"
                  element={<StoreScreenDashboard />}
                />
                <Route
                  path="/dashboard/my-profile"
                  element={<AccountScreen />}
                />
                <Route path="/admin-panel" element={<AdminScreen />} />
                <Route
                  path="/admin-panel/servant-management"
                  element={<ServantManagementScreen />}
                />
                <Route
                  path="/admin-panel/service-management"
                  element={<ServiceManagementScreen />}
                />
                <Route
                  path="/admin-panel/book-management"
                  element={<BookManagementScreen />}
                />
              </Routes>
            </Box>
          </Box>
        ) : (
          /* Non-Dashboard Routes */
          <Box style={{paddingTop: "20px", paddingBottom: "100px"}}>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/store" element={<StoreScreen />} />
              <Route path="/my-profile" element={<AccountScreen />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Box>
        )}
      </Box>

    </Box>
  )
}
