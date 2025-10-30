import axios from "axios"

import {
  SERVANTIN_LIST_MY_REQUEST,
  SERVANTIN_LIST_MY_SUCCESS,
  SERVANTIN_LIST_MY_FAIL
} from "../constants/servantInConstants"
import {notifications} from "@mantine/notifications"
import ENV from "../utils/env"

const base_url = ENV.API_BASE_URL

function download(content, fileName, contentType) {
  const a = document.createElement("a")
  const file = new Blob([content], {type: contentType})
  a.href = URL.createObjectURL(file)
  a.download = fileName
  a.click()
}

export const listMyServantIn = (filter) => async (dispatch, getState) => {
  try {
    dispatch({
      type: SERVANTIN_LIST_MY_REQUEST
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
      `${base_url}/servantIn/mine${filter}`,
      config
    )
    dispatch({
      type: SERVANTIN_LIST_MY_SUCCESS,
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
      type: SERVANTIN_LIST_MY_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message
    })
  }
}
