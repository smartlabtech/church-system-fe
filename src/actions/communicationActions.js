import axios from "axios";
import {
  SEND_MESSAGE_REQUEST,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_FAIL,
  GET_COMMUNICATION_HISTORY_REQUEST,
  GET_COMMUNICATION_HISTORY_SUCCESS,
  GET_COMMUNICATION_HISTORY_FAIL,
} from "../constants/communicationConstants";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/ar";

export const sendMessage = (message, serviceId = null) => async (dispatch, getState) => {
  try {
    dispatch({ type: SEND_MESSAGE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(
      `${API_BASE_URL}/communication/send`,
      { message, serviceId },
      config
    );

    dispatch({
      type: SEND_MESSAGE_SUCCESS,
      payload: data,
    });

    return data;
  } catch (error) {
    dispatch({
      type: SEND_MESSAGE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
    throw error;
  }
};

export const getCommunicationHistory = (filters = {}) => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_COMMUNICATION_HISTORY_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
      params: filters,
    };

    const { data } = await axios.get(
      `${API_BASE_URL}/communication`,
      config
    );

    dispatch({
      type: GET_COMMUNICATION_HISTORY_SUCCESS,
      payload: data,
    });

    return data;
  } catch (error) {
    dispatch({
      type: GET_COMMUNICATION_HISTORY_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
