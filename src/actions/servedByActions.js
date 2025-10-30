import axios from "axios"

import {
  SERVED_BY_DELETE_FAIL,
  SERVED_BY_DELETE_REQUEST,
  SERVED_BY_DELETE_SUCCESS,
  SERVED_BY_FAIL,
  SERVED_BY_REQUEST,
  SERVED_BY_SUCCESS
} from "../constants/servedByConstants"
import {USER_LIST_SUCCESS} from "../constants/userConstants"
import {notifications} from "@mantine/notifications"
import ENV from "../utils/env"

const base_url = ENV.API_BASE_URL

export const setServedBy = (classId, userId) => async (dispatch, getState) => {
  try {
    dispatch({
      type: SERVED_BY_REQUEST
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
      `${base_url}/servedBy`,
      {classId: classId, userId: userId},
      config
    )
    dispatch({
      type: SERVED_BY_SUCCESS,
      payload: data
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
      type: SERVED_BY_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.response.data.message
    })
  }
}

export const deleteServedBy =
  (oldList, index, data) => async (dispatch, getState) => {
    try {
      dispatch({
        type: SERVED_BY_DELETE_REQUEST
      })

      const {
        userLogin: {userInfo}
      } = getState()

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${userInfo.token}`
        },
        data: data
      }
      const result = await axios.delete(`${base_url}/servedBy`, config)
      dispatch({
        type: SERVED_BY_DELETE_SUCCESS
      })
      if (result.data.deletedCount == 1) {
        delete oldList[index]
        dispatch({
          type: USER_LIST_SUCCESS,
          payload: oldList
        })
      } else
        notifications.show({
          id: "delete-error",
          color: "red",
          title: "Error",
          message: "Not Available To Delete",
          autoClose: 5000
        })
    } catch (error) {
      dispatch({
        type: SERVED_BY_DELETE_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.response.data.message
      })
      notifications.show({
        id: "error-response",
        color: "red",
        title: "Error",
        message: error.response?.data?.message || "An error occurred",
        autoClose: 5000
      })
    }
  }
