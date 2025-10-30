import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Container,
  Paper,
  Stack,
  Group,
  Title,
  Text,
  Card,
  SimpleGrid,
  Tabs,
  Badge,
  Button,
  Loader,
  Center,
  Alert,
  Box,
  ActionIcon,
  Indicator,
  Transition,
  useMantineTheme
} from '@mantine/core'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {
  FaBinoculars,
  FaFingerprint,
  FaBullhorn,
  FaCalendarAlt,
  FaStore,
  FaBible,
  FaPlus,
  FaUsers,
  FaChartLine,
  FaInfoCircle,
  FaClock
} from 'react-icons/fa'
import { GiCampingTent } from 'react-icons/gi'
import { BiBible, BiStore } from 'react-icons/bi'

import { listMyServantIn } from '../actions/servantInActions'
import ControlAttendanceCard from '../components/ControlAttendanceCard'
import ControlAddUserCard from '../components/ControlAddUserCard'
import ServantInListModal from '../components/ServantInListModal'
import FollowUpScreen from './FollowUp'
import Gifts from './gifts/Gifts'

function ServantInScreen() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const theme = useMantineTheme()

  const [selectedTab, setSelectedTab] = useState('follow-up')

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const servantInListMy = useSelector((state) => state.servantInListMy)
  const { error, loading, servantIn } = servantInListMy

  const servantInList = useSelector((state) => state.servantInList)
  const { selected } = servantInList

  useEffect(() => {
    if (userInfo && userInfo?.user?.authorizedKhadem) {
      dispatch(listMyServantIn(''))
    }
  }, [dispatch, userInfo])

  // Service tabs configuration
  const serviceTabs = [
    {
      value: 'follow-up',
      title: t('Follow_Up'),
      icon: <FaBinoculars size={18} />,
      color: 'red',
      available: true,
      description: t('Track and manage follow-ups')
    },
    {
      value: 'attendance',
      title: t('Attendance'),
      icon: <FaFingerprint size={18} />,
      color: 'blue',
      available: true,
      description: t('Mark and view attendance records')
    },
    {
      value: 'bible-study',
      title: t('Bible_Study'),
      icon: <FaBible size={18} />,
      color: 'green',
      available: false,
      description: t('Bible study materials and progress')
    },
    {
      value: 'announcements',
      title: t('Announcements'),
      icon: <FaBullhorn size={18} />,
      color: 'violet',
      available: false,
      description: t('Church announcements and updates')
    },
    {
      value: 'events',
      title: t('Events'),
      icon: <GiCampingTent size={18} />,
      color: 'orange',
      available: false,
      description: t('Upcoming church events')
    },
    {
      value: 'store',
      title: t('Store'),
      icon: <FaStore size={18} />,
      color: 'yellow',
      available: true,
      description: t('Church store and resources')
    }
  ]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: {
      scale: 1.03,
      transition: { type: 'spring', stiffness: 300 }
    }
  }

  // Stats cards for dashboard overview
  const statsCards = [
    {
      title: t('Total Members'),
      value: servantIn?.length || 0,
      icon: <FaUsers size={20} />,
      color: 'blue'
    },
    {
      title: t('Today Attendance'),
      value: 45,
      icon: <FaChartLine size={20} />,
      color: 'green'
    },
    {
      title: t('Pending Tasks'),
      value: 12,
      icon: <FaClock size={20} />,
      color: 'yellow'
    }
  ]

  if (loading) {
    return (
      <Center h="400px">
        <Loader size="xl" />
      </Center>
    )
  }

  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between" align="center">
          <Box>
            <Title order={2}>{t('Service Dashboard')}</Title>
            <Text size="sm" c="dimmed">
              {selected?.service?.name || t('Select_Your_Service')}
            </Text>
          </Box>
          <ControlAddUserCard service={selected?.service} />
        </Group>

        {/* Stats Overview */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
            {statsCards.map((stat, index) => (
              <motion.div key={index} variants={cardVariants} whileHover="hover">
                <Paper shadow="sm" radius="md" p="lg">
                  <Group justify="space-between">
                    <Box>
                      <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                        {stat.title}
                      </Text>
                      <Text size="xl" fw={700}>
                        {stat.value}
                      </Text>
                    </Box>
                    <Box
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        backgroundColor: theme.colors[stat.color][1],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {React.cloneElement(stat.icon, {
                        color: theme.colors[stat.color][6]
                      })}
                    </Box>
                  </Group>
                </Paper>
              </motion.div>
            ))}
          </SimpleGrid>
        </motion.div>

        {/* Service Tabs - Modern Design */}
        <Paper shadow="sm" radius="lg" p="md">
          <Tabs value={selectedTab} onChange={setSelectedTab} variant="pills">
            <Tabs.List grow>
              {serviceTabs.map((tab) => (
                <Tabs.Tab
                  key={tab.value}
                  value={tab.value}
                  leftSection={tab.icon}
                  disabled={!tab.available}
                  rightSection={
                    !tab.available && (
                      <Badge size="xs" variant="filled" color="gray">
                        {t('Soon')}
                      </Badge>
                    )
                  }
                  style={{
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Text size="sm" fw={500}>
                    {tab.title}
                  </Text>
                </Tabs.Tab>
              ))}
            </Tabs.List>

            {/* Tab Panels with Animation */}
            <Box mt="lg">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Tabs.Panel value="follow-up">
                    <Paper p="md" radius="md" withBorder>
                      <FollowUpScreen />
                    </Paper>
                  </Tabs.Panel>

                  <Tabs.Panel value="attendance">
                    <Paper p="md" radius="md" withBorder>
                      <ControlAttendanceCard userInfo={userInfo} />
                    </Paper>
                  </Tabs.Panel>

                  <Tabs.Panel value="bible-study">
                    <ComingSoonCard
                      title={t('Bible Study')}
                      description={t('Bible study features coming soon')}
                      icon={<FaBible size={60} />}
                    />
                  </Tabs.Panel>

                  <Tabs.Panel value="announcements">
                    <ComingSoonCard
                      title={t('Announcements')}
                      description={t('Announcements feature coming soon')}
                      icon={<FaBullhorn size={60} />}
                    />
                  </Tabs.Panel>

                  <Tabs.Panel value="events">
                    <ComingSoonCard
                      title={t('Events')}
                      description={t('Events management coming soon')}
                      icon={<GiCampingTent size={60} />}
                    />
                  </Tabs.Panel>

                  <Tabs.Panel value="store">
                    <Paper p="md" radius="md" withBorder>
                      <Gifts selectedService={selected?.service} />
                    </Paper>
                  </Tabs.Panel>
                </motion.div>
              </AnimatePresence>
            </Box>
          </Tabs>
        </Paper>

        {/* Service List Modal */}
        {servantIn?.length > 0 ? (
          <ServantInListModal myList={servantIn} />
        ) : (
          !loading && (
            <Alert
              icon={<FaInfoCircle />}
              title={t('No Service Assigned')}
              color="blue"
              variant="light"
              radius="md"
            >
              <Text size="sm">{t('Not_Added_To_Service_Yet')}</Text>
            </Alert>
          )
        )}
      </Stack>
    </Container>
  )
}

// Coming Soon Component
function ComingSoonCard({ title, description, icon }) {
  const theme = useMantineTheme()

  return (
    <Center h={300}>
      <Stack align="center" gap="md">
        <Box
          style={{
            color: theme.colors.gray[5]
          }}
        >
          {icon}
        </Box>
        <Title order={3} c="dimmed">
          {title}
        </Title>
        <Text size="sm" c="dimmed" ta="center">
          {description}
        </Text>
        <Badge size="lg" variant="light" color="gray">
          Coming Soon
        </Badge>
      </Stack>
    </Center>
  )
}

export default ServantInScreen