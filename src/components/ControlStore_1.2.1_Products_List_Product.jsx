import {useDispatch, useSelector} from "react-redux"

import {useTranslation} from "react-i18next"
import {Loader} from "@mantine/core"

function ControlStoreProductListsProduct({index, product, onDelete, onEdit}) {
  const [t, i18n] = useTranslation()

  const productDelete = useSelector((state) => state.productDelete)
  const {loading, deleteIndex} = productDelete

  return (
    <div
      className="m-0 p-1 rounded outline"
      style={{width: "100%", height: "100%"}}
    >
      <Group className="p-0 m-0 justify-content-between">
        <Stack xs={2} sm={2} md={2} lg={2} xl={2} className="p-0 m-0">
          {deleteIndex === index && loading ? (
            <Loader />
          ) : (
            <i
              className="p-0 m-0 bi bi-trash3"
              style={{color: "red", fontSize: "16px"}}
              onClick={() => onDelete(index, product)}
            ></i>
          )}
        </Stack>
        <Stack xs={2} className="p-0 m-0">
          <i
            className="p-0 m-0 bi bi-pencil-square"
            style={{color: "grey", fontSize: "16px"}}
            onClick={() => onEdit(index, product)}
          ></i>
        </Stack>
      </Group>
      <Group className="p-0 m-0">
        <Image
          className="p-0 m-0 rounded"
          style={{
            maxHeight: "150px"
          }}
          src={product.productUrl}
          alt="product-images"
        />
      </Group>
      <Group className="p-2 m-0">
        <p className="p-0 m-0" style={{fontSize: "10px"}}>
          {product?.title?.en}
        </p>
      </Group>
      <Group className="p-0 m-0 justify-content-between">
        <Stack xs={6} className="p-0 m-0">
          <p
            className="p-0 m-0"
            style={{fontSize: "10px", color: product.status ? "green" : "red"}}
          >
            {product.status ? "Active" : "Inactive"}
          </p>
        </Stack>
        <Stack xs={6} className="p-0 m-0">
          <p className="p-0 m-0" style={{fontSize: "10px"}}>
            {product.points} {t("Pts.")}
          </p>
        </Stack>
      </Group>
    </div>
  )
}

export default ControlStoreProductListsProduct
