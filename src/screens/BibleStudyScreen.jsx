import React, {useState} from "react"
import {
  Container,
  Stack,
  Paper,
  Title,
  Text,
  Group,
  Badge,
  Divider,
  SimpleGrid,
  Box
} from "@mantine/core"
import {useSelector} from "react-redux"
import {useTranslation} from "react-i18next"
import {FaBook, FaQuestionCircle, FaListUl} from "react-icons/fa"
import ServiceBooksView from "../components/dashboard/ServiceBooksView"
import MCQManagement from "../components/dashboard/MCQManagement"

const BibleStudyScreen = () => {
  const {t, i18n} = useTranslation()
  const currentLang = i18n.language
  const [selectedBookId, setSelectedBookId] = useState(null)
  const [selectedQuestionId, setSelectedQuestionId] = useState(null)

  // Get selected service to show in header
  const servantInList = useSelector((state) => state.servantInList)
  const {selected} = servantInList

  // Get counts for badges
  const serviceBookList = useSelector((state) => state.serviceBookList)
  const {serviceBooks} = serviceBookList
  const MCQList = useSelector((state) => state.MCQList)
  const {mcqs} = MCQList

  // Ensure mcqs is always an array
  const mcqsList = Array.isArray(mcqs) ? mcqs : []

  // Find selected question
  const selectedQuestion = mcqsList.find((q) => q._id === selectedQuestionId)

  return (
    <Container size="xl" px="md">
      <Stack gap="lg">
        {/* Header */}
        <Paper shadow="sm" radius="md" p="md" withBorder>
          <Group justify="space-between" wrap="wrap">
            <div>
              <Title order={2} c="primary.6">
                <Group gap="xs">
                  <FaBook size={24} />
                  {t("Bible_Study")}
                </Group>
              </Title>
              <Text size="sm" c="dimmed" mt="xs">
                {selected?.service
                  ? `${t("Managing_content_for")}: ${selected.service.name}`
                  : t("Manage_biblical_books_and_study_materials")}
              </Text>
            </div>
            {/* Service name badge if selected */}
            {selected?.service && (
              <Badge size="lg" color="blue" variant="filled">
                {selected.service.name}
              </Badge>
            )}
          </Group>
        </Paper>

        {/* Mobile/Tablet Layout - Stacked Sections with Horizontal Scroll */}
        <Stack gap="md" hiddenFrom="lg">
          {/* Service Books Section - Horizontal scroll */}
          <Paper shadow="sm" radius="md" p="sm" withBorder>
            <Stack gap="sm">
              <Group justify="space-between" wrap="nowrap">
                <Group gap="xs">
                  <FaBook size={16} />
                  <Text fw={600} c="blue.6" size="sm">
                    {t("Service_Books")}
                  </Text>
                </Group>
                {serviceBooks && serviceBooks.length > 0 && (
                  <Badge size="sm" color="blue" variant="light">
                    {serviceBooks.length}
                  </Badge>
                )}
              </Group>
              <Box style={{overflowX: "auto", overflowY: "hidden"}}>
                <Group gap="xs" wrap="nowrap" style={{minWidth: "max-content"}}>
                  <ServiceBooksView
                    onSelectBook={setSelectedBookId}
                    selectedBookId={selectedBookId}
                    horizontal={true}
                  />
                </Group>
              </Box>
            </Stack>
          </Paper>

          {/* Questions Section - Horizontal scroll */}
          <Paper shadow="sm" radius="md" p="sm" withBorder>
            <Stack gap="sm">
              <Group justify="space-between" wrap="nowrap">
                <Group gap="xs">
                  <FaQuestionCircle size={16} />
                  <Text fw={600} c="green.6" size="sm">
                    {t("Questions")}
                  </Text>
                </Group>
                {mcqsList.length > 0 && (
                  <Badge size="sm" color="green" variant="light">
                    {mcqsList.length}
                  </Badge>
                )}
              </Group>
              <Box
                style={{
                  overflowX: "auto",
                  overflowY: "hidden",
                  maxHeight: "300px"
                }}
              >
                <MCQManagement
                  selectedBookId={selectedBookId}
                  onSelectQuestion={setSelectedQuestionId}
                  selectedQuestionId={selectedQuestionId}
                  horizontal={true}
                />
              </Box>
            </Stack>
          </Paper>

          {/* Choices Section - Full width */}
          <Paper shadow="sm" radius="md" p="sm" withBorder>
            <Stack gap="sm">
              <Group justify="space-between" wrap="nowrap">
                <Group gap="xs">
                  <FaListUl size={16} />
                  <Text fw={600} c="orange.6" size="sm">
                    {t("Choices")}
                  </Text>
                </Group>
                {selectedQuestion && selectedQuestion.choices && (
                  <Badge size="sm" color="orange" variant="light">
                    {selectedQuestion.choices.length}
                  </Badge>
                )}
              </Group>
              {!selectedQuestion ? (
                <Stack align="center" gap="xs" py="md">
                  <FaListUl size={20} color="var(--mantine-color-orange-5)" />
                  <Text size="xs" c="dimmed" ta="center">
                    {t("Select_a_question_to_view_its_choices")}
                  </Text>
                </Stack>
              ) : (
                <Stack gap="xs">
                  <Paper p="xs" withBorder bg="blue.0">
                    <Text size="xs" fw={600} c="blue.9" lineClamp={2}>
                      {currentLang === "ar"
                        ? selectedQuestion.question?.ar
                        : selectedQuestion.question?.en}
                    </Text>
                  </Paper>
                  {selectedQuestion.choices?.map((choice, index) => {
                    const isCorrect =
                      choice.check === true || choice.isTrue === true
                    const choiceText =
                      currentLang === "ar"
                        ? choice.choice?.ar || choice.text?.ar
                        : choice.choice?.en || choice.text?.en
                    return (
                      <Paper
                        key={index}
                        p="xs"
                        withBorder
                        style={{
                          backgroundColor: isCorrect
                            ? "var(--mantine-color-green-0)"
                            : "white",
                          borderColor: isCorrect
                            ? "var(--mantine-color-green-5)"
                            : undefined
                        }}
                      >
                        <Group gap="xs" wrap="nowrap">
                          {isCorrect && (
                            <Text
                              size="xs"
                              c="green.8"
                              fw={700}
                              style={{flexShrink: 0}}
                            >
                              ✓
                            </Text>
                          )}
                          <Badge
                            size="xs"
                            color={isCorrect ? "green" : "gray"}
                            variant={isCorrect ? "filled" : "light"}
                            style={{flexShrink: 0}}
                          >
                            {index + 1}
                          </Badge>
                          <Text
                            size="xs"
                            style={{flex: 1, wordBreak: "break-word"}}
                            c={isCorrect ? "green.9" : undefined}
                            fw={isCorrect ? 600 : 400}
                          >
                            {choiceText}
                          </Text>
                        </Group>
                      </Paper>
                    )
                  })}
                </Stack>
              )}
            </Stack>
          </Paper>
        </Stack>

        {/* Desktop Layout - 3 Columns Side by Side (Large screens only) */}
        <SimpleGrid
          cols={3}
          spacing="lg"
          visibleFrom="lg"
          style={{alignItems: "stretch"}}
        >
          {/* Section 1: Service Books */}
          <Paper
            shadow="sm"
            radius="md"
            p="md"
            withBorder
            style={{
              height: "calc(100vh - 280px)",
              maxHeight: "800px",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <Group justify="space-between" wrap="nowrap" mb="md">
              <Group gap="xs">
                <FaBook size={18} />
                <Text fw={600} c="blue.6" size="md">
                  {t("Service_Books")}
                </Text>
              </Group>
              {serviceBooks && serviceBooks.length > 0 && (
                <Badge size="sm" color="blue" variant="light">
                  {serviceBooks.length}
                </Badge>
              )}
            </Group>
            <Divider mb="md" />
            <Box style={{flex: 1, overflow: "auto", minHeight: 0}}>
              <ServiceBooksView
                onSelectBook={setSelectedBookId}
                selectedBookId={selectedBookId}
              />
            </Box>
          </Paper>

          {/* Section 2: Questions */}
          <Paper
            shadow="sm"
            radius="md"
            p="md"
            withBorder
            style={{
              height: "calc(100vh - 280px)",
              maxHeight: "800px",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <Group justify="space-between" wrap="nowrap" mb="md">
              <Group gap="xs">
                <FaQuestionCircle size={18} />
                <Text fw={600} c="green.6" size="md">
                  {t("Questions")}
                </Text>
              </Group>
              {mcqsList.length > 0 && (
                <Badge size="sm" color="green" variant="light">
                  {mcqsList.length}
                </Badge>
              )}
            </Group>
            <Divider mb="md" />
            <Box style={{flex: 1, overflow: "auto", minHeight: 0}}>
              <MCQManagement
                selectedBookId={selectedBookId}
                onSelectQuestion={setSelectedQuestionId}
                selectedQuestionId={selectedQuestionId}
              />
            </Box>
          </Paper>

          {/* Section 3: Choices */}
          <Paper
            shadow="sm"
            radius="md"
            p="md"
            withBorder
            style={{
              height: "calc(100vh - 280px)",
              maxHeight: "800px",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <Group justify="space-between" wrap="nowrap" mb="md">
              <Group gap="xs">
                <FaListUl size={18} />
                <Text fw={600} c="orange.6" size="md">
                  {t("Choices")}
                </Text>
              </Group>
              {selectedQuestion && selectedQuestion.choices && (
                <Badge size="sm" color="orange" variant="light">
                  {selectedQuestion.choices.length}
                </Badge>
              )}
            </Group>
            <Divider mb="md" />
            <Box style={{flex: 1, overflow: "auto", minHeight: 0}}>
              {!selectedQuestion ? (
                <Stack
                  align="center"
                  gap="xs"
                  px="sm"
                  style={{height: "100%", justifyContent: "center"}}
                >
                  <FaListUl size={24} color="var(--mantine-color-orange-5)" />
                  <Text size="sm" c="dimmed" ta="center">
                    {t("Select_a_question_to_view_its_choices")}
                  </Text>
                </Stack>
              ) : (
                <Stack gap="xs">
                  <Paper p="xs" withBorder bg="blue.0">
                    <Text size="xs" fw={600} c="blue.9" lineClamp={2}>
                      {currentLang === "ar"
                        ? selectedQuestion.question?.ar
                        : selectedQuestion.question?.en}
                    </Text>
                  </Paper>
                  {selectedQuestion.choices?.map((choice, index) => {
                    const isCorrect =
                      choice.check === true || choice.isTrue === true
                    const choiceText =
                      currentLang === "ar"
                        ? choice.choice?.ar || choice.text?.ar
                        : choice.choice?.en || choice.text?.en
                    return (
                      <Paper
                        key={index}
                        p="xs"
                        withBorder
                        style={{
                          backgroundColor: isCorrect
                            ? "var(--mantine-color-green-0)"
                            : "white",
                          borderColor: isCorrect
                            ? "var(--mantine-color-green-5)"
                            : undefined
                        }}
                      >
                        <Group gap="xs" wrap="nowrap">
                          {isCorrect && (
                            <Text
                              size="xs"
                              c="green.8"
                              fw={700}
                              style={{flexShrink: 0}}
                            >
                              ✓
                            </Text>
                          )}
                          <Badge
                            size="xs"
                            color={isCorrect ? "green" : "gray"}
                            variant={isCorrect ? "filled" : "light"}
                            style={{flexShrink: 0}}
                          >
                            {index + 1}
                          </Badge>
                          <Text
                            size="xs"
                            style={{flex: 1, wordBreak: "break-word"}}
                            c={isCorrect ? "green.9" : undefined}
                            fw={isCorrect ? 600 : 400}
                          >
                            {choiceText}
                          </Text>
                        </Group>
                      </Paper>
                    )
                  })}
                </Stack>
              )}
            </Box>
          </Paper>
        </SimpleGrid>
      </Stack>
    </Container>
  )
}

export default BibleStudyScreen
