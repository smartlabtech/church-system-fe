import axios from "axios"
import {
  PRODUCT_CREATE_FAIL,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_RESET,
  PRODUCT_DELETE_FAIL,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_GET_FAIL,
  PRODUCT_GET_REQUEST,
  PRODUCT_GET_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_RESET
} from "../constants/productConstants"

import {notifications} from "@mantine/notifications"

export const productPost =
  (oldlist, productData) => async (dispatch, getState) => {
    try {
      dispatch({
        type: PRODUCT_CREATE_REQUEST
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
        `/api/en/product`,
        productData,
        config
      )
      dispatch({
        type: PRODUCT_CREATE_SUCCESS,
        payload: data
      })
      notifications.show({
        id: "success-added",
        color: "green",
        title: "Success",
        message: "Added Successfully",
        autoClose: 5000
      })
      const newList = [data].concat(oldlist)

      dispatch({
        type: PRODUCT_GET_SUCCESS,
        payload: newList
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
        type: PRODUCT_CREATE_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
      })
    }
  }

export const productsGet = (filters) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_GET_REQUEST
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
    const {data} = await axios.get(`/api/en/product?${filters}`, config)
    dispatch({
      type: PRODUCT_GET_SUCCESS,
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
      type: PRODUCT_GET_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message
    })
  }
}

export const updateProduct =
  (oldData, index, id, newData) => async (dispatch, getState) => {
    try {
      dispatch({
        type: PRODUCT_UPDATE_REQUEST
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
      const {data} = await axios.patch(
        `/api/en/product/${id}`,
        newData,
        config
      )

      dispatch({
        type: PRODUCT_UPDATE_SUCCESS,
        payload: data
      })
      oldData[index] = data
      dispatch({
        type: PRODUCT_GET_SUCCESS,
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
        type: PRODUCT_UPDATE_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
      })
    }
  }

export const productDelete =
  (id, index, oldlist, serviceId) => async (dispatch, getState) => {
    try {
      dispatch({
        type: PRODUCT_DELETE_REQUEST,
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
      const {data} = await axios.delete(
        `/api/en/product/${id}?serviceId=${serviceId}`,
        config
      )
      dispatch({
        type: PRODUCT_DELETE_SUCCESS,
        payload: data
      })

      if (data.deletedCount === 1) {
        await delete oldlist[index]
        dispatch({
          type: PRODUCT_GET_SUCCESS,
          payload: oldlist
        })
      }

      if (oldlist == 0) window.location.replace(`${window.location.origin}`)
      dispatch({
        type: PRODUCT_GET_SUCCESS,
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
        type: PRODUCT_DELETE_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
      })
    }
  }
