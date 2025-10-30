import axios from "axios"
import {
  SHABAB_EVENT_REGISTER_FAIL,
  SHABAB_EVENT_REGISTER_REQUEST,
  SHABAB_EVENT_REGISTER_SUCCESS
} from "../constants/shababEventRegisterConstant"
import {notifications} from "@mantine/notifications"
import ENV from "../utils/env"

const base_url = ENV.API_BASE_URL

export const registerEvent = (payload) => async (dispatch, getState) => {
  try {
    dispatch({
      type: SHABAB_EVENT_REGISTER_REQUEST
    })

    const config = {
      headers: {
        "Content-type": "application/json"
      }
    }
    const {data} = await axios.post(`${base_url}/shabab-event`, payload, config)
    dispatch({
      type: SHABAB_EVENT_REGISTER_SUCCESS
    })
    notifications.show({
      id: "reservation-success",
      color: "green",
      title: "نجاح",
      message: "تم تسجيل الحجز",
      autoClose: 5000
    })
  } catch (error) {
    dispatch({
      type: SHABAB_EVENT_REGISTER_FAIL
    })
    notifications.show({
      id: "error-response",
      color: "red",
      title: "Error",
      message: error.response?.data?.message || "An error occurred",
      autoClose: 5000
    })
  }
}

// export const getAnnouncements = (serviceId) => async (dispatch, getState) => {
//   try {
//     dispatch({
//       type: ANNOUNCEMENT_REQUEST
//     })

//     const {
//       userLogin: {userInfo}
//     } = getState()

//     const config = {
//       headers: {
//         "Content-type": "application/json",
//         Authorization: `Bearer ${userInfo.token}`
//       }
//     }
//     const {data} = await axios.get(
//       `${base_url}/announcement?serviceId=${serviceId}`,
//       config
//     )
//     dispatch({
//       type: ANNOUNCEMENT_SUCCESS,
//       payload: data
//     })
//   } catch (error) {
// notifications.show({
//   id: 'connection-error',
//   color: 'red',
//   title: 'Error',
//   message: 'Connection Error',
//   autoClose: 5000,
// });

//     dispatch({
//       type: ANNOUNCEMENT_FAIL,
//       payload:
//         error.response && error.response.data.detail
//           ? error.response.data.detail
//           : error.message
//     })
//   }
// }
