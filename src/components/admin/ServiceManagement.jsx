import React, { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  Table,
  Button,
  Group,
  Modal,
  TextInput,
  Select,
  NumberInput,
  Switch,
  Card,
  Stack,
  Title,
  Badge,
  ActionIcon,
  Loader,
  Text,
  Paper,
  Grid,
  Container,
  ScrollArea,
  Divider,
  Box
} from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { useTranslation } from "react-i18next"
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaChurch,
  FaCalendarAlt,
  FaTrophy,
  FaBook,
  FaUserCheck
} from "react-icons/fa"
import {
  listServices,
  createService,
  updateService,
  deleteService
} from "../../actions/serviceActions"
import {
  SERVICE_TYPES,
  SERVICE_CREATE_RESET,
  SERVICE_UPDATE_RESET,
  SERVICE_DELETE_RESET
} from "../../constants/serviceConstants"
import ClassManagement from "./ClassManagement"

const ServiceManagement = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  // Generate weekdays array with translations
  const WEEKDAYS = [
    { value: "0", label: t("Sunday") },
    { value: "1", label: t("Monday") },
    { value: "2", label: t("Tuesday") },
    { value: "3", label: t("Wednesday") },
    { value: "4", label: t("Thursday") },
    { value: "5", label: t("Friday") },
    { value: "6", label: t("Saturday") }
  ]

  const [modalOpened, setModalOpened] = useState(false)
  const [deleteModalOpened, setDeleteModalOpened] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [serviceToDelete, setServiceToDelete] = useState(null)
  const [filters, setFilters] = useState({})
  const [selectedService, setSelectedService] = useState(null)
  const [servicesHeight, setServicesHeight] = useState(null)
  const servicesColumnRef = useRef(null)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    serviceDay: 5,
    type: "PRIMARY",
    onePoundEqXpoints: 1,
    attendancePoints: 5,
    bibleStudyPoints: 1,
    sendUserCredentials: false
  })

  // Redux state
  const serviceList = useSelector((state) => state.serviceList)
  const { loading, services, error } = serviceList

  const serviceCreate = useSelector((state) => state.serviceCreate)
  const { success: createSuccess, error: createError } = serviceCreate

  const serviceUpdate = useSelector((state) => state.serviceUpdate)
  const { success: updateSuccess, error: updateError } = serviceUpdate

  const serviceDelete = useSelector((state) => state.serviceDelete)
  const { success: deleteSuccess, error: deleteError } = serviceDelete

  // Load services on mount
  useEffect(() => {
    dispatch(listServices())
  }, [dispatch])

  // No auto-selection - user must manually select a service
  // This was removed based on user preference

  // Calculate services column height
  useEffect(() => {
    const updateHeight = () => {
      if (servicesColumnRef.current) {
        const height = servicesColumnRef.current.offsetHeight
        setServicesHeight(height)
      }
    }

    // Initial calculation
    updateHeight()

    // Recalculate on window resize
    window.addEventListener('resize', updateHeight)

    // Recalculate when services data changes
    const timer = setTimeout(updateHeight, 100)

    return () => {
      window.removeEventListener('resize', updateHeight)
      clearTimeout(timer)
    }
  }, [services, loading])

  // Handle success messages
  useEffect(() => {
    if (createSuccess) {
      notifications.show({
        title: t("Success"),
        message: t("Service_created_successfully"),
        color: "green"
      })
      setModalOpened(false)
      resetForm()
      dispatch({ type: SERVICE_CREATE_RESET })
    }

    if (updateSuccess) {
      notifications.show({
        title: t("Success"),
        message: t("Service_updated_successfully"),
        color: "green"
      })
      setModalOpened(false)
      resetForm()
      dispatch({ type: SERVICE_UPDATE_RESET })
    }

    if (deleteSuccess) {
      notifications.show({
        title: t("Success"),
        message: t("Service_deleted_successfully"),
        color: "green"
      })
      setDeleteModalOpened(false)
      dispatch({ type: SERVICE_DELETE_RESET })
    }
  }, [createSuccess, updateSuccess, deleteSuccess, dispatch, t])

  // Handle errors
  useEffect(() => {
    if (createError) {
      notifications.show({
        title: t("Error"),
        message: createError,
        color: "red"
      })
    }

    if (updateError) {
      notifications.show({
        title: t("Error"),
        message: updateError,
        color: "red"
      })
    }

    if (deleteError) {
      notifications.show({
        title: t("Error"),
        message: deleteError,
        color: "red"
      })
    }
  }, [createError, updateError, deleteError, t])

  const resetForm = () => {
    setFormData({
      name: "",
      serviceDay: 5,
      type: "PRIMARY",
      onePoundEqXpoints: 1,
      attendancePoints: 5,
      bibleStudyPoints: 1,
      sendUserCredentials: false
    })
    setEditingService(null)
  }

  const handleOpenModal = (service = null) => {
    if (service) {
      setEditingService(service)
      setFormData({
        name: service.name,
        serviceDay: service.serviceDay,
        type: service.type,
        onePoundEqXpoints: service.onePoundEqXpoints,
        attendancePoints: service.attendancePoints,
        bibleStudyPoints: service.bibleStudyPoints,
        sendUserCredentials: service.sendUserCredentials
      })
    } else {
      resetForm()
    }
    setModalOpened(true)
  }

  const handleSubmit = () => {
    if (editingService) {
      dispatch(updateService(editingService._id, formData))
    } else {
      dispatch(createService(formData))
    }
  }

  const handleDelete = () => {
    if (serviceToDelete) {
      dispatch(deleteService(serviceToDelete._id))
    }
  }

  const handleFilter = () => {
    dispatch(listServices(filters))
  }

  const handleClearFilters = () => {
    setFilters({})
    dispatch(listServices())
  }

  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        {/* Header */}
        <Paper shadow="sm" radius="md" p="md" withBorder>
          <Group justify="space-between">
            <div>
              <Title order={2} c="primary.6">
                <Group gap="xs">
                  <FaChurch size={24} />
                  {t("Service_Management")}
                </Group>
              </Title>
              <Text size="sm" c="dimmed" mt="xs">
                {t("Manage_church_services_and_points")}
              </Text>
            </div>
            <Button
              leftSection={<FaPlus />}
              onClick={() => handleOpenModal()}
              variant="filled"
            >
              {t("Add_Service")}
            </Button>
          </Group>
        </Paper>

        {/* Main Content with Sidebar */}
        <Grid gutter="lg" align="stretch">
          {/* Left Content - Services Management */}
          <Grid.Col span={{ base: 12, sm: 12, md: 8, lg: 9 }}>
            <Stack gap="lg" ref={servicesColumnRef}>
              {/* Filters */}
              <Paper shadow="sm" radius="md" p="md" withBorder>
                <Stack gap="md">
                  <Text fw={600}>{t("Filters")}</Text>
                  <Grid gutter="sm">
                    <Grid.Col span={{ base: 12, xs: 12, sm: 6, md: 4, lg: 3 }}>
                      <TextInput
                        placeholder={t("Service_Name")}
                        value={filters.name || ""}
                        onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, xs: 6, sm: 6, md: 4, lg: 3 }}>
                      <Select
                        placeholder={t("Service_Day")}
                        data={[
                          { value: "", label: t("All") },
                          ...WEEKDAYS
                        ]}
                        value={filters.serviceDay?.toString() || ""}
                        onChange={(value) => setFilters({
                          ...filters,
                          serviceDay: value ? parseInt(value) : undefined
                        })}
                        clearable
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, xs: 6, sm: 6, md: 4, lg: 3 }}>
                      <Select
                        placeholder={t("Service_Type")}
                        data={[
                          { value: "", label: t("All") },
                          { value: "PRIMARY", label: t("Primary") },
                          { value: "SECONDARY", label: t("Secondary") }
                        ]}
                        value={filters.type || ""}
                        onChange={(value) => setFilters({ ...filters, type: value || undefined })}
                        clearable
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, xs: 12, sm: 6, md: 12, lg: 3 }}>
                      <Group grow gap="xs">
                        <Button onClick={handleFilter} variant="filled" size="sm">
                          {t("Filter")}
                        </Button>
                        <Button onClick={handleClearFilters} variant="light" color="gray" size="sm">
                          {t("Clear")}
                        </Button>
                      </Group>
                    </Grid.Col>
                  </Grid>
                </Stack>
              </Paper>

              {/* Services Table */}
              <Paper shadow="sm" radius="md" p="md" withBorder>
          {loading ? (
            <Stack align="center" py="xl">
              <Loader size="lg" />
              <Text c="dimmed">{t("Loading_services")}</Text>
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
                    <Table.Th>{t("Name")}</Table.Th>
                    <Table.Th>{t("Day")}</Table.Th>
                    <Table.Th>{t("Type")}</Table.Th>
                    <Table.Th>{t("Attendance_Points")}</Table.Th>
                    <Table.Th>{t("Bible_Study_Points")}</Table.Th>
                    <Table.Th>{t("Money_to_Points")}</Table.Th>
                    <Table.Th>{t("Send_Credentials")}</Table.Th>
                    <Table.Th>{t("Actions")}</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {services?.map((service) => (
                    <Table.Tr
                      key={service._id}
                      onClick={() => setSelectedService(service)}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: selectedService?._id === service._id ? 'var(--mantine-color-primary-0)' : 'transparent'
                      }}
                    >
                      <Table.Td fw={600}>{service.name}</Table.Td>
                      <Table.Td>
                        <Badge variant="light">
                          {WEEKDAYS.find(d => d.value === service.serviceDay.toString())?.label}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          color={service.type === "PRIMARY" ? "blue" : "green"}
                          variant="filled"
                        >
                          {t(service.type)}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap={4}>
                          <FaUserCheck size={14} />
                          {service.attendancePoints}
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Group gap={4}>
                          <FaBook size={14} />
                          {service.bibleStudyPoints}
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Group gap={4}>
                          <FaTrophy size={14} />
                          {service.onePoundEqXpoints}
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          color={service.sendUserCredentials ? "green" : "gray"}
                          variant="light"
                        >
                          {service.sendUserCredentials ? t("Yes") : t("No")}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <ActionIcon
                          variant="light"
                          color="blue"
                          onClick={() => handleOpenModal(service)}
                        >
                          <FaEdit />
                        </ActionIcon>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
              {services?.length === 0 && (
                <Text ta="center" py="xl" c="dimmed">
                  {t("No_services_found")}
                </Text>
              )}
            </ScrollArea>
          )}
        </Paper>
            </Stack>
          </Grid.Col>

          {/* Right Sidebar - Class Management */}
          <Grid.Col span={{ base: 12, sm: 12, md: 4, lg: 3 }}>
            <ClassManagement selectedService={selectedService} height={servicesHeight} />
          </Grid.Col>
        </Grid>

        {/* Add/Edit Modal */}
        <Modal
          opened={modalOpened}
          onClose={() => setModalOpened(false)}
          title={
            <Title order={3}>
              {editingService ? t("Edit_Service") : t("Add_Service")}
            </Title>
          }
          size="md"
        >
          <Stack gap="md">
            <TextInput
              label={t("Service_Name")}
              placeholder={t("Enter_service_name")}
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <Select
              label={t("Service_Day")}
              placeholder={t("Select_day")}
              required
              data={WEEKDAYS}
              value={formData.serviceDay.toString()}
              onChange={(value) => setFormData({
                ...formData,
                serviceDay: parseInt(value)
              })}
            />

            <Select
              label={t("Service_Type")}
              placeholder={t("Select_type")}
              required
              data={[
                { value: "PRIMARY", label: t("Primary") },
                { value: "SECONDARY", label: t("Secondary") }
              ]}
              value={formData.type}
              onChange={(value) => setFormData({ ...formData, type: value })}
            />

            <NumberInput
              label={t("Attendance_Points")}
              placeholder={t("Points_for_attendance")}
              min={0}
              value={formData.attendancePoints}
              onChange={(value) => setFormData({
                ...formData,
                attendancePoints: value || 0
              })}
              leftSection={<FaUserCheck size={14} />}
            />

            <NumberInput
              label={t("Bible_Study_Points")}
              placeholder={t("Points_for_bible_study")}
              min={0}
              value={formData.bibleStudyPoints}
              onChange={(value) => setFormData({
                ...formData,
                bibleStudyPoints: value || 0
              })}
              leftSection={<FaBook size={14} />}
            />

            <NumberInput
              label={t("Money_to_Points_Ratio")}
              placeholder={t("Points_per_pound")}
              min={0}
              step={0.1}
              value={formData.onePoundEqXpoints}
              onChange={(value) => setFormData({
                ...formData,
                onePoundEqXpoints: value || 0
              })}
              leftSection={<FaTrophy size={14} />}
            />

            <Switch
              label={t("Send_User_Credentials")}
              checked={formData.sendUserCredentials}
              onChange={(event) => setFormData({
                ...formData,
                sendUserCredentials: event.currentTarget.checked
              })}
            />

            <Divider />

            <Group justify="flex-end">
              <Button variant="default" onClick={() => setModalOpened(false)}>
                {t("Cancel")}
              </Button>
              <Button onClick={handleSubmit}>
                {editingService ? t("Update") : t("Create")}
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Stack>
    </Container>
  )
}

export default ServiceManagement