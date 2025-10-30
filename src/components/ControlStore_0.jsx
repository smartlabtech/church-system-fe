import React, {useState, useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"

import {useTranslation} from "react-i18next"

import ControlStoreProduct from "./ControlStore_1.0_Product"

import {productsGet} from "../actions/productActions"

function ControlStore({service}) {
  const dispatch = useDispatch()
  const [t, i18n] = useTranslation()

  const [product_voucher, setProduct_voucher] = useState("")

  const [addorlist, setAddorlist] = useState("list")

  const onButton = (type) => {
    setProduct_voucher(type)
    if (type === "Product") dispatch(productsGet(`serviceId=${service._id}`))
  }

  return (
    <>
      <Group
        data-mdb-toggle="modal"
        data-mdb-target="#manage-store"
        className="m-0 p-0 module card"
        style={{direction: t("Dir")}}
      >
        <Stack
          className="m-0 p-3 justify-content-start"
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
        >
          <p className="p-0 m-0">
            {t("Store")}
            <span style={{color: "green"}}>
              <i className="bi bi-shield-fill-check"></i>
            </span>
          </p>
          <i className="p-0 m-0 large-size bi bi-shop"></i>
        </Stack>
      </Group>
      <div
        className="modal  fade"
        id="manage-store"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="p-0 m-0" style={{width: "100%"}}>
              <Group className="p-0 m-0">
                <Stack>
                  <Button
                    className="rounded"
                    variant={
                      product_voucher === "Product" ? "info" : "outline-info"
                    }
                    size="sm"
                    onClick={() => onButton("Product")}
                  >
                    Products
                  </Button>
                </Stack>
                <Stack>
                  <Button
                    className="rounded"
                    variant={
                      product_voucher === "Voucher" ? "info" : "outline-info"
                    }
                    size="sm"
                    onClick={() => onButton("Voucher")}
                  >
                    Vouchers
                  </Button>
                </Stack>
              </Group>

              {product_voucher === "Product" ? (
                <ControlStoreProduct service={service} />
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ControlStore
