import React, {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {listMyServantIn} from "../actions/servantInActions"
import {useTranslation} from "react-i18next"
import {
  Container,
  Loader,
  Stack,
  Text,
  Badge,
  Paper
} from "@mantine/core"
import DashboardStats from "../components/DashboardStats"

function ServantInScreen() {
  const dispatch = useDispatch()
  const [t] = useTranslation()

  const userLogin = useSelector((state) => state.userLogin)
  const {userInfo} = userLogin

  const servantInListMy = useSelector((state) => state.servantInListMy)
  const {loading, servantIn} = servantInListMy

  const servantInList = useSelector((state) => state.servantInList)
  const {selected} = servantInList

  useEffect(() => {
    if (userInfo && userInfo?.user?.authorizedKhadem) {
      dispatch(listMyServantIn(""))
    }
  }, [dispatch, userInfo])

  return (
    <Container size="xl" px="md" py="lg">
      <Stack gap="lg">
        {/* Dashboard Stats */}
        {selected?.service?._id ? (
          <DashboardStats serviceId={selected.service._id} />
        ) : loading ? (
          <Paper shadow="sm" radius="md" p="xl" withBorder>
            <Stack align="center" justify="center" style={{minHeight: 200}}>
              <Loader size="lg" />
              <Text c="dimmed">{t("Loading_services")}</Text>
            </Stack>
          </Paper>
        ) : (
          <Paper shadow="sm" radius="md" p="lg" withBorder ta="center">
            <Stack align="center" gap="md">
              <Badge color="yellow" variant="light" size="lg">
                {t("Not_Added_To_Service_Yet")}
              </Badge>
              <Text c="dimmed">{t("Contact_admin_to_be_added")}</Text>
            </Stack>
          </Paper>
        )}
      </Stack>
    </Container>
  )
}

export default ServantInScreen
