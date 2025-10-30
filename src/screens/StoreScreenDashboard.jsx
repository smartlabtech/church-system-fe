import React from 'react'
import { Container, Stack, Paper, Title, Text, Group } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { BiStore } from 'react-icons/bi'
import Gifts from './gifts/Gifts'
import { useSelector } from 'react-redux'

const StoreScreenDashboard = () => {
  const { t } = useTranslation()

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
                  <BiStore size={24} />
                  {t('Store')}
                </Group>
              </Title>
              <Text size="sm" c="dimmed" mt="xs">
                {t('Church_store_and_rewards')}
              </Text>
            </div>
          </Group>
        </Paper>

        {/* Store Content */}
        <Paper shadow="sm" radius="md" p="xl" withBorder>
          <Gifts selectedService={selected?.service} />
        </Paper>
      </Stack>
    </Container>
  )
}

export default StoreScreenDashboard