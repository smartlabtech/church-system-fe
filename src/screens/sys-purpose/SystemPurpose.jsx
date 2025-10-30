import React, {useEffect} from "react"
import {Card, Text, Group, Stack, useMantineTheme} from "@mantine/core"
import {purposeList} from "./purposeList"
import {useTranslation} from "react-i18next"
import {useMediaQuery} from "@mantine/hooks"
import {useSelector} from "react-redux"
import {useNavigate} from "react-router-dom"

const SystemPurpose = () => {
  const theme = useMantineTheme()
  const isSmallScreen = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`)

  const [t, i18n] = useTranslation()

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        padding: "10px",
        justifyContent: "center",
        margin: "0"
      }}
    >
      {purposeList?.map((item, index) => (
        <Card
          key={index}
          shadow="sm"
          miw={isSmallScreen ? "100%" : "300px"}
          maw={isSmallScreen ? "100%" : "300px"}
          m={0}
        >
          <Text size="md" style={{marginBottom: "8px", direction: t("Dir")}}>
            {t(index + 1)} - {item.description[t("lang")]}
          </Text>
        </Card>
      ))}
    </div>
  )
}

export default SystemPurpose
