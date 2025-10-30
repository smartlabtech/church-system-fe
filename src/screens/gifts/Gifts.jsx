import React, {useState, useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {
  Button,
  Group,
  Stack,
  Text,
  SimpleGrid,
  Card,
  Image,
  Badge,
  Loader,
  Center,
  ActionIcon,
  Paper,
  Title,
  Menu,
  TextInput,
  Box,
  Container,
  Divider,
  Tooltip,
  rem
} from "@mantine/core"
import {useTranslation} from "react-i18next"
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEllipsisV,
  FaSearch,
  FaGift,
  FaTag,
  FaCoins
} from "react-icons/fa"
import {BiGridSmall, BiListUl} from "react-icons/bi"
import AddUpdateProductModal from "./Add_UpdateProductModal"
import {productsGet, productDelete} from "../../actions/productActions"
import {modals} from "@mantine/modals"

const Gifts = ({selectedService}) => {
  const {t, i18n} = useTranslation()
  const dispatch = useDispatch()
  const currentLang = i18n.language

  const [show, setShow] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [viewMode, setViewMode] = useState("grid") // grid or list
  const [searchTerm, setSearchTerm] = useState("")

  const productGet = useSelector((state) => state.productGet)
  const {loading, data: products} = productGet

  const productDelete_state = useSelector((state) => state.productDelete)
  const {loading: deleteLoading, deleteIndex} = productDelete_state

  // Fetch products when service is selected
  useEffect(() => {
    if (selectedService?._id) {
      dispatch(productsGet(`serviceId=${selectedService._id}`))
    }
  }, [dispatch, selectedService])

  const handleEdit = (product) => {
    setSelectedProduct(product)
    setShow(true)
  }

  const handleAdd = () => {
    setSelectedProduct(null)
    setShow(true)
  }

  const handleDelete = (product, index) => {
    modals.openConfirmModal({
      title: t("Delete_Product"),
      centered: true,
      children: (
        <Text size="sm">
          {t("Are_you_sure_you_want_to_delete")} "
          {currentLang === "ar" ? product.title?.ar : product.title?.en}"?
        </Text>
      ),
      labels: {confirm: t("Delete"), cancel: t("Cancel")},
      confirmProps: {color: "red"},
      onConfirm: () => {
        dispatch(
          productDelete(product._id, index, products || [], selectedService._id)
        )
      }
    })
  }

  // Filter products based on search term
  const filteredProducts = products?.filter((product) => {
    if (!searchTerm) return true
    const titleAr = product.title?.ar?.toLowerCase() || ""
    const titleEn = product.title?.en?.toLowerCase() || ""
    const category = product.category?.toLowerCase() || ""
    const search = searchTerm.toLowerCase()
    return (
      titleAr.includes(search) ||
      titleEn.includes(search) ||
      category.includes(search)
    )
  })

  // Calculate points (points = price * 1.5)
  const calculatePoints = (price) => {
    return Math.round(price * 1.5)
  }

  if (!selectedService) {
    return (
      <Center style={{minHeight: 400}}>
        <Stack align="center" gap="lg">
          <Box
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, var(--mantine-color-blue-1) 0%, var(--mantine-color-cyan-1) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <FaGift size={48} color="var(--mantine-color-blue-6)" />
          </Box>
          <Title order={3} c="dimmed" ta="center">
            {t("Please_select_a_service_to_manage_products")}
          </Title>
        </Stack>
      </Center>
    )
  }

  if (loading) {
    return (
      <Center style={{minHeight: 400}}>
        <Stack align="center" gap="md">
          <Loader size="lg" type="dots" />
          <Text c="dimmed">{t("Loading_products")}...</Text>
        </Stack>
      </Center>
    )
  }

  return (
    <Container size="xl" px={0}>
      <Stack gap="md">
        {/* Header Section - Cleaner Design */}
        <Stack gap="sm">
          <Group justify="space-between" align="center" gap="sm">
            <TextInput
              placeholder={t("Search_products")}
              leftSection={<FaSearch size={16} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="md"
              radius="md"
              style={{ flex: 1, minWidth: 0, maxWidth: 400 }}
            />
            <Group gap="xs">
              <Button
                leftSection={<FaPlus size={16} />}
                onClick={handleAdd}
                size="md"
                radius="md"
                visibleFrom="sm"
              >
                {t("Add_Product")}
              </Button>
              <ActionIcon
                size="lg"
                onClick={handleAdd}
                color="blue"
                variant="filled"
                radius="md"
                hiddenFrom="sm"
              >
                <FaPlus size={18} />
              </ActionIcon>
            </Group>
          </Group>

          {/* Product Count and View Toggle */}
          <Group justify="space-between" align="center">
            <Text size="sm" c="dimmed">
              {filteredProducts?.length || 0} {t("Products")}
            </Text>
            <Group gap="xs" visibleFrom="sm">
              <Tooltip label={t("Grid_View")}>
                <ActionIcon
                  size="lg"
                  variant={viewMode === "grid" ? "filled" : "light"}
                  color="blue"
                  onClick={() => setViewMode("grid")}
                  radius="md"
                >
                  <BiGridSmall size={20} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label={t("List_View")}>
                <ActionIcon
                  size="lg"
                  variant={viewMode === "list" ? "filled" : "light"}
                  color="blue"
                  onClick={() => setViewMode("list")}
                  radius="md"
                >
                  <BiListUl size={20} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>
        </Stack>

        {/* Products Display */}
        {!filteredProducts || filteredProducts.length === 0 ? (
          <Paper p="xl" radius="md" withBorder>
            <Center style={{minHeight: 300}}>
              <Stack align="center" gap="lg">
                <Box
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    background: "var(--mantine-color-gray-1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <FaGift size={40} color="var(--mantine-color-gray-5)" />
                </Box>
                <Stack gap="xs" align="center">
                  <Title order={3} c="dimmed">
                    {t("No_products_found")}
                  </Title>
                  <Text size="sm" c="dimmed" ta="center">
                    {searchTerm
                      ? t("Try_different_search_term")
                      : t("Click_add_product_to_get_started")}
                  </Text>
                </Stack>
                {!searchTerm && (
                  <Button
                    leftSection={<FaPlus size={16} />}
                    onClick={handleAdd}
                    variant="light"
                    size="md"
                  >
                    {t("Add_Your_First_Product")}
                  </Button>
                )}
              </Stack>
            </Center>
          </Paper>
        ) : viewMode === "grid" ? (
          <SimpleGrid cols={{base: 1, sm: 2, md: 3, lg: 4}} spacing="lg">
            {filteredProducts.map((product, index) => (
              <Card
                key={product._id}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                style={{
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "pointer",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)"
                  e.currentTarget.style.boxShadow =
                    "0 20px 40px rgba(0, 0, 0, 0.12)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "var(--mantine-shadow-sm)"
                }}
              >
                <Card.Section>
                  <Box style={{position: "relative"}}>
                    <Image
                      src={product.image}
                      height={200}
                      alt={
                        currentLang === "ar"
                          ? product.title?.ar
                          : product.title?.en
                      }
                      fallbackSrc="https://via.placeholder.com/400x300?text=No+Image"
                      style={{objectFit: "cover"}}
                    />
                    {!product.status && (
                      <Badge
                        color="red"
                        variant="filled"
                        style={{
                          position: "absolute",
                          top: 10,
                          left: 10
                        }}
                      >
                        {t("Inactive")}
                      </Badge>
                    )}
                    <Menu position="bottom-end" shadow="md">
                      <Menu.Target>
                        <ActionIcon
                          variant="filled"
                          color="dark"
                          radius="xl"
                          size="lg"
                          style={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            opacity: 0.9
                          }}
                        >
                          <FaEllipsisV size={14} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item
                          leftSection={<FaEdit size={14} />}
                          onClick={() => handleEdit(product)}
                        >
                          {t("Edit")}
                        </Menu.Item>
                        <Menu.Item
                          leftSection={<FaTrash size={14} />}
                          color="red"
                          onClick={() => handleDelete(product, index)}
                          disabled={deleteLoading && deleteIndex === index}
                        >
                          {deleteLoading && deleteIndex === index
                            ? t("Deleting")
                            : t("Delete")}
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Box>
                </Card.Section>

                <Stack gap="sm" mt="md" style={{flex: 1}}>
                  {/* Category Badge */}
                  {product.category && (
                    <Badge
                      variant="light"
                      color="blue"
                      size="sm"
                      leftSection={<FaTag size={10} />}
                      style={{alignSelf: "flex-start"}}
                    >
                      {product.category}
                    </Badge>
                  )}

                  {/* Title */}
                  <Title order={4} lineClamp={2} fw={600}>
                    {currentLang === "ar"
                      ? product.title?.ar
                      : product.title?.en}
                  </Title>

                  {/* Description */}
                  {(product.description?.ar || product.description?.en) && (
                    <Text size="sm" c="dimmed" lineClamp={2}>
                      {currentLang === "ar"
                        ? product.description?.ar
                        : product.description?.en}
                    </Text>
                  )}

                  <Box mt="auto">
                    <Divider my="sm" />
                    {/* Price and Points */}
                    <Group justify="space-between" align="center">
                      <Box>
                        <Text size="xs" c="dimmed" fw={500}>
                          {t("Price")}
                        </Text>
                        <Text size="xl" fw={700} c="blue">
                          {product.price} {t("EGP")}
                        </Text>
                      </Box>
                      <Box ta="right">
                        <Text size="xs" c="dimmed" fw={500}>
                          {t("Points")}
                        </Text>
                        <Group gap={4} justify="flex-end">
                          <FaCoins
                            size={16}
                            color="var(--mantine-color-orange-6)"
                          />
                          <Text size="lg" fw={700} c="orange">
                            {calculatePoints(product.price)}
                          </Text>
                        </Group>
                      </Box>
                    </Group>
                  </Box>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        ) : (
          <Stack gap="md">
            {filteredProducts.map((product, index) => (
              <Paper
                key={product._id}
                shadow="sm"
                radius="md"
                withBorder
                style={{
                  overflow: "hidden",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateX(4px)"
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(0, 0, 0, 0.12)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateX(0)"
                  e.currentTarget.style.boxShadow = "var(--mantine-shadow-sm)"
                }}
              >
                <Group wrap="nowrap" align="stretch" gap={0}>
                  {/* Product Image */}
                  <Box
                    style={{
                      width: 200,
                      minWidth: 200,
                      height: 200,
                      position: "relative",
                      overflow: "hidden"
                    }}
                  >
                    <Image
                      src={product.image}
                      height="100%"
                      width="100%"
                      alt={
                        currentLang === "ar"
                          ? product.title?.ar
                          : product.title?.en
                      }
                      fallbackSrc="https://via.placeholder.com/200x200?text=No+Image"
                      style={{
                        objectFit: "cover",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%"
                      }}
                    />
                    {!product.status && (
                      <Badge
                        color="red"
                        variant="filled"
                        style={{
                          position: "absolute",
                          top: 10,
                          left: 10,
                          zIndex: 1
                        }}
                      >
                        {t("Inactive")}
                      </Badge>
                    )}
                  </Box>

                  {/* Product Details */}
                  <Box p="lg" style={{flex: 1}}>
                    <Group
                      justify="space-between"
                      align="flex-start"
                      wrap="nowrap"
                    >
                      <Stack gap="sm" style={{flex: 1}}>
                        {/* Category Badge */}
                        {product.category && (
                          <Badge
                            variant="light"
                            color="blue"
                            size="md"
                            leftSection={<FaTag size={12} />}
                            style={{alignSelf: "flex-start"}}
                          >
                            {product.category}
                          </Badge>
                        )}

                        {/* Title */}
                        <Title order={3} fw={600} lineClamp={1}>
                          {currentLang === "ar"
                            ? product.title?.ar
                            : product.title?.en}
                        </Title>

                        {/* Description */}
                        {(product.description?.ar ||
                          product.description?.en) && (
                          <Text size="sm" c="dimmed" lineClamp={2}>
                            {currentLang === "ar"
                              ? product.description?.ar
                              : product.description?.en}
                          </Text>
                        )}

                        {/* Price and Points */}
                        <Group gap="xl" mt="md">
                          <Box>
                            <Text size="xs" c="dimmed" fw={500} mb={4}>
                              {t("Price")}
                            </Text>
                            <Text size="xl" fw={700} c="blue">
                              {product.price} {t("EGP")}
                            </Text>
                          </Box>
                          <Divider orientation="vertical" />
                          <Box>
                            <Text size="xs" c="dimmed" fw={500} mb={4}>
                              {t("Points")}
                            </Text>
                            <Group gap={6}>
                              <FaCoins
                                size={18}
                                color="var(--mantine-color-orange-6)"
                              />
                              <Text size="xl" fw={700} c="orange">
                                {calculatePoints(product.price)}
                              </Text>
                            </Group>
                          </Box>
                        </Group>
                      </Stack>

                      {/* Actions Menu */}
                      <Menu position="bottom-end" shadow="md">
                        <Menu.Target>
                          <ActionIcon
                            variant="light"
                            color="gray"
                            radius="md"
                            size="lg"
                          >
                            <FaEllipsisV size={16} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item
                            leftSection={<FaEdit size={14} />}
                            onClick={() => handleEdit(product)}
                          >
                            {t("Edit")}
                          </Menu.Item>
                          <Menu.Item
                            leftSection={<FaTrash size={14} />}
                            color="red"
                            onClick={() => handleDelete(product, index)}
                            disabled={deleteLoading && deleteIndex === index}
                          >
                            {deleteLoading && deleteIndex === index
                              ? t("Deleting")
                              : t("Delete")}
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Group>
                  </Box>
                </Group>
              </Paper>
            ))}
          </Stack>
        )}
      </Stack>

      {/* Add/Edit Modal */}
      <AddUpdateProductModal
        productDetails={selectedProduct}
        status={show}
        serviceId={selectedService?._id}
        onShow={setShow}
        products={products || []}
      />
    </Container>
  )
}

export default Gifts
