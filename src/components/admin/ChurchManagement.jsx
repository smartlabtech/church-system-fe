import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  Table,
  Button,
  Group,
  Modal,
  TextInput,
  Select,
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
  Alert
} from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import { useTranslation } from "react-i18next"
import {
  FaEdit,
  FaPlus,
  FaChurch,
  FaGlobe,
  FaInfoCircle
} from "react-icons/fa"
import {
  listChurches,
  createChurch,
  updateChurch
} from "../../actions/churchActions"
import {
  CHURCH_CREATE_RESET,
  CHURCH_UPDATE_RESET
} from "../../constants/churchConstants"

// Popular IANA timezones
const TIMEZONES = [
  { value: "Africa/Cairo", label: "Africa/Cairo (Egypt, UTC+2)" },
  { value: "America/New_York", label: "America/New_York (Eastern Time, UTC-5/-4)" },
  { value: "America/Chicago", label: "America/Chicago (Central Time, UTC-6/-5)" },
  { value: "America/Denver", label: "America/Denver (Mountain Time, UTC-7/-6)" },
  { value: "America/Los_Angeles", label: "America/Los_Angeles (Pacific Time, UTC-8/-7)" },
  { value: "Europe/London", label: "Europe/London (UK, UTC+0/+1)" },
  { value: "Europe/Paris", label: "Europe/Paris (Central Europe, UTC+1/+2)" },
  { value: "Europe/Athens", label: "Europe/Athens (Eastern Europe, UTC+2/+3)" },
  { value: "Asia/Dubai", label: "Asia/Dubai (UAE, UTC+4)" },
  { value: "Asia/Kolkata", label: "Asia/Kolkata (India, UTC+5:30)" },
  { value: "Asia/Shanghai", label: "Asia/Shanghai (China, UTC+8)" },
  { value: "Asia/Tokyo", label: "Asia/Tokyo (Japan, UTC+9)" },
  { value: "Australia/Sydney", label: "Australia/Sydney (Australia, UTC+10/+11)" },
  { value: "Pacific/Auckland", label: "Pacific/Auckland (New Zealand, UTC+12/+13)" }
]

const ChurchManagement = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const isMobile = useMediaQuery('(max-width: 768px)')

  const [modalOpened, setModalOpened] = useState(false)
  const [editingChurch, setEditingChurch] = useState(null)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    timezone: "Africa/Cairo"
  })

  // Redux state
  const churchList = useSelector((state) => state.churchList)
  const { loading, churches, error } = churchList

  const churchCreate = useSelector((state) => state.churchCreate)
  const { success: createSuccess, error: createError } = churchCreate

  const churchUpdate = useSelector((state) => state.churchUpdate)
  const { success: updateSuccess, error: updateError } = churchUpdate

  // Load churches on mount
  useEffect(() => {
    dispatch(listChurches())
  }, [dispatch])

  // Handle success messages
  useEffect(() => {
    if (createSuccess) {
      notifications.show({
        title: t("Success"),
        message: t("Church_created_successfully"),
        color: "green"
      })
      setModalOpened(false)
      resetForm()
      dispatch({ type: CHURCH_CREATE_RESET })
    }

    if (updateSuccess) {
      notifications.show({
        title: t("Success"),
        message: t("Church_updated_successfully"),
        color: "green"
      })
      setModalOpened(false)
      resetForm()
      dispatch({ type: CHURCH_UPDATE_RESET })
    }
  }, [createSuccess, updateSuccess, dispatch, t])

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
  }, [createError, updateError, t])

  const resetForm = () => {
    setFormData({
      name: "",
      timezone: "Africa/Cairo"
    })
    setEditingChurch(null)
  }

  const handleOpenModal = (church = null) => {
    if (church) {
      setEditingChurch(church)
      setFormData({
        name: church.name,
        timezone: church.timezone || "Africa/Cairo"
      })
    } else {
      resetForm()
    }
    setModalOpened(true)
  }

  const handleSubmit = () => {
    if (editingChurch) {
      dispatch(updateChurch(editingChurch._id, formData))
    } else {
      dispatch(createChurch(formData))
    }
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
                  <FaChurch size={24} />
                  {t("Church_Management")}
                </Group>
              </Title>
              <Text size="sm" c="dimmed" mt="xs">
                {t("Manage_church_settings_and_timezone")}
              </Text>
            </div>
            <Button
              leftSection={<FaPlus />}
              onClick={() => handleOpenModal()}
              variant="filled"
              fullWidth={isMobile}
            >
              {t("Add_Church")}
            </Button>
          </Group>
        </Paper>

        {/* Info Alert */}
        <Alert icon={<FaInfoCircle />} title={t("Timezone_Information")} color="blue" variant="light">
          <Text size="sm">
            {t("Timezone_affects_when_questions_are_active")}
          </Text>
        </Alert>

        {/* Churches Table */}
        <Paper shadow="sm" radius="md" p="md" withBorder>
          {loading ? (
            <Stack align="center" py="xl">
              <Loader size="lg" />
              <Text c="dimmed">{t("Loading_churches")}</Text>
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
                    <Table.Th>{t("Timezone")}</Table.Th>
                    <Table.Th>{t("Actions")}</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {churches?.map((church) => (
                    <Table.Tr key={church._id}>
                      <Table.Td fw={600}>{church.name}</Table.Td>
                      <Table.Td>
                        <Group gap={4}>
                          <FaGlobe size={14} />
                          <Badge variant="light" color="blue">
                            {church.timezone || "Africa/Cairo"}
                          </Badge>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <ActionIcon
                          variant="light"
                          color="blue"
                          onClick={() => handleOpenModal(church)}
                        >
                          <FaEdit />
                        </ActionIcon>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
              {churches?.length === 0 && (
                <Text ta="center" py="xl" c="dimmed">
                  {t("No_churches_found")}
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
              {editingChurch ? t("Edit_Church") : t("Add_Church")}
            </Title>
          }
          size="md"
          fullScreen={isMobile}
        >
          <Stack gap="md">
            <TextInput
              label={t("Church_Name")}
              placeholder={t("Enter_church_name")}
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <Select
              label={t("Timezone")}
              placeholder={t("Select_timezone")}
              required
              data={TIMEZONES}
              value={formData.timezone}
              onChange={(value) => setFormData({ ...formData, timezone: value })}
              searchable
              leftSection={<FaGlobe size={14} />}
              description={t("Timezone_determines_when_daily_questions_are_active")}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={() => setModalOpened(false)}>
                {t("Cancel")}
              </Button>
              <Button onClick={handleSubmit}>
                {editingChurch ? t("Update") : t("Create")}
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Stack>
    </Container>
  )
}

export default ChurchManagement
