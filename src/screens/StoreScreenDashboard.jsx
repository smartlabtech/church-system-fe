import React from "react"
import {Container, Stack, Paper, Title, Text, Group} from "@mantine/core"
import {useTranslation} from "react-i18next"
import {FaGift} from "react-icons/fa"
import Gifts from "./gifts/Gifts"
import {useSelector} from "react-redux"

const StoreScreenDashboard = () => {
  const {t} = useTranslation()

  const servantInList = useSelector((state) => state.servantInList)
  const {selected} = servantInList

  return (
    <Container size="xl" px="md">
      <Stack gap="lg">
        {/* Header */}
        <Paper shadow="sm" radius="md" p="md" withBorder>
          <Group justify="space-between">
            <div>
              <Title order={2} c="primary.6">
                <Group gap="xs">
                  <FaGift size={24} />
                  {t("Store_Management")}
                </Group>
              </Title>
              <Text size="sm" c="dimmed" mt="xs">
                {selected?.service
                  ? `${t("Managing_products_for")}: ${selected.service.name}`
                  : t("Manage_store_products_and_rewards")}
              </Text>
            </div>
          </Group>
        </Paper>

        {/* Store Content */}
        <Gifts selectedService={selected?.service} />
      </Stack>
    </Container>
  )
}

export default StoreScreenDashboard
