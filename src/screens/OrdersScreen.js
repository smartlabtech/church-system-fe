import React, {useState, useEffect} from "react"

import {useDispatch, useSelector} from "react-redux"

import {deleteOrder, ordersGet} from "../actions/orderActions"
import {getHoursDiff} from "../components/ServedByListModal"
import {useTranslation} from "react-i18next"
import {Loader} from "@mantine/core"

function OrderScreen({history}) {
  const dispatch = useDispatch()
  const [t, i18n] = useTranslation()

  const userLogin = useSelector((state) => state.userLogin)
  const {userInfo} = userLogin

  const orderGet = useSelector((state) => state.orderGet)
  const {data: OrdersGet, loading: OrdersGetLoading} = orderGet

  const orderDelete = useSelector((state) => state.orderDelete)
  const {loading: OrderDeleteLoading, deleteIndex} = orderDelete

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
      dispatch(
        ordersGet(
          `serviceId=${currentService.serviceId}&sortProperty=createdAt&sortType=DESCENDING`
        )
      )
    }
  }, [dispatch])

  const handleOrderDelete = (id, index) => {
    dispatch(deleteOrder(id, index, OrdersGet))
  }

  return (
    <>
      {OrdersGetLoading ? (
        <Loader />
      ) : (
        <div className="m-0 p-0" style={{direction: t("Dir")}}>
          {OrdersGet?.length ? (
            OrdersGet?.map((order, index) => (
              <Group
                className="p-2 m-0 mb-3 justify-content-center outline rounded"
                key={index}
              >
                <Stack
                  xs={3}
                  sm={3}
                  md={1}
                  lg={1}
                  xl={1}
                  className="p-0 m-0 justify-content-around"
                >
                  <img
                    src={order.productUrl}
                    className="p-0 m-0 rounded"
                    style={{width: "100%"}}
                    alt="Avatar"
                  />
                </Stack>
                <Stack
                  className="p-0 m-0"
                  xs={9}
                  sm={9}
                  md={11}
                  lg={11}
                  xl={11}
                  style={{
                    display: "flex",
                    flexWrap: "wrap"
                  }}
                >
                  <Group
                    className="p-0 m-0 justify-content-between"
                    style={{width: "100%"}}
                  >
                    <Stack
                      className="p-0 m-0 justify-content-start"
                      xs={8}
                      sm={8}
                      md={8}
                      lg={8}
                      xl={8}
                    >
                      <p>{order.title}</p>
                    </Stack>
                    <Stack
                      className="p-0 m-0 justify-content-center"
                      xs={4}
                      sm={4}
                      md={4}
                      lg={4}
                      xl={4}
                    >
                      <p className="p-0 m-0">
                        {order.points} {t("Pts.")}
                      </p>
                      <p className="p-0 m-0">{t(order.status)}</p>
                      {OrderDeleteLoading && deleteIndex === index ? (
                        <Loader />
                      ) : (
                        <Button
                          hidden={order.status == "PENDING" ? false : true}
                          className="m-1 p-1 rounded"
                          variant="outline-danger"
                          onClick={() => handleOrderDelete(order._id, index)}
                        >
                          {t("Cancel")}
                        </Button>
                      )}
                    </Stack>
                  </Group>
                </Stack>
              </Group>
            ))
          ) : (
            <h3
              className="p-5 m-0"
              style={{width: "100%", textAlign: "center"}}
            >
              {t("Empty_Order_List")}
            </h3>
          )}
        </div>
      )}
    </>
  )
}

export default OrderScreen
