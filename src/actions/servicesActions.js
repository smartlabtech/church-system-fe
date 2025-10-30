import axios from "axios"
import {
  SERVICES_FAIL,
  SERVICES_REQUEST,
  SERVICES_SUCCESS
} from "../constants/servicesConstants"
import {notifications} from "@mantine/notifications"
import ENV from "../utils/env"

const base_url = ENV.API_BASE_URL

export const getServices = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: SERVICES_REQUEST
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
    const {data} = await axios.get(`${base_url}/service`, config)
    dispatch({
      type: SERVICES_SUCCESS,
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
      type: SERVICES_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message
    })
  }
}
