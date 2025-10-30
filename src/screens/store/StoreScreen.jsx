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
          {item?.title?.ar || item?.title?.en || "Product"}
        </Text>

        <Group justify="space-between" align="center">
          <Badge size="lg" color="secondary" variant="light" leftSection="🏆">
            {item.points} pts
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
                  title: "نقاطك غير كافية",
                  message: `تحتاج ${item.points - userPoints} نقطة إضافية`,
                  autoClose: 4000
                })
              } else {
                notifications.show({
                  id: "order-success",
                  color: "green",
                  title: "تم الطلب بنجاح",
                  message: "سيتم التواصل معك قريباً",
                  autoClose: 3000
                })
              }
            }}
          >
            اطلب الآن
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
                متجر النقاط
              </Title>
              <Text size="sm" c="dimmed" mt="xs">
                استبدل نقاطك بجوائز قيمة
              </Text>
            </div>
            {storeData?.userPoints !== undefined && (
              <Badge size="xl" color="secondary" variant="filled">
                رصيدك: {storeData.userPoints} نقطة
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
                لا توجد منتجات متاحة
              </Badge>
              <Text c="dimmed">سيتم إضافة منتجات جديدة قريباً</Text>
            </Stack>
          </Paper>
        )}
      </Stack>
    </Container>
  )
}

export default StoreScreen
