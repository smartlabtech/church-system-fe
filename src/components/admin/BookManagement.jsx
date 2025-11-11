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
  Container,
  ScrollArea,
  Divider,
  Select,
  Grid,
  Drawer,
  Tooltip,
  Box
} from '@mantine/core'
import { useMediaQuery, useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { useTranslation } from 'react-i18next'
import {
  FaEdit,
  FaPlus,
  FaBook,
  FaSortAlphaDown,
  FaSortAlphaUp,
  FaListOl,
  FaFilter
} from 'react-icons/fa'
import {
  listBooks,
  createBook,
  updateBook
} from '../../actions/bookActions'
import {
  BOOK_CREATE_RESET,
  BOOK_UPDATE_RESET,
  SORT_PROPERTY,
  SORT_TYPE
} from '../../constants/bookConstants'

const BookManagement = () => {
  const dispatch = useDispatch()
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language
  const isMobile = useMediaQuery('(max-width: 768px)')

  const [modalOpened, setModalOpened] = useState(false)
  const [sortDrawerOpened, { open: openSortDrawer, close: closeSortDrawer }] = useDisclosure(false)
  const [editingBook, setEditingBook] = useState(null)
  const [sortConfig, setSortConfig] = useState({
    sortProperty: SORT_PROPERTY.NAME,
    sortType: SORT_TYPE.ASCENDING
  })

  // Form state
  const [formData, setFormData] = useState({
    name: {
      ar: '',
      en: ''
    },
    chapters: ''
  })

  // Redux state
  const bookList = useSelector((state) => state.bookList)
  const { loading, books, error } = bookList

  const bookCreate = useSelector((state) => state.bookCreate)
  const { success: createSuccess, error: createError } = bookCreate

  const bookUpdate = useSelector((state) => state.bookUpdate)
  const { success: updateSuccess, error: updateError } = bookUpdate

  // Load books on mount
  useEffect(() => {
    dispatch(listBooks(sortConfig))
  }, [dispatch, sortConfig])

  // Handle success messages
  useEffect(() => {
    if (createSuccess) {
      notifications.show({
        title: t('Success'),
        message: t('Book_created_successfully'),
        color: 'green'
      })
      setModalOpened(false)
      resetForm()
      dispatch({ type: BOOK_CREATE_RESET })
    }

    if (updateSuccess) {
      notifications.show({
        title: t('Success'),
        message: t('Book_updated_successfully'),
        color: 'green'
      })
      setModalOpened(false)
      resetForm()
      dispatch({ type: BOOK_UPDATE_RESET })
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
      name: {
        ar: '',
        en: ''
      },
      chapters: ''
    })
    setEditingBook(null)
  }

  const handleOpenModal = (book = null) => {
    if (book) {
      setEditingBook(book)
      setFormData({
        name: {
          ar: book.name?.ar || '',
          en: book.name?.en || ''
        },
        chapters: book.chapters || ''
      })
    } else {
      resetForm()
    }
    setModalOpened(true)
  }

  const handleSubmit = () => {
    const bookData = {
      name: formData.name
    }

    // Only add chapters if it has a value
    if (formData.chapters) {
      bookData.chapters = Number(formData.chapters)
    }

    if (editingBook) {
      dispatch(updateBook(editingBook._id, bookData))
    } else {
      dispatch(createBook(bookData))
    }
  }

  const handleSort = () => {
    setSortConfig(prev => ({
      ...prev,
      sortType: prev.sortType === SORT_TYPE.ASCENDING
        ? SORT_TYPE.DESCENDING
        : SORT_TYPE.ASCENDING
    }))
    closeSortDrawer()
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(currentLang === 'ar' ? 'ar-EG' : 'en-US')
  }

  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        {/* Header */}
        <Paper shadow="sm" radius="md" p="md" withBorder>
          <Group justify="space-between" wrap="wrap" gap="md">
            <div>
              <Title order={2} c="primary.6">
                <Group gap="xs">
                  <FaBook size={24} />
                  {t('Book_Management')}
                </Group>
              </Title>
              <Text size="sm" c="dimmed" mt="xs">
                {t('Manage_biblical_books')}
              </Text>
            </div>
          </Group>
        </Paper>

        {/* Action Buttons - Professional floating design */}
        <Group justify="space-between" align="center">
          <Badge color="blue" variant="light" size="lg">
            {t('Total')}: {books?.length || 0} {t('books')}
          </Badge>

          <Group gap="xs">
            {/* Sort Button - Icon only on mobile, full button on desktop */}
            <Box hiddenFrom="sm">
              <Tooltip label={t('Sort')} position="bottom" withArrow>
                <ActionIcon
                  size="lg"
                  variant="light"
                  color="blue"
                  onClick={openSortDrawer}
                  radius="md"
                >
                  <FaFilter size={18} />
                </ActionIcon>
              </Tooltip>
            </Box>
            <Button
              leftSection={<FaFilter />}
              onClick={openSortDrawer}
              variant="light"
              visibleFrom="sm"
              size="sm"
            >
              {t('Sort')}
            </Button>

            {/* Add Book Button - Icon only on mobile, full button on desktop */}
            <Box hiddenFrom="sm">
              <Tooltip label={t('Add_Book')} position="bottom" withArrow>
                <ActionIcon
                  size="lg"
                  variant="filled"
                  color="blue"
                  onClick={() => handleOpenModal()}
                  radius="md"
                >
                  <FaPlus size={18} />
                </ActionIcon>
              </Tooltip>
            </Box>
            <Button
              leftSection={<FaPlus />}
              onClick={() => handleOpenModal()}
              variant="filled"
              visibleFrom="sm"
              size="sm"
            >
              {t('Add_Book')}
            </Button>
          </Group>
        </Group>

        {/* Books Table */}
        <Paper shadow="sm" radius="md" p="md" withBorder>
          {loading ? (
            <Stack align="center" py="xl">
              <Loader size="lg" />
              <Text c="dimmed">{t('Loading_books')}</Text>
            </Stack>
          ) : error ? (
            <Text c="red" ta="center" py="xl">
              {error}
            </Text>
          ) : (
            <ScrollArea>
              <Table striped highlightOnHover style={{ minWidth: 700 }}>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th style={{ minWidth: 150 }}>{t('Name')} ({t('Arabic')})</Table.Th>
                    <Table.Th style={{ minWidth: 150 }}>{t('Name')} ({t('English')})</Table.Th>
                    <Table.Th style={{ minWidth: 100 }}>{t('Chapters')}</Table.Th>
                    <Table.Th style={{ minWidth: 120 }}>{t('Created_Date')}</Table.Th>
                    <Table.Th style={{ minWidth: 120 }}>{t('Last_Modified')}</Table.Th>
                    <Table.Th style={{ minWidth: 80 }}>{t('Actions')}</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {books?.map((book) => (
                    <Table.Tr key={book._id}>
                      <Table.Td fw={600}>{book.name?.ar}</Table.Td>
                      <Table.Td>{book.name?.en}</Table.Td>
                      <Table.Td>
                        {book.chapters ? (
                          <Badge color="blue" variant="light" leftSection={<FaListOl size={10} />}>
                            {book.chapters}
                          </Badge>
                        ) : (
                          <Text c="dimmed" size="sm">-</Text>
                        )}
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{formatDate(book.createdAt)}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{formatDate(book.lastModify)}</Text>
                      </Table.Td>
                      <Table.Td>
                        <ActionIcon
                          variant="light"
                          color="blue"
                          onClick={() => handleOpenModal(book)}
                        >
                          <FaEdit />
                        </ActionIcon>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
              {books?.length === 0 && (
                <Text ta="center" py="xl" c="dimmed">
                  {t('No_books_found')}
                </Text>
              )}
            </ScrollArea>
          )}
        </Paper>

        {/* Sort Drawer */}
        <Drawer
          opened={sortDrawerOpened}
          onClose={closeSortDrawer}
          title={
            <Group gap="xs">
              <FaFilter size={18} />
              <Text fw={600}>{t('Sort_Options')}</Text>
            </Group>
          }
          position="right"
          size="md"
          padding="md"
        >
          <Stack gap="md">
            <Text size="sm" c="dimmed">
              {t('Choose_how_to_sort_books')}
            </Text>

            <Button
              variant={sortConfig.sortType === SORT_TYPE.ASCENDING ? "filled" : "light"}
              fullWidth
              leftSection={<FaSortAlphaDown />}
              onClick={handleSort}
              size="md"
            >
              {t('Name')} ({t('A-Z')})
            </Button>

            <Button
              variant={sortConfig.sortType === SORT_TYPE.DESCENDING ? "filled" : "light"}
              fullWidth
              leftSection={<FaSortAlphaUp />}
              onClick={handleSort}
              size="md"
            >
              {t('Name')} ({t('Z-A')})
            </Button>

            <Divider />

            <Group justify="center">
              <Text size="sm" c="dimmed">
                {t('Currently_sorted_by')}: {t('Name')} ({sortConfig.sortType === SORT_TYPE.ASCENDING ? t('A-Z') : t('Z-A')})
              </Text>
            </Group>
          </Stack>
        </Drawer>

        {/* Add/Edit Modal */}
        <Modal
          opened={modalOpened}
          onClose={() => setModalOpened(false)}
          title={
            <Title order={3}>
              <Group gap="xs">
                <FaBook />
                {editingBook ? t('Edit_Book') : t('Add_Book')}
              </Group>
            </Title>
          }
          size="md"
          fullScreen={isMobile}
        >
          <Stack gap="md">
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label={t('Name_Arabic')}
                  placeholder={t('Enter_arabic_name')}
                  required
                  value={formData.name.ar}
                  onChange={(e) => setFormData({
                    ...formData,
                    name: { ...formData.name, ar: e.target.value }
                  })}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label={t('Name_English')}
                  placeholder={t('Enter_english_name')}
                  required
                  value={formData.name.en}
                  onChange={(e) => setFormData({
                    ...formData,
                    name: { ...formData.name, en: e.target.value }
                  })}
                />
              </Grid.Col>
            </Grid>

            <NumberInput
              label={t('Number_of_Chapters')}
              placeholder={t('Enter_number_of_chapters')}
              min={0}
              value={formData.chapters}
              onChange={(value) => setFormData({ ...formData, chapters: value })}
              leftSection={<FaListOl size={14} />}
              description={t('Optional_field')}
            />

            <Divider />

            <Group justify="flex-end">
              <Button variant="default" onClick={() => setModalOpened(false)}>
                {t('Cancel')}
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!formData.name.ar || !formData.name.en}
              >
                {editingBook ? t('Update') : t('Create')}
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Stack>
    </Container>
  )
}

export default BookManagement