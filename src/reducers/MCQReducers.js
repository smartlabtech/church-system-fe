import {
  MCQ_LIST_REQUEST,
  MCQ_LIST_SUCCESS,
  MCQ_LIST_FAIL,
  MCQ_CREATE_FAIL,
  MCQ_CREATE_REQUEST,
  MCQ_CREATE_SUCCESS,
  MCQ_CREATE_RESET,
  MCQ_DELETE_FAIL,
  MCQ_DELETE_REQUEST,
  MCQ_DELETE_SUCCESS,
  MCQ_GET_FAIL,
  MCQ_GET_REQUEST,
  MCQ_GET_SUCCESS,
  MCQ_UPDATE_FAIL,
  MCQ_UPDATE_REQUEST,
  MCQ_UPDATE_SUCCESS,
  MCQ_UPDATE_RESET,
  MCQ_ANSWER_SUBMIT_REQUEST,
  MCQ_ANSWER_SUBMIT_SUCCESS,
  MCQ_ANSWER_SUBMIT_FAIL,
  MCQ_ANSWER_SUBMIT_RESET,
  MCQ_ANSWER_LIST_REQUEST,
  MCQ_ANSWER_LIST_SUCCESS,
  MCQ_ANSWER_LIST_FAIL
} from "../constants/MCQConstants"

// List MCQs reducer
export const MCQListReducer = (state = { mcqs: [] }, action) => {
  switch (action.type) {
    case MCQ_LIST_REQUEST:
      return { ...state, loading: true }

    case MCQ_LIST_SUCCESS:
      return { loading: false, mcqs: action.payload, error: null }

    case MCQ_LIST_FAIL:
      return { loading: false, error: action.payload, mcqs: [] }

    case MCQ_CREATE_SUCCESS:
      // Add new MCQ to the list
      return {
        ...state,
        mcqs: [...(state.mcqs || []), action.payload]
      }

    case MCQ_UPDATE_SUCCESS:
      // Update existing MCQ in the list
      return {
        ...state,
        mcqs: (state.mcqs || []).map(mcq =>
          mcq._id === action.payload._id ? action.payload : mcq
        )
      }

    case MCQ_DELETE_SUCCESS:
      // Remove deleted MCQ from the list
      return {
        ...state,
        mcqs: (state.mcqs || []).filter(mcq => mcq._id !== action.payload)
      }

    default:
      return state
  }
}

// Create MCQ reducer
export const MCQCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case MCQ_CREATE_REQUEST:
      return { loading: true }

    case MCQ_CREATE_SUCCESS:
      return { loading: false, success: true, mcq: action.payload }

    case MCQ_CREATE_FAIL:
      return { loading: false, error: action.payload }

    case MCQ_CREATE_RESET:
      return {}

    default:
      return state
  }
}

// Get single MCQ reducer
export const MCQGetReducer = (state = { mcq: null }, action) => {
  switch (action.type) {
    case MCQ_GET_REQUEST:
      return { ...state, loading: true }

    case MCQ_GET_SUCCESS:
      return { loading: false, mcq: action.payload }

    case MCQ_GET_FAIL:
      return { loading: false, error: action.payload }

    default:
      return state
  }
}

// Update MCQ reducer
export const MCQUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case MCQ_UPDATE_REQUEST:
      return { loading: true }

    case MCQ_UPDATE_SUCCESS:
      return { loading: false, success: true, mcq: action.payload }

    case MCQ_UPDATE_FAIL:
      return { loading: false, error: action.payload }

    case MCQ_UPDATE_RESET:
      return {}

    default:
      return state
  }
}

// Delete MCQ reducer
export const MCQDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case MCQ_DELETE_REQUEST:
      return { loading: true }

    case MCQ_DELETE_SUCCESS:
      return { loading: false, success: true }

    case MCQ_DELETE_FAIL:
      return { loading: false, error: action.payload }

    default:
      return state
  }
}

// Submit MCQ Answer reducer
export const MCQAnswerSubmitReducer = (state = {}, action) => {
  switch (action.type) {
    case MCQ_ANSWER_SUBMIT_REQUEST:
      return { loading: true }

    case MCQ_ANSWER_SUBMIT_SUCCESS:
      return {
        loading: false,
        success: true,
        result: action.payload,
        isCorrect: action.payload.isCorrect,
        pointsGained: action.payload.pointsGained,
        trueAnswer: action.payload.trueAnswer
      }

    case MCQ_ANSWER_SUBMIT_FAIL:
      return { loading: false, error: action.payload }

    case MCQ_ANSWER_SUBMIT_RESET:
      return {}

    default:
      return state
  }
}

// List MCQ Answers reducer
export const MCQAnswerListReducer = (state = { answers: [] }, action) => {
  switch (action.type) {
    case MCQ_ANSWER_LIST_REQUEST:
      return { ...state, loading: true }

    case MCQ_ANSWER_LIST_SUCCESS:
      return { loading: false, answers: action.payload }

    case MCQ_ANSWER_LIST_FAIL:
      return { loading: false, error: action.payload, answers: [] }

    default:
      return state
  }
}
