import axios from 'axios'
import {
  BOOK_LIST_REQUEST,
  BOOK_LIST_SUCCESS,
  BOOK_LIST_FAIL,
  BOOK_CREATE_REQUEST,
  BOOK_CREATE_SUCCESS,
  BOOK_CREATE_FAIL,
  BOOK_UPDATE_REQUEST,
  BOOK_UPDATE_SUCCESS,
  BOOK_UPDATE_FAIL,
  BOOK_DETAILS_REQUEST,
  BOOK_DETAILS_SUCCESS,
  BOOK_DETAILS_FAIL,
} from '../constants/bookConstants'

// List Books
export const listBooks = (queryParams = {}) => async (dispatch, getState) => {
  try {
    dispatch({
      type: BOOK_LIST_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    // Build query string
    const params = new URLSearchParams()
    if (queryParams.sortProperty) params.append('sortProperty', queryParams.sortProperty)
    if (queryParams.sortType) params.append('sortType', queryParams.sortType)

    const queryString = params.toString()
    const url = queryString ? `/api/en/book?${queryString}` : '/api/en/book'

    const { data } = await axios.get(url, config)

    dispatch({
      type: BOOK_LIST_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: BOOK_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

// Create New Book
export const createBook = (bookData) => async (dispatch, getState) => {
  try {
    dispatch({
      type: BOOK_CREATE_REQUEST,
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

    const { data } = await axios.post('/api/en/book', bookData, config)

    dispatch({
      type: BOOK_CREATE_SUCCESS,
      payload: data,
    })

    // Refresh the book list
    dispatch(listBooks())
  } catch (error) {
    dispatch({
      type: BOOK_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

// Update Book
export const updateBook = (id, bookData) => async (dispatch, getState) => {
  try {
    dispatch({
      type: BOOK_UPDATE_REQUEST,
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

    const { data } = await axios.put(`/api/en/book/${id}`, bookData, config)

    dispatch({
      type: BOOK_UPDATE_SUCCESS,
      payload: data,
    })

    // Refresh the book list
    dispatch(listBooks())
  } catch (error) {
    dispatch({
      type: BOOK_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

// Get Book Details
export const getBookDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: BOOK_DETAILS_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get(`/api/en/book/${id}`, config)

    dispatch({
      type: BOOK_DETAILS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: BOOK_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}