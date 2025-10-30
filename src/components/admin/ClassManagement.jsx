import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  listClasses,
  createClass,
  updateClass
} from '../../actions/classActions'
import {
  CLASS_CREATE_RESET,
  CLASS_UPDATE_RESET
} from '../../constants/classConstants'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Button,
  Card,
  Group,
  Loader,
  Modal,
  NumberInput,
  Paper,
  ScrollArea,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
  Badge,
  ActionIcon,
  Divider
} from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import {
  FaPlus,
  FaEdit,
  FaGraduationCap,
  FaSortNumericUp
} from 'react-icons/fa'

const ClassManagement = ({ selectedService, height, onSelectClass, selectedClass }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const isMobile = useMediaQuery('(max-width: 768px)')

  const [opened, { open, close }] = useDisclosure(false)
  const [editMode, setEditMode] = useState(false)
  const [currentClass, setCurrentClass] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    serviceId: '',
    nextClassId: ''
  })

  const classList = useSelector((state) => state.classList)
  const { loading, classes = [], error } = classList

  const classCreate = useSelector((state) => state.classCreate)
  const {
    loading: createLoading,
    success: createSuccess,
    error: createError
  } = classCreate

  const classUpdate = useSelector((state) => state.classUpdate)
  const {
    loading: updateLoading,
    success: updateSuccess,
    error: updateError
  } = classUpdate

  // Load all classes on mount
  useEffect(() => {
    dispatch(listClasses()) // Load all classes without filter
  }, [dispatch])

  // Reload classes when they are updated/created successfully
  useEffect(() => {
    if (createSuccess || updateSuccess) {
      dispatch(listClasses())
    }
  }, [createSuccess, updateSuccess, dispatch])

  // Update form when service is selected
  useEffect(() => {
    if (selectedService) {
      setFormData(prev => ({ ...prev, serviceId: selectedService._id }))
    }
  }, [selectedService])

  useEffect(() => {
    if (createSuccess) {
      notifications.show({
        title: t('Success'),
        message: t('Class_created_successfully'),
        color: 'green'
      })
      close()
      dispatch({ type: CLASS_CREATE_RESET })
      setFormData({
        name: '',
        code: '',
        serviceId: selectedService?._id || '',
        nextClassId: ''
      })
    }
  }, [createSuccess, dispatch, close, t, selectedService])

  useEffect(() => {
    if (updateSuccess) {
      notifications.show({
        title: t('Success'),
        message: t('Class_updated_successfully'),
        color: 'green'
      })
      close()
      dispatch({ type: CLASS_UPDATE_RESET })
      setEditMode(false)
      setCurrentClass(null)
      setFormData({
        name: '',
        code: '',
        serviceId: selectedService?._id || '',
        nextClassId: ''
      })
    }
  }, [updateSuccess, dispatch, close, t, selectedService])

  // Ensure classes is an array and filter based on selected service
  const classesArray = Array.isArray(classes) ? classes : []

  const filteredClasses = selectedService
    ? classesArray.filter(cls => cls.serviceId === selectedService._id)
    : classesArray

  const sortedClasses = [...filteredClasses].sort((a, b) => a.code - b.code)

  // Get available classes for nextClassId selection
  const getAvailableNextClasses = () => {
    if (!currentClass) return sortedClasses
    return sortedClasses.filter(cls => cls._id !== currentClass._id)
  }

  const handleOpenModal = (classItem = null) => {
    if (classItem) {
      setEditMode(true)
      setCurrentClass(classItem)
      setFormData({
        name: classItem.name || '',
        code: classItem.code || '',
        serviceId: classItem.serviceId || selectedService?._id || '',
        nextClassId: classItem.nextClassId || ''
      })
    } else {
      setEditMode(false)
      setCurrentClass(null)
      setFormData({
        name: '',
        code: '',
        serviceId: selectedService?._id || '',
        nextClassId: ''
      })
    }
    open()
  }

  const handleSubmit = () => {
    if (editMode && currentClass) {
      const updateData = {}
      if (formData.name) updateData.name = formData.name
      if (formData.code) updateData.code = Number(formData.code)
      if (formData.nextClassId) updateData.nextClassId = formData.nextClassId
      updateData.serviceId = formData.serviceId

      dispatch(updateClass(currentClass._id, updateData))
    } else {
      const createData = {
        name: formData.name,
        code: Number(formData.code),
        serviceId: formData.serviceId
      }
      if (formData.nextClassId) {
        createData.nextClassId = formData.nextClassId
      }
      dispatch(createClass(createData))
    }
  }

  const getNextClassName = (nextClassId) => {
    const nextClass = sortedClasses.find(cls => cls._id === nextClassId)
    return nextClass ? nextClass.name : t('None')
  }

  return (
    <>
      <Card
        shadow="sm"
        radius="md"
        p="md"
        withBorder
        style={{
          height: isMobile ? '400px' : (height ? `${height}px` : '100%'),
          maxHeight: isMobile ? '400px' : (height ? `${height}px` : '100%'),
          minHeight: isMobile ? '400px' : (height ? `${height}px` : '400px'),
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <Stack gap="md" style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          {/* Header */}
          <Group justify="space-between">
            <Stack gap={2}>
              <Group gap="xs">
                <FaGraduationCap size={20} />
                <Title order={4}>{t('Classes')}</Title>
              </Group>
              <Text size="xs" c="dimmed">
                {selectedService
                  ? `${selectedService.name} (${sortedClasses.length})`
                  : `${t('All_Classes')} (${sortedClasses.length})`
                }
              </Text>
            </Stack>
            <Button
              size="xs"
              leftSection={<FaPlus size={14} />}
              onClick={() => handleOpenModal()}
              disabled={!selectedService}
            >
              {t('Add_Class')}
            </Button>
          </Group>

          <Divider />

          {/* Classes List */}
          {loading ? (
            <Group justify="center" py="xl">
              <Loader size="md" />
            </Group>
          ) : error ? (
            <Text c="red" ta="center">{error}</Text>
          ) : sortedClasses.length === 0 ? (
            <Paper p="md" withBorder>
              <Text c="dimmed" ta="center">
                {t('No_classes_found_for_this_service')}
              </Text>
            </Paper>
          ) : (
            <ScrollArea style={{ flex: 1, minHeight: 0 }} type="scroll">
              <Stack gap="xs">
                {sortedClasses.map((classItem) => (
                  <Paper
                    key={classItem._id}
                    p="sm"
                    withBorder
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--mantine-color-primary-0)'
                      e.currentTarget.style.borderColor = 'var(--mantine-color-primary-3)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white'
                      e.currentTarget.style.borderColor = 'var(--mantine-color-gray-3)'
                    }}
                  >
                    <Group justify="space-between">
                      <Stack gap={4}>
                        <Group gap="xs">
                          <Badge color="primary" variant="light">
                            {t('Code')}: {classItem.code}
                          </Badge>
                          <Text fw={500} size="sm">{classItem.name}</Text>
                        </Group>
                        {classItem.nextClassId ? (
                          <Text size="xs" c="dimmed">
                            {t('Next')}: {getNextClassName(classItem.nextClassId)}
                          </Text>
                        ) : null}
                      </Stack>
                      <ActionIcon
                        variant="light"
                        onClick={() => handleOpenModal(classItem)}
                      >
                        <FaEdit size={14} />
                      </ActionIcon>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            </ScrollArea>
          )}
        </Stack>
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title={
          <Group gap="xs">
            <FaGraduationCap size={20} />
            <Text fw={600}>
              {editMode ? t('Edit_Class') : t('Add_New_Class')}
            </Text>
          </Group>
        }
        size="md"
      >
        <Stack gap="md">
          <TextInput
            label={t('Class_Name')}
            placeholder={t('Enter_class_name')}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <NumberInput
            label={t('Code')}
            description={t('Sequence_number_for_class')}
            placeholder={t('Enter_code')}
            value={formData.code}
            onChange={(value) => setFormData({ ...formData, code: value })}
            min={1}
            leftSection={<FaSortNumericUp size={14} />}
            required
          />

          <Select
            label={t('Next_Class')}
            placeholder={t('Select_next_class')}
            value={formData.nextClassId}
            onChange={(value) => setFormData({ ...formData, nextClassId: value })}
            data={getAvailableNextClasses().map(cls => ({
              value: cls._id,
              label: `${cls.name} (${t('Code')}: ${cls.code})`
            }))}
            clearable
            searchable
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={close}>
              {t('Cancel')}
            </Button>
            <Button
              onClick={handleSubmit}
              loading={createLoading || updateLoading}
              disabled={!formData.name || !formData.code}
            >
              {editMode ? t('Update') : t('Create')}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  )
}

export default ClassManagement