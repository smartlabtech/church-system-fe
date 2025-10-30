import {
  SHABAB_EVENT_REGISTER_FAIL,
  SHABAB_EVENT_REGISTER_REQUEST,
  SHABAB_EVENT_REGISTER_SUCCESS
} from "../constants/shababEventRegisterConstant"

export const shababEventRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case SHABAB_EVENT_REGISTER_REQUEST:
      return {loading: true}

    case SHABAB_EVENT_REGISTER_SUCCESS:
      return {loading: false}

    case SHABAB_EVENT_REGISTER_FAIL:
      return {loading: false}

    default:
      return state
  }
}
