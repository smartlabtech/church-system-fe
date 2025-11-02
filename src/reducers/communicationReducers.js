import {
  SEND_MESSAGE_REQUEST,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_FAIL,
  SEND_MESSAGE_RESET,
  GET_COMMUNICATION_HISTORY_REQUEST,
  GET_COMMUNICATION_HISTORY_SUCCESS,
  GET_COMMUNICATION_HISTORY_FAIL,
} from "../constants/communicationConstants";

export const sendMessageReducer = (state = {}, action) => {
  switch (action.type) {
    case SEND_MESSAGE_REQUEST:
      return { loading: true };
    case SEND_MESSAGE_SUCCESS:
      return { loading: false, success: true, message: action.payload };
    case SEND_MESSAGE_FAIL:
      return { loading: false, error: action.payload };
    case SEND_MESSAGE_RESET:
      return {};
    default:
      return state;
  }
};

export const communicationHistoryReducer = (state = { messages: [] }, action) => {
  switch (action.type) {
    case GET_COMMUNICATION_HISTORY_REQUEST:
      return { loading: true, messages: [] };
    case GET_COMMUNICATION_HISTORY_SUCCESS:
      return {
        loading: false,
        messages: action.payload.messages,
        total: action.payload.total,
        limit: action.payload.limit,
        skip: action.payload.skip,
      };
    case GET_COMMUNICATION_HISTORY_FAIL:
      return { loading: false, error: action.payload, messages: [] };
    default:
      return state;
  }
};
