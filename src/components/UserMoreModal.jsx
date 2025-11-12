import React, {useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {useTranslation} from "react-i18next"
import {
  Button,
  Group,
  Modal,
  Stack,
  Text,
  Title,
  Divider,
  Badge,
  Paper,
  Tabs,
  ThemeIcon,
  Box,
  ScrollArea,
  Flex,
  Card
} from "@mantine/core"
import AddUpdateUserModal from "./Add_UpdateUserModal"
import {
  RESET_ADD_UPDATE_USER_MODAL,
  SET_ADD_UPDATE_USER_MODAL
} from "../constants/modalsConstants"
import {getUserCredentials} from "../actions/userActions"
import {
  FaUser,
  FaBirthdayCake,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaChurch,
  FaGraduationCap,
  FaLightbulb,
  FaPhone,
  FaMapPin
} from "react-icons/fa"

const UserMoreModal = ({
  index,
  userDetails,
  onDelete,
  classId,
  onFollowUp,
  selectedService
}) => {
  const dispatch = useDispatch()
  const [t, i18n] = useTranslation()

  const [show, setShow] = useState(false)
  const servedByDelete = useSelector((state) => state.servedByDelete)
  const {loading} = servedByDelete

  const userRequestCredentials = useSelector(
    (state) => state.userRequestCredentials
  )
  const {loading: userRequestCredentialsLoading} = userRequestCredentials

  const userFollowUpUpdate = useSelector((state) => state.userFollowUpUpdate)
  const {loading: userFollowUpUpdateLoading} = userFollowUpUpdate

  const add_updateUserModal = useSelector((state) => state.add_updateUserModal)
  const {status, selectedIdToEdit} = add_updateUserModal

  const onShow = (status, type) => {
    if (type === "editUser" || type === "-") {
      setShow(false)
      status
        ? dispatch({type: SET_ADD_UPDATE_USER_MODAL, payload: userDetails._id})
        : dispatch({type: RESET_ADD_UPDATE_USER_MODAL})
    }
  }

  const shareViaSMS = (mobileToSendTo) => {
    const body = {
      serviceId: selectedService._id,
      classId
    }
    dispatch(getUserCredentials(mobileToSendTo, userDetails._id, body))
  }

  const InfoRow = ({icon, label, value, color = "blue"}) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return null

    return (
      <Group gap="sm" wrap="nowrap" align="flex-start">
        <ThemeIcon size="sm" color={color} variant="light" radius="xl">
          {icon}
        </ThemeIcon>
        <Stack gap={4} style={{flex: 1}}>
          <Text size="xs" c="dimmed" fw={500}>
            {label}
          </Text>
          {Array.isArray(value) ? (
            <Group gap="xs">
              {value.map((item, idx) => (
                <Badge key={idx} variant="dot" size="sm">
                  {item}
                </Badge>
              ))}
            </Group>
          ) : (
            <Text size="sm">{value}</Text>
          )}
        </Stack>
      </Group>
    )
  }

  return (
    <>
      <AddUpdateUserModal
        userDetails={userDetails}
        serviceId={selectedService._id}
        classId={classId}
        status={status && selectedIdToEdit === userDetails?._id}
        classes={selectedService.classes}
        onShow={onShow}
      />
      <Button
        p={0}
        m={0}
        size="xs"
        variant="subtle"
        styles={{
          root: {
            textDecoration: "underline",
            color: "inherit",
            padding: 0,
            background: "none"
          }
        }}
        onClick={() => setShow(true)}
      >
        {t("More")}
      </Button>

      <Modal
        opened={show}
        onClose={() => setShow(false)}
        size="xl"
        title={
          <Group gap="xs">
            <FaUser />
            <Title order={3}>
              {`${userDetails.firstName} ${userDetails.fatherName} ${
                userDetails?.grandFaName || ""
              } ${userDetails?.familyName || ""}`}
            </Title>
          </Group>
        }
        centered
        scrollAreaComponent={ScrollArea.Autosize}
      >
        <Stack gap="lg">
          {/* Action Buttons */}
          <Paper p="md" withBorder radius="md" bg="gray.0">
            <Group justify="center" gap="sm" wrap="wrap">
              <Button
                variant="light"
                color="teal"
                leftSection={<FaCalendarAlt size={14} />}
                onClick={() => onFollowUp(userDetails._id)}
                loading={userFollowUpUpdateLoading}
              >
                {t("Follow_Up_Done")}
              </Button>
              <Button
                variant="light"
                color="blue"
                leftSection={<FaUser size={14} />}
                onClick={() => onShow(true, "editUser")}
              >
                {t("Edit")}
              </Button>
              <Button
                variant="light"
                color="red"
                onClick={() => onDelete(index, userDetails._id)}
                loading={loading}
              >
                {t("Remove_From_Service")}
              </Button>
            </Group>
          </Paper>

          <Tabs defaultValue="personal" dir={t("Dir")}>
            <Tabs.List grow>
              <Tabs.Tab value="personal" leftSection={<FaUser size={14} />}>
                {t("Personal_Info")}
              </Tabs.Tab>
              <Tabs.Tab value="education" leftSection={<FaGraduationCap size={14} />}>
                {t("Education_Skills")}
              </Tabs.Tab>
              <Tabs.Tab value="activity" leftSection={<FaCalendarAlt size={14} />}>
                {t("Activity")}
              </Tabs.Tab>
            </Tabs.List>

            {/* Personal Information Tab */}
            <Tabs.Panel value="personal" pt="md">
              <Stack gap="md">
                <Card withBorder radius="md" p="md">
                  <Stack gap="md">
                    <Title order={5} c="dimmed">
                      {t("Basic_Information")}
                    </Title>
                    <Divider />

                    <InfoRow
                      icon={<FaUser size={12} />}
                      label={t("Full_Name")}
                      value={`${userDetails.firstName} ${userDetails.fatherName} ${
                        userDetails?.grandFaName || ""
                      } ${userDetails?.familyName || ""}`}
                      color="blue"
                    />

                    {userDetails?.birthday && (
                      <InfoRow
                        icon={<FaBirthdayCake size={12} />}
                        label={t("Birthday")}
                        value={`${userDetails.birthday.day}/${userDetails.birthday.month}/${userDetails.birthday.year}`}
                        color="pink"
                      />
                    )}

                    <InfoRow
                      icon={<FaEnvelope size={12} />}
                      label={t("Email")}
                      value={userDetails?.email}
                      color="cyan"
                    />

                    <InfoRow
                      icon={<FaChurch size={12} />}
                      label={t("Father_of_Confession")}
                      value={userDetails?.fatherOfConfession}
                      color="grape"
                    />
                  </Stack>
                </Card>

                {/* Address Card */}
                {userDetails?.address && (
                  <Card withBorder radius="md" p="md">
                    <Stack gap="md">
                      <Title order={5} c="dimmed">
                        {t("Address")}
                      </Title>
                      <Divider />

                      <Group gap="sm" wrap="nowrap" align="flex-start">
                        <ThemeIcon size="sm" color="red" variant="light" radius="xl">
                          <FaMapMarkerAlt size={12} />
                        </ThemeIcon>
                        <Stack gap={4} style={{flex: 1}}>
                          <Text size="sm">
                            {[
                              userDetails.address.building,
                              userDetails.address.street_compound,
                              userDetails.address.region,
                              userDetails.address.floor && `${t("Floor")} ${userDetails.address.floor}`,
                              userDetails.address.flat && `${t("Flat")} ${userDetails.address.flat}`
                            ]
                              .filter(Boolean)
                              .join(" - ")}
                          </Text>
                        </Stack>
                      </Group>

                      {userDetails?.address?.mark && (
                        <Paper p="xs" bg="red.0" radius="sm">
                          <Group gap="xs">
                            <FaMapPin size={12} color="red" />
                            <Text size="xs" c="red" fw={500}>
                              {t("Landmark")}: {userDetails.address.mark}
                            </Text>
                          </Group>
                        </Paper>
                      )}

                      {userDetails?.address?.location && (
                        <Box mt="sm">
                          <iframe
                            src={userDetails.address.location}
                            width="100%"
                            height="200"
                            style={{border: 0, borderRadius: "8px"}}
                            allowFullScreen
                            loading="lazy"
                          ></iframe>
                        </Box>
                      )}
                    </Stack>
                  </Card>
                )}
              </Stack>
            </Tabs.Panel>

            {/* Education & Skills Tab */}
            <Tabs.Panel value="education" pt="md">
              <Stack gap="md">
                {/* Study/Education Card */}
                <Card withBorder radius="md" p="md">
                  <Stack gap="md">
                    <Group gap="xs">
                      <FaGraduationCap size={16} />
                      <Title order={5}>{t("Education_Work")}</Title>
                    </Group>
                    <Divider />

                    {userDetails?.study && userDetails.study.length > 0 ? (
                      <Group gap="xs">
                        {userDetails.study.map((item, idx) => (
                          <Badge
                            key={idx}
                            size="lg"
                            variant="light"
                            color="blue"
                            leftSection={<FaGraduationCap size={12} />}
                          >
                            {item}
                          </Badge>
                        ))}
                      </Group>
                    ) : (
                      <Text size="sm" c="dimmed" ta="center">
                        {t("No_education_info")}
                      </Text>
                    )}
                  </Stack>
                </Card>

                {/* Skills Card */}
                <Card withBorder radius="md" p="md">
                  <Stack gap="md">
                    <Group gap="xs">
                      <FaLightbulb size={16} />
                      <Title order={5}>{t("Skills")}</Title>
                    </Group>
                    <Divider />

                    {userDetails?.skills && userDetails.skills.length > 0 ? (
                      <Group gap="xs">
                        {userDetails.skills.map((skill, idx) => (
                          <Badge
                            key={idx}
                            size="lg"
                            variant="dot"
                            color="teal"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </Group>
                    ) : (
                      <Text size="sm" c="dimmed" ta="center">
                        {t("No_skills_added")}
                      </Text>
                    )}
                  </Stack>
                </Card>
              </Stack>
            </Tabs.Panel>

            {/* Activity Tab */}
            <Tabs.Panel value="activity" pt="md">
              <Stack gap="md">
                <Card withBorder radius="md" p="md">
                  <Stack gap="md">
                    <Title order={5} c="dimmed">
                      {t("Activity_History")}
                    </Title>
                    <Divider />

                    <Group grow>
                      <Paper p="md" bg="blue.0" radius="md">
                        <Stack gap="xs" align="center">
                          <FaCalendarAlt size={20} color="blue" />
                          <Text size="xs" c="dimmed" fw={500}>
                            {t("Last_Attendance")}
                          </Text>
                          <Text size="sm" fw={600}>
                            {userDetails?.more?.lastAttendance?.split("T")[0] || "---"}
                          </Text>
                        </Stack>
                      </Paper>

                      <Paper p="md" bg="teal.0" radius="md">
                        <Stack gap="xs" align="center">
                          <FaCalendarAlt size={20} color="teal" />
                          <Text size="xs" c="dimmed" fw={500}>
                            {t("Last_Follow_Up")}
                          </Text>
                          <Text size="sm" fw={600}>
                            {userDetails?.more?.lastFollowUp?.split("T")[0] || "---"}
                          </Text>
                        </Stack>
                      </Paper>

                      <Paper p="md" bg="grape.0" radius="md">
                        <Stack gap="xs" align="center">
                          <FaCalendarAlt size={20} color="purple" />
                          <Text size="xs" c="dimmed" fw={500}>
                            {t("Bible_Last_10")}
                          </Text>
                          <Text size="sm" fw={600}>
                            {userDetails?.bibleFollowUp || 0}
                          </Text>
                        </Stack>
                      </Paper>
                    </Group>
                  </Stack>
                </Card>

                {/* Send Credentials Section */}
                {selectedService?.sendUserCredentials && (
                  <Card withBorder radius="md" p="md" bg="blue.0">
                    <Stack gap="md">
                      <Group gap="xs">
                        <FaPhone size={14} />
                        <Title order={5}>{t("Send_UserId_And_PW")}</Title>
                      </Group>
                      <Divider />

                      <Group grow>
                        {userDetails.motherMobile && (
                          <Button
                            variant="light"
                            color="pink"
                            onClick={() => shareViaSMS(userDetails.motherMobile)}
                            loading={userRequestCredentialsLoading}
                          >
                            {t("Mother")}
                          </Button>
                        )}
                        {userDetails.fatherMobile && (
                          <Button
                            variant="light"
                            color="blue"
                            onClick={() => shareViaSMS(userDetails.fatherMobile)}
                            loading={userRequestCredentialsLoading}
                          >
                            {t("Father")}
                          </Button>
                        )}
                      </Group>
                    </Stack>
                  </Card>
                )}
              </Stack>
            </Tabs.Panel>
          </Tabs>
        </Stack>
      </Modal>
    </>
  )
}

export default UserMoreModal
