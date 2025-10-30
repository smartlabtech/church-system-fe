import {RESET_SUCCESS, SET_SUCCESS} from "../constants/successAlertConstants"

export const successAlertReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_SUCCESS:
      return {
        status: true,
        message: action.payload
      }

    case RESET_SUCCESS:
      return {
        status: false,
        message: ""
      }

    default:
      return state
  }
}
