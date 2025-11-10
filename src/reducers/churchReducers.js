import {
  CHURCH_LIST_REQUEST,
  CHURCH_LIST_SUCCESS,
  CHURCH_LIST_FAIL,
  CHURCH_CREATE_REQUEST,
  CHURCH_CREATE_SUCCESS,
  CHURCH_CREATE_FAIL,
  CHURCH_CREATE_RESET,
  CHURCH_UPDATE_REQUEST,
  CHURCH_UPDATE_SUCCESS,
  CHURCH_UPDATE_FAIL,
  CHURCH_UPDATE_RESET,
  CHURCH_DELETE_REQUEST,
  CHURCH_DELETE_SUCCESS,
  CHURCH_DELETE_FAIL,
  CHURCH_DELETE_RESET,
} from "../constants/churchConstants"

export const churchListReducer = (state = { churches: [] }, action) => {
  switch (action.type) {
    case CHURCH_LIST_REQUEST:
      return { loading: true, churches: [] }
    case CHURCH_LIST_SUCCESS:
      return { loading: false, churches: action.payload }
    case CHURCH_LIST_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const churchCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case CHURCH_CREATE_REQUEST:
      return { loading: true }
    case CHURCH_CREATE_SUCCESS:
      return { loading: false, success: true, church: action.payload }
    case CHURCH_CREATE_FAIL:
      return { loading: false, error: action.payload }
    case CHURCH_CREATE_RESET:
      return {}
    default:
      return state
  }
}

export const churchUpdateReducer = (state = { church: {} }, action) => {
  switch (action.type) {
    case CHURCH_UPDATE_REQUEST:
      return { loading: true }
    case CHURCH_UPDATE_SUCCESS:
      return { loading: false, success: true, church: action.payload }
    case CHURCH_UPDATE_FAIL:
      return { loading: false, error: action.payload }
    case CHURCH_UPDATE_RESET:
      return { church: {} }
    default:
      return state
  }
}

export const churchDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case CHURCH_DELETE_REQUEST:
      return { loading: true }
    case CHURCH_DELETE_SUCCESS:
      return { loading: false, success: true }
    case CHURCH_DELETE_FAIL:
      return { loading: false, error: action.payload }
    case CHURCH_DELETE_RESET:
      return {}
    default:
      return state
  }
}
