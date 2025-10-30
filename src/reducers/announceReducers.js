import {RESET_ANNOUNCE, SET_ANNOUNCE} from "../constants/announceConstants"

export const announceReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_ANNOUNCE:
      return {
        status: true,
        message: action.payload
      }

    case RESET_ANNOUNCE:
      return {
        status: false,
        message: ""
      }

    default:
      return state
  }
}
