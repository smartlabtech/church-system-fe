import {
  BOOK_GET_FAIL,
  BOOK_GET_REQUEST,
  BOOK_GET_SUCCESS
} from "../constants/booksConstants"

export const booksGetReducer = (state = {}, action) => {
  switch (action.type) {
    case BOOK_GET_REQUEST:
      return {loading: true}

    case BOOK_GET_SUCCESS:
      return {loading: false, books: action.payload}

    case BOOK_GET_FAIL:
      return {loading: false}

    default:
      return state
  }
}
