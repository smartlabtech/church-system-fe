import axios from "axios"
import {
  MCQ_LIST_REQUEST,
  MCQ_LIST_SUCCESS,
  MCQ_LIST_FAIL,
  MCQ_CREATE_FAIL,
  MCQ_CREATE_REQUEST,
  MCQ_CREATE_SUCCESS,
  MCQ_DELETE_FAIL,
  MCQ_DELETE_REQUEST,
  MCQ_DELETE_SUCCESS,
  MCQ_GET_FAIL,
  MCQ_GET_REQUEST,
  MCQ_GET_SUCCESS,
  MCQ_UPDATE_REQUEST,
  MCQ_UPDATE_SUCCESS,
  MCQ_UPDATE_FAIL,
  MCQ_ANSWER_SUBMIT_REQUEST,
  MCQ_ANSWER_SUBMIT_SUCCESS,
  MCQ_ANSWER_SUBMIT_FAIL
} from "../constants/MCQConstants"

import {notifications} from "@mantine/notifications"

// List MCQs for a service book
export const listMCQs = (queryParams = {}) => async (dispatch, getState) => {
  try {
    dispatch({ type: MCQ_LIST_REQUEST })

    const {
      userLogin: { userInfo }
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    }

    // Build query string
    const params = new URLSearchParams()
    if (queryParams.serviceId) params.append('serviceId', queryParams.serviceId)
    if (queryParams.service_bookId) params.append('service_bookId', queryParams.service_bookId)
    if (queryParams.chapter) params.append('chapter', queryParams.chapter)
    if (queryParams.fromVerse) params.append('fromVerse', queryParams.fromVerse)
    if (queryParams.toVerse) params.append('toVerse', queryParams.toVerse)
    if (queryParams.startDate) params.append('startDate', queryParams.startDate)
    if (queryParams.endDate) params.append('endDate', queryParams.endDate)
    if (queryParams.sortProperty) params.append('sortProperty', queryParams.sortProperty)
    if (queryParams.sortType) params.append('sortType', queryParams.sortType)
    if (queryParams.page) params.append('page', queryParams.page)
    if (queryParams.size) params.append('size', queryParams.size)

    const { data } = await axios.get(
      `/api/en/MCQ?${params.toString()}`,
      config
    )

    dispatch({
      type: MCQ_LIST_SUCCESS,
      payload: data
    })
  } catch (error) {
    dispatch({
      type: MCQ_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    })
  }
}

// Create new MCQ with question and choices
export const createMCQ = (mcqData) => async (dispatch, getState) => {
  try {
    dispatch({ type: MCQ_CREATE_REQUEST })

    const {
      userLogin: { userInfo }
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`
      }
    }

    const { data } = await axios.post(
      `/api/en/MCQ`,
      mcqData,
      config
    )

    dispatch({
      type: MCQ_CREATE_SUCCESS,
      payload: data
    })

    notifications.show({
      id: "success-mcq",
      color: "green",
      title: "Success",
      message: "Question added successfully",
      autoClose: 5000
    })

    // Refresh the list after creating
    if (mcqData.serviceId && mcqData.service_bookId) {
      dispatch(listMCQs({
        serviceId: mcqData.serviceId,
        service_bookId: mcqData.service_bookId
      }))
    }
  } catch (error) {
    dispatch({
      type: MCQ_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    })

    notifications.show({
      id: "error-mcq",
      color: "red",
      title: "Error",
      message: error.response?.data?.message || "Failed to create question",
      autoClose: 5000
    })
  }
}

// Update MCQ
export const updateMCQ = (mcqId, updateData) => async (dispatch, getState) => {
  try {
    dispatch({ type: MCQ_UPDATE_REQUEST })

    const {
      userLogin: { userInfo }
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`
      }
    }

    const { data } = await axios.patch(
      `/api/en/MCQ/${mcqId}`,
      updateData,
      config
    )

    dispatch({
      type: MCQ_UPDATE_SUCCESS,
      payload: data
    })

    notifications.show({
      id: "success-mcq-update",
      color: "green",
      title: "Success",
      message: "Question updated successfully",
      autoClose: 5000
    })

    // Refresh the list after updating
    if (updateData.serviceId) {
      dispatch(listMCQs({ serviceId: updateData.serviceId }))
    }
  } catch (error) {
    dispatch({
      type: MCQ_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    })

    notifications.show({
      id: "error-mcq-update",
      color: "red",
      title: "Error",
      message: error.response?.data?.message || "Failed to update question",
      autoClose: 5000
    })
  }
}

// Delete MCQ
export const deleteMCQ = (mcqId, serviceId, service_bookId) => async (dispatch, getState) => {
  try {
    dispatch({ type: MCQ_DELETE_REQUEST })

    const {
      userLogin: { userInfo }
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    }

    await axios.delete(`/api/en/MCQ/${mcqId}`, config)

    dispatch({
      type: MCQ_DELETE_SUCCESS,
      payload: mcqId
    })

    notifications.show({
      id: "success-mcq-delete",
      color: "green",
      title: "Success",
      message: "Question deleted successfully",
      autoClose: 5000
    })

    // Refresh the list after deleting
    if (serviceId && service_bookId) {
      dispatch(listMCQs({ serviceId, service_bookId }))
    }
  } catch (error) {
    dispatch({
      type: MCQ_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    })

    notifications.show({
      id: "error-mcq-delete",
      color: "red",
      title: "Error",
      message: error.response?.data?.message || "Failed to delete question",
      autoClose: 5000
    })
  }
}

// Get single MCQ
export const getMCQ = (mcqId) => async (dispatch, getState) => {
  try {
    dispatch({ type: MCQ_GET_REQUEST })

    const {
      userLogin: { userInfo }
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    }

    const { data } = await axios.get(
      `/api/en/MCQ/${mcqId}`,
      config
    )

    dispatch({
      type: MCQ_GET_SUCCESS,
      payload: data
    })
  } catch (error) {
    dispatch({
      type: MCQ_GET_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    })
  }
}

// Submit MCQ Answer
export const submitMCQAnswer = (answerData) => async (dispatch, getState) => {
  try {
    dispatch({ type: MCQ_ANSWER_SUBMIT_REQUEST })

    const {
      userLogin: { userInfo }
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`
      }
    }

    const { data } = await axios.post(
      `/api/en/MCQ_Answer`,
      answerData,
      config
    )

    dispatch({
      type: MCQ_ANSWER_SUBMIT_SUCCESS,
      payload: data
    })

    notifications.show({
      id: "success-answer",
      color: data.pointsGained > 0 ? "green" : "orange",
      title: data.pointsGained > 0 ? "Correct!" : "Incorrect",
      message: data.pointsGained > 0
        ? `You earned ${data.pointsGained} points!`
        : `The correct answer was: ${data.trueAnswer}`,
      autoClose: 5000
    })
  } catch (error) {
    dispatch({
      type: MCQ_ANSWER_SUBMIT_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    })

    notifications.show({
      id: "error-answer",
      color: "red",
      title: "Error",
      message: error.response?.data?.message || "Failed to submit answer",
      autoClose: 5000
    })
  }
}

// Legacy functions kept for compatibility
export const MCQPost = createMCQ
export const MCQsGet = listMCQs
export const MCQUpdate = updateMCQ
export const deleteBibleQuestion = deleteMCQ