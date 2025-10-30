import {
  SERVANTIN_LIST_REQUEST,
  SERVANTIN_LIST_SUCCESS,
  SERVANTIN_LIST_FAIL,
  SERVANTIN_LIST_RESET,
  SERVANTIN_CREATE_REQUEST,
  SERVANTIN_CREATE_SUCCESS,
  SERVANTIN_CREATE_FAIL,
  SERVANTIN_CREATE_RESET,
  ///////////////////////////////////////
  SERVANTIN_LIST_MY_REQUEST,
  SERVANTIN_LIST_MY_SUCCESS,
  SERVANTIN_LIST_MY_FAIL,
  SERVANTIN_LIST_MY_RESET,
  RESET_SERVANTINMODAL,
  SET_SERVANTINMODAL,
  SET_SERVANTINSERVICE
} from "../constants/servantInConstants"

export const servantInListReducer = (state = {service: {}}, action) => {
  switch (action.type) {
    case SET_SERVANTINMODAL:
      return {
        ...state,
        status: true
      }

    case RESET_SERVANTINMODAL:
      return {
        ...state,
        status: false
      }

    case SET_SERVANTINSERVICE:
      return {
        ...state,
        selected: action.payload
      }

    default:
      return state
  }
}

////////////////////////////////////////////////////////////////////

export const servantInListMyReducer = (state = {servantIn: []}, action) => {
  switch (action.type) {
    case SERVANTIN_LIST_MY_REQUEST:
      return {
        loading: true
      }

    case SERVANTIN_LIST_MY_SUCCESS:
      return {
        loading: false,
        servantIn: action.payload
      }

    case SERVANTIN_LIST_MY_FAIL:
      return {
        loading: false,
        error: action.payload
      }

    case SERVANTIN_LIST_MY_RESET:
      return {
        servantIn: []
      }

    default:
      return state
  }
}
