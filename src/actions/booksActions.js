import axios from "axios"
import {
  BOOK_GET_FAIL,
  BOOK_GET_REQUEST,
  BOOK_GET_SUCCESS
} from "../constants/booksConstants"

import {notifications} from "@mantine/notifications"
import ENV from "../utils/env"

const base_url = ENV.API_BASE_URL

export const listBooks = (filters) => async (dispatch, getState) => {
  try {
    dispatch({
      type: BOOK_GET_REQUEST
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
    const {data} = await axios.get(`${base_url}/book${filters}`, config)
    console.log(data)
    dispatch({
      type: BOOK_GET_SUCCESS,
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
      type: BOOK_GET_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message
    })
  }
}
