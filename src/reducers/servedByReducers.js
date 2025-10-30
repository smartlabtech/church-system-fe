import {
  RESET_SERVEDBYMODAL,
  SERVED_BY_CLEAR,
  SERVED_BY_DELETE_FAIL,
  SERVED_BY_DELETE_REQUEST,
  SERVED_BY_DELETE_SUCCESS,
  SERVED_BY_FAIL,
  SERVED_BY_REQUEST,
  SERVED_BY_SUCCESS,
  SET_SERVEDBYMODAL,
  SET_SERVEDBYSERVICE
} from "../constants/servedByConstants"

export const servedByReducer = (state = {userInfo: {}}, action) => {
  switch (action.type) {
    case SERVED_BY_REQUEST:
      return {...state, loading: true}

    case SERVED_BY_SUCCESS:
      return {...state, loading: false, userInfo: action.payload}

    case SERVED_BY_FAIL:
      return {...state, loading: false, error: action.payload}

    case SERVED_BY_CLEAR:
      return {...state, userInfo: {}}

    case SET_SERVEDBYMODAL:
      return {
        ...state,
        status: true
      }

    case RESET_SERVEDBYMODAL:
      return {
        ...state,
        status: false
      }

    case SET_SERVEDBYSERVICE:
      return {
        ...state,
        service: action.payload
      }

    default:
      return state
  }
}

export const servedByDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case SERVED_BY_DELETE_REQUEST:
      return {loading: true}

    case SERVED_BY_DELETE_SUCCESS:
      return {loading: false}

    case SERVED_BY_DELETE_FAIL:
      return {loading: false, error: action.payload}

    default:
      return state
  }
}
