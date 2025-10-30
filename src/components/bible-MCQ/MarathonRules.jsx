import {
  Timeline,
  Card,
  Text,
  Button,
  Progress,
  Group,
  Modal
} from "@mantine/core"
import {useTranslation} from "react-i18next"
import {useState} from "react"

const MarathonRules = () => {
  const {t} = useTranslation()
  const [opened, setOpened] = useState(false) // Modal state
  const rounds = [
    {
      title: {en: "Round 1", ar: "جولة ١"},
      description: {
        en: "15 consecutive days",
        ar: "١٥ يوم متواصلين وبتحصل علي النقط اللي علي السؤال فقط"
      },
      multiply: 1,
      days: 15
    },
    {
      title: {en: "Round 2", ar: "جولة ٢"},
      description: {
        en: "30 consecutive days (can overlap with previous rounds), points are multiplied by",
        ar: "٣٠ يوم متواصلين (ويمكن احتسابهم علي أيام الجولة السابقة) وبتحصل علي النقط اللي علي السؤال مضروبة في"
      },
      multiply: 2,
      days: 30
    },
    {
      title: {en: "Round 3", ar: "جولة ٣"},
      description: {
        en: "60 consecutive days (can overlap with previous rounds), points are multiplied by",
        ar: "٦٠ يوم متواصلين (ويمكن احتسابهم علي أيام الجولة السابقة) وبتحصل علي النقط اللي علي السؤال مضروبة في"
      },
      multiply: 3,
      days: 60
    },
    {
      title: {en: "Round 4", ar: "جولة ٤"},
      description: {
        en: "100 consecutive days (can overlap with previous rounds), points are multiplied by",
        ar: "١٠٠ يوم متواصلين (ويمكن احتسابهم علي أيام الجولة السابقة) وبتحصل علي النقط اللي علي السؤال مضروبة في"
      },
      multiply: 4,
      days: 100
    }
  ]

  return (
    <>
      {/* Button to Open Modal */}
      <Button
        onClick={() => setOpened(true)}
        variant="outline"
        color="blue"
        radius="md"
        size="xs"
      >
        {t("lang") === "ar" ? "قواعد الماراثون" : "Marathon Rules"}
      </Button>

      {/* Modal with Rules */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={t("lang") === "ar" ? "قواعد الماراثون" : "Bible Marathon Rules"}
        dir={t("Dir")}
        size="lg"
        centered
      >
        <Card shadow="sm" padding="lg">
          <Text size="xl" weight={700} align="center">
            {t("lang") === "ar"
              ? "قواعد الجولات الأربع"
              : "Bible Marathon: 4-Round Rules"}
          </Text>
          <Timeline
            active={-1}
            color="blue"
            bulletSize={24}
            lineWidth={2}
            mt="lg"
          >
            {rounds.map((round, index) => (
              <Timeline.Item
                key={index}
                title={
                  <Group position="apart">
                    <Text color="orange" fw="bolder">
                      {round.title[t("lang")]}
                    </Text>
                    <Text size="xs" mt="xs">
                      {t("lang") === "ar" ? "الأيام:" : "Days:"} {round.days}
                    </Text>
                    <Text size="xs" mt="xs">
                      {t("lang") === "ar" ? "النقاط:" : "Points:"} ×
                      {round.multiply}
                    </Text>
                  </Group>
                }
              >
                <Text color="dimmed" size="sm">
                  {round.description[t("lang")]} {round.multiply}.
                </Text>
                <Progress
                  value={(round.days / 100) * 100}
                  size="md"
                  mt="lg"
                  label={`${round.days} Days`}
                />
              </Timeline.Item>
            ))}
          </Timeline>
        </Card>
      </Modal>
    </>
  )
}

export default MarathonRules
