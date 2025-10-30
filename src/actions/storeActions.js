import axios from "axios"
import {
  STORE_FAIL,
  STORE_REQUEST,
  STORE_SUCCESS
} from "../constants/storeConstants"
import {notifications} from "@mantine/notifications"
import ENV from "../utils/env"

const base_url = ENV.API_BASE_URL

export const getStore = (filters) => async (dispatch, getState) => {
  try {
    dispatch({
      type: STORE_REQUEST
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
    const {data} = await axios.get(`${base_url}/store?${filters}`, config)
    let new_list = data.products.reverse()
    dispatch({
      type: STORE_SUCCESS,
      payload: {products: new_list}
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
      type: STORE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message
    })
  }
}
