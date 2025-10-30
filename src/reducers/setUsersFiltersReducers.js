import {SET_USERS_FILTERS} from "../constants/usersFiltersConstants.js"

export const usersFiltersReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_USERS_FILTERS:
      return {filters: action.payload}

    default:
      return state
  }
}
