import {
  PRODUCT_CREATE_FAIL,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_GET_FAIL,
  PRODUCT_GET_REQUEST,
  PRODUCT_GET_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS
} from "../constants/productConstants"

export const productCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_CREATE_REQUEST:
      return {...state, loading: true}

    case PRODUCT_CREATE_SUCCESS:
      return {...state, loading: false, data: action.payload}

    case PRODUCT_CREATE_FAIL:
      return {...state, loading: false}

    default:
      return state
  }
}

export const productGetReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_GET_REQUEST:
      return {...state, loading: true}

    case PRODUCT_GET_SUCCESS:
      return {...state, loading: false, data: action.payload}

    case PRODUCT_GET_FAIL:
      return {...state, loading: false}

    default:
      return state
  }
}

export const productUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_UPDATE_REQUEST:
      return {...state, loading: true}

    case PRODUCT_UPDATE_SUCCESS:
      return {...state, loading: false, data: action.payload}

    case PRODUCT_UPDATE_FAIL:
      return {...state, loading: false}

    default:
      return state
  }
}

export const productDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_DELETE_REQUEST:
      return {loading: true, deleteIndex: action.index}

    case PRODUCT_DELETE_SUCCESS:
      return {loading: false}

    case PRODUCT_DELETE_FAIL:
      return {loading: false}

    default:
      return state
  }
}
