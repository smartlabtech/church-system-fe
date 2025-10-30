import {
  ANNOUNCEMENT_FAIL,
  ANNOUNCEMENT_REQUEST,
  ANNOUNCEMENT_SUCCESS
} from "../constants/announcementConstants"

export const announcementReducer = (state = {}, action) => {
  switch (action.type) {
    case ANNOUNCEMENT_REQUEST:
      return {...state, loading: true}

    case ANNOUNCEMENT_SUCCESS:
      return {...state, loading: false, announcements: action.payload}

    case ANNOUNCEMENT_FAIL:
      return {...state, loading: false}

    default:
      return state
  }
}
