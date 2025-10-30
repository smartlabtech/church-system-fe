import axios from "axios"
import {
  ANNOUNCEMENT_FAIL,
  ANNOUNCEMENT_REQUEST,
  ANNOUNCEMENT_SUCCESS
} from "../constants/announcementConstants"
import {notifications} from "@mantine/notifications"
import ENV from "../utils/env"

const base_url = ENV.API_BASE_URL

export const createAnnouncement =
  (oldList, announcementData) => async (dispatch, getState) => {
    try {
      dispatch({
        type: ANNOUNCEMENT_REQUEST
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
        `${base_url}/announcement`,
        announcementData,
        config
      )
      const newList = [data].concat(oldList)
      dispatch({
        type: ANNOUNCEMENT_SUCCESS,
        payload: newList
      })
    } catch (error) {
      dispatch({
        type: ANNOUNCEMENT_FAIL,
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

export const getAnnouncements = (serviceId) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ANNOUNCEMENT_REQUEST
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
    const {data} = await axios.get(
      `${base_url}/announcement?serviceId=${serviceId}`,
      config
    )
    dispatch({
      type: ANNOUNCEMENT_SUCCESS,
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
      type: ANNOUNCEMENT_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message
    })
  }
}

// export const updateAnnouncement =
//   (oldList, index, id, announcementData) => async (dispatch, getState) => {
//     try {
//       dispatch({
//         type: ANNOUNCEMENT_REQUEST
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
//         `${base_url}/announcement/${id}`,
//         announcementData,
//         config
//       )
//       oldList[index] = data
//       dispatch({
//         type: ANNOUNCEMENT_SUCCESS,
//         payload: oldList
//       })
//     } catch (error) {
//       dispatch({
//         type: ANNOUNCEMENT_FAIL,
//         payload: oldList
//       })
// notifications.show({
//   id: 'error-response',
//   color: 'red',
//   title: 'Error',
//   message: error.response?.data?.message || 'An error occurred',
//   autoClose: 5000,
// });
//     }
//   }

export const deleteAnnouncement =
  (oldList, index, id) => async (dispatch, getState) => {
    try {
      dispatch({
        type: ANNOUNCEMENT_REQUEST
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
      await axios.delete(`${base_url}/announcement/${id}`, config)
      delete oldList[index]
      dispatch({
        type: ANNOUNCEMENT_SUCCESS,
        payload: oldList
      })
    } catch (error) {
      dispatch({
        type: ANNOUNCEMENT_FAIL,
        payload: oldList
      })
      notifications.show({
        id: "error-message",
        color: "red",
        title: "Error",
        message: error.response?.data?.message || "An error occurred",
        autoClose: 5000
      })
    }
  }
