import {LOG_FAIL, LOG_REQUEST, LOG_SUCCESS} from "../constants/logConstants"

export const logReducer = (state = {}, action) => {
  switch (action.type) {
    case LOG_REQUEST:
      return {loading: true}

    case LOG_SUCCESS:
      return {loading: false, myLogs: action.payload}

    case LOG_FAIL:
      return {loading: false, error: action.payload}

    default:
      return state
  }
}
