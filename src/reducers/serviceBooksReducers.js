import {
  SERVICE_BOOK_CREATE_FAIL,
  SERVICE_BOOK_CREATE_REQUEST,
  SERVICE_BOOK_CREATE_SUCCESS,
  SERVICE_BOOK_GET_FAIL,
  SERVICE_BOOK_GET_REQUEST,
  SERVICE_BOOK_GET_SUCCESS,
  SERVICE_BOOK_UPDATE_FAIL,
  SERVICE_BOOK_UPDATE_REQUEST,
  SERVICE_BOOK_UPDATE_SUCCESS,
  SERVICE_BOOK_DELETE_FAIL,
  SERVICE_BOOK_DELETE_REQUEST,
  SERVICE_BOOK_DELETE_SUCCESS
} from "../constants/serviceBooksConstants"

export const serviceBookCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case SERVICE_BOOK_CREATE_REQUEST:
      return {...state, loading: true}

    case SERVICE_BOOK_CREATE_SUCCESS:
      return {...state, loading: false, serviceBook: action.payload}

    case SERVICE_BOOK_CREATE_FAIL:
      return {...state, loading: false}

    default:
      return state
  }
}

export const serviceBooksGetReducer = (state = {}, action) => {
  switch (action.type) {
    case SERVICE_BOOK_GET_REQUEST:
      return {loading: true}

    case SERVICE_BOOK_GET_SUCCESS:
      return {loading: false, serviceBooks: action.payload}

    case SERVICE_BOOK_GET_FAIL:
      return {loading: false}

    default:
      return state
  }
}

export const serviceBookUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case SERVICE_BOOK_UPDATE_REQUEST:
      return {...state, loading: true}

    case SERVICE_BOOK_UPDATE_SUCCESS:
      return {...state, loading: false}

    case SERVICE_BOOK_UPDATE_FAIL:
      return {...state, loading: false}

    default:
      return state
  }
}

export const serviceBookDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case SERVICE_BOOK_DELETE_REQUEST:
      return {...state, loading: true}

    case SERVICE_BOOK_DELETE_SUCCESS:
      return {...state, loading: false, serviceBooks: action.payload}

    case SERVICE_BOOK_DELETE_FAIL:
      return {...state, loading: false}

    default:
      return state
  }
}
