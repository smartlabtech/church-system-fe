import axios from 'axios'
import {
  CLASS_LIST_REQUEST,
  CLASS_LIST_SUCCESS,
  CLASS_LIST_FAIL,
  CLASS_CREATE_REQUEST,
  CLASS_CREATE_SUCCESS,
  CLASS_CREATE_FAIL,
  CLASS_UPDATE_REQUEST,
  CLASS_UPDATE_SUCCESS,
  CLASS_UPDATE_FAIL,
  CLASS_DETAILS_REQUEST,
  CLASS_DETAILS_SUCCESS,
  CLASS_DETAILS_FAIL,
} from '../constants/classConstants'

// List Classes for a Service
export const listClasses = (serviceId) => async (dispatch, getState) => {
  try {
    dispatch({
      type: CLASS_LIST_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get(
      `/api/en/class${serviceId ? `?serviceId=${serviceId}` : ''}`,
      config
    )

    dispatch({
      type: CLASS_LIST_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: CLASS_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

// Create New Class
export const createClass = (classData) => async (dispatch, getState) => {
  try {
    dispatch({
      type: CLASS_CREATE_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.post('/api/en/class', classData, config)

    dispatch({
      type: CLASS_CREATE_SUCCESS,
      payload: data,
    })

    // Refresh the class list (load all classes)
    dispatch(listClasses())
  } catch (error) {
    dispatch({
      type: CLASS_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

// Update Class
export const updateClass = (id, classData) => async (dispatch, getState) => {
  try {
    dispatch({
      type: CLASS_UPDATE_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.put(`/api/en/class/${id}`, classData, config)

    dispatch({
      type: CLASS_UPDATE_SUCCESS,
      payload: data,
    })

    // Refresh the class list (load all classes)
    dispatch(listClasses())
  } catch (error) {
    dispatch({
      type: CLASS_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

// Get Class Details
export const getClassDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: CLASS_DETAILS_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get(`/api/en/class/${id}`, config)

    dispatch({
      type: CLASS_DETAILS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: CLASS_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}