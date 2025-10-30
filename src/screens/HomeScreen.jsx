import React, {useState, useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"

import {
  Group,
  Stack,
  Image,
  Card,
  Text,
  Container,
  Title,
  Paper,
  Badge,
  SimpleGrid,
  Box,
  ActionIcon,
  Skeleton,
  AspectRatio,
  Overlay,
  Center
} from "@mantine/core"
import {useNavigate} from "react-router-dom"
import {getMyProfile} from "../actions/userActions"
import ServedByModal from "../components/ServedByListModal"
import AskHere from "../components/ask-here/AskHere"
import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaCalendarAlt,
  FaMapMarkerAlt
} from "react-icons/fa"
import {PointCard} from "../components/points-card/PointCard"
import {useTranslation} from "react-i18next"
import BibleMCQ from "../components/bible-MCQ/BibleMCQ"

function HomeScreen() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {t} = useTranslation()

  const userLogin = useSelector((state) => state.userLogin)
  const {userInfo, loading} = userLogin

  const userServiceMeta = useSelector((state) => state.userServiceMeta)
  const {landingPage} = userServiceMeta

  const [wait, setWait] = useState(true)
  const [imageIndex, setImageIndex] = useState(0)

  useEffect(() => {
    if (userInfo) {
      dispatch(getMyProfile())
      setWait(false)
    }
  }, [dispatch])

  return (
    <Box
      style={{
        backgroundColor: "var(--mantine-color-gray-0)",
        minHeight: "calc(100vh - 140px)"
      }}
    >
      <Container size="xl" px={{base: "md", sm: "lg", md: "xl"}}>
        <Stack gap={{base: "md", sm: "lg", md: "xl"}}>
          {userInfo && !wait ? <ServedByModal userInfo={userInfo} /> : null}

          {/* Hero/Announcements Section - Responsive Carousel */}
          {landingPage?.announcements?.length > 0 && (
            <Paper
              shadow="xl"
              radius="lg"
              p={0}
              withBorder
              style={{
                overflow: "hidden",
                background:
                  "linear-gradient(135deg, var(--mantine-color-primary-1) 0%, var(--mantine-color-primary-0) 100%)"
              }}
            >
              <Stack gap={0}>
                {/* Main Image - Responsive */}
                <AspectRatio ratio={16 / 9} maw="100%">
                  <Box style={{position: "relative"}}>
                    <Image
                      src={landingPage.announcements[imageIndex]?.url}
                      alt="announcements"
                      fit="cover"
                      h="100%"
                      w="100%"
                      style={{objectFit: "cover"}}
                    />
                    {/* Gradient overlay for text readability */}
                    <Box
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "40%",
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                        pointerEvents: "none"
                      }}
                    />
                  </Box>
                </AspectRatio>

                {/* Thumbnails - Responsive Grid */}
                {landingPage.announcements.length > 1 && (
                  <Box
                    p={{base: "xs", sm: "md", md: "lg"}}
                    style={{backgroundColor: "white"}}
                  >
                    <Group justify="center" gap={{base: 4, sm: "xs", md: "sm"}}>
                      {landingPage.announcements.map((banner, index) => (
                        <Box
                          key={index}
                          style={{
                            position: "relative",
                            cursor: "pointer",
                            borderRadius: "var(--mantine-radius-md)",
                            overflow: "hidden",
                            border:
                              imageIndex === index
                                ? "3px solid var(--mantine-color-primary-6)"
                                : "3px solid var(--mantine-color-gray-3)",
                            transition: "all 0.3s ease"
                          }}
                          onClick={() => setImageIndex(index)}
                        >
                          <Image
                            src={banner.url}
                            alt={`thumbnail-${index}`}
                            fit="cover"
                            w={{base: 50, sm: 60, md: 80}}
                            h={{base: 50, sm: 60, md: 80}}
                            style={{
                              opacity: imageIndex === index ? 1 : 0.6,
                              transition: "opacity 0.3s ease"
                            }}
                          />
                        </Box>
                      ))}
                    </Group>
                  </Box>
                )}
              </Stack>
            </Paper>
          )}

          {/* Main Content Section - Dynamic based on available content */}
          <Stack gap={{base: "md", sm: "lg", md: "xl"}}>
            {/* Points Card - Always visible */}
            {(userInfo || landingPage?.score !== undefined) && (
              <Paper
                shadow="md"
                radius="lg"
                p={{base: "md", sm: "lg"}}
                withBorder
                style={{
                  background:
                    "linear-gradient(135deg, #fff 0%, var(--mantine-color-primary-0) 100%)"
                }}
              >
                <PointCard
                  points={landingPage?.score || 0}
                  qrCode={userInfo?.user?._id || "not signin"}
                />
              </Paper>
            )}

            {/* Bible MCQ Section - Only show if data exists */}
            {landingPage?.bible?.length > 0 && (
              <Paper
                shadow="md"
                radius="lg"
                p={{base: "md", sm: "lg"}}
                withBorder
              >
                <BibleMCQ bibleMCQs={landingPage.bible} userInfo={userInfo} />
              </Paper>
            )}

            {/* Ask Here Section - Only show if user is logged in */}
            {userInfo && (
              <Stack gap="md">
                <Title order={{base: 4, sm: 3}} c="primary.6">
                  {t("Ask_Your_Question")}
                </Title>
                <AskHere />
              </Stack>
            )}
          </Stack>

          {/* Events Section - Full Width Responsive Grid */}
          {landingPage?.events?.length > 0 && (
            <Stack gap={{base: "md", sm: "lg"}}>
              <Paper
                shadow="sm"
                radius="lg"
                p={{base: "md", sm: "lg"}}
                withBorder
              >
                <Stack gap={{base: "md", sm: "lg"}}>
                  <Group justify="space-between" align="center">
                    <Title order={2} c="primary.6">
                      {t("Upcoming_Events")}
                    </Title>
                    <Badge size="lg" variant="light" color="secondary">
                      {landingPage.events.length} {t("Events")}
                    </Badge>
                  </Group>

                  <SimpleGrid
                    cols={{base: 1, xs: 2, md: 3, lg: 4}}
                    spacing={{base: "md", sm: "lg"}}
                  >
                    {landingPage.events.map((event, index) => (
                      <Card
                        key={index}
                        shadow="sm"
                        padding="lg"
                        radius="md"
                        withBorder
                        style={{
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          cursor: "pointer",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform =
                            "translateY(-8px) scale(1.02)"
                          e.currentTarget.style.boxShadow =
                            "0 20px 40px rgba(0,0,0,0.15)"
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform =
                            "translateY(0) scale(1)"
                          e.currentTarget.style.boxShadow =
                            "var(--mantine-shadow-sm)"
                        }}
                      >
                        <Stack gap="xs" style={{flex: 1}}>
                          <Badge
                            size="lg"
                            variant="gradient"
                            gradient={{from: "primary", to: "secondary"}}
                            style={{alignSelf: "flex-start"}}
                          >
                            {t("Event")}
                          </Badge>

                          <Text fw={700} size="lg" lineClamp={2}>
                            {event.name || "Event"}
                          </Text>

                          <Stack gap={4} mt="auto">
                            {event.date && (
                              <Group gap="xs">
                                <FaCalendarAlt
                                  size={14}
                                  color="var(--mantine-color-dimmed)"
                                />
                                <Text size="sm" c="dimmed">
                                  {event.date}
                                </Text>
                              </Group>
                            )}
                            {event.location && (
                              <Group gap="xs">
                                <FaMapMarkerAlt
                                  size={14}
                                  color="var(--mantine-color-dimmed)"
                                />
                                <Text size="sm" c="dimmed" lineClamp={1}>
                                  {event.location}
                                </Text>
                              </Group>
                            )}
                          </Stack>
                        </Stack>
                      </Card>
                    ))}
                  </SimpleGrid>
                </Stack>
              </Paper>
            </Stack>
          )}
        </Stack>
      </Container>
    </Box>
  )
}

export default HomeScreen
