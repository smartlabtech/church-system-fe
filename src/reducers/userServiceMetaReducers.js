import {
  USER_FOLLOW_UP_UPDATE_FAIL,
  USER_FOLLOW_UP_UPDATE_REQUEST,
  USER_FOLLOW_UP_UPDATE_SUCCESS,
  USER_SERVICE_META_FAIL,
  USER_SERVICE_META_REQUEST,
  USER_SERVICE_META_SUCCESS
} from "../constants/userServiceMetaConstants"

export const userServiceMetaReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_SERVICE_META_REQUEST:
      return {loading: true}

    case USER_SERVICE_META_SUCCESS:
      return {loading: false, landingPage: action.payload}

    case USER_SERVICE_META_FAIL:
      return {loading: false, error: action.payload}

    default:
      return state
  }
}

export const userFollowUpUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_FOLLOW_UP_UPDATE_REQUEST:
      return {loading: true}

    case USER_FOLLOW_UP_UPDATE_SUCCESS:
      return {loading: false}

    case USER_FOLLOW_UP_UPDATE_FAIL:
      return {loading: false, error: action.payload}

    default:
      return state
  }
}
