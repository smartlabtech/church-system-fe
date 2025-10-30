import {SET_AUTH_SCREEN} from "../constants/authScreenConstants"

export const authScreenReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_AUTH_SCREEN:
      return {
        screen: action.payload
      }

    default:
      return state
  }
}
