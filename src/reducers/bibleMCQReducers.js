import {
  BIBLE_MCQ_DELETE_FAIL,
  BIBLE_MCQ_DELETE_REQUEST,
  BIBLE_MCQ_DELETE_SUCCESS,
  BIBLE_MCQ_UPDATE_FAIL,
  BIBLE_MCQ_UPDATE_REQUEST,
  BIBLE_MCQ_UPDATE_SUCCESS
} from "../constants/bibleMCQConstants"

export const bibleMCQUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case BIBLE_MCQ_UPDATE_REQUEST:
      return {...state, loading: true}

    case BIBLE_MCQ_UPDATE_SUCCESS:
      return {...state, loading: false, data: action.payload}

    case BIBLE_MCQ_UPDATE_FAIL:
      return {...state, loading: false}

    default:
      return state
  }
}

export const bibleMCQDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case BIBLE_MCQ_DELETE_REQUEST:
      return {...state, loading: true, deleteIndex: action.index}

    case BIBLE_MCQ_DELETE_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload
      }

    case BIBLE_MCQ_DELETE_FAIL:
      return {...state, loading: false}

    default:
      return state
  }
}
