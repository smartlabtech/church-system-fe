import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  Modal,
  Button,
  Stack,
  TextInput,
  NumberInput,
  Textarea,
  Switch,
  Group,
  Text
} from "@mantine/core"
import { useTranslation } from "react-i18next"
import { productPost, updateProduct } from "../../actions/productActions"

function AddUpdateProductModal({ productDetails, status, serviceId, onShow, products }) {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const productCreate = useSelector((state) => state.productCreate)
  const { loading: createLoading } = productCreate

  const productUpdate = useSelector((state) => state.productUpdate)
  const { loading: updateLoading } = productUpdate

  // Form state
  const [titleAr, setTitleAr] = useState("")
  const [titleEn, setTitleEn] = useState("")
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState("")
  const [url, setUrl] = useState("")
  const [category, setCategory] = useState("general")
  const [videoLink, setVideoLink] = useState("")
  const [descriptionAr, setDescriptionAr] = useState("")
  const [descriptionEn, setDescriptionEn] = useState("")
  const [productStatus, setProductStatus] = useState(true)

  // Populate form when editing
  useEffect(() => {
    if (productDetails) {
      setTitleAr(productDetails.title?.ar || "")
      setTitleEn(productDetails.title?.en || "")
      setPrice(productDetails.price || 0)
      setImage(productDetails.image || "")
      setUrl(productDetails.url || "")
      setCategory(productDetails.category || "general")
      setVideoLink(productDetails.videoLink || "")
      setDescriptionAr(productDetails.description?.ar || "")
      setDescriptionEn(productDetails.description?.en || "")
      setProductStatus(productDetails.status !== undefined ? productDetails.status : true)
    } else {
      // Reset form for new product
      resetForm()
    }
  }, [productDetails, status])

  const resetForm = () => {
    setTitleAr("")
    setTitleEn("")
    setPrice(0)
    setImage("")
    setUrl("")
    setCategory("general")
    setVideoLink("")
    setDescriptionAr("")
    setDescriptionEn("")
    setProductStatus(true)
  }

  const submitHandler = (e) => {
    e.preventDefault()

    const productData = {
      serviceId,
      title: {
        ar: titleAr,
        en: titleEn
      },
      price: Number(price),
      image,
      url: url || undefined,
      category: category || "general",
      videoLink: videoLink || undefined,
      description: {
        ar: descriptionAr,
        en: descriptionEn
      },
      status: productStatus
    }

    if (productDetails?._id) {
      // Update existing product
      const productIndex = products.findIndex(p => p._id === productDetails._id)
      dispatch(updateProduct(products, productIndex, productDetails._id, productData))
    } else {
      // Create new product
      dispatch(productPost(products, productData))
    }

    // Close modal after short delay
    setTimeout(() => {
      onShow(false)
      resetForm()
    }, 500)
  }

  return (
    <Modal
      opened={status}
      onClose={() => {
        onShow(false)
        resetForm()
      }}
      title={
        <Text fw={600} size="lg">
          {productDetails?._id ? t("Edit_Product") : t("Add_Product")}
        </Text>
      }
      size="lg"
    >
      <form onSubmit={submitHandler}>
        <Stack gap="md">
          {/* Title Fields */}
          <Group grow>
            <TextInput
              label={t("Title_Arabic")}
              placeholder={t("Enter_title_in_Arabic")}
              value={titleAr}
              onChange={(e) => setTitleAr(e.target.value)}
              required
            />
            <TextInput
              label={t("Title_English")}
              placeholder={t("Enter_title_in_English")}
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              required
            />
          </Group>

          {/* Price */}
          <NumberInput
            label={t("Price")}
            placeholder={t("Enter_price_in_EGP")}
            value={price}
            onChange={setPrice}
            min={1}
            required
            leftSection={<Text size="xs" c="dimmed">EGP</Text>}
            description={t("Points_will_be_calculated_automatically")}
          />

          {/* Image URL */}
          <TextInput
            label={t("Image_URL")}
            placeholder="https://example.com/image.jpg"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            description={t("Direct_link_to_product_image")}
          />

          {/* Product URL */}
          <TextInput
            label={t("Product_URL")}
            placeholder="https://example.com/product"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            description={t("Link_to_product_page_optional")}
          />

          {/* Category */}
          <TextInput
            label={t("Category")}
            placeholder={t("e.g._games_electronics_books")}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            description={t("Product_category_default_general")}
          />

          {/* Video Link */}
          <TextInput
            label={t("Video_Link")}
            placeholder="https://youtube.com/watch?v=..."
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
            description={t("Optional_video_demonstration")}
          />

          {/* Description Fields */}
          <Group grow>
            <Textarea
              label={t("Description_Arabic")}
              placeholder={t("Enter_description_in_Arabic")}
              value={descriptionAr}
              onChange={(e) => setDescriptionAr(e.target.value)}
              minRows={3}
            />
            <Textarea
              label={t("Description_English")}
              placeholder={t("Enter_description_in_English")}
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              minRows={3}
            />
          </Group>

          {/* Status Switch */}
          <Switch
            label={t("Active_Status")}
            description={t("Enable_or_disable_this_product")}
            checked={productStatus}
            onChange={(event) => setProductStatus(event.currentTarget.checked)}
            color="green"
          />

          {/* Action Buttons */}
          <Group justify="flex-end" mt="md">
            <Button
              variant="default"
              onClick={() => {
                onShow(false)
                resetForm()
              }}
            >
              {t("Cancel")}
            </Button>
            <Button
              type="submit"
              loading={createLoading || updateLoading}
              disabled={!titleAr || !titleEn || !price || price < 1}
            >
              {productDetails?._id ? t("Update_Product") : t("Add_Product")}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}

export default AddUpdateProductModal
