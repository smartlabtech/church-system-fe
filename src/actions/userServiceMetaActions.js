import axios from "axios"
import {
  USER_FOLLOW_UP_UPDATE_FAIL,
  USER_FOLLOW_UP_UPDATE_REQUEST,
  USER_FOLLOW_UP_UPDATE_SUCCESS,
  USER_SERVICE_META_FAIL,
  USER_SERVICE_META_REQUEST,
  USER_SERVICE_META_SUCCESS
} from "../constants/userServiceMetaConstants"
import {notifications} from "@mantine/notifications"
import ENV from "../utils/env"

const base_url = ENV.API_BASE_URL

export const getUserServiceMeta = (serviceId) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_SERVICE_META_REQUEST
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
    const {data} = await axios.get(
      `${base_url}/service/landing-page?serviceId=${serviceId}`,
      config
    )
    dispatch({
      type: USER_SERVICE_META_SUCCESS,
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
      type: USER_SERVICE_META_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message
    })
  }
}

export const updateLastFollowUp = (data) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_FOLLOW_UP_UPDATE_REQUEST
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
    const result = await axios.post(
      `${base_url}/user-service-meta/lastFollowUp`,
      data,
      config
    )
    dispatch({
      type: USER_FOLLOW_UP_UPDATE_SUCCESS
    })

    notifications.show({
      id: "success-updated",
      color: "green",
      title: "Success",
      message: "Updated",
      autoClose: 5000
    })
  } catch (error) {
    dispatch({
      type: USER_FOLLOW_UP_UPDATE_FAIL,
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
