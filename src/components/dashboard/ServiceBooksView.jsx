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
  ScrollArea,
  Group,
  Select,
  ThemeIcon,
  SimpleGrid,
  Accordion,
  Tooltip,
  Box,
  Button,
  Modal,
  TextInput,
  NumberInput,
  Textarea,
  Divider,
  ActionIcon,
  Table
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useTranslation } from 'react-i18next'
import {
  FaBook,
  FaListOl,
  FaInfoCircle,
  FaChurch,
  FaGraduationCap,
  FaBookOpen,
  FaPlus,
  FaEdit,
  FaSortNumericDown,
  FaSortNumericUp
} from 'react-icons/fa'
import {
  listServiceBooks,
  createServiceBook,
  updateServiceBook
} from '../../actions/serviceBookActions'
import { listServices } from '../../actions/serviceActions'
import { listClasses } from '../../actions/classActions'
import { listBooks } from '../../actions/bookActions'
import {
  SERVICEBOOK_CREATE_RESET,
  SERVICEBOOK_UPDATE_RESET
} from '../../constants/serviceBookConstants'

const ServiceBooksView = ({ onSelectBook, selectedBookId, horizontal = false }) => {
  const dispatch = useDispatch()
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language

  // Get selected service from Redux (already selected in header)
  const servantInList = useSelector((state) => state.servantInList)
  const { selected } = servantInList
  const selectedService = selected?.service?._id || null

  const [selectedClass, setSelectedClass] = useState('')
  const [modalOpened, setModalOpened] = useState(false)
  const [editingServiceBook, setEditingServiceBook] = useState(null)
  const [sortAscending, setSortAscending] = useState(true)
  const [viewMode, setViewMode] = useState('cards') // 'cards' or 'table'

  // Form state
  const [formData, setFormData] = useState({
    serviceId: '',
    classId: '',
    bookId: '',
    order: 0,
    introduction: ''
  })

  // Redux state
  const serviceBookList = useSelector((state) => state.serviceBookList)
  const { loading: booksLoading, serviceBooks } = serviceBookList

  const serviceList = useSelector((state) => state.serviceList)
  const { loading: servicesLoading, services } = serviceList

  const classList = useSelector((state) => state.classList)
  const { classes } = classList

  const bookList = useSelector((state) => state.bookList)
  const { books } = bookList

  const serviceBookCreate = useSelector((state) => state.serviceBookCreate)
  const { success: createSuccess, error: createError } = serviceBookCreate

  const serviceBookUpdate = useSelector((state) => state.serviceBookUpdate)
  const { success: updateSuccess, error: updateError } = serviceBookUpdate

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  // Load books on mount
  useEffect(() => {
    dispatch(listBooks())
  }, [dispatch])

  // Load classes when service is selected
  useEffect(() => {
    if (selectedService) {
      dispatch(listClasses(selectedService))
    }
  }, [dispatch, selectedService])

  // Load service books when service or class changes
  useEffect(() => {
    if (selectedService) {
      const queryParams = { serviceId: selectedService }
      if (selectedClass) {
        queryParams.classId = selectedClass
      }
      dispatch(listServiceBooks(queryParams))
    }
  }, [dispatch, selectedService, selectedClass])

  // Handle success messages
  useEffect(() => {
    if (createSuccess) {
      notifications.show({
        title: t('Success'),
        message: t('Service_Book_created_successfully'),
        color: 'green'
      })
      setModalOpened(false)
      resetForm()
      dispatch({ type: SERVICEBOOK_CREATE_RESET })
    }

    if (updateSuccess) {
      notifications.show({
        title: t('Success'),
        message: t('Service_Book_updated_successfully'),
        color: 'green'
      })
      setModalOpened(false)
      resetForm()
      dispatch({ type: SERVICEBOOK_UPDATE_RESET })
    }
  }, [createSuccess, updateSuccess, dispatch, t])

  // Handle errors
  useEffect(() => {
    if (createError) {
      notifications.show({
        title: t('Error'),
        message: createError,
        color: 'red'
      })
    }

    if (updateError) {
      notifications.show({
        title: t('Error'),
        message: updateError,
        color: 'red'
      })
    }
  }, [createError, updateError, t])

  const resetForm = () => {
    setFormData({
      serviceId: selectedService || '',
      classId: selectedClass || '',
      bookId: '',
      order: 0,
      introduction: ''
    })
    setEditingServiceBook(null)
  }

  const handleOpenModal = (serviceBook = null) => {
    if (serviceBook) {
      setEditingServiceBook(serviceBook)

      // Extract bookId from bookDetails or bookId
      let bookId = ''
      if (serviceBook.bookDetails && serviceBook.bookDetails._id) {
        bookId = serviceBook.bookDetails._id
      } else if (serviceBook.bookId && typeof serviceBook.bookId === 'object') {
        bookId = serviceBook.bookId._id
      } else if (serviceBook.bookId) {
        bookId = serviceBook.bookId
      }

      setFormData({
        serviceId: serviceBook.serviceId || selectedService,
        classId: serviceBook.classId || '',
        bookId: bookId,
        order: serviceBook.order || 0,
        introduction: serviceBook.introduction || ''
      })
    } else {
      resetForm()
    }
    setModalOpened(true)
  }

  const handleSubmit = () => {
    const serviceBookData = {
      serviceId: formData.serviceId,
      bookId: formData.bookId,
      order: Number(formData.order) || 0,
      introduction: formData.introduction
    }

    if (formData.classId) {
      serviceBookData.classId = formData.classId
    }

    if (editingServiceBook) {
      dispatch(updateServiceBook(editingServiceBook._id, serviceBookData))
    } else {
      dispatch(createServiceBook(serviceBookData))
    }
  }

  // Filter classes for selected service
  const serviceClasses = Array.isArray(classes)
    ? classes.filter(cls => cls.serviceId === selectedService)
    : []

  // Sort and group service books
  const sortedServiceBooks = Array.isArray(serviceBooks)
    ? [...serviceBooks].sort((a, b) => (a.order || 0) - (b.order || 0))
    : []

  // Group books by class
  const groupedBooks = sortedServiceBooks.reduce((groups, book) => {
    const classId = book.classId || 'all'
    if (!groups[classId]) {
      groups[classId] = []
    }
    groups[classId].push(book)
    return groups
  }, {})

  // Get book name based on current language
  const getBookName = (book) => {
    if (!book) return '-'

    // Handle the actual API response structure with bookDetails
    if (book.bookDetails && book.bookDetails.name) {
      return currentLang === 'ar' ? book.bookDetails.name.ar : book.bookDetails.name.en
    }

    // Fallback for old structure or direct book object
    if (book.bookId && book.bookId.name) {
      return currentLang === 'ar' ? book.bookId.name.ar : book.bookId.name.en
    }

    // Direct book name
    if (book.name) {
      return currentLang === 'ar' ? book.name.ar : book.name.en
    }

    return '-'
  }

  // Get class name
  const getClassName = (classId, book) => {
    if (classId === 'all') return t('General_Books')

    // If book has classDetails, use it directly
    if (book && book.classDetails) {
      return `${book.classDetails.code} - ${book.classDetails.name}`
    }

    // Fallback to finding from serviceClasses
    const cls = serviceClasses.find(c => c._id === classId)
    return cls ? `${cls.code} - ${cls.name}` : t('Unknown_Class')
  }

  const renderBookCard = (book) => {
    const isSelected = selectedBookId === book._id
    return (
      <Card
        key={book._id}
        shadow="sm"
        padding="xs"
        radius="sm"
        withBorder
        style={{
          position: 'relative',
          cursor: 'pointer',
          backgroundColor: isSelected ? 'var(--mantine-color-blue-0)' : 'white',
          borderColor: isSelected ? 'var(--mantine-color-blue-5)' : undefined
        }}
        onClick={() => onSelectBook && onSelectBook(book._id)}
      >
        <Group justify="space-between" wrap="wrap" gap="xs">
          <Group gap="xs" style={{ flex: 1 }}>
            <ThemeIcon size="sm" radius="sm" variant="light" color={isSelected ? 'blue' : 'gray'}>
              <FaBookOpen size={14} />
            </ThemeIcon>
            <Stack gap={2} style={{ flex: 1 }}>
              <Text fw={600} size="sm" lineClamp={1} c={isSelected ? 'blue.7' : undefined}>
                {getBookName(book)}
              </Text>
              {book.bookId?.chapters && (
                <Badge color="blue" variant="light" size="xs">
                  {book.bookId.chapters} Ch
                </Badge>
              )}
            </Stack>
          </Group>
          <ActionIcon
            variant="light"
            color="blue"
            size="sm"
            radius="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleOpenModal(book)
            }}
          >
            <FaEdit size={12} />
          </ActionIcon>
        </Group>
      </Card>
    )
  }

  // For horizontal mode, render without controls
  if (horizontal) {
    if (!selectedService) {
      return (
        <Text size="xs" c="dimmed">{t('Please_select_a_service')}</Text>
      )
    }
    if (booksLoading) {
      return <Loader size="sm" />
    }
    if (sortedServiceBooks.length === 0) {
      return (
        <Text size="xs" c="dimmed">{t('No_books_assigned_to_this_service')}</Text>
      )
    }
    // Render books horizontally
    return (
      <>
        {sortedServiceBooks.map(book => (
          <Box key={book._id} style={{ minWidth: '200px', width: '200px' }}>
            {renderBookCard(book)}
          </Box>
        ))}
      </>
    )
  }

  return (
    <Stack gap="lg">
      {/* Controls */}
      {selectedService && (
        <Group justify="space-between" wrap="nowrap" gap="xs">
          <Select
            placeholder={t('Filter_by_class')}
            value={selectedClass}
            onChange={setSelectedClass}
            data={[
              { value: '', label: t('All_Classes') },
              ...(serviceClasses.map(cls => ({
                value: cls._id,
                label: `${cls.code} - ${cls.name}`
              })) || [])
            ]}
            leftSection={<FaGraduationCap size={14} />}
            clearable
            size="xs"
            style={{ flex: 1, minWidth: 0 }}
          />
          <Button
            leftSection={<FaPlus />}
            onClick={() => handleOpenModal()}
            variant="filled"
            size="sm"
          >
            {t('Add_Book')}
          </Button>
        </Group>
      )}

      {/* Content */}
      {!selectedService ? (
        <Card shadow="sm" radius="md" p="xl" withBorder>
          <Stack align="center" gap="md">
            <ThemeIcon size="xl" radius="md" variant="light" color="blue">
              <FaChurch size={30} />
            </ThemeIcon>
            <Text size="lg" c="dimmed" ta="center">
              {t('Please_select_a_service_from_the_header_above')}
            </Text>
            <Text size="sm" c="dimmed" ta="center">
              {t('Click_on_the_service_selector_in_the_page_header')}
            </Text>
          </Stack>
        </Card>
      ) : booksLoading ? (
        <Card shadow="sm" radius="md" p="xl" withBorder>
          <Stack align="center" gap="md">
            <Loader size="lg" />
            <Text c="dimmed">{t('Loading_service_books')}</Text>
          </Stack>
        </Card>
      ) : sortedServiceBooks.length === 0 ? (
        <Card shadow="sm" radius="md" p="xl" withBorder>
          <Stack align="center" gap="md">
            <ThemeIcon size="xl" radius="md" variant="light" color="gray">
              <FaBook size={30} />
            </ThemeIcon>
            <Text size="lg" c="dimmed" ta="center">
              {t('No_books_assigned_to_this_service')}
            </Text>
          </Stack>
        </Card>
      ) : (
        // Show all books in a simple grid
        <SimpleGrid cols={{ base: 1 }} spacing="xs">
          {sortedServiceBooks.map(book => renderBookCard(book))}
        </SimpleGrid>
      )}

      {/* Add/Edit Modal */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={
          <Title order={3}>
            <Group gap="xs">
              <FaBook />
              {editingServiceBook ? t('Edit_Service_Book') : t('Add_Service_Book')}
            </Group>
          </Title>
        }
        size="md"
      >
        <Stack gap="md">
          <Select
            label={t('Book')}
            placeholder={t('Select_a_book')}
            required
            value={formData.bookId}
            onChange={(value) => setFormData({ ...formData, bookId: value })}
            data={
              books?.map(book => ({
                value: book._id,
                label: currentLang === 'ar'
                  ? `${book.name.ar} (${book.name.en})`
                  : `${book.name.en} (${book.name.ar})`
              })) || []
            }
            searchable
            nothingFoundMessage={t('No_books_found')}
          />

          <Select
            label={t('Class')}
            placeholder={t('Select_a_class_optional')}
            value={formData.classId}
            onChange={(value) => setFormData({ ...formData, classId: value })}
            data={[
              { value: '', label: t('All_Classes') },
              ...(serviceClasses.map(cls => ({
                value: cls._id,
                label: `${cls.code} - ${cls.name}`
              })) || [])
            ]}
            clearable
            description={t('Leave_empty_for_all_classes')}
          />

          <NumberInput
            label={t('Order')}
            placeholder={t('Enter_display_order')}
            min={0}
            value={formData.order}
            onChange={(value) => setFormData({ ...formData, order: value })}
            leftSection={<FaListOl size={14} />}
            description={t('Books_will_be_sorted_by_this_number')}
          />

          <Textarea
            label={t('Introduction')}
            placeholder={t('Enter_introduction_or_notes')}
            value={formData.introduction}
            onChange={(e) => setFormData({ ...formData, introduction: e.target.value })}
            minRows={3}
            description={t('Optional_introduction_or_notes')}
          />

          <Divider />

          <Group justify="flex-end">
            <Button variant="default" onClick={() => setModalOpened(false)}>
              {t('Cancel')}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.bookId || !formData.serviceId}
            >
              {editingServiceBook ? t('Update') : t('Create')}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  )
}

export default ServiceBooksView