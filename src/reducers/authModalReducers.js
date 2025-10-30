import {RESET_AUTH_MODAL, SET_AUTH_MODAL} from "../constants/authModalConstants"

export const authModalReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_AUTH_MODAL:
      return {
        status: true
      }

    case RESET_AUTH_MODAL:
      return {
        status: false
      }

    default:
      return state
  }
}
