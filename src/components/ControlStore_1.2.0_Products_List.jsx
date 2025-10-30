import React, {useState, useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"

import {useTranslation} from "react-i18next"

import ControlStoreProductListsProduct from "./ControlStore_1.2.1_Products_List_Product"
import {Loader} from "@mantine/core"

function ControlStoreProductLists({onEdit, onDelete}) {
  const [t, i18n] = useTranslation()

  const productGet = useSelector((state) => state.productGet)
  const {loading, data} = productGet

  return loading ? (
    <Loader />
  ) : (
    <div
      className="m-0 p-0"
      style={{
        marginTop: "20px",
        maxHeight: "600px",
        display: "inline-block",
        overflow: "scroll"
      }}
    >
      {data?.length > 0 ? (
        <Group
          className="m-0 p-0 rounded"
          style={{
            width: "100%"
          }}
        >
          {data?.map((product, index) => (
            <Stack
              className="p-1 m-0"
              xs={6}
              sm={6}
              md={4}
              lg={2}
              xl={2}
              key={index}
              style={{maxWidth: "230px"}}
            >
              <ControlStoreProductListsProduct
                index={index}
                product={product}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </Stack>
          ))}
        </Group>
      ) : (
        <h5>{t("Empty")}</h5>
      )}
    </div>
  )
}

export default ControlStoreProductLists
