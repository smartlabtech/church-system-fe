import axios from "axios"

import {
  SERVICE_BOOK_CREATE_FAIL,
  SERVICE_BOOK_CREATE_REQUEST,
  SERVICE_BOOK_CREATE_SUCCESS,
  SERVICE_BOOK_DELETE_FAIL,
  SERVICE_BOOK_DELETE_REQUEST,
  SERVICE_BOOK_DELETE_SUCCESS,
  SERVICE_BOOK_GET_FAIL,
  SERVICE_BOOK_GET_REQUEST,
  SERVICE_BOOK_GET_SUCCESS,
  SERVICE_BOOK_UPDATE_FAIL,
  SERVICE_BOOK_UPDATE_REQUEST,
  SERVICE_BOOK_UPDATE_SUCCESS
} from "../constants/serviceBooksConstants"

import {notifications} from "@mantine/notifications"
import ENV from "../utils/env"

const base_url = ENV.API_BASE_URL

export const serviceBookPost = (content) => async (dispatch, getState) => {
  try {
    dispatch({
      type: SERVICE_BOOK_CREATE_REQUEST
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

    const {data} = await axios.post(`${base_url}/serviceBook`, content, config)

    dispatch({
      type: SERVICE_BOOK_CREATE_SUCCESS,
      payload: data
    })

    notifications.show({
      id: "success-service-book",
      color: "green",
      title: "Success",
      message: "Service Book Added Successfully",
      autoClose: 5000
    })
    dispatch(serviceBooksList(`?serviceId=${content.serviceId}`))
  } catch (error) {
    notifications.show({
      id: "error-response",
      color: "red",
      title: "Error",
      message: error.response?.data?.message || "An error occurred",
      autoClose: 5000
    })
    dispatch({
      type: SERVICE_BOOK_CREATE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message
    })
  }
}

export const serviceBooksList = (filters) => async (dispatch, getState) => {
  try {
    dispatch({
      type: SERVICE_BOOK_GET_REQUEST
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
    const {data} = await axios.get(`${base_url}/serviceBook${filters}`, config)
    dispatch({
      type: SERVICE_BOOK_GET_SUCCESS,
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
      type: SERVICE_BOOK_GET_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message
    })
  }
}

export const serviceBookUpdate =
  (id, newData) => async (dispatch, getState) => {
    try {
      dispatch({
        type: SERVICE_BOOK_UPDATE_REQUEST
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
        `${base_url}/serviceBook/${id}`,
        newData,
        config
      )

      dispatch({
        type: SERVICE_BOOK_UPDATE_SUCCESS,
        payload: data
      })
      notifications.show({
        id: "success-service-book",
        color: "green",
        title: "Success",
        message: "Service Book Added Successfully",
        autoClose: 5000
      })
      dispatch(serviceBooksList(`?serviceId=${newData.serviceId}`))
    } catch (error) {
      notifications.show({
        id: "error-message",
        color: "red",
        title: "Error",
        message: error.response?.data?.message || "An error occurred",
        autoClose: 5000
      })
      dispatch({
        type: SERVICE_BOOK_UPDATE_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
      })
    }
  }

export const serviceBookDelete =
  (id, index, oldlist, serviceId) => async (dispatch, getState) => {
    try {
      dispatch({
        type: SERVICE_BOOK_DELETE_REQUEST,
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
        `${base_url}/product/${id}?serviceId=${serviceId}`,
        config
      )
      dispatch({
        type: SERVICE_BOOK_DELETE_SUCCESS,
        payload: data
      })

      if (data.deletedCount === 1) {
        await delete oldlist[index]
        dispatch({
          type: SERVICE_BOOK_GET_SUCCESS,
          payload: oldlist
        })
      }
    } catch (error) {
      notifications.show({
        id: "error-message",
        color: "red",
        title: "Error",
        message: error.response?.data?.message || "An error occurred",
        autoClose: 5000
      })
      dispatch({
        type: SERVICE_BOOK_DELETE_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
      })
    }
  }
