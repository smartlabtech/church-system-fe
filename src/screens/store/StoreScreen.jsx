import React, {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {getStore} from "../../actions/storeActions"
import ServedByModal from "../../components/ServedByListModal"
import {useTranslation} from "react-i18next"
import {
  Badge,
  Button,
  Card,
  Container,
  Group,
  Image,
  Loader,
  LoadingOverlay,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title
} from "@mantine/core"
import {notifications} from "@mantine/notifications"

const StoreScreen = () => {
  const dispatch = useDispatch()
  const {t} = useTranslation()

  const servedBy = useSelector((state) => state.servedBy)
  const {service} = servedBy

  const store = useSelector((state) => state.store)
  const {storeData, loading} = store

  const userLogin = useSelector((state) => state.userLogin)
  const {userInfo} = userLogin

  const items = storeData?.products?.map((item, index) => (
    <Card
      key={index}
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        cursor: "pointer"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)"
        e.currentTarget.style.boxShadow = "var(--mantine-shadow-lg)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)"
        e.currentTarget.style.boxShadow = "var(--mantine-shadow-sm)"
      }}
    >
      <Card.Section>
        <Image
          src={item?.image}
          height={200}
          alt={item?.title?.ar || "Product"}
          fit="cover"
        />
      </Card.Section>

      <Stack gap="sm" mt="md">
        <Text size="sm" fw={600} lineClamp={2}>
          {t("lang") === "ar" ? (item?.title?.ar || item?.title?.en || "Product") : (item?.title?.en || item?.title?.ar || "Product")}
        </Text>

        <Group justify="space-between" align="center">
          <Badge size="lg" color="secondary" variant="light" leftSection="🏆">
            {item.points} {t("Points")}
          </Badge>

          <Button
            size="sm"
            variant="filled"
            color="primary"
            onClick={(e) => {
              e.stopPropagation()
              const userPoints = storeData?.userPoints || 0
              if (userPoints < item.points) {
                notifications.show({
                  id: "not-enough",
                  color: "red",
                  title: t("Not_Enough_Points"),
                  message: t("You_need_more_points").replace("{count}", item.points - userPoints),
                  autoClose: 4000
                })
              } else {
                notifications.show({
                  id: "order-success",
                  color: "green",
                  title: t("Order_Successful"),
                  message: t("We_will_contact_you_soon"),
                  autoClose: 3000
                })
              }
            }}
          >
            {t("Order_Now")}
          </Button>
        </Group>
      </Stack>
    </Card>
  ))

  useEffect(() => {
    if (service?._id) {
      dispatch(getStore(`serviceId=${service.serviceId}&status=TRUE`))
    }
  }, [dispatch, service])

  return (
    <Container size="xl" px="md" pb="xl">
      <Stack gap="lg">
        <ServedByModal userInfo={userInfo} />

        {/* Header Section */}
        <Paper shadow="sm" radius="md" p="md" withBorder>
          <Group justify="space-between">
            <div>
              <Title order={2} c="primary.6">
                {t("Points_Store")}
              </Title>
              <Text size="sm" c="dimmed" mt="xs">
                {t("Redeem_your_points_for_valuable_rewards")}
              </Text>
            </div>
            {storeData?.userPoints !== undefined && (
              <Badge size="xl" color="secondary" variant="filled">
                {t("Your_Balance")}: {storeData.userPoints} {t("point")}
              </Badge>
            )}
          </Group>
        </Paper>

        {/* Products Grid */}
        {loading ? (
          <Stack align="center" py="xl">
            <Loader size="lg" />
            <Text c="dimmed">{t("Loading_products")}...</Text>
          </Stack>
        ) : storeData?.products?.length > 0 ? (
          <SimpleGrid cols={{base: 1, xs: 2, sm: 3, lg: 4}} spacing="lg">
            {items}
          </SimpleGrid>
        ) : (
          <Paper shadow="sm" radius="md" p="xl" withBorder ta="center">
            <Stack align="center" gap="md">
              <Badge size="xl" color="gray" variant="light">
                {t("No_Products_Available")}
              </Badge>
              <Text c="dimmed">{t("New_products_coming_soon")}</Text>
            </Stack>
          </Paper>
        )}
      </Stack>
    </Container>
  )
}

export default StoreScreen
