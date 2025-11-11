import React, {useState} from "react"
import {
  Stack,
  Text,
  Box,
  ThemeIcon,
  Accordion,
  Badge,
  Group,
  Paper,
  Title,
  SimpleGrid
} from "@mantine/core"
import {purposeCategories} from "./purposeList"
import {useTranslation} from "react-i18next"
import {FaCheckCircle} from "react-icons/fa"

const SystemPurpose = () => {
  const {t, i18n} = useTranslation()
  const currentLang = i18n.language
  const [value, setValue] = useState(null)

  return (
    <Stack gap="lg">
      {/* Introduction */}
      <Paper p="md" radius="md" bg="primary.0" withBorder>
        <Group gap="sm" wrap="nowrap">
          <ThemeIcon size="xl" radius="md" color="primary" variant="light">
            <FaCheckCircle size={24} />
          </ThemeIcon>
          <Stack gap={4}>
            <Title order={4} c="primary.7">
              {currentLang === "ar"
                ? "الحلول الذكية للتحديات الحقيقية"
                : "Smart Solutions for Real Challenges"}
            </Title>
            <Text size="sm" c="dimmed">
              {currentLang === "ar"
                ? "تم تصميم هذا النظام لحل التحديات اليومية التي تواجه الخدمة بطريقة احترافية ومبتكرة"
                : "This system is designed to solve daily service challenges in a professional and innovative way"}
            </Text>
          </Stack>
        </Group>
      </Paper>

      {/* Categories Summary */}
      <SimpleGrid cols={{base: 2, sm: 3, md: 4}} spacing="xs">
        {purposeCategories.map((category, index) => {
          const Icon = category.icon
          return (
            <Paper
              key={category.id}
              p="sm"
              radius="md"
              withBorder
              style={{
                cursor: "pointer",
                transition: "all 0.2s ease",
                backgroundColor:
                  value === index
                    ? `var(--mantine-color-${category.color}-0)`
                    : "white",
                borderColor:
                  value === index
                    ? `var(--mantine-color-${category.color}-5)`
                    : undefined
              }}
              onClick={() => setValue(value === index ? null : index)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)"
                e.currentTarget.style.boxShadow = "var(--mantine-shadow-md)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = ""
              }}
            >
              <Stack gap="xs" align="center">
                <ThemeIcon
                  size="lg"
                  radius="md"
                  color={category.color}
                  variant={value === index ? "filled" : "light"}
                >
                  <Icon size={20} />
                </ThemeIcon>
                <Text
                  size="xs"
                  fw={600}
                  ta="center"
                  lineClamp={2}
                  style={{minHeight: "2.5rem", display: "flex", alignItems: "center"}}
                >
                  {category.title[currentLang]}
                </Text>
                <Badge
                  size="xs"
                  color={category.color}
                  variant={value === index ? "filled" : "light"}
                >
                  {category.problems.length}
                </Badge>
              </Stack>
            </Paper>
          )
        })}
      </SimpleGrid>

      {/* Accordion for detailed problems */}
      <Accordion
        value={value?.toString()}
        onChange={(val) => setValue(val ? parseInt(val) : null)}
        variant="separated"
        radius="md"
      >
        {purposeCategories.map((category, categoryIndex) => {
          const CategoryIcon = category.icon
          return (
            <Accordion.Item
              key={category.id}
              value={categoryIndex.toString()}
              style={{
                borderColor: `var(--mantine-color-${category.color}-3)`
              }}
            >
              <Accordion.Control
                icon={
                  <ThemeIcon color={category.color} variant="light" size="lg" radius="md">
                    <CategoryIcon size={20} />
                  </ThemeIcon>
                }
              >
                <Group justify="space-between" wrap="nowrap">
                  <Text fw={600} size="md">
                    {category.title[currentLang]}
                  </Text>
                  <Badge color={category.color} variant="light" size="sm">
                    {category.problems.length}{" "}
                    {currentLang === "ar" ? "حلول" : "solutions"}
                  </Badge>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                <Stack gap="md">
                  {category.problems.map((problem, problemIndex) => {
                    const ProblemIcon = problem.icon
                    return (
                      <Paper
                        key={problemIndex}
                        p="md"
                        radius="md"
                        withBorder
                        style={{
                          borderLeft: `4px solid var(--mantine-color-${category.color}-5)`,
                          transition: "all 0.2s ease"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateX(4px)"
                          e.currentTarget.style.boxShadow = "var(--mantine-shadow-sm)"
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateX(0)"
                          e.currentTarget.style.boxShadow = ""
                        }}
                      >
                        <Group gap="md" align="flex-start" wrap="nowrap">
                          <ThemeIcon
                            size="lg"
                            radius="md"
                            color={category.color}
                            variant="light"
                            style={{flexShrink: 0}}
                          >
                            <ProblemIcon size={18} />
                          </ThemeIcon>
                          <Stack gap="xs" style={{flex: 1}}>
                            <Group gap="xs">
                              <Badge
                                color={category.color}
                                variant="dot"
                                size="sm"
                              >
                                {categoryIndex + 1}.{problemIndex + 1}
                              </Badge>
                              <Text fw={600} size="sm" c={`${category.color}.7`}>
                                {problem.title[currentLang]}
                              </Text>
                            </Group>
                            <Text size="sm" c="dimmed" style={{lineHeight: 1.6}}>
                              {problem.description[currentLang]}
                            </Text>
                          </Stack>
                        </Group>
                      </Paper>
                    )
                  })}
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          )
        })}
      </Accordion>

      {/* Footer */}
      <Paper p="md" radius="md" bg="gray.0" ta="center">
        <Text size="sm" c="dimmed" fw={500}>
          {currentLang === "ar"
            ? "نظام شامل مصمم لجعل الخدمة أكثر كفاءة وفعالية"
            : "A comprehensive system designed to make service more efficient and effective"}
        </Text>
      </Paper>
    </Stack>
  )
}

export default SystemPurpose
