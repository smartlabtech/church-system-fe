import {
  Anchor,
  Card,
  Divider,
  Group,
  Image,
  Space,
  Stack,
  Text,
  Title
} from "@mantine/core"
import React, {useState} from "react"
import cartImage from "../../assets/photo/cart-img.gif"
import {useTranslation} from "react-i18next"
import Lottie from "react-lottie-player"

import Store from "./Store"

export const PointCard = ({points, qrCode}) => {
  const {t} = useTranslation()

  return (
    <Stack gap="md" align="center" style={{ width: "100%" }}>
      <Group justify="space-between" align="center" style={{ width: "100%" }} wrap={{ base: 'wrap', sm: 'nowrap' }}>
        <Stack gap="xs" align="center" flex={1} style={{ minWidth: 0 }}>
          <Title order={{ base: 3, sm: 2 }} c="primary.6">{t("Your_Points")}</Title>
          <Group gap="xs" align="baseline">
            <Text
              size={{ base: '2rem', sm: '2.5rem', md: '3rem' }}
              fw={700}
              c="secondary.6"
              style={{ lineHeight: 1 }}
            >
              {points}
            </Text>
            <Text size={{ base: 'sm', sm: 'md', md: 'lg' }} c="dimmed" fw={500}>
              {t("Points")}
            </Text>
          </Group>
        </Stack>

        <Divider orientation="vertical" h={{ base: 0, sm: 80 }} visibleFrom="sm" />

        <Stack flex={1} align="center" style={{ minWidth: 0, width: '100%' }}>
          <Store />
        </Stack>
      </Group>
    </Stack>
  )
}
