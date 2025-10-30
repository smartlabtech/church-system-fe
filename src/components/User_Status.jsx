import React from "react"
import {useTranslation} from "react-i18next"

import {Button, Group, Stack, Text} from "@mantine/core"

const UserStatus = ({status, onUpdateStatus}) => {
  const [t, i18n] = useTranslation()

  return (
    <Stack>
      <Text>{t("Avalability")}</Text>
      <Group>
        {["IN_CHURCH", "OTHER_CHURCH", "TRAVEL", "IMMIGRANT", "WRONG_DATA"].map(
          (val, index) => (
            <Button
              size="xs"
              key={index}
              variant={status == val ? "gradient" : "outline"}
              onClick={() => onUpdateStatus(val)}
            >
              {t(val)}
            </Button>
          )
        )}
      </Group>
    </Stack>
  )
}

export default UserStatus
