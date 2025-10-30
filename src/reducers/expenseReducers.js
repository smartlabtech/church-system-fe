import {
  EXPENSE_DOWNLOAD_FAIL,
  EXPENSE_DOWNLOAD_REQUEST,
  EXPENSE_DOWNLOAD_SUCCESS,
  EXPENSE_GET_FAIL,
  EXPENSE_GET_REQUEST,
  EXPENSE_GET_SUCCESS,
  EXPENSE_POST_FAIL,
  EXPENSE_POST_REQUEST,
  EXPENSE_POST_SUCCESS
} from "../constants/expenseConstants"

export const getExpensesReducer = (state = {}, action) => {
  switch (action.type) {
    case EXPENSE_GET_REQUEST:
      return {loading: true}

    case EXPENSE_GET_SUCCESS:
      return {loading: false, expenses: action.payload}

    case EXPENSE_GET_FAIL:
      return {loading: false}

    default:
      return state
  }
}

export const postExpenseReducer = (state = {}, action) => {
  switch (action.type) {
    case EXPENSE_POST_REQUEST:
      return {loading: true}

    case EXPENSE_POST_SUCCESS:
      return {loading: false, expense: action.payload}

    case EXPENSE_POST_FAIL:
      return {loading: false}

    default:
      return state
  }
}

export const downloadExpenseReducer = (state = {}, action) => {
  switch (action.type) {
    case EXPENSE_DOWNLOAD_REQUEST:
      return {loading: true}

    case EXPENSE_DOWNLOAD_SUCCESS:
      return {loading: false}

    case EXPENSE_DOWNLOAD_FAIL:
      return {loading: false}

    default:
      return state
  }
}
