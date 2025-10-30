import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Stack,
  Group,
  Container,
  Paper,
  Text,
  Title,
  Card,
  Image,
  Badge,
  Button,
  SimpleGrid,
  Skeleton,
  ActionIcon,
  Indicator,
  Box,
  Transition,
  useMantineTheme
} from '@mantine/core'
import { Carousel } from '@mantine/carousel'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaMapMarkerAlt,
  FaUsers
} from 'react-icons/fa'
import { getMyProfile } from '../actions/userActions'
import ServedByModal from '../components/ServedByListModal'
import AskHere from '../components/ask-here/AskHere'
import { PointCard } from '../components/points-card/PointCard'
import BibleMCQ from '../components/bible-MCQ/BibleMCQ'

function HomeScreen() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const theme = useMantineTheme()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo, loading } = userLogin

  const userServiceMeta = useSelector((state) => state.userServiceMeta)
  const { landingPage } = userServiceMeta

  const [wait, setWait] = useState(true)
  const [imageIndex, setImageIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (userInfo) {
      dispatch(getMyProfile())
      setWait(false)
    }
    setMounted(true)
  }, [dispatch, userInfo])

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const staggerChildren = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  // Auto-rotate announcements
  useEffect(() => {
    if (landingPage?.announcements?.length > 1) {
      const interval = setInterval(() => {
        setImageIndex((prev) => (prev + 1) % landingPage.announcements.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [landingPage?.announcements])

  if (loading || !mounted) {
    return (
      <Container size="xl" py="xl">
        <Stack gap="lg">
          <Skeleton height={300} radius="md" />
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} height={200} radius="md" />
            ))}
          </SimpleGrid>
        </Stack>
      </Container>
    )
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {userInfo && !wait && <ServedByModal userInfo={userInfo} />}

        {/* Announcements Carousel */}
        {landingPage?.announcements?.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ duration: 0.5 }}
          >
            <Paper shadow="md" radius="lg" p={0} style={{ overflow: 'hidden' }}>
              <Box pos="relative">
                <Transition
                  mounted={true}
                  transition="fade"
                  duration={500}
                  timingFunction="ease"
                >
                  {(styles) => (
                    <Image
                      style={styles}
                      src={landingPage.announcements[imageIndex]?.url}
                      alt="announcement"
                      height={400}
                      fit="cover"
                      radius="lg"
                    />
                  )}
                </Transition>

                {/* Navigation Arrows */}
                {landingPage.announcements.length > 1 && (
                  <>
                    <ActionIcon
                      variant="filled"
                      size="lg"
                      radius="xl"
                      pos="absolute"
                      left={10}
                      top="50%"
                      style={{ transform: 'translateY(-50%)' }}
                      onClick={() =>
                        setImageIndex((prev) =>
                          prev === 0 ? landingPage.announcements.length - 1 : prev - 1
                        )
                      }
                    >
                      <FaChevronLeft />
                    </ActionIcon>
                    <ActionIcon
                      variant="filled"
                      size="lg"
                      radius="xl"
                      pos="absolute"
                      right={10}
                      top="50%"
                      style={{ transform: 'translateY(-50%)' }}
                      onClick={() =>
                        setImageIndex((prev) =>
                          (prev + 1) % landingPage.announcements.length
                        )
                      }
                    >
                      <FaChevronRight />
                    </ActionIcon>
                  </>
                )}

                {/* Thumbnail Indicators */}
                <Group justify="center" gap="xs" p="md">
                  {landingPage.announcements.map((_, index) => (
                    <Box
                      key={index}
                      style={{
                        width: index === imageIndex ? 30 : 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor:
                          index === imageIndex
                            ? theme.colors.primary[6]
                            : theme.colors.gray[5],
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onClick={() => setImageIndex(index)}
                    />
                  ))}
                </Group>
              </Box>
            </Paper>
          </motion.div>
        )}

        {/* Points Card - Modern Design */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Paper
            shadow="lg"
            radius="lg"
            p="xl"
            style={{
              background: `linear-gradient(135deg, ${theme.colors.primary[6]} 0%, ${theme.colors.secondary[6]} 100%)`
            }}
          >
            <PointCard
              points={landingPage?.score || 0}
              qrCode={userInfo?.user?._id || 'not signin'}
            />
          </Paper>
        </motion.div>

        {/* Ask Here Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Paper shadow="sm" radius="lg" p="lg">
            <Title order={3} mb="md" ta="center">
              {t('Have a Question?')}
            </Title>
            <AskHere />
          </Paper>
        </motion.div>

        {/* Bible MCQ Section */}
        {landingPage?.bible && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Paper shadow="sm" radius="lg" p="lg">
              <Title order={3} mb="md" ta="center">
                {t('Bible Study')}
              </Title>
              <BibleMCQ bibleMCQs={landingPage.bible} userInfo={userInfo} />
            </Paper>
          </motion.div>
        )}

        {/* Events Section - Modern Cards */}
        {landingPage?.events?.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
          >
            <Title order={2} mb="lg" ta="center">
              {t('Upcoming Events')}
            </Title>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
              {landingPage.events.map((event, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card
                    shadow="md"
                    radius="lg"
                    padding="lg"
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: theme.shadows.xl
                      }
                    }}
                  >
                    {event.image && (
                      <Card.Section>
                        <Image
                          src={event.image}
                          height={160}
                          alt={event.name}
                          fit="cover"
                        />
                      </Card.Section>
                    )}

                    <Stack gap="sm" mt="md">
                      <Group justify="space-between">
                        <Text fw={600} size="lg">
                          {event.name || t('Event')}
                        </Text>
                        {event.type && (
                          <Badge variant="light" color="primary">
                            {event.type}
                          </Badge>
                        )}
                      </Group>

                      {event.description && (
                        <Text size="sm" c="dimmed" lineClamp={2}>
                          {event.description}
                        </Text>
                      )}

                      <Stack gap="xs">
                        {event.date && (
                          <Group gap="xs">
                            <FaCalendarAlt size={14} color={theme.colors.gray[6]} />
                            <Text size="sm" c="dimmed">
                              {new Date(event.date).toLocaleDateString()}
                            </Text>
                          </Group>
                        )}

                        {event.time && (
                          <Group gap="xs">
                            <FaClock size={14} color={theme.colors.gray[6]} />
                            <Text size="sm" c="dimmed">
                              {event.time}
                            </Text>
                          </Group>
                        )}

                        {event.location && (
                          <Group gap="xs">
                            <FaMapMarkerAlt size={14} color={theme.colors.gray[6]} />
                            <Text size="sm" c="dimmed">
                              {event.location}
                            </Text>
                          </Group>
                        )}

                        {event.attendees && (
                          <Group gap="xs">
                            <FaUsers size={14} color={theme.colors.gray[6]} />
                            <Text size="sm" c="dimmed">
                              {event.attendees} {t('attending')}
                            </Text>
                          </Group>
                        )}
                      </Stack>

                      <Button
                        fullWidth
                        variant="light"
                        radius="md"
                        mt="sm"
                        onClick={() => {
                          // Handle event click
                          console.log('Event clicked:', event)
                        }}
                      >
                        {t('Learn More')}
                      </Button>
                    </Stack>
                  </Card>
                </motion.div>
              ))}
            </SimpleGrid>
          </motion.div>
        )}

        {/* Quick Actions */}
        {userInfo && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Paper shadow="sm" radius="lg" p="lg">
              <Title order={3} mb="md" ta="center">
                {t('Quick Actions')}
              </Title>
              <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
                <Button
                  variant="light"
                  radius="md"
                  h={80}
                  onClick={() => navigate('/dashboard')}
                >
                  <Stack align="center" gap={5}>
                    <FaUsers size={24} />
                    <Text size="sm">{t('Dashboard')}</Text>
                  </Stack>
                </Button>
                <Button
                  variant="light"
                  radius="md"
                  h={80}
                  onClick={() => navigate('/my-profile')}
                >
                  <Stack align="center" gap={5}>
                    <FaUsers size={24} />
                    <Text size="sm">{t('Profile')}</Text>
                  </Stack>
                </Button>
                <Button
                  variant="light"
                  radius="md"
                  h={80}
                  onClick={() => navigate('/follow-up')}
                >
                  <Stack align="center" gap={5}>
                    <FaUsers size={24} />
                    <Text size="sm">{t('Follow Up')}</Text>
                  </Stack>
                </Button>
                <Button
                  variant="light"
                  radius="md"
                  h={80}
                  onClick={() => navigate('/store')}
                >
                  <Stack align="center" gap={5}>
                    <FaUsers size={24} />
                    <Text size="sm">{t('Store')}</Text>
                  </Stack>
                </Button>
              </SimpleGrid>
            </Paper>
          </motion.div>
        )}
      </Stack>
    </Container>
  )
}

export default HomeScreen