import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAuthorizedKhadem } from "../../actions/adminActions"
import {
  SET_ADD_TO_SERVICE_MODAL,
  SET_ROLE_MODAL,
  SET_UPDATE_SERVANT_SERVICE_MODAL
} from "../../constants/modalsConstants"
import RoleModal from "../RoleModal"
import UpdateServantServiceModal from "../UpdateServantServiceModal"
import AddServantServiceModal from "../AddServantServiceModal"
import { getServices } from "../../actions/servicesActions"
import { useTranslation } from "react-i18next"
import PhotoModal from "../PhotoModal"
import {
  Avatar,
  Badge,
  Button,
  Card,
  Container,
  Grid,
  Group,
  Loader,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title
} from "@mantine/core"
import { BsPlusSquareDotted } from "react-icons/bs"
import { FaUsers } from "react-icons/fa"

const ServantManagement = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const [status, setStatus] = useState(false)
  const [userImage, setUserImage] = useState("")

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const admin = useSelector((state) => state.admin)
  const { authorizedKhadem, loading } = admin

  useEffect(() => {
    if (userInfo && userInfo?.user?.role === "admin") {
      dispatch(getAuthorizedKhadem())
      dispatch(getServices())
    }
  }, [dispatch, userInfo])

  const showImage = (image) => {
    setUserImage(image)
    setStatus(true)
  }

  return loading ? (
    <Container size="lg" py="xl">
      <Stack align="center" gap="md">
        <Loader size="lg" />
        <Text c="dimmed">{t("Loading_data")}</Text>
      </Stack>
    </Container>
  ) : (
    <Container size="xl" py="md">
      <Stack gap="lg">
        {/* Modals */}
        <RoleModal />
        <UpdateServantServiceModal />
        <AddServantServiceModal />
        <PhotoModal userImage={userImage} status={status} onHide={setStatus} />

        {/* Header */}
        <Paper shadow="sm" radius="md" p="md" withBorder>
          <Group justify="space-between">
            <div>
              <Title order={2} c="primary.6">
                <Group gap="xs">
                  <FaUsers size={24} />
                  {t("Servant_Management")}
                </Group>
              </Title>
              <Text size="sm" c="dimmed" mt="xs">
                {t("Manage_church_servants_and_roles")}
              </Text>
            </div>
            <Badge size="lg" color="secondary" variant="filled">
              {authorizedKhadem?.length || 0} {t("Servants")}
            </Badge>
          </Group>
        </Paper>

        {/* Servants Grid */}
        <SimpleGrid cols={{ base: 1, sm: 1, lg: 2 }} spacing="lg">
          {authorizedKhadem?.map((item, index) => (
            <Card
              key={index}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              style={{
                transition: "transform 0.2s ease, box-shadow 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)"
                e.currentTarget.style.boxShadow = "var(--mantine-shadow-md)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "var(--mantine-shadow-sm)"
              }}
            >
              <Grid gutter="md" align="center">
                {/* Avatar and Basic Info */}
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <Stack align="center" gap="sm">
                    <Avatar
                      src={item?.image}
                      size="xl"
                      radius="md"
                      style={{ cursor: "pointer", border: "2px solid var(--mantine-color-primary-2)" }}
                      onClick={() => showImage(item?.image)}
                    />
                    <Stack gap={2} align="center">
                      <Text size="sm" fw={600}>
                        {`${item?.firstName} ${item?.fatherName} ${item?.grandFaName || ""}`}
                      </Text>
                      <Badge
                        color="primary"
                        variant="light"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          dispatch({
                            type: SET_ROLE_MODAL,
                            payload: {
                              listData: authorizedKhadem,
                              index: index,
                              indexData: item
                            }
                          })
                        }
                      >
                        {item.role}
                      </Badge>
                    </Stack>
                  </Stack>
                </Grid.Col>

                {/* Services Section */}
                <Grid.Col span={{ base: 12, sm: 8 }}>
                  <Stack gap="md">
                    {/* Add Service Button */}
                    <Button
                      leftSection={<BsPlusSquareDotted size={18} />}
                      variant="light"
                      fullWidth
                      onClick={() =>
                        dispatch({
                          type: SET_ADD_TO_SERVICE_MODAL,
                          payload: {
                            listData: authorizedKhadem,
                            index: index,
                            servantName: `${item.firstName} ${item.fatherName} ${
                              item?.grandFaName || ""
                            }`,
                            servantImage: item.image,
                            servantId: item._id
                          }
                        })
                      }
                    >
                      {t("Add_to_Service")}
                    </Button>

                    {/* Current Services */}
                    <Stack gap="xs">
                      <Text size="xs" c="dimmed" fw={600}>
                        {t("Current_Services")}:
                      </Text>
                      {item.servantIn.length ? (
                        <Group gap="xs">
                          {item.servantIn.map((service, serviceIndex) => (
                            <Badge
                              key={serviceIndex}
                              size="lg"
                              color="accent"
                              variant="filled"
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                dispatch({
                                  type: SET_UPDATE_SERVANT_SERVICE_MODAL,
                                  payload: {
                                    listData: authorizedKhadem,
                                    index: index,
                                    indexData: service,
                                    servantName: `${item.firstName} ${
                                      item.fatherName
                                    } ${item?.grandFaName || ""}`,
                                    servantImage: item.image,
                                    servantRole: service.role
                                  }
                                })
                              }
                            >
                              {service.name}
                            </Badge>
                          ))}
                        </Group>
                      ) : (
                        <Badge color="red" variant="light" size="md">
                          {t("No_Services_Assigned")}
                        </Badge>
                      )}
                    </Stack>

                    {/* Served By Info */}
                    {item.servedBy?.length > 0 && (
                      <Stack gap="xs">
                        <Text size="xs" c="dimmed" fw={600}>
                          {t("Served_By")}:
                        </Text>
                        <Group gap="xs">
                          {item.servedBy.map((service, idx) => (
                            <Badge key={idx} color="gray" variant="light">
                              {service.name}
                            </Badge>
                          ))}
                        </Group>
                      </Stack>
                    )}
                  </Stack>
                </Grid.Col>
              </Grid>
            </Card>
          ))}
        </SimpleGrid>

        {/* Empty State */}
        {!authorizedKhadem?.length && (
          <Paper shadow="sm" radius="md" p="xl" withBorder ta="center">
            <Stack align="center" gap="md">
              <Badge size="xl" color="yellow" variant="light">
                {t("No_Servants_Found")}
              </Badge>
              <Text c="dimmed">{t("Add_servants_to_get_started")}</Text>
            </Stack>
          </Paper>
        )}
      </Stack>
    </Container>
  )
}

export default ServantManagement