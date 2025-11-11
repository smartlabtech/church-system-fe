import React, {useState, useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {
  Button,
  Group,
  Stack,
  Text,
  SimpleGrid,
  Image,
  Badge,
  Loader,
  Center,
  ActionIcon,
  Paper,
  Title,
  TextInput,
  Box,
  Divider,
  Tooltip
} from "@mantine/core"
import {useTranslation} from "react-i18next"
import {
  FaPlus,
  FaEdit,
  FaTrash,
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
                "linear-gradient(135deg, var(--mantine-color-primary-1) 0%, var(--mantine-color-accent-1) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <FaGift size={48} color="var(--mantine-color-primary-6)" />
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
    <Stack gap="md">
      {/* Filters and Controls */}
      <Paper shadow="sm" radius="md" p="md" withBorder>
        <Group justify="space-between" align="center" gap="sm" wrap="wrap">
          <TextInput
            placeholder={t("Search_products")}
            leftSection={<FaSearch size={16} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="md"
            radius="md"
            style={{flex: 1, minWidth: 0, maxWidth: 400}}
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
              color="primary"
              variant="filled"
              radius="md"
              hiddenFrom="sm"
            >
              <FaPlus size={16} />
            </ActionIcon>
          </Group>
        </Group>
      </Paper>

      {/* Product Count and View Toggle */}
      <Paper shadow="sm" radius="md" p="md" withBorder>
        <Group justify="space-between" align="center">
          <Text size="sm" c="dimmed">
            {filteredProducts?.length || 0} {t("Products")}
          </Text>
          <Group gap="xs" visibleFrom="sm">
            <Tooltip label={t("Grid_View")}>
              <ActionIcon
                size="lg"
                variant={viewMode === "grid" ? "filled" : "light"}
                color="primary"
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
                color="primary"
                onClick={() => setViewMode("list")}
                radius="md"
              >
                <BiListUl size={20} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </Paper>

      {/* Products Display */}
        {!filteredProducts || filteredProducts.length === 0 ? (
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
        ) : viewMode === "grid" ? (
          <SimpleGrid cols={{base: 1, sm: 2, md: 3, lg: 4}} spacing={{ base: "sm", sm: "md" }}>
            {filteredProducts.map((product, index) => (
              <Paper
                key={product._id}
                shadow="sm"
                p={{ base: "sm", sm: "md" }}
                radius="md"
                withBorder
                style={{
                  transition: "all 0.2s ease",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden"
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
                <Box style={{position: "relative", margin: "-0.75rem -0.75rem 0 -0.75rem"}}>
                  <Image
                    src={product.image}
                    height={{ base: 160, sm: 180 }}
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
                      size="sm"
                      style={{
                        position: "absolute",
                        top: 8,
                        left: 8
                      }}
                    >
                      {t("Inactive")}
                    </Badge>
                  )}
                  <Group
                    gap="xs"
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8
                    }}
                  >
                    <Tooltip label={t("Edit")} position="left" withArrow>
                      <ActionIcon
                        variant="filled"
                        color="primary"
                        radius="md"
                        size="md"
                        onClick={() => handleEdit(product)}
                      >
                        <FaEdit size={14} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label={t("Delete")} position="left" withArrow>
                      <ActionIcon
                        variant="filled"
                        color="red"
                        radius="md"
                        size="md"
                        onClick={() => handleDelete(product, index)}
                        loading={deleteLoading && deleteIndex === index}
                      >
                        <FaTrash size={14} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Box>

                <Stack gap="xs" mt="md" style={{flex: 1}}>
                  {/* Title */}
                  <Text
                    size="sm"
                    fw={600}
                    lineClamp={2}
                    style={{minHeight: "2.5rem"}}
                  >
                    {currentLang === "ar"
                      ? product.title?.ar
                      : product.title?.en}
                  </Text>

                  {/* Category Badge */}
                  {product.category && (
                    <Badge
                      variant="light"
                      color="primary"
                      size="xs"
                      style={{alignSelf: "flex-start"}}
                    >
                      {product.category}
                    </Badge>
                  )}

                  <Box mt="auto">
                    <Divider my="xs" />
                    {/* Price and Points */}
                    <Group justify="space-between" align="center">
                      <Stack gap={0}>
                        <Text size="xs" c="dimmed">
                          {t("Price")}
                        </Text>
                        <Text size="lg" fw={600} c="primary">
                          {product.price} {t("EGP")}
                        </Text>
                      </Stack>
                      <Stack gap={0} align="flex-end">
                        <Text size="xs" c="dimmed">
                          {t("Points")}
                        </Text>
                        <Group gap={4}>
                          <Text size="lg" fw={600} c="secondary">
                            {calculatePoints(product.price)}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {t("pt")}
                          </Text>
                        </Group>
                      </Stack>
                    </Group>
                  </Box>
                </Stack>
              </Paper>
            ))}
          </SimpleGrid>
        ) : (
          <Stack gap={{ base: "sm", sm: "md" }}>
            {filteredProducts.map((product, index) => (
              <Paper
                key={product._id}
                shadow="sm"
                p={{ base: "sm", sm: "md" }}
                radius="md"
                withBorder
                style={{
                  overflow: "hidden",
                  transition: "all 0.2s ease"
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
                <Group wrap="nowrap" align="flex-start" gap={{ base: "sm", sm: "md" }}>
                  {/* Product Image */}
                  <Box
                    style={{
                      width: "100px",
                      minWidth: "100px",
                      height: "100px",
                      position: "relative",
                      overflow: "hidden",
                      borderRadius: "var(--mantine-radius-md)"
                    }}
                    sx={(theme) => ({
                      [theme.fn?.largerThan?.('sm') || '@media (min-width: 768px)']: {
                        width: "150px",
                        minWidth: "150px",
                        height: "150px"
                      }
                    })}
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
                        size="xs"
                        style={{
                          position: "absolute",
                          top: 8,
                          left: 8,
                          zIndex: 1
                        }}
                      >
                        {t("Inactive")}
                      </Badge>
                    )}
                  </Box>

                  {/* Product Details */}
                  <Stack gap="xs" style={{flex: 1}}>
                    {/* Category Badge */}
                    {product.category && (
                      <Badge
                        variant="light"
                        color="primary"
                        size="xs"
                        style={{alignSelf: "flex-start"}}
                      >
                        {product.category}
                      </Badge>
                    )}

                    {/* Title */}
                    <Text size="md" fw={600} lineClamp={1}>
                      {currentLang === "ar"
                        ? product.title?.ar
                        : product.title?.en}
                    </Text>

                    {/* Description */}
                    {(product.description?.ar || product.description?.en) && (
                      <Text size="sm" c="dimmed" lineClamp={2}>
                        {currentLang === "ar"
                          ? product.description?.ar
                          : product.description?.en}
                      </Text>
                    )}

                    <Divider my="xs" />

                    {/* Price and Points */}
                    <Group justify="space-between" align="center">
                      <Group gap="lg">
                        <Stack gap={0}>
                          <Text size="xs" c="dimmed">
                            {t("Price")}
                          </Text>
                          <Text size="lg" fw={600} c="primary">
                            {product.price} {t("EGP")}
                          </Text>
                        </Stack>
                        <Divider orientation="vertical" />
                        <Stack gap={0}>
                          <Text size="xs" c="dimmed">
                            {t("Points")}
                          </Text>
                          <Group gap={4}>
                            <Text size="lg" fw={600} c="secondary">
                              {calculatePoints(product.price)}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {t("pt")}
                            </Text>
                          </Group>
                        </Stack>
                      </Group>

                      {/* Actions */}
                      <Group gap="xs">
                        <Tooltip label={t("Edit")} position="left" withArrow>
                          <ActionIcon
                            variant="light"
                            color="primary"
                            radius="md"
                            size="md"
                            onClick={() => handleEdit(product)}
                          >
                            <FaEdit size={14} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label={t("Delete")} position="left" withArrow>
                          <ActionIcon
                            variant="light"
                            color="red"
                            radius="md"
                            size="md"
                            onClick={() => handleDelete(product, index)}
                            loading={deleteLoading && deleteIndex === index}
                          >
                            <FaTrash size={14} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </Group>
                  </Stack>
                </Group>
              </Paper>
            ))}
          </Stack>
        )}

      {/* Add/Edit Modal */}
      <AddUpdateProductModal
        productDetails={selectedProduct}
        status={show}
        serviceId={selectedService?._id}
        onShow={setShow}
        products={products || []}
      />
    </Stack>
  )
}

export default Gifts
