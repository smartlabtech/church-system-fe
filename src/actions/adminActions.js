import axios from "axios"
import {
  AUTHORIZED_KHADEM_FAIL,
  AUTHORIZED_KHADEM_REQUEST,
  AUTHORIZED_KHADEM_SUCCESS
} from "../constants/adminConstants"
import {notifications} from "@mantine/notifications"
import ENV from "../utils/env"

const base_url = ENV.API_BASE_URL

export const getAuthorizedKhadem = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: AUTHORIZED_KHADEM_REQUEST
    })

    const {
      userLogin: {userInfo}
    } = getState()

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`
      }
    }
    const {data} = await axios.get(`${base_url}/user/authorizedKhadem`, config)
    dispatch({
      type: AUTHORIZED_KHADEM_SUCCESS,
      payload: data
    })
  } catch (error) {
    notifications.show({
      id: "connection-error",
      color: "red",
      title: "Error",
      message: "Connection Error",
      autoClose: 5000
    })
    dispatch({
      type: AUTHORIZED_KHADEM_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message
    })
  }
}

export const addService_AuthorizedKhadem =
  (oldList, index, servantInData) => async (dispatch, getState) => {
    try {
      dispatch({
        type: AUTHORIZED_KHADEM_REQUEST
      })

      const {
        userLogin: {userInfo}
      } = getState()

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${userInfo.token}`
        }
      }
      const {data} = await axios.post(
        `${base_url}/servantIn`,
        servantInData,
        config
      )
      oldList[index] = data
      dispatch({
        type: AUTHORIZED_KHADEM_SUCCESS,
        payload: oldList
      })
    } catch (error) {
      dispatch({
        type: AUTHORIZED_KHADEM_FAIL,
        payload: oldList
      })
      notifications.show({
        id: "dynamic-error",
        color: "red",
        title: "Error",
        message:
          error?.response?.data?.message || "An unexpected error occurred.",
        autoClose: 5000 // Close after 5 seconds
      })
    }
  }

// export const updateService_AuthorizedKhadem =
//   (oldList, index, id, servantInData) => async (dispatch, getState) => {
//     try {
//       dispatch({
//         type: AUTHORIZED_KHADEM_REQUEST
//       })

//       const {
//         userLogin: {userInfo}
//       } = getState()

//       const config = {
//         headers: {
//           "Content-type": "application/json",
//           Authorization: `Bearer ${userInfo.token}`
//         }
//       }
//       const {data} = await axios.patch(
//         `${base_url}/servantIn/${id}`,
//         servantInData,
//         config
//       )
//       data = oldList[index] = data
//       dispatch({
//         type: AUTHORIZED_KHADEM_SUCCESS,
//         payload: data
//       })
//     } catch (error) {
//       dispatch({
//         type: AUTHORIZED_KHADEM_FAIL,
//         payload: oldList
//       })
// notifications.show({
//   id: 'error-message',
//   color: 'red',
//   title: 'Error',
//   message: error?.response?.data?.message || 'An error occurred.',
//   autoClose: 5000,
// });

//     }
//   }

export const deleteService_AuthorizedKhadem =
  (oldList, index, id) => async (dispatch, getState) => {
    try {
      dispatch({
        type: AUTHORIZED_KHADEM_REQUEST
      })

      const {
        userLogin: {userInfo}
      } = getState()

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${userInfo.token}`
        }
      }
      const {data} = await axios.delete(`${base_url}/servantIn/${id}`, config)
      oldList[index] = data
      dispatch({
        type: AUTHORIZED_KHADEM_SUCCESS,
        payload: oldList
      })
    } catch (error) {
      dispatch({
        type: AUTHORIZED_KHADEM_FAIL,
        payload: oldList
      })
      notifications.show({
        id: "error-notification",
        color: "red",
        title: "Error",
        message: error.response?.data?.message || "An error occurred",
        autoClose: 5000
      })
    }
  }

export const updateRole_AuthorizedKhadem =
  (oldList, index, id, role) => async (dispatch, getState) => {
    try {
      dispatch({
        type: AUTHORIZED_KHADEM_REQUEST
      })

      const {
        userLogin: {userInfo}
      } = getState()

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${userInfo.token}`
        }
      }
      const {data} = await axios.patch(
        `${base_url}/user/role/${id}`,
        {role: role},
        config
      )
      oldList[index].role = role
      dispatch({
        type: AUTHORIZED_KHADEM_SUCCESS,
        payload: oldList
      })
    } catch (error) {
      dispatch({
        type: AUTHORIZED_KHADEM_FAIL,
        payload: oldList
      })
      notifications.show({
        id: "error",
        color: "red",
        title: "Error",
        message: error.response?.data?.message || "An error occurred",
        autoClose: 5000
      })
    }
  }
