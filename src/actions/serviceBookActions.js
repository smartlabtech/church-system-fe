import axios from 'axios'
import {
  SERVICEBOOK_LIST_REQUEST,
  SERVICEBOOK_LIST_SUCCESS,
  SERVICEBOOK_LIST_FAIL,
  SERVICEBOOK_CREATE_REQUEST,
  SERVICEBOOK_CREATE_SUCCESS,
  SERVICEBOOK_CREATE_FAIL,
  SERVICEBOOK_UPDATE_REQUEST,
  SERVICEBOOK_UPDATE_SUCCESS,
  SERVICEBOOK_UPDATE_FAIL,
  SERVICEBOOK_DETAILS_REQUEST,
  SERVICEBOOK_DETAILS_SUCCESS,
  SERVICEBOOK_DETAILS_FAIL,
} from '../constants/serviceBookConstants'

// List ServiceBooks
export const listServiceBooks = (queryParams = {}) => async (dispatch, getState) => {
  try {
    dispatch({ type: SERVICEBOOK_LIST_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    // Build query string from params
    const params = new URLSearchParams()

    // serviceId is required for query
    if (queryParams.serviceId) {
      params.append('serviceId', queryParams.serviceId)
    }
    if (queryParams.classId) {
      params.append('classId', queryParams.classId)
    }
    if (queryParams.bookId) {
      params.append('bookId', queryParams.bookId)
    }
    if (queryParams.churchId) {
      params.append('churchId', queryParams.churchId)
    }

    const queryString = params.toString()
    const url = `/api/en/serviceBook${queryString ? `?${queryString}` : ''}`

    const { data } = await axios.get(url, config)

    dispatch({
      type: SERVICEBOOK_LIST_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: SERVICEBOOK_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

// Create ServiceBook
export const createServiceBook = (serviceBookData) => async (dispatch, getState) => {
  try {
    dispatch({ type: SERVICEBOOK_CREATE_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.post('/api/en/serviceBook', serviceBookData, config)

    dispatch({
      type: SERVICEBOOK_CREATE_SUCCESS,
      payload: data,
    })

    // Reload the list with the current serviceId
    if (serviceBookData.serviceId) {
      dispatch(listServiceBooks({ serviceId: serviceBookData.serviceId }))
    }
  } catch (error) {
    dispatch({
      type: SERVICEBOOK_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

// Update ServiceBook
export const updateServiceBook = (id, serviceBookData) => async (dispatch, getState) => {
  try {
    dispatch({ type: SERVICEBOOK_UPDATE_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.put(`/api/en/serviceBook/${id}`, serviceBookData, config)

    dispatch({
      type: SERVICEBOOK_UPDATE_SUCCESS,
      payload: data,
    })

    // Reload the list with the current serviceId
    if (serviceBookData.serviceId) {
      dispatch(listServiceBooks({ serviceId: serviceBookData.serviceId }))
    }
  } catch (error) {
    dispatch({
      type: SERVICEBOOK_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

// Get ServiceBook details
export const getServiceBookDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: SERVICEBOOK_DETAILS_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get(`/api/en/serviceBook/${id}`, config)

    dispatch({
      type: SERVICEBOOK_DETAILS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: SERVICEBOOK_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}