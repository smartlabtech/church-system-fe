import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Card,
  Stack,
  Title,
  Badge,
  Loader,
  Text,
  Paper,
  Group,
  Select,
  Button,
  Modal,
  TextInput,
  NumberInput,
  Textarea,
  Divider,
  ActionIcon,
  Table,
  SimpleGrid,
  ThemeIcon,
  Checkbox,
  ScrollArea,
  Alert,
  Box
} from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { notifications } from '@mantine/notifications'
import { useTranslation } from 'react-i18next'
import {
  FaQuestionCircle,
  FaPlus,
  FaEdit,
  FaTrash,
  FaBook,
  FaListOl,
  FaBible
} from 'react-icons/fa'
import {
  listMCQs,
  createMCQ,
  updateMCQ
} from '../../actions/MCQActions'
import { listServiceBooks } from '../../actions/serviceBookActions'
import {
  MCQ_CREATE_RESET,
  MCQ_UPDATE_RESET
} from '../../constants/MCQConstants'

const MCQManagement = ({ selectedBookId, onSelectQuestion, selectedQuestionId, horizontal = false }) => {
  const dispatch = useDispatch()
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language

  // Get selected service from Redux
  const servantInList = useSelector((state) => state.servantInList)
  const { selected } = servantInList
  const selectedService = selected?.service?._id || null

  // Use the book selected from ServiceBooksView
  const selectedBook = selectedBookId || ''
  const [selectedChapter, setSelectedChapter] = useState('')
  const [modalOpened, setModalOpened] = useState(false)
  const [editingMCQ, setEditingMCQ] = useState(null)
  const [hasLoadedInitially, setHasLoadedInitially] = useState(false)
  const [bulkEditModalOpened, setBulkEditModalOpened] = useState(false)
  const [bulkEditChapter, setBulkEditChapter] = useState(null)
  const [bulkEditDates, setBulkEditDates] = useState({
    startDate: null,
    endDate: null
  })
  const [bulkEditLoading, setBulkEditLoading] = useState(false)

  // Filter states
  const [filterStatus, setFilterStatus] = useState('')
  const [filterPoints, setFilterPoints] = useState('')
  const [filterStartDate, setFilterStartDate] = useState(null)
  const [filterEndDate, setFilterEndDate] = useState(null)

  // Form state
  const [formData, setFormData] = useState({
    serviceId: '',
    service_bookId: '',
    chapter: '',
    fromVerse: '',
    toVerse: '',
    question: {
      en: '',
      ar: ''
    },
    points: 10,
    startDate: null,
    endDate: null,
    choices: [
      { text: { en: '', ar: '' }, isTrue: false },
      { text: { en: '', ar: '' }, isTrue: false },
      { text: { en: '', ar: '' }, isTrue: false },
      { text: { en: '', ar: '' }, isTrue: false }
    ]
  })

  // Redux state
  const MCQList = useSelector((state) => state.MCQList)
  const { loading: mcqsLoading, mcqs, error: mcqsError } = MCQList

  const serviceBookList = useSelector((state) => state.serviceBookList)
  const { serviceBooks } = serviceBookList

  const MCQCreate = useSelector((state) => state.MCQCreate)
  const { success: createSuccess, error: createError } = MCQCreate

  const MCQUpdate = useSelector((state) => state.MCQUpdate)
  const { success: updateSuccess, error: updateError } = MCQUpdate

  const MCQDelete = useSelector((state) => state.MCQDelete)
  const { success: deleteSuccess, error: deleteError } = MCQDelete

  const MCQAnswerSubmit = useSelector((state) => state.MCQAnswerSubmit)
  const { success: answerSuccess, result: answerResult } = MCQAnswerSubmit

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  // Load service books when service is selected
  useEffect(() => {
    if (selectedService) {
      dispatch(listServiceBooks({ serviceId: selectedService }))
    }
  }, [dispatch, selectedService])

  // Load MCQs when filters change (only on initial load or when filters change)
  useEffect(() => {
    if (selectedService && selectedBook) {
      // Only load on initial mount when service and book are selected
      if (!hasLoadedInitially) {
        const queryParams = {
          serviceId: selectedService,
          service_bookId: selectedBook
        }
        dispatch(listMCQs(queryParams))
        setHasLoadedInitially(true)
      }
    }
  }, [selectedService, selectedBook, hasLoadedInitially, dispatch])

  // Separate effect for filter changes (only runs after initial load)
  useEffect(() => {
    if (hasLoadedInitially && selectedService && selectedBook) {
      const queryParams = {
        serviceId: selectedService,
        service_bookId: selectedBook
      }
      if (selectedChapter) {
        queryParams.chapter = selectedChapter
      }
      if (filterStatus !== '') {
        queryParams.status = filterStatus === 'active'
      }
      if (filterPoints !== '') {
        queryParams.points = Number(filterPoints)
      }
      if (filterStartDate) {
        queryParams.startDate = filterStartDate.toISOString()
      }
      if (filterEndDate) {
        queryParams.endDate = filterEndDate.toISOString()
      }
      dispatch(listMCQs(queryParams))
    }
  }, [selectedChapter, filterStatus, filterPoints, filterStartDate, filterEndDate, hasLoadedInitially, selectedService, selectedBook, dispatch])

  // Handle success/error messages
  useEffect(() => {
    if (createSuccess) {
      setModalOpened(false)
      resetForm()
      dispatch({ type: MCQ_CREATE_RESET })
    }

    if (updateSuccess) {
      setModalOpened(false)
      resetForm()
      dispatch({ type: MCQ_UPDATE_RESET })
    }

    // Note: No need to refresh after operations - reducer updates the list automatically

    if (answerSuccess && answerResult) {
      dispatch({ type: MCQ_ANSWER_SUBMIT_RESET })
    }
  }, [createSuccess, updateSuccess, deleteSuccess, answerSuccess, answerResult, dispatch])

  const resetForm = () => {
    setFormData({
      serviceId: selectedService || '',
      service_bookId: selectedBook || '',
      chapter: '',
      fromVerse: '',
      toVerse: '',
      question: {
        en: '',
        ar: ''
      },
      points: 10,
      startDate: null,
      endDate: null,
      choices: [
        { text: { en: '', ar: '' }, isTrue: false },
        { text: { en: '', ar: '' }, isTrue: false },
        { text: { en: '', ar: '' }, isTrue: false },
        { text: { en: '', ar: '' }, isTrue: false }
      ]
    })
    setEditingMCQ(null)
  }

  const handleOpenModal = (mcq = null) => {
    if (mcq) {
      setEditingMCQ(mcq)
      // Ensure choices have proper structure
      const mappedChoices = mcq.choices?.map(choice => ({
        text: choice.text || { en: '', ar: '' },
        isTrue: choice.isTrue || false,
        _id: choice._id
      })) || [
        { text: { en: '', ar: '' }, isTrue: false },
        { text: { en: '', ar: '' }, isTrue: false },
        { text: { en: '', ar: '' }, isTrue: false },
        { text: { en: '', ar: '' }, isTrue: false }
      ]

      setFormData({
        serviceId: mcq.serviceId || selectedService,
        service_bookId: mcq.service_bookId || selectedBook,
        chapter: mcq.chapter || '',
        fromVerse: mcq.fromVerse || '',
        toVerse: mcq.toVerse || '',
        question: mcq.question || { en: '', ar: '' },
        points: mcq.points || 10,
        startDate: mcq.startDate ? new Date(mcq.startDate) : null,
        endDate: mcq.endDate ? new Date(mcq.endDate) : null,
        choices: mappedChoices
      })
    } else {
      resetForm()
    }
    setModalOpened(true)
  }

  const handleSubmit = () => {
    // Only validate choices when creating (not when editing)
    if (!editingMCQ) {
      // Validate at least one correct answer
      const hasCorrectAnswer = formData.choices.some(choice => choice.isTrue)
      if (!hasCorrectAnswer) {
        notifications.show({
          title: t('Error'),
          message: t('Please_select_at_least_one_correct_answer'),
          color: 'red'
        })
        return
      }

      // Validate all choices have text
      const allChoicesValid = formData.choices.every(choice =>
        choice.text.en.trim() || choice.text.ar.trim()
      )
      if (!allChoicesValid) {
        notifications.show({
          title: t('Error'),
          message: t('Please_fill_all_choice_texts'),
          color: 'red'
        })
        return
      }
    }

    const mcqData = {
      serviceId: formData.serviceId,  // Required in both create and update
      chapter: Number(formData.chapter) || 0,
      fromVerse: Number(formData.fromVerse) || 0,
      toVerse: Number(formData.toVerse) || 0,
      question: formData.question,
      points: Number(formData.points) || 10
    }

    // Add service_bookId and choices only when creating
    if (!editingMCQ) {
      mcqData.service_bookId = formData.service_bookId

      // Include choices when creating
      mcqData.choices = formData.choices.filter(choice =>
        choice.text.en.trim() || choice.text.ar.trim()
      )
    }

    // Add dates if provided
    if (formData.startDate) {
      const startDate = formData.startDate instanceof Date
        ? formData.startDate
        : new Date(formData.startDate)
      // Create UTC date at start of day (00:00:00.000 UTC)
      const utcStartDate = new Date(Date.UTC(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate(),
        0, 0, 0, 0
      ))
      mcqData.startDate = utcStartDate.toISOString()
    }
    if (formData.endDate) {
      const endDate = formData.endDate instanceof Date
        ? formData.endDate
        : new Date(formData.endDate)
      // Create UTC date at end of day (23:59:59.999 UTC)
      const utcEndDate = new Date(Date.UTC(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate(),
        23, 59, 59, 999
      ))
      mcqData.endDate = utcEndDate.toISOString()
    }

    if (editingMCQ) {
      dispatch(updateMCQ(editingMCQ._id, mcqData))
    } else {
      dispatch(createMCQ(mcqData))
    }
  }

  const updateChoice = (index, field, value) => {
    const newChoices = [...formData.choices]
    if (field === 'isTrue') {
      // Only one correct answer allowed
      newChoices.forEach((choice, i) => {
        choice.isTrue = i === index ? value : false
      })
    } else if (field === 'en' || field === 'ar') {
      // Ensure text object exists
      if (!newChoices[index].text) {
        newChoices[index].text = { en: '', ar: '' }
      }
      newChoices[index].text[field] = value
    }
    setFormData({ ...formData, choices: newChoices })
  }

  const addChoice = () => {
    const newChoices = [...formData.choices, { text: { en: '', ar: '' }, isTrue: false }]
    setFormData({ ...formData, choices: newChoices })
  }

  const handleOpenBulkEditModal = (groupKey) => {
    setBulkEditChapter(groupKey)
    setBulkEditDates({ startDate: null, endDate: null })
    setBulkEditModalOpened(true)
  }

  const handleBulkEditSubmit = async () => {
    if (!bulkEditChapter || (!bulkEditDates.startDate && !bulkEditDates.endDate)) {
      notifications.show({
        title: t('Error'),
        message: t('Please_select_at_least_one_date'),
        color: 'red'
      })
      return
    }

    setBulkEditLoading(true)

    const group = groupedMCQs[bulkEditChapter]
    const questionsInGroup = group.questions

    try {
      // Update each question in the group
      for (let i = 0; i < questionsInGroup.length; i++) {
        const mcq = questionsInGroup[i]
        const updateData = {
          serviceId: mcq.serviceId || selectedService,
          chapter: mcq.chapter,
          fromVerse: mcq.fromVerse,
          toVerse: mcq.toVerse,
          question: mcq.question,
          points: mcq.points
        }

        // Add dates if provided
        if (bulkEditDates.startDate) {
          const startDate = new Date(bulkEditDates.startDate)
          const utcStartDate = new Date(Date.UTC(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate(),
            0, 0, 0, 0
          ))
          updateData.startDate = utcStartDate.toISOString()
        }

        if (bulkEditDates.endDate) {
          const endDate = new Date(bulkEditDates.endDate)
          const utcEndDate = new Date(Date.UTC(
            endDate.getFullYear(),
            endDate.getMonth(),
            endDate.getDate(),
            23, 59, 59, 999
          ))
          updateData.endDate = utcEndDate.toISOString()
        }

        await dispatch(updateMCQ(mcq._id, updateData))
      }

      setBulkEditModalOpened(false)
      setBulkEditLoading(false)
      notifications.show({
        title: t('Success'),
        message: t('Group_dates_updated_successfully'),
        color: 'green'
      })
    } catch (error) {
      setBulkEditLoading(false)
      notifications.show({
        title: t('Error'),
        message: t('Failed_to_update_questions'),
        color: 'red'
      })
    }
  }

  // Get book name
  const getBookName = (book) => {
    if (!book) return '-'
    if (book.bookDetails && book.bookDetails.name) {
      return currentLang === 'ar' ? book.bookDetails.name.ar : book.bookDetails.name.en
    }
    if (book.bookId && book.bookId.name) {
      return currentLang === 'ar' ? book.bookId.name.ar : book.bookId.name.en
    }
    if (book.name) {
      return currentLang === 'ar' ? book.name.ar : book.name.en
    }
    return '-'
  }

  // Check if question is active today
  const isQuestionActiveToday = (mcq) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Start of today

    if (!mcq.startDate && !mcq.endDate) {
      return false // No dates set, not specifically active today
    }

    const startDate = mcq.startDate ? new Date(mcq.startDate) : null
    const endDate = mcq.endDate ? new Date(mcq.endDate) : null

    if (startDate && endDate) {
      // Both dates set - check if today is between them
      return today >= new Date(startDate.setHours(0, 0, 0, 0)) &&
             today <= new Date(endDate.setHours(0, 0, 0, 0))
    } else if (startDate) {
      // Only start date - check if today is on or after start
      return today >= new Date(startDate.setHours(0, 0, 0, 0))
    } else if (endDate) {
      // Only end date - check if today is on or before end
      return today <= new Date(endDate.setHours(0, 0, 0, 0))
    }

    return false
  }

  // Ensure mcqs is always an array
  const mcqsList = Array.isArray(mcqs) ? mcqs : []

  // Get unique chapters for filter dropdown
  const chapters = [...new Set(mcqsList.map(mcq => mcq.chapter))].sort((a, b) => a - b)

  // Group MCQs by chapter, fromVerse, and toVerse
  const groupedMCQs = mcqsList.reduce((groups, mcq) => {
    const chapter = mcq.chapter || 0
    const fromVerse = mcq.fromVerse || 0
    const toVerse = mcq.toVerse || 0
    const groupKey = `${chapter}-${fromVerse}-${toVerse}`

    if (!groups[groupKey]) {
      groups[groupKey] = {
        chapter,
        fromVerse,
        toVerse,
        questions: []
      }
    }
    groups[groupKey].questions.push(mcq)
    return groups
  }, {})

  // Sort groups by chapter, then fromVerse, then toVerse
  const sortedGroupKeys = Object.keys(groupedMCQs).sort((a, b) => {
    const [chapterA, fromA, toA] = a.split('-').map(Number)
    const [chapterB, fromB, toB] = b.split('-').map(Number)

    if (chapterA !== chapterB) return chapterA - chapterB
    if (fromA !== fromB) return fromA - fromB
    return toA - toB
  })

  // Render horizontal mode for mobile
  if (horizontal) {
    if (!selectedService) {
      return <Text size="xs" c="dimmed">{t('Please_select_a_service_from_header')}</Text>
    }
    if (!selectedBook) {
      return <Text size="xs" c="dimmed">{t('Please_select_a_book_from_the_Service_Books_section')}</Text>
    }
    if (mcqsLoading) {
      return <Loader size="sm" />
    }
    if (mcqsList.length === 0) {
      return <Text size="xs" c="dimmed">{t('No_questions_found_for_this_book')}</Text>
    }

    // Render questions horizontally grouped by chapter and verses
    return (
      <Group gap="md" wrap="nowrap" style={{ minWidth: 'max-content' }}>
        {sortedGroupKeys.map((groupKey) => {
          const group = groupedMCQs[groupKey]
          return (
            <Box key={groupKey} style={{ display: 'inline-block' }}>
              <Stack gap="xs" style={{ marginBottom: '8px' }}>
                <Badge color="blue" variant="filled" size="sm">
                  {t('Chapter')} {group.chapter} {group.fromVerse && `(${group.fromVerse}-${group.toVerse})`}
                </Badge>
              </Stack>
              <Group gap="xs" wrap="nowrap">
                {group.questions.map((mcq) => {
                const correctAnswer = mcq.choices?.find(c => c.check === true || c.isTrue === true)
                const correctAnswerText = correctAnswer
                  ? (currentLang === 'ar'
                      ? (correctAnswer.choice?.ar || correctAnswer.text?.ar)
                      : (correctAnswer.choice?.en || correctAnswer.text?.en))
                  : null
                const isSelected = selectedQuestionId === mcq._id

                return (
                  <Card
                    key={mcq._id}
                    shadow="sm"
                    radius="sm"
                    p="xs"
                    withBorder
                    style={{
                      cursor: 'pointer',
                      backgroundColor: isSelected ? 'var(--mantine-color-blue-0)' : 'white',
                      borderColor: isSelected ? 'var(--mantine-color-blue-5)' : undefined,
                      minWidth: '250px',
                      width: '250px',
                      height: '95px',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative'
                    }}
                    onClick={() => onSelectQuestion && onSelectQuestion(mcq._id)}
                  >
                    <ActionIcon
                      variant="light"
                      color="blue"
                      size="xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenModal(mcq)
                      }}
                      title={t('Edit_Question')}
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        zIndex: 1
                      }}
                    >
                      <FaEdit size={10} />
                    </ActionIcon>
                    <Stack gap={4} style={{ height: '100%', justifyContent: 'space-between' }}>
                      <Box>
                        <Text size="xs" fw={600} lineClamp={2} c={isSelected ? 'blue.7' : undefined}>
                          {currentLang === 'ar' ? mcq.question.ar : mcq.question.en}
                        </Text>
                        {correctAnswerText && (
                          <Group gap={4} wrap="nowrap" mt={4}>
                            <Text size="xs" c="green.8" fw={600} style={{ flexShrink: 0 }}>✓</Text>
                            <Text size="xs" c="green.7" fw={500} lineClamp={1} style={{ flex: 1 }}>
                              {correctAnswerText}
                            </Text>
                          </Group>
                        )}
                      </Box>
                      <Group gap="xs">
                        {isQuestionActiveToday(mcq) && (
                          <Badge size="xs" color="green" variant="filled">
                            ⭐ {t('Today')}
                          </Badge>
                        )}
                        <Badge size="xs" color="teal" variant="filled">
                          {mcq.points} pts
                        </Badge>
                      </Group>
                    </Stack>
                  </Card>
                  )
                })}
              </Group>
            </Box>
          )
        })}
      </Group>
    )
  }

  return (
    <Stack gap="sm">
      {/* Filters */}
      {selectedService && selectedBook && (
        <Stack gap="xs">
          <Group gap="xs" wrap="wrap">
            {chapters.length > 0 && (
              <Select
                placeholder={t('Filter_by_chapter')}
                value={selectedChapter}
                onChange={setSelectedChapter}
                data={[
                  { value: '', label: t('All_Chapters') },
                  ...chapters.map(ch => ({
                    value: ch.toString(),
                    label: `${t('Chapter')} ${ch}`
                  }))
                ]}
                leftSection={<FaListOl size={14} />}
                size="xs"
                style={{ flex: 1, minWidth: 120 }}
              />
            )}
            <Select
              placeholder={t('Status')}
              value={filterStatus}
              onChange={setFilterStatus}
              data={[
                { value: '', label: t('All') },
                { value: 'active', label: t('Active') },
                { value: 'inactive', label: t('Inactive') }
              ]}
              size="xs"
              style={{ flex: 1, minWidth: 100 }}
            />
            <NumberInput
              placeholder={t('Points')}
              value={filterPoints}
              onChange={setFilterPoints}
              min={0}
              size="xs"
              style={{ flex: 1, minWidth: 80 }}
            />
          </Group>
          <Group gap="xs" wrap="wrap">
            <DateInput
              placeholder={t('Start_Date')}
              value={filterStartDate}
              onChange={setFilterStartDate}
              size="xs"
              style={{ flex: 1, minWidth: 140 }}
              valueFormat="DD MMM YYYY"
              dateParser={(input) => {
                const parts = input.split('/')
                if (parts.length === 3) {
                  const day = parseInt(parts[0], 10)
                  const month = parseInt(parts[1], 10) - 1
                  const year = parseInt(parts[2], 10)
                  return new Date(year, month, day)
                }
                return null
              }}
            />
            <DateInput
              placeholder={t('End_Date')}
              value={filterEndDate}
              onChange={setFilterEndDate}
              size="xs"
              style={{ flex: 1, minWidth: 140 }}
              valueFormat="DD MMM YYYY"
              dateParser={(input) => {
                const parts = input.split('/')
                if (parts.length === 3) {
                  const day = parseInt(parts[0], 10)
                  const month = parseInt(parts[1], 10) - 1
                  const year = parseInt(parts[2], 10)
                  return new Date(year, month, day)
                }
                return null
              }}
            />
            <Button
              leftSection={<FaPlus />}
              onClick={() => handleOpenModal()}
              variant="filled"
              size="sm"
            >
              {t('Add_Question')}
            </Button>
          </Group>
        </Stack>
      )}

      {/* Questions List */}
      {!selectedService ? (
        <Alert icon={<FaBible size={16} />} color="blue" p="xs">
          <Text size="xs" style={{ lineHeight: 1.4, wordBreak: 'break-word' }}>
            {t('Please_select_a_service_from_header')}
          </Text>
        </Alert>
      ) : !selectedBook ? (
        <Alert icon={<FaBook size={16} />} color="blue" p="xs">
          <Text size="xs" style={{ lineHeight: 1.4, wordBreak: 'break-word' }}>
            {t('Please_select_a_book_from_the_Service_Books_section')}
          </Text>
        </Alert>
      ) : mcqsLoading ? (
        <Card shadow="sm" radius="md" p="xl" withBorder>
          <Stack align="center" gap="md">
            <Loader size="lg" />
            <Text c="dimmed">{t('Loading_questions')}</Text>
          </Stack>
        </Card>
      ) : mcqsList.length === 0 ? (
        <Card shadow="sm" radius="md" p="xl" withBorder>
          <Stack align="center" gap="md">
            <ThemeIcon size="xl" radius="md" variant="light" color="gray">
              <FaQuestionCircle size={30} />
            </ThemeIcon>
            <Text size="lg" c="dimmed" ta="center">
              {t('No_questions_found_for_this_book')}
            </Text>
          </Stack>
        </Card>
      ) : (
        // Admin View - Grouped by chapter, fromVerse, toVerse
        <Stack gap="md">
          {sortedGroupKeys.map((groupKey) => {
            const group = groupedMCQs[groupKey]
            return (
              <Stack gap="xs" key={groupKey}>
                <Group gap="xs" align="center" justify="space-between">
                  <Group gap="xs">
                    <Badge color="blue" variant="filled" size="sm">
                      {t('Chapter')} {group.chapter} {group.fromVerse && `(v.${group.fromVerse}-${group.toVerse})`}
                    </Badge>
                    <Text size="xs" c="dimmed">
                      ({group.questions.length} {t('questions')})
                    </Text>
                  </Group>
                  <Button
                    size="xs"
                    variant="light"
                    onClick={() => handleOpenBulkEditModal(groupKey)}
                    leftSection={<FaEdit size={12} />}
                  >
                    {t('Edit_Group_Dates')}
                  </Button>
                </Group>
                <Stack gap="xs">
                  {group.questions.map((mcq) => {
                  // Find correct answer - API uses 'check' property and 'choice' for text
                  const correctAnswer = mcq.choices?.find(c => c.check === true || c.isTrue === true)
                  const correctAnswerText = correctAnswer
                    ? (currentLang === 'ar'
                        ? (correctAnswer.choice?.ar || correctAnswer.text?.ar)
                        : (correctAnswer.choice?.en || correctAnswer.text?.en))
                    : null

                  const isSelected = selectedQuestionId === mcq._id
                  return (
                    <Card
                      key={mcq._id}
                      shadow="sm"
                      radius="sm"
                      p="xs"
                      withBorder
                      style={{
                        cursor: 'pointer',
                        backgroundColor: isSelected ? 'var(--mantine-color-blue-0)' : 'white',
                        borderColor: isSelected ? 'var(--mantine-color-blue-5)' : undefined
                      }}
                      onClick={() => onSelectQuestion && onSelectQuestion(mcq._id)}
                    >
                      <Group justify="space-between" wrap="wrap" gap="xs">
                        <Stack gap={4} style={{ flex: 1, minWidth: 200 }}>
                          <Text size="sm" fw={600} lineClamp={2} c={isSelected ? 'blue.7' : undefined}>
                            {currentLang === 'ar' ? mcq.question.ar : mcq.question.en}
                          </Text>
                          {correctAnswerText && (
                            <Group gap={4} wrap="nowrap">
                              <Text size="xs" c="green.8" fw={600} style={{ flexShrink: 0 }}>
                                ✓
                              </Text>
                              <Text size="xs" c="green.7" fw={500} lineClamp={1} style={{ flex: 1 }}>
                                {correctAnswerText}
                              </Text>
                            </Group>
                          )}
                          <Group gap="xs">
                            {isQuestionActiveToday(mcq) && (
                              <Badge size="xs" color="green" variant="filled">
                                ⭐ {t('Today')}
                              </Badge>
                            )}
                            <Badge size="xs" color="teal" variant="filled">
                              {mcq.points} pts
                            </Badge>
                            {mcq.choices && (
                              <Badge size="xs" color="orange" variant="light">
                                {mcq.choices.length} choices
                              </Badge>
                            )}
                          </Group>
                        </Stack>
                        <ActionIcon
                          variant="light"
                          color="blue"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleOpenModal(mcq)
                          }}
                          title={t('Edit_Question')}
                        >
                          <FaEdit size={12} />
                        </ActionIcon>
                      </Group>
                    </Card>
                    )
                  })}
                </Stack>
              </Stack>
            )
          })}
        </Stack>
      )}

      {/* Add/Edit Modal */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={
          <Group gap="xs">
            <FaQuestionCircle />
            <Text fw={600}>
              {editingMCQ ? t('Edit_Question') : t('Add_Question')}
            </Text>
          </Group>
        }
        size="xl"
      >
        <Stack gap="md">
          {/* Question fields */}
          <Stack gap="md">
            <Group grow>
              <NumberInput
                label={t('Chapter')}
                placeholder={t('Enter_chapter_number')}
                min={1}
                value={formData.chapter}
                onChange={(value) => setFormData({ ...formData, chapter: value })}
                leftSection={<FaListOl size={14} />}
                required
              />
              <NumberInput
                label={t('From_Verse')}
                placeholder={t('Start_verse')}
                min={1}
                value={formData.fromVerse}
                onChange={(value) => setFormData({ ...formData, fromVerse: value })}
              />
              <NumberInput
                label={t('To_Verse')}
                placeholder={t('End_verse')}
                min={1}
                value={formData.toVerse}
                onChange={(value) => setFormData({ ...formData, toVerse: value })}
              />
            </Group>

            <Textarea
              label={t('Question_English')}
              placeholder={t('Enter_question_in_English')}
              value={formData.question.en}
              onChange={(e) => setFormData({
                ...formData,
                question: { ...formData.question, en: e.target.value }
              })}
              minRows={2}
              required
            />

            <Textarea
              label={t('Question_Arabic')}
              placeholder={t('Enter_question_in_Arabic')}
              value={formData.question.ar}
              onChange={(e) => setFormData({
                ...formData,
                question: { ...formData.question, ar: e.target.value }
              })}
              minRows={2}
              required
            />

            <NumberInput
              label={t('Points')}
              placeholder={t('Enter_points')}
              min={1}
              max={100}
              value={formData.points}
              onChange={(value) => setFormData({ ...formData, points: value })}
              description={t('Points_awarded_for_correct_answer')}
            />

            <Group grow>
              <DateInput
                label={t('Start_Date')}
                placeholder={t('Select_start_date')}
                value={formData.startDate}
                onChange={(value) => setFormData({ ...formData, startDate: value })}
                valueFormat="DD MMM YYYY"
                description={t('Question_active_from_this_date')}
                dateParser={(input) => {
                  const parts = input.split('/')
                  if (parts.length === 3) {
                    const day = parseInt(parts[0], 10)
                    const month = parseInt(parts[1], 10) - 1
                    const year = parseInt(parts[2], 10)
                    return new Date(year, month, day)
                  }
                  return null
                }}
              />
              <DateInput
                label={t('End_Date')}
                placeholder={t('Select_end_date')}
                value={formData.endDate}
                onChange={(value) => setFormData({ ...formData, endDate: value })}
                valueFormat="DD MMM YYYY"
                description={t('Question_active_until_this_date')}
                dateParser={(input) => {
                  const parts = input.split('/')
                  if (parts.length === 3) {
                    const day = parseInt(parts[0], 10)
                    const month = parseInt(parts[1], 10) - 1
                    const year = parseInt(parts[2], 10)
                    return new Date(year, month, day)
                  }
                  return null
                }}
              />
            </Group>

            {/* Choices section - only show when creating */}
            {!editingMCQ && (
              <Stack gap="sm">
                <Divider label={t('Choices')} labelPosition="center" />
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">
                    {t('Enter_choices_and_mark_correct_answer')}
                  </Text>
                  <Button
                    leftSection={<FaPlus size={12} />}
                    onClick={addChoice}
                    variant="light"
                    size="xs"
                  >
                    {t('Add_Choice')}
                  </Button>
                </Group>

                {formData.choices.map((choice, index) => (
                  <Paper key={index} p="sm" withBorder>
                    <Stack gap="sm">
                      <Group justify="space-between">
                        <Text fw={500}>
                          {t('Choice')} {index + 1}
                        </Text>
                        <Checkbox
                          label={t('Correct_Answer')}
                          checked={choice.isTrue}
                          onChange={(e) => updateChoice(index, 'isTrue', e.target.checked)}
                          color="green"
                        />
                      </Group>

                      <TextInput
                        placeholder={t('Choice_text_in_English')}
                        value={choice.text?.en || ''}
                        onChange={(e) => updateChoice(index, 'en', e.target.value)}
                      />

                      <TextInput
                        placeholder={t('Choice_text_in_Arabic')}
                        value={choice.text?.ar || ''}
                        onChange={(e) => updateChoice(index, 'ar', e.target.value)}
                      />
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            )}
          </Stack>

          <Divider />

          <Group justify="flex-end">
            <Button variant="default" onClick={() => setModalOpened(false)}>
              {t('Cancel')}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                !formData.question.en || !formData.question.ar ||
                !formData.chapter || !formData.service_bookId
              }
            >
              {editingMCQ ? t('Update') : t('Create')}
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Bulk Edit Modal for Chapter Dates */}
      <Modal
        opened={bulkEditModalOpened}
        onClose={() => setBulkEditModalOpened(false)}
        title={
          <Group gap="xs">
            <FaEdit />
            <Text fw={600}>
              {t('Edit_Group_Dates')} - {bulkEditChapter && groupedMCQs[bulkEditChapter] && (
                <>
                  {t('Chapter')} {groupedMCQs[bulkEditChapter].chapter}
                  {groupedMCQs[bulkEditChapter].fromVerse && ` (v.${groupedMCQs[bulkEditChapter].fromVerse}-${groupedMCQs[bulkEditChapter].toVerse})`}
                </>
              )}
            </Text>
          </Group>
        }
        size="md"
      >
        <Stack gap="md">
          <Alert color="blue" p="xs">
            <Text size="xs">
              {t('This_will_update_dates_for_all')} {groupedMCQs[bulkEditChapter]?.questions.length || 0} {t('questions_in_this_group')}
            </Text>
          </Alert>

          <DateInput
            label={t('Start_Date')}
            placeholder={t('Select_start_date')}
            value={bulkEditDates.startDate}
            onChange={(value) => setBulkEditDates({ ...bulkEditDates, startDate: value })}
            valueFormat="DD MMM YYYY"
            description={t('Leave_empty_to_keep_current_dates')}
            dateParser={(input) => {
              const parts = input.split('/')
              if (parts.length === 3) {
                const day = parseInt(parts[0], 10)
                const month = parseInt(parts[1], 10) - 1
                const year = parseInt(parts[2], 10)
                return new Date(year, month, day)
              }
              return null
            }}
            clearable
          />

          <DateInput
            label={t('End_Date')}
            placeholder={t('Select_end_date')}
            value={bulkEditDates.endDate}
            onChange={(value) => setBulkEditDates({ ...bulkEditDates, endDate: value })}
            valueFormat="DD MMM YYYY"
            description={t('Leave_empty_to_keep_current_dates')}
            dateParser={(input) => {
              const parts = input.split('/')
              if (parts.length === 3) {
                const day = parseInt(parts[0], 10)
                const month = parseInt(parts[1], 10) - 1
                const year = parseInt(parts[2], 10)
                return new Date(year, month, day)
              }
              return null
            }}
            clearable
          />

          <Divider />

          <Group justify="flex-end">
            <Button
              variant="default"
              onClick={() => setBulkEditModalOpened(false)}
              disabled={bulkEditLoading}
            >
              {t('Cancel')}
            </Button>
            <Button
              onClick={handleBulkEditSubmit}
              disabled={(!bulkEditDates.startDate && !bulkEditDates.endDate) || bulkEditLoading}
              loading={bulkEditLoading}
            >
              {t('Update_All_Questions')}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  )
}

export default MCQManagement