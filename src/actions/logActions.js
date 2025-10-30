import axios from "axios"
import {LOG_FAIL, LOG_REQUEST, LOG_SUCCESS} from "../constants/logConstants"
import {notifications} from "@mantine/notifications"
import ENV from "../utils/env"

const base_url = ENV.API_BASE_URL

export const listMyLog = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: LOG_REQUEST
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
    const {data} = await axios.get(`${base_url}/action-log`, config)
    dispatch({
      type: LOG_SUCCESS,
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
      type: LOG_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message
    })
  }
}
