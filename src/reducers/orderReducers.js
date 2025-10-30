import {
  ORDER_CREATE_FAIL,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_DELETE_FAIL,
  ORDER_DELETE_REQUEST,
  ORDER_DELETE_SUCCESS,
  ORDER_GET_FAIL,
  ORDER_GET_REQUEST,
  ORDER_GET_SUCCESS,
  ORDER_UPDATE_FAIL,
  ORDER_UPDATE_REQUEST,
  ORDER_UPDATE_SUCCESS
} from "../constants/orderConstants"

export const orderCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_CREATE_REQUEST:
      return {...state, loading: true}

    case ORDER_CREATE_SUCCESS:
      return {...state, loading: false, data: action.payload}

    case ORDER_CREATE_FAIL:
      return {...state, loading: false}

    default:
      return state
  }
}

export const orderGetReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_GET_REQUEST:
      return {...state, loading: true}

    case ORDER_GET_SUCCESS:
      return {...state, loading: false, data: action.payload}

    case ORDER_GET_FAIL:
      return {...state, loading: false}

    default:
      return state
  }
}

export const orderUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_UPDATE_REQUEST:
      return {...state, loading: true}

    case ORDER_UPDATE_SUCCESS:
      return {...state, loading: false, data: action.payload}

    case ORDER_UPDATE_FAIL:
      return {...state, loading: false}

    default:
      return state
  }
}

export const orderDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_DELETE_REQUEST:
      return {...state, loading: true, deleteIndex: action.index}

    case ORDER_DELETE_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload
      }

    case ORDER_DELETE_FAIL:
      return {...state, loading: false}

    default:
      return state
  }
}
