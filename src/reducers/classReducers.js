import {
  CLASS_LIST_REQUEST,
  CLASS_LIST_SUCCESS,
  CLASS_LIST_FAIL,
  CLASS_LIST_RESET,
  CLASS_CREATE_REQUEST,
  CLASS_CREATE_SUCCESS,
  CLASS_CREATE_FAIL,
  CLASS_CREATE_RESET,
  CLASS_UPDATE_REQUEST,
  CLASS_UPDATE_SUCCESS,
  CLASS_UPDATE_FAIL,
  CLASS_UPDATE_RESET,
  CLASS_DETAILS_REQUEST,
  CLASS_DETAILS_SUCCESS,
  CLASS_DETAILS_FAIL,
  CLASS_DETAILS_RESET,
} from '../constants/classConstants'

// Class List Reducer
export const classListReducer = (state = { classes: [] }, action) => {
  switch (action.type) {
    case CLASS_LIST_REQUEST:
      return { loading: true, classes: [] }
    case CLASS_LIST_SUCCESS:
      return {
        loading: false,
        classes: action.payload,
      }
    case CLASS_LIST_FAIL:
      return { loading: false, error: action.payload }
    case CLASS_LIST_RESET:
      return { classes: [] }
    default:
      return state
  }
}

// Class Create Reducer
export const classCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case CLASS_CREATE_REQUEST:
      return { loading: true }
    case CLASS_CREATE_SUCCESS:
      return { loading: false, success: true, class: action.payload }
    case CLASS_CREATE_FAIL:
      return { loading: false, error: action.payload }
    case CLASS_CREATE_RESET:
      return {}
    default:
      return state
  }
}

// Class Update Reducer
export const classUpdateReducer = (state = { class: {} }, action) => {
  switch (action.type) {
    case CLASS_UPDATE_REQUEST:
      return { loading: true }
    case CLASS_UPDATE_SUCCESS:
      return { loading: false, success: true, class: action.payload }
    case CLASS_UPDATE_FAIL:
      return { loading: false, error: action.payload }
    case CLASS_UPDATE_RESET:
      return { class: {} }
    default:
      return state
  }
}

// Class Details Reducer
export const classDetailsReducer = (state = { class: {} }, action) => {
  switch (action.type) {
    case CLASS_DETAILS_REQUEST:
      return { ...state, loading: true }
    case CLASS_DETAILS_SUCCESS:
      return { loading: false, class: action.payload }
    case CLASS_DETAILS_FAIL:
      return { loading: false, error: action.payload }
    case CLASS_DETAILS_RESET:
      return { class: {} }
    default:
      return state
  }
}