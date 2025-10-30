import {
  STORE_FAIL,
  STORE_REQUEST,
  STORE_SUCCESS
} from "../constants/storeConstants"

export const storeReducer = (state = {}, action) => {
  switch (action.type) {
    case STORE_REQUEST:
      return {...state, loading: true}

    case STORE_SUCCESS:
      return {...state, loading: false, storeData: action.payload}

    case STORE_FAIL:
      return {...state, loading: false}

    default:
      return state
  }
}
