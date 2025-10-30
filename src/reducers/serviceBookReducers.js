import {
  SERVICEBOOK_LIST_REQUEST,
  SERVICEBOOK_LIST_SUCCESS,
  SERVICEBOOK_LIST_FAIL,
  SERVICEBOOK_CREATE_REQUEST,
  SERVICEBOOK_CREATE_SUCCESS,
  SERVICEBOOK_CREATE_FAIL,
  SERVICEBOOK_CREATE_RESET,
  SERVICEBOOK_UPDATE_REQUEST,
  SERVICEBOOK_UPDATE_SUCCESS,
  SERVICEBOOK_UPDATE_FAIL,
  SERVICEBOOK_UPDATE_RESET,
  SERVICEBOOK_DETAILS_REQUEST,
  SERVICEBOOK_DETAILS_SUCCESS,
  SERVICEBOOK_DETAILS_FAIL,
} from '../constants/serviceBookConstants'

// ServiceBook List Reducer
export const serviceBookListReducer = (state = { serviceBooks: [] }, action) => {
  switch (action.type) {
    case SERVICEBOOK_LIST_REQUEST:
      return { loading: true }
    case SERVICEBOOK_LIST_SUCCESS:
      return { loading: false, serviceBooks: action.payload }
    case SERVICEBOOK_LIST_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

// ServiceBook Create Reducer
export const serviceBookCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case SERVICEBOOK_CREATE_REQUEST:
      return { loading: true }
    case SERVICEBOOK_CREATE_SUCCESS:
      return { loading: false, success: true, serviceBook: action.payload }
    case SERVICEBOOK_CREATE_FAIL:
      return { loading: false, error: action.payload }
    case SERVICEBOOK_CREATE_RESET:
      return {}
    default:
      return state
  }
}

// ServiceBook Update Reducer
export const serviceBookUpdateReducer = (state = { serviceBook: {} }, action) => {
  switch (action.type) {
    case SERVICEBOOK_UPDATE_REQUEST:
      return { loading: true }
    case SERVICEBOOK_UPDATE_SUCCESS:
      return { loading: false, success: true, serviceBook: action.payload }
    case SERVICEBOOK_UPDATE_FAIL:
      return { loading: false, error: action.payload }
    case SERVICEBOOK_UPDATE_RESET:
      return { serviceBook: {} }
    default:
      return state
  }
}

// ServiceBook Details Reducer
export const serviceBookDetailsReducer = (state = { serviceBook: {} }, action) => {
  switch (action.type) {
    case SERVICEBOOK_DETAILS_REQUEST:
      return { ...state, loading: true }
    case SERVICEBOOK_DETAILS_SUCCESS:
      return { loading: false, serviceBook: action.payload }
    case SERVICEBOOK_DETAILS_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}