import React from 'react'
import { Container, Stack, Paper, Title, Text, Badge, Group, ThemeIcon } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { FaBullhorn } from 'react-icons/fa'

const AnnouncementsScreen = () => {
  const { t } = useTranslation()

  return (
    <Container size="xl" px="md">
      <Stack gap="lg">
        {/* Header */}
        <Paper shadow="sm" radius="md" p="md" withBorder>
          <Group justify="space-between">
            <div>
              <Title order={2} c="primary.6">
                <Group gap="xs">
                  <FaBullhorn size={24} />
                  {t('Announcements')}
                </Group>
              </Title>
              <Text size="sm" c="dimmed" mt="xs">
                {t('Church_announcements_and_updates')}
              </Text>
            </div>
            <Badge size="lg" color="gray" variant="filled">
              {t('Coming_Soon')}
            </Badge>
          </Group>
        </Paper>

        {/* Coming Soon Content */}
        <Paper shadow="sm" radius="md" p="xl" withBorder >
          <Stack align="center" justify="center" h={300}>
            <ThemeIcon size="xl" radius="md" variant="light" color="gray">
              <FaBullhorn size={30} />
            </ThemeIcon>
            <Title order={3} c="dimmed">{t('Announcements')}</Title>
            <Text c="dimmed" ta="center">
              {t('This_feature_will_be_available_soon')}
            </Text>
            <Text size="sm" c="dimmed" ta="center" maw={400}>
              {t('You_will_be_able_to_view_and_manage_church_announcements_here')}
            </Text>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  )
}

export default AnnouncementsScreen