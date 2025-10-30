import React, {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {getMyProfile} from "../actions/userActions"

import {useTranslation} from "react-i18next"
import {useNavigate} from "react-router-dom"
import {
  Container,
  Divider,
  Grid,
  Group,
  Loader,
  Paper,
  Stack,
  Tabs,
  Text,
  Title
} from "@mantine/core"
import UpdateProfileCard from "../components/updateProfileCard"
import UpdatePhotoCard from "../components/updatePhotoCard"
import ChangeMobileCard from "../components/ChangeMobileCard"
import ChangeEmailCard from "../components/ChangeEmailCard"
import ChangePwCard from "../components/changePwCard"
import {
  FaUser,
  FaCamera,
  FaMobile,
  FaEnvelope,
  FaLock,
  FaShieldAlt
} from "react-icons/fa"

function AccountScreen() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [t] = useTranslation()

  const userLogin = useSelector((state) => state.userLogin)
  const {userInfo, loading} = userLogin

  useEffect(() => {
    if (!userInfo) {
      navigate(`/`)
    }
  }, [navigate, dispatch])

  return loading ? (
    <Container size="lg" px="xl">
      <Stack align="center" gap="md">
        <Loader size="lg" />
        <Text c="dimmed">{t("Loading_profile")}</Text>
      </Stack>
    </Container>
  ) : (
    <Container size="lg" px="md">
      <Stack gap="lg">
        {/* Header */}
        <Paper shadow="sm" radius="md" p="md" withBorder>
          <Title order={2} c="primary.6">{t("My_Profile")}</Title>
          <Text size="sm" c="dimmed" mt="xs">{t("Manage_your_account_settings")}</Text>
        </Paper>

        {/* Profile Sections in Tabs */}
        <Tabs defaultValue="profile" variant="pills">
          <Tabs.List grow mb="lg">
            <Tabs.Tab value="profile" leftSection={<FaUser size={16} />}>
              {t("Profile")}
            </Tabs.Tab>
            <Tabs.Tab value="security" leftSection={<FaShieldAlt size={16} />}>
              {t("Security")}
            </Tabs.Tab>
            <Tabs.Tab value="contact" leftSection={<FaEnvelope size={16} />}>
              {t("Contact")}
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="profile">
            <Grid gutter="lg">
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Paper shadow="sm" radius="md" p="lg" withBorder h="100%">
                  <Stack align="center">
                    <FaCamera size={24} color="var(--mantine-color-primary-6)" />
                    <Text fw={600}>{t("Profile_Photo")}</Text>
                    <UpdatePhotoCard />
                  </Stack>
                </Paper>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Paper shadow="sm" radius="md" p="lg" withBorder h="100%">
                  <Stack>
                    <Group gap="xs">
                      <FaUser size={20} color="var(--mantine-color-primary-6)" />
                      <Text fw={600} size="lg">{t("Personal_Information")}</Text>
                    </Group>
                    <UpdateProfileCard />
                  </Stack>
                </Paper>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          <Tabs.Panel value="security">
            <Stack gap="lg">
              <Paper shadow="sm" radius="md" p="lg" withBorder>
                <Stack>
                  <Group gap="xs">
                    <FaLock size={20} color="var(--mantine-color-primary-6)" />
                    <Text fw={600} size="lg">{t("Change_Password")}</Text>
                  </Group>
                  <Text size="sm" c="dimmed" mb="md">
                    {t("Keep_your_account_secure_with_strong_password")}
                  </Text>
                  <ChangePwCard />
                </Stack>
              </Paper>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="contact">
            <Stack gap="lg">
              <Paper shadow="sm" radius="md" p="lg" withBorder>
                <Stack>
                  <Group gap="xs">
                    <FaMobile size={20} color="var(--mantine-color-primary-6)" />
                    <Text fw={600} size="lg">{t("Mobile_Number")}</Text>
                  </Group>
                  <Text size="sm" c="dimmed" mb="md">
                    {t("Update_your_mobile_number_for_account_verification")}
                  </Text>
                  <ChangeMobileCard />
                </Stack>
              </Paper>

              <Paper shadow="sm" radius="md" p="lg" withBorder>
                <Stack>
                  <Group gap="xs">
                    <FaEnvelope size={20} color="var(--mantine-color-primary-6)" />
                    <Text fw={600} size="lg">{t("Email_Address")}</Text>
                  </Group>
                  <Text size="sm" c="dimmed" mb="md">
                    {t("Update_your_email_for_notifications")}
                  </Text>
                  <ChangeEmailCard />
                </Stack>
              </Paper>
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  )
}

export default AccountScreen
