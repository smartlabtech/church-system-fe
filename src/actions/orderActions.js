import axios from "axios"
import {
  ORDER_CREATE_FAIL,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_DELETE_FAIL,
  ORDER_DELETE_REQUEST,
  ORDER_DELETE_SUCCESS,
  ORDER_GET_FAIL,
  ORDER_GET_REQUEST,
  ORDER_GET_SUCCESS,
  ORDER_UPDATE_REQUEST
} from "../constants/orderConstants"

import {notifications} from "@mantine/notifications"
import ENV from "../utils/env"

const base_url = ENV.API_BASE_URL

export const orderPost =
  (serviceId, type, id) => async (dispatch, getState) => {
    try {
      dispatch({
        type: ORDER_CREATE_REQUEST
      })

      const {
        userLogin: {userInfo}
      } = getState()

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${userInfo.token}`
        }
      }

      const {data} = await axios.post(
        `${base_url}/order`,
        {serviceId: serviceId, giftId: id, type: type},
        config
      )
      dispatch({
        type: ORDER_CREATE_SUCCESS,
        payload: data
      })
      notifications.show({
        id: "success-order-added",
        color: "green",
        title: "Success",
        message: "Order Added Successfully",
        autoClose: 5000
      })
    } catch (error) {
      console.log(error)
      notifications.show({
        id: "error-response",
        color: "red",
        title: "Error",
        message: error.response?.data?.message || "An error occurred",
        autoClose: 5000
      })
      dispatch({
        type: ORDER_CREATE_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
      })
    }
  }

export const ordersGet = (filters) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_GET_REQUEST
    })

    const {
      userLogin: {userInfo}
    } = getState()

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`
      }
    }
    const {data} = await axios.get(`${base_url}/order?${filters}`, config)
    dispatch({
      type: ORDER_GET_SUCCESS,
      payload: data
    })
  } catch (error) {
    notifications.show({
      id: "connection-error",
      color: "red",
      title: "Error",
      message: "Connection Error",
      autoClose: 5000
    })
    dispatch({
      type: ORDER_GET_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message
    })
  }
}

export const orderUpdate =
  (id, index, oldData) => async (dispatch, getState) => {
    try {
      dispatch({
        type: ORDER_UPDATE_REQUEST
      })

      const {
        userLogin: {userInfo}
      } = getState()

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${userInfo.token}`
        }
      }
      const {data} = await axios.patch(`${base_url}/order/${id}`, config)

      dispatch({
        type: ORDER_UPDATE_REQUEST,
        payload: data
      })
      oldData[index] = data
      dispatch({
        type: ORDER_GET_REQUEST,
        payload: oldData
      })
    } catch (error) {
      notifications.show({
        id: "error-message",
        color: "red",
        title: "Error",
        message: error.response?.data?.message || "An error occurred",
        autoClose: 5000
      })

      dispatch({
        type: ORDER_UPDATE_REQUEST,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
      })
    }
  }

export const deleteOrder =
  (id, index, oldlist) => async (dispatch, getState) => {
    try {
      dispatch({
        type: ORDER_DELETE_REQUEST,
        index: index
      })

      const {
        userLogin: {userInfo}
      } = getState()

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${userInfo.token}`
        }
      }
      const {data} = await axios.post(
        `${base_url}/order/cancel/${id}`,
        {},
        config
      )
      dispatch({
        type: ORDER_DELETE_SUCCESS,
        payload: data
      })
      oldlist[index] = data

      if (oldlist == 0) window.location.replace(`${window.location.origin}`)
      dispatch({
        type: ORDER_GET_SUCCESS,
        payload: oldlist
      })
    } catch (error) {
      notifications.show({
        id: "error-message",
        color: "red",
        title: "Error",
        message: error.response?.data?.message || "An error occurred",
        autoClose: 5000
      })

      dispatch({
        type: ORDER_DELETE_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
      })
    }
  }
