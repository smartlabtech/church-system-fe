import React, {useState, useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"

import {useTranslation} from "react-i18next"

import ErrorModal from "./ErrorModal"
import SuccessModal from "./successModal"
import {productPost, updateProduct} from "../actions/productActions"
import {Loader} from "@mantine/core"

function ControlStoreProductAdd({service, index, product, onClear}) {
  const dispatch = useDispatch()
  const [t, i18n] = useTranslation()

  const productGet = useSelector((state) => state.productGet)
  const {data} = productGet

  const productCreate = useSelector((state) => state.productCreate)
  const {loading} = productCreate

  const productUpdate = useSelector((state) => state.productUpdate)
  const {loading: productUpdateLoading} = productUpdate

  const [url, setUrl] = useState(product?.productUrl || "")
  const [titleAr, setTitleAr] = useState(product?.title?.ar || "")
  const [titleEn, setTitleEn] = useState(product?.title?.en || "")
  const [descriptionEn, setDescriptionEn] = useState(
    product?.description?.en || ""
  )
  const [descriptionAr, setDescriptionAr] = useState(
    product?.description?.ar || ""
  )
  const [realCost, setRealCost] = useState(product?.realCost || "")
  const [category, setCategory] = useState(product?.category || "")

  const submitHandler = () => {
    let productDate = {}
    productDate["serviceId"] = service._id
    productDate["productUrl"] = url
    productDate["title"] = {en: titleEn, ar: titleAr}
    productDate["realCost"] = realCost

    if (descriptionEn != "" || descriptionAr != "")
      productDate["description"] = {en: descriptionEn, ar: descriptionAr}
    if (category != "") productDate["category"] = category
    if (index === "") dispatch(productPost(data, productDate))
    else dispatch(updateProduct(data, index, product._id, productDate))
  }

  return (
    <Group className="p-0 m-0" style={{width: "100%"}}>
      <Form onSubmit={submitHandler}>
        <Stack className="p-0 m-0">
          <Form.Label
            htmlFor="product-url"
            className="update-create-form-label required"
          >
            {t("product_Image_Url")}
          </Form.Label>
          <Form.Control
            id="product-url"
            className="mb-2 mt-2 outline rounded"
            required
            type="text"
            placeholder={t("Image_Link")}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          ></Form.Control>
        </Stack>

        <Stack className="p-0 m-0">
          <Form.Label
            htmlFor="product-title-en"
            className="update-create-form-label required"
          >
            {t("product_Name_en")}
          </Form.Label>
          <Form.Control
            id="product-title-en"
            className="mb-2 outline rounded"
            required
            type="text"
            placeholder="..."
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
          ></Form.Control>
        </Stack>
        <Stack className="p-0 m-0">
          <Form.Label
            htmlFor="product-title"
            className="update-create-form-label required"
          >
            {t("product_Name_ar")}
          </Form.Label>
          <Form.Control
            id="product-title"
            className="mb-2 outline rounded"
            required
            type="text"
            placeholder="..."
            value={titleAr}
            style={{direction: "rtl"}}
            onChange={(e) => setTitleAr(e.target.value)}
          ></Form.Control>
        </Stack>

        <Stack className="p-0 m-0">
          <Form.Label
            htmlFor="product-description"
            className="update-create-form-label"
          >
            {t("product_Description_en")}
          </Form.Label>
          <Form.Control
            id="product-description"
            className="mb-2 outline rounded"
            type="text"
            placeholder="..."
            value={descriptionEn}
            onChange={(e) => setDescriptionEn(e.target.value)}
          ></Form.Control>
        </Stack>
        <Stack className="p-0 m-0">
          <Form.Label
            htmlFor="product-description"
            className="update-create-form-label"
          >
            {t("product_Description_ar")}
          </Form.Label>
          <Form.Control
            id="product-description"
            className="mb-2 outline rounded"
            type="text"
            placeholder="..."
            style={{direction: "rtl"}}
            value={descriptionAr}
            onChange={(e) => setDescriptionAr(e.target.value)}
          ></Form.Control>
        </Stack>

        <Stack className="p-0 m-0">
          <Form.Label
            htmlFor="product-cost"
            className="update-create-form-label required"
          >
            {t("product_Real_Cost")}
          </Form.Label>
          <Form.Control
            id="product-cost"
            className="mb-2 outline rounded"
            required
            type="number"
            placeholder="150"
            value={realCost}
            onChange={(e) => setRealCost(e.target.value)}
          ></Form.Control>
        </Stack>

        <Stack className="p-0 m-0">
          {loading || productUpdateLoading ? (
            <Loader />
          ) : (
            <>
              <Button
                className="p-2 m-1 rounded"
                style={{width: "100%"}}
                type="submit"
                variant="success"
              >
                {index === "" ? t("Create") : t("Update")}
              </Button>
              <Button
                hidden={index === ""}
                className="p-2 m-1 rounded"
                style={{width: "100%"}}
                variant="outline-danger"
                onClick={() => onClear()}
              >
                {t("Cancel")}
              </Button>
            </>
          )}
        </Stack>
      </Form>
    </Group>
  )
}

export default ControlStoreProductAdd
