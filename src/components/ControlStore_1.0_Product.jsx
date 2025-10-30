import React, {useState, useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"

import {useTranslation} from "react-i18next"

import {productDelete} from "../actions/productActions"
import ControlStoreProductAdd from "./ControlStore_1.1_Product_Add"
import ControlStoreProductLists from "./ControlStore_1.2.0_Products_List"

function ControlStoreProduct({service}) {
  const dispatch = useDispatch()
  const [t, i18n] = useTranslation()

  const productGet = useSelector((state) => state.productGet)
  const {data} = productGet

  const [addorlist, setAddorlist] = useState("list")

  const [indexToUpdate, setIndexToUpdate] = useState("")
  const [productToUpdate, setProductToUpdate] = useState("")

  const onEdit = (index, product) => {
    setIndexToUpdate(index)
    setProductToUpdate(product)
    setAddorlist("add")
  }

  const onClear = () => {
    setIndexToUpdate("")
    setProductToUpdate("")
    setAddorlist("list")
  }

  const onDelete = (index, product) => {
    dispatch(productDelete(product._id, index, data, service._id))
  }

  return (
    <>
      <Group className="p-2 m-0 justify-content-end" style={{width: "100%"}}>
        <Stack className="p-0 m-0" sm={2} xs={2} md={2} lg={2} xl={2}>
          {addorlist === "list" ? (
            <i
              className="bi bi-plus-square-dotted"
              style={{fontSize: "26px", color: "green"}}
              onClick={() => setAddorlist("add")}
            ></i>
          ) : (
            <i
              className="bi bi-list-task"
              style={{fontSize: "26px"}}
              onClick={() => setAddorlist("list")}
            ></i>
          )}
        </Stack>
      </Group>
      <Group className="p-0 m-0 justify-content-end" style={{width: "100%"}}>
        {addorlist === "add" ? (
          <ControlStoreProductAdd
            service={service}
            index={indexToUpdate}
            product={productToUpdate}
            onClear={onClear}
          />
        ) : (
          ""
        )}

        {addorlist === "list" ? (
          <ControlStoreProductLists onEdit={onEdit} onDelete={onDelete} />
        ) : (
          ""
        )}
      </Group>
    </>
  )
}

export default ControlStoreProduct
