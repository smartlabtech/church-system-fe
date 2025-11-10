import axios from "axios"
import {
  CHURCH_LIST_REQUEST,
  CHURCH_LIST_SUCCESS,
  CHURCH_LIST_FAIL,
  CHURCH_CREATE_REQUEST,
  CHURCH_CREATE_SUCCESS,
  CHURCH_CREATE_FAIL,
  CHURCH_UPDATE_REQUEST,
  CHURCH_UPDATE_SUCCESS,
  CHURCH_UPDATE_FAIL,
  CHURCH_DELETE_REQUEST,
  CHURCH_DELETE_SUCCESS,
  CHURCH_DELETE_FAIL,
} from "../constants/churchConstants"
import ENV from "../utils/env"

const base_url = ENV.API_BASE_URL

// Get all churches
export const listChurches = () => async (dispatch, getState) => {
  try {
    dispatch({ type: CHURCH_LIST_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get(
      `${base_url.replace('/ar', '/en')}/church`,
      config
    )

    dispatch({
      type: CHURCH_LIST_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: CHURCH_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

// Create church
export const createChurch = (churchData) => async (dispatch, getState) => {
  try {
    dispatch({ type: CHURCH_CREATE_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.post(
      `${base_url.replace('/ar', '/en')}/church`,
      churchData,
      config
    )

    dispatch({
      type: CHURCH_CREATE_SUCCESS,
      payload: data,
    })

    // Refresh list after creation
    dispatch(listChurches())
  } catch (error) {
    dispatch({
      type: CHURCH_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

// Update church
export const updateChurch = (id, churchData) => async (dispatch, getState) => {
  try {
    dispatch({ type: CHURCH_UPDATE_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.patch(
      `${base_url.replace('/ar', '/en')}/church/${id}`,
      churchData,
      config
    )

    dispatch({
      type: CHURCH_UPDATE_SUCCESS,
      payload: data,
    })

    // Refresh list after update
    dispatch(listChurches())
  } catch (error) {
    dispatch({
      type: CHURCH_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

// Delete church
export const deleteChurch = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: CHURCH_DELETE_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    await axios.delete(
      `${base_url.replace('/ar', '/en')}/church/${id}`,
      config
    )

    dispatch({ type: CHURCH_DELETE_SUCCESS })

    // Refresh list after deletion
    dispatch(listChurches())
  } catch (error) {
    dispatch({
      type: CHURCH_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}
