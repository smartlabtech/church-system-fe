import {
  SERVICES_FAIL,
  SERVICES_REQUEST,
  SERVICES_SUCCESS
} from "../constants/servicesConstants"

export const servicesListReducer = (state = {}, action) => {
  switch (action.type) {
    case SERVICES_REQUEST:
      return {loading: true}

    case SERVICES_SUCCESS:
      return {loading: false, services: action.payload}

    case SERVICES_FAIL:
      return {loading: false, error: action.payload}

    default:
      return state
  }
}
