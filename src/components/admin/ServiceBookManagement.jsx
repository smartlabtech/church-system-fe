import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Table,
  Button,
  Group,
  Modal,
  TextInput,
  NumberInput,
  Card,
  Stack,
  Title,
  Badge,
  ActionIcon,
  Loader,
  Text,
  Paper,
  ScrollArea,
  Divider,
  Select,
  Textarea,
  Tooltip
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useTranslation } from 'react-i18next'
import {
  FaEdit,
  FaPlus,
  FaBook,
  FaSortNumericDown,
  FaSortNumericUp,
  FaListOl,
  FaInfoCircle
} from 'react-icons/fa'
import {
  listServiceBooks,
  createServiceBook,
  updateServiceBook
} from '../../actions/serviceBookActions'
import { listBooks } from '../../actions/bookActions'
import { listClasses } from '../../actions/classActions'
import {
  SERVICEBOOK_CREATE_RESET,
  SERVICEBOOK_UPDATE_RESET
} from '../../constants/serviceBookConstants'

const ServiceBookManagement = ({ serviceId, selectedClass }) => {
  const dispatch = useDispatch()
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language

  const [modalOpened, setModalOpened] = useState(false)
  const [editingServiceBook, setEditingServiceBook] = useState(null)
  const [sortAscending, setSortAscending] = useState(true)

  // Form state
  const [formData, setFormData] = useState({
    serviceId: serviceId || '',
    classId: '',
    bookId: '',
    order: 0,
    introduction: ''
  })

  // Redux state
  const serviceBookList = useSelector((state) => state.serviceBookList)
  const { loading, serviceBooks, error } = serviceBookList

  const serviceBookCreate = useSelector((state) => state.serviceBookCreate)
  const { success: createSuccess, error: createError } = serviceBookCreate

  const serviceBookUpdate = useSelector((state) => state.serviceBookUpdate)
  const { success: updateSuccess, error: updateError } = serviceBookUpdate

  const bookList = useSelector((state) => state.bookList)
  const { books } = bookList

  const classList = useSelector((state) => state.classList)
  const { classes } = classList

  // Load service books when service or class changes
  useEffect(() => {
    if (serviceId) {
      const queryParams = { serviceId }
      if (selectedClass) {
        queryParams.classId = selectedClass._id
      }
      dispatch(listServiceBooks(queryParams))
    }
  }, [dispatch, serviceId, selectedClass])

  // Load books and classes for selection
  useEffect(() => {
    dispatch(listBooks())
    if (serviceId) {
      dispatch(listClasses(serviceId))
    }
  }, [dispatch, serviceId])

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
      serviceId: serviceId || '',
      classId: selectedClass ? selectedClass._id : '',
      bookId: '',
      order: 0,
      introduction: ''
    })
    setEditingServiceBook(null)
  }

  const handleOpenModal = (serviceBook = null) => {
    if (serviceBook) {
      setEditingServiceBook(serviceBook)
      setFormData({
        serviceId: serviceBook.serviceId || serviceId,
        classId: serviceBook.classId || '',
        bookId: serviceBook.bookId?._id || serviceBook.bookId || '',
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

    // Only add classId if it has a value
    if (formData.classId) {
      serviceBookData.classId = formData.classId
    }

    if (editingServiceBook) {
      dispatch(updateServiceBook(editingServiceBook._id, serviceBookData))
    } else {
      dispatch(createServiceBook(serviceBookData))
    }
  }

  // Sort service books by order
  const sortedServiceBooks = Array.isArray(serviceBooks)
    ? [...serviceBooks].sort((a, b) => {
        const orderA = a.order || 0
        const orderB = b.order || 0
        return sortAscending ? orderA - orderB : orderB - orderA
      })
    : []

  // Filter classes for current service
  const serviceClasses = Array.isArray(classes)
    ? classes.filter(cls => cls.serviceId === serviceId)
    : []

  // Get book name based on current language
  const getBookName = (book) => {
    if (!book) return '-'
    if (typeof book === 'object' && book.name) {
      return currentLang === 'ar' ? book.name.ar : book.name.en
    }
    // If bookId is just an ID string, find the book
    const foundBook = books?.find(b => b._id === book)
    if (foundBook) {
      return currentLang === 'ar' ? foundBook.name.ar : foundBook.name.en
    }
    return '-'
  }

  // Get class name
  const getClassName = (classId) => {
    const cls = serviceClasses.find(c => c._id === classId)
    return cls ? `${cls.code} - ${cls.name}` : t('All_Classes')
  }

  if (!serviceId) {
    return (
      <Card shadow="sm" radius="md" p="md" withBorder>
        <Text ta="center" c="dimmed">
          {t('Select_a_service_to_manage_books')}
        </Text>
      </Card>
    )
  }

  return (
    <Stack gap="lg">
      {/* Header */}
      <Paper shadow="sm" radius="md" p="md" withBorder>
        <Group justify="space-between">
          <div>
            <Title order={3} c="primary.6">
              <Group gap="xs">
                <FaBook size={20} />
                {t('Service_Books')}
              </Group>
            </Title>
            <Text size="sm" c="dimmed" mt={4}>
              {selectedClass
                ? t('Books_for_class') + ': ' + getClassName(selectedClass._id)
                : t('Books_for_entire_service')}
            </Text>
          </div>
          <Button
            leftSection={<FaPlus />}
            onClick={() => handleOpenModal()}
            variant="filled"
            size="sm"
          >
            {t('Add_Book')}
          </Button>
        </Group>
      </Paper>

      {/* Sort Controls */}
      <Paper shadow="sm" radius="md" p="sm" withBorder>
        <Group>
          <Button
            variant="light"
            size="sm"
            leftSection={
              sortAscending
                ? <FaSortNumericDown />
                : <FaSortNumericUp />
            }
            onClick={() => setSortAscending(!sortAscending)}
          >
            {t('Order')}: {sortAscending ? '1-9' : '9-1'}
          </Button>
          <Badge color="blue" variant="light">
            {t('Total')}: {sortedServiceBooks.length} {t('books')}
          </Badge>
        </Group>
      </Paper>

      {/* Books Table */}
      <Paper shadow="sm" radius="md" p="md" withBorder>
        {loading ? (
          <Stack align="center" py="xl">
            <Loader size="lg" />
            <Text c="dimmed">{t('Loading_service_books')}</Text>
          </Stack>
        ) : error ? (
          <Text c="red" ta="center" py="xl">
            {error}
          </Text>
        ) : (
          <ScrollArea>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>{t('Order')}</Table.Th>
                  <Table.Th>{t('Book')}</Table.Th>
                  <Table.Th>{t('Class')}</Table.Th>
                  <Table.Th>{t('Introduction')}</Table.Th>
                  <Table.Th>{t('Actions')}</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {sortedServiceBooks.map((serviceBook) => (
                  <Table.Tr key={serviceBook._id}>
                    <Table.Td>
                      <Badge color="gray" variant="filled" leftSection={<FaListOl size={10} />}>
                        {serviceBook.order || 0}
                      </Badge>
                    </Table.Td>
                    <Table.Td fw={600}>
                      {getBookName(serviceBook.bookId)}
                    </Table.Td>
                    <Table.Td>
                      <Badge color="blue" variant="light">
                        {serviceBook.classId ? getClassName(serviceBook.classId) : t('All_Classes')}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      {serviceBook.introduction ? (
                        <Tooltip label={serviceBook.introduction} multiline width={300}>
                          <Group gap={4}>
                            <FaInfoCircle size={14} />
                            <Text size="sm" lineClamp={1}>
                              {serviceBook.introduction}
                            </Text>
                          </Group>
                        </Tooltip>
                      ) : (
                        <Text c="dimmed" size="sm">-</Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <ActionIcon
                        variant="light"
                        color="blue"
                        onClick={() => handleOpenModal(serviceBook)}
                      >
                        <FaEdit />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
            {sortedServiceBooks.length === 0 && (
              <Text ta="center" py="xl" c="dimmed">
                {t('No_books_assigned_to_this_service')}
              </Text>
            )}
          </ScrollArea>
        )}
      </Paper>

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

export default ServiceBookManagement