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
  Title,
  ActionIcon,
  Tooltip,
  Divider
} from "@mantine/core"
import {FaGift, FaShoppingBag, FaShoppingCart} from "react-icons/fa"
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

  const handleOrder = (item) => {
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
  }

  const items = storeData?.products?.map((item, index) => (
    <Card
      key={index}
      shadow="sm"
      padding="md"
      radius="md"
      withBorder
      style={{
        transition: "all 0.2s ease",
        display: "flex",
        flexDirection: "column"
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

      <Stack gap="xs" mt="md" style={{ flex: 1 }}>
        <Text size="sm" fw={600} lineClamp={2} style={{ minHeight: "2.5rem" }}>
          {t("lang") === "ar" ? (item?.title?.ar || item?.title?.en || "Product") : (item?.title?.en || item?.title?.ar || "Product")}
        </Text>

        <Divider />

        <Group justify="space-between" align="center" mt="auto">
          <Badge size="lg" color="blue" variant="light">
            🏆 {item.points} {t("pt")}
          </Badge>

          <Tooltip label={t("Order_Now")} position="left" withArrow>
            <ActionIcon
              variant="filled"
              color="green"
              size="lg"
              radius="md"
              onClick={(e) => {
                e.stopPropagation()
                handleOrder(item)
              }}
            >
              <FaShoppingCart size={18} />
            </ActionIcon>
          </Tooltip>
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
          <Stack gap="sm">
            <Group justify="space-between" wrap="wrap">
              <div>
                <Title order={2} c="primary.6">
                  <Group gap="xs">
                    <FaGift size={24} />
                    {t("Points_Store")}
                  </Group>
                </Title>
                <Text size="sm" c="dimmed" mt="xs">
                  {t("Redeem_your_points_for_valuable_rewards")}
                </Text>
              </div>
              {storeData?.userPoints !== undefined && (
                <Badge size="xl" color="green" variant="filled" style={{ padding: "12px 20px" }}>
                  💰 {storeData.userPoints} {t("pt")}
                </Badge>
              )}
            </Group>
          </Stack>
        </Paper>

        {/* Products Grid */}
        {loading ? (
          <Stack align="center" py="xl" gap="md">
            <Loader size="lg" />
            <Text c="dimmed">{t("Loading_products")}...</Text>
          </Stack>
        ) : storeData?.products?.length > 0 ? (
          <SimpleGrid cols={{base: 1, xs: 2, sm: 2, md: 3, lg: 4}} spacing="md">
            {items}
          </SimpleGrid>
        ) : (
          <Stack align="center" py="xl" gap="md">
            <FaGift size={48} color="var(--mantine-color-gray-5)" />
            <div style={{ textAlign: "center" }}>
              <Text size="lg" fw={600} c="dimmed">
                {t("No_Products_Available")}
              </Text>
              <Text size="sm" c="dimmed" mt="xs">
                {t("New_products_coming_soon")}
              </Text>
            </div>
          </Stack>
        )}
      </Stack>
    </Container>
  )
}

export default StoreScreen
