import {
  AUTHORIZED_KHADEM_FAIL,
  AUTHORIZED_KHADEM_REQUEST,
  AUTHORIZED_KHADEM_SUCCESS
} from "../constants/adminConstants"

export const adminReducer = (state = {}, action) => {
  switch (action.type) {
    case AUTHORIZED_KHADEM_REQUEST:
      return {...state, loading: true}

    case AUTHORIZED_KHADEM_SUCCESS:
      return {...state, loading: false, authorizedKhadem: action.payload}

    case AUTHORIZED_KHADEM_FAIL:
      return {...state, loading: false}

    default:
      return state
  }
}
