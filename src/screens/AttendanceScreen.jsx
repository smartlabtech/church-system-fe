import React from 'react'
import { Container, Stack, Paper, Title, Text, Group } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { FaFingerprint } from 'react-icons/fa'
import ControlAttendanceCard from '../components/ControlAttendanceCard'
import ControlAddUserCard from '../components/ControlAddUserCard'
import { useSelector } from 'react-redux'

const AttendanceScreen = () => {
  const { t } = useTranslation()
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const servantInList = useSelector((state) => state.servantInList)
  const { selected } = servantInList

  return (
    <Container size="xl" px="md">
      <Stack gap="lg">
        {/* Header */}
        <Paper shadow="sm" radius="md" p="md" withBorder>
          <Group justify="space-between">
            <div>
              <Title order={2} c="primary.6">
                <Group gap="xs">
                  <FaFingerprint size={24} />
                  {t('Attendance')}
                </Group>
              </Title>
              <Text size="sm" c="dimmed" mt="xs">
                {t('Mark_attendance_for_church_members')}
              </Text>
            </div>
            <ControlAddUserCard service={selected?.service} />
          </Group>
        </Paper>

        {/* Attendance Content */}
        <ControlAttendanceCard userInfo={userInfo} />
      </Stack>
    </Container>
  )
}

export default AttendanceScreen