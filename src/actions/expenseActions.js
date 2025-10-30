import axios from "axios"
import {
  EXPENSE_DOWNLOAD_FAIL,
  EXPENSE_DOWNLOAD_REQUEST,
  EXPENSE_DOWNLOAD_SUCCESS,
  EXPENSE_GET_FAIL,
  EXPENSE_GET_REQUEST,
  EXPENSE_GET_SUCCESS,
  EXPENSE_POST_FAIL,
  EXPENSE_POST_REQUEST,
  EXPENSE_POST_SUCCESS
} from "../constants/expenseConstants"
import {notifications} from "@mantine/notifications"
import ENV from "../utils/env"

const base_url = ENV.API_BASE_URL

export const listExpenses = (filter) => async (dispatch, getState) => {
  try {
    dispatch({
      type: EXPENSE_GET_REQUEST
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
      `${base_url}/expense?serviceId=${filter.serviceId}`,
      config
    )
    dispatch({
      type: EXPENSE_GET_SUCCESS,
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
      type: EXPENSE_GET_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message
    })
  }
}

export const setExpense = (newData, oldList) => async (dispatch, getState) => {
  try {
    dispatch({
      type: EXPENSE_POST_REQUEST
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
    const {data} = await axios.post(`${base_url}/expense`, newData, config)
    const newArray1 = [data].concat(oldList)
    dispatch({
      type: EXPENSE_GET_SUCCESS,
      payload: newArray1
    })
    dispatch({
      type: EXPENSE_POST_SUCCESS,
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
      type: EXPENSE_POST_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message
    })
  }
}

export const downloadExpenses = (filter) => async (dispatch, getState) => {
  try {
    dispatch({
      type: EXPENSE_DOWNLOAD_REQUEST
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
      `${base_url}/expense/download?serviceId=${filter.serviceId}`,
      config
    )

    notifications.show({
      id: "success-message",
      color: "green",
      title: "Success",
      message: data.message || "Operation completed successfully",
      autoClose: 5000
    })

    dispatch({
      type: EXPENSE_DOWNLOAD_SUCCESS,
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
      type: EXPENSE_DOWNLOAD_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message
    })
  }
}
