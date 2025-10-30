import {Group, Stack, Text, Anchor} from "@mantine/core"
import React from "react"
import {useTranslation} from "react-i18next"
import {FaPhone} from "react-icons/fa"

export const CallNumber = ({type, number}) => {
  const {t} = useTranslation()

  return (
    <Group justify="space-between">
      <Text size="md" align="start">
        {t(type)}
      </Text>

      <Anchor href={`tel:${number}`} target="_self">
        <FaPhone />
      </Anchor>
    </Group>
  )
}
