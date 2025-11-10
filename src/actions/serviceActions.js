import axios from "axios"
import {
  SERVICE_LIST_REQUEST,
  SERVICE_LIST_SUCCESS,
  SERVICE_LIST_FAIL,
  SERVICE_CREATE_REQUEST,
  SERVICE_CREATE_SUCCESS,
  SERVICE_CREATE_FAIL,
  SERVICE_UPDATE_REQUEST,
  SERVICE_UPDATE_SUCCESS,
  SERVICE_UPDATE_FAIL,
  SERVICE_DELETE_REQUEST,
  SERVICE_DELETE_SUCCESS,
  SERVICE_DELETE_FAIL,
} from "../constants/serviceConstants"
import ENV from "../utils/env"

const base_url = ENV.API_BASE_URL
const church_id = ENV.API_CHURCH_ID

// Get all services
export const listServices = (queryParams = {}) => async (dispatch, getState) => {
  try {
    dispatch({ type: SERVICE_LIST_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    // Filter out empty values from queryParams
    const filteredParams = {}
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] !== '' && queryParams[key] !== undefined && queryParams[key] !== null) {
        filteredParams[key] = queryParams[key]
      }
    })

    // Build query string
    const queryString = new URLSearchParams(filteredParams).toString()
    const url = queryString
      ? `${base_url.replace('/ar', '/en')}/service?${queryString}`
      : `${base_url.replace('/ar', '/en')}/service`

    const { data } = await axios.get(url, config)

    dispatch({
      type: SERVICE_LIST_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: SERVICE_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

// Create new service
export const createService = (serviceData) => async (dispatch, getState) => {
  try {
    dispatch({ type: SERVICE_CREATE_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    // Add churchId from env
    const dataWithChurchId = {
      ...serviceData,
      churchId: church_id,
    }

    const { data } = await axios.post(
      `${base_url.replace('/ar', '/en')}/service`,
      dataWithChurchId,
      config
    )

    dispatch({
      type: SERVICE_CREATE_SUCCESS,
      payload: data,
    })

    // Refresh the list
    dispatch(listServices())
  } catch (error) {
    dispatch({
      type: SERVICE_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

// Update service
export const updateService = (id, serviceData) => async (dispatch, getState) => {
  try {
    dispatch({ type: SERVICE_UPDATE_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    // Don't send churchId during updates - it's immutable after creation
    const { data } = await axios.patch(
      `${base_url.replace('/ar', '/en')}/service/${id}`,
      serviceData,
      config
    )

    dispatch({
      type: SERVICE_UPDATE_SUCCESS,
      payload: data,
    })

    // Refresh the list
    dispatch(listServices())
  } catch (error) {
    dispatch({
      type: SERVICE_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

// Delete service
export const deleteService = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: SERVICE_DELETE_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    await axios.delete(`${base_url.replace('/ar', '/en')}/service/${id}`, config)

    dispatch({ type: SERVICE_DELETE_SUCCESS })

    // Refresh the list
    dispatch(listServices())
  } catch (error) {
    dispatch({
      type: SERVICE_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}