import React, {useState, useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"

import {useTranslation} from "react-i18next"
import {getHoursDiff} from "../components/ServedByListModal"
import {getStore} from "../actions/storeActions"
import {orderPost} from "../actions/orderActions"
import {Button, Group, Loader, Modal, Stack} from "@mantine/core"

function StoreScreen({history}) {
  const dispatch = useDispatch()
  const [t, i18n] = useTranslation()

  const [show, setShow] = useState(false)

  const [id, setId] = useState("")
  const [url, setUrl] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [moreUrl, setMoreUrl] = useState("")
  const [points, setPoints] = useState("")

  const userLogin = useSelector((state) => state.userLogin)
  const {userInfo} = userLogin

  const orderCreate = useSelector((state) => state.orderCreate)
  const {loading: orderCreateLoading} = orderCreate

  const store = useSelector((state) => state.store)
  const {storeData, loading} = store
  useEffect(() => {
    if (
      getHoursDiff(
        localStorage.getItem("servedByLastUpdate") || 0,
        Date.now()
      ) > 0.25
    ) {
      if (userInfo.user.servedBy.length) {
        localStorage.removeItem("servedBy")
        history.push("/")
      }
    } else {
      const currentService = localStorage.getItem("servedBy")
      dispatch(getStore(`serviceId=${currentService.serviceId}`))
    }
  }, [dispatch])

  const handleProduct = (product) => {
    setId(product._id)
    setUrl(product.productUrl)
    setTitle(product.title)
    setDescription(product.description || "")
    setCategory(product.category || "")
    setMoreUrl(product?.moreUrl || "")
    setPoints(product.points)
    setShow(true)
  }

  const handleCreateOrder = (id) => {
    const currentService = localStorage.getItem("servedBy")
    dispatch(orderPost(currentService.serviceId, "PRODUCT", id))
  }

  return (
    <div style={{margin: "auto", direction: t("Dir")}}>
      <Modal opened={show} onClose={() => setShow(false)}>
        <Modal.Body>
          <Group
            className="p-0 m-0 justify-content-center"
            style={{width: "100%", direction: t("Dir")}}
          >
            <Stack className="p-0 m-0" xs={12} sm={12} md={6} lg={6} xl={6}>
              <img
                src={url}
                // className="rounded-circle"
                style={{width: "60%"}}
                alt="Avatar"
              />
            </Stack>
            <Stack className="p-0 m-0" xs={12} sm={12} md={6} lg={6} xl={6}>
              <p className="p-2 m-0"> {title[t("lang")]}</p>
              <p className="p-2 m-0">
                {points} {t("Pts.")}
              </p>
              {orderCreateLoading ? (
                <Loader />
              ) : (
                <Button
                  className="rounded"
                  onClick={() => handleCreateOrder(id)}
                >
                  {t("Redeem_Now")}
                </Button>
              )}
            </Stack>
          </Group>
          <hr />
          <Group
            className="p-0 m-0 justify-content-around"
            style={{width: "100%"}}
          >
            {description !== "" && (
              <>
                <h5 className="p-1 m-0">{t("Description")}</h5>
                <p className="p-1 m-0">{description[t("lang")]}</p>
              </>
            )}

            {moreUrl !== "" && (
              <Nav
                className="p-0 m-0"
                onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}
              >
                <Nav.Item>
                  <Nav.Link href={url}>More</Nav.Link>
                </Nav.Item>
              </Nav>
            )}
          </Group>
        </Modal.Body>
      </Modal>
      {loading ? (
        <Loader />
      ) : storeData?.products?.length ? (
        <Group
          className="p-0 m-0 justify-content-center"
          style={{
            width: "100%"
          }}
        >
          {storeData?.products?.map((product, index) => (
            <Stack
              key={index}
              className="p-1 m-0"
              xs={6}
              sm={6}
              md={4}
              lg={2}
              xl={2}
              // style={{direction: t("Dir")}}
              onClick={() => handleProduct(product)}
            >
              <div className="p-3 m-0 product-card" style={{width: "100%"}}>
                <img
                  src={product.productUrl}
                  // className="rounded-circle"
                  style={{width: "100%", height: "180px"}}
                  alt="Avatar"
                />
                <span style={{width: "80%", textAlign: "center"}}>
                  {product?.title[t("lang")].length > 15
                    ? product?.title[t("lang")].substring(0, 14).concat(" ...")
                    : product?.title[t("lang")]}
                </span>
                <p className="p-0 m-1">
                  {product?.points} {t("Pts.")}
                </p>
              </div>
            </Stack>
          ))}
        </Group>
      ) : (
        <h4 className="p-5 m-0" style={{width: "100%", textAlign: "center"}}>
          {t("No_products_Added_Yet")}
        </h4>
      )}
    </div>
  )
}

export default StoreScreen
