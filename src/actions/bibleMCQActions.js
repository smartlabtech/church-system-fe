import axios from "axios"
import {
  BIBLE_MCQ_CREATE_FAIL,
  BIBLE_MCQ_CREATE_REQUEST,
  BIBLE_MCQ_CREATE_SUCCESS,
  BIBLE_MCQ_DELETE_FAIL,
  BIBLE_MCQ_DELETE_REQUEST,
  BIBLE_MCQ_DELETE_SUCCESS,
  BIBLE_MCQ_GET_FAIL,
  BIBLE_MCQ_GET_REQUEST,
  BIBLE_MCQ_GET_SUCCESS,
  BIBLE_MCQ_UPDATE_REQUEST
} from "../constants/bibleMCQConstants"

import {notifications} from "@mantine/notifications"
import ENV from "../utils/env"

const base_url = ENV.API_BASE_URL

export const bibleMCQPost =
  (serviceId, type, id) => async (dispatch, getState) => {
    try {
      dispatch({
        type: BIBLE_MCQ_CREATE_REQUEST
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
        `${base_url}/bibleMCQ`,
        {serviceId: serviceId, giftId: id, type: type},
        config
      )
      dispatch({
        type: BIBLE_MCQ_CREATE_SUCCESS,
        payload: data
      })
      notifications.show({
        id: "success-biblemcq",
        color: "green",
        title: "Success",
        message: "BibleMCQ Added Successfully",
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
        type: BIBLE_MCQ_CREATE_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
      })
    }
  }

export const bibleMCQsGet = (filters) => async (dispatch, getState) => {
  try {
    dispatch({
      type: BIBLE_MCQ_GET_REQUEST
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
    const {data} = await axios.get(`${base_url}/bibleMCQ?${filters}`, config)
    dispatch({
      type: BIBLE_MCQ_GET_SUCCESS,
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
      type: BIBLE_MCQ_GET_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message
    })
  }
}

export const bibleMCQUpdate =
  (id, index, oldData) => async (dispatch, getState) => {
    try {
      dispatch({
        type: BIBLE_MCQ_UPDATE_REQUEST
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
      const {data} = await axios.patch(`${base_url}/bibleMCQ/${id}`, config)

      dispatch({
        type: BIBLE_MCQ_UPDATE_REQUEST,
        payload: data
      })
      oldData[index] = data
      dispatch({
        type: BIBLE_MCQ_GET_REQUEST,
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
        type: BIBLE_MCQ_UPDATE_REQUEST,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
      })
    }
  }

export const deleteBibleMCQ =
  (id, index, oldlist) => async (dispatch, getState) => {
    try {
      dispatch({
        type: BIBLE_MCQ_DELETE_REQUEST,
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
        `${base_url}/bibleMCQ/cancel/${id}`,
        {},
        config
      )
      dispatch({
        type: BIBLE_MCQ_DELETE_SUCCESS,
        payload: data
      })
      oldlist[index] = data

      if (oldlist == 0) window.location.replace(`${window.location.origin}`)
      dispatch({
        type: BIBLE_MCQ_GET_SUCCESS,
        payload: oldlist
      })
    } catch (error) {
      notifications.show({
        id: "error-response",
        color: "red",
        title: "Error",
        message: error.response?.data?.message || "An error occurred",
        autoClose: 5000
      })
      dispatch({
        type: BIBLE_MCQ_DELETE_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
      })
    }
  }
