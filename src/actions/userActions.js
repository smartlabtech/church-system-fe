import axios from "axios"
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_FORGET_PASSWORD_REQUEST,
  USER_FORGET_PASSWORD_SUCCESS,
  USER_FORGET_PASSWORD_FAIL,
  USER_CHANGE_PASSWORD_REQUEST,
  USER_CHANGE_PASSWORD_SUCCESS,
  USER_CHANGE_PASSWORD_FAIL,
  USER_CHANGE_PHONE_OTP_REQUEST,
  USER_CHANGE_PHONE_OTP_SUCCESS,
  USER_CHANGE_PHONE_OTP_FAIL,
  USER_CHANGE_PHONE_REQUEST,
  USER_CHANGE_PHONE_SUCCESS,
  USER_CHANGE_PHONE_FAIL,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_RESET,
  CLIENT_DETAILS_REQUEST,
  CLIENT_DETAILS_SUCCESS,
  CLIENT_DETAILS_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAIL,
  USER_ADD_REQUEST,
  USER_ADD_SUCCESS,
  USER_ADD_FAIL,
  FIND_TO_ATTEND_FAIL,
  FIND_TO_ATTEND_SUCCESS,
  FIND_TO_ATTEND_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  USER_LIST_REQUEST,
  GET_USER_CREDENTIALS_REQUEST,
  GET_USER_CREDENTIALS_SUCCESS,
  GET_USER_CREDENTIALS_FAIL,
  GET_USER_PROFILE_REQUEST,
  GET_USER_PROFILE_SUCCESS,
  GET_USER_PROFILE_FAIL
} from "../constants/userConstants"

import {RESET_AUTH_MODAL, SET_AUTH_MODAL} from "../constants/authModalConstants"
import {RESET_SUCCESS, SET_SUCCESS} from "../constants/successAlertConstants"
import {RESET_ADD_UPDATE_USER_MODAL} from "../constants/modalsConstants"
import {notifications} from "@mantine/notifications"
import ENV from "../utils/env"

const base_url = ENV.API_BASE_URL
const churchId = ENV.API_CHURCH_ID
export const login =
  (signInBy, password, loginActionSource) => async (dispatch) => {
    try {
      dispatch({type: USER_LOGIN_REQUEST})

      let body = {password, churchId}

      if (signInBy?.mobile) body.mobile = signInBy.mobile
      if (signInBy?.id) body.id = signInBy.id

      const config = {
        headers: {"Content-type": "application/json"}
      }

      const {data} = await axios.post(`${base_url}/auth/signin`, body, config)

      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: data
      })

      if (loginActionSource !== "MYPROFILE") {
        window.location.replace(`${window.location.origin}`)
      }

      // Save user data to localStorage
      localStorage.setItem("userInfo", JSON.stringify(data))
      if (signInBy?.mobile) {
        localStorage.setItem("mobile", signInBy.mobile)
        localStorage.removeItem("id")
      }
      if (signInBy?.id) {
        localStorage.setItem("id", signInBy.id)
        localStorage.removeItem("mobile")
      }
      localStorage.setItem("password", password)
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "754 System Error"

      notifications.show({
        id: "error-notification",
        color: "red",
        title: "Error",
        message: errorMessage || "An error occurred",
        autoClose: 5000
      })
      dispatch(log_out())

      dispatch({
        type: USER_LOGIN_FAIL,
        payload: errorMessage
      })
    }
  }

export const forgetPassword = (mobile) => async (dispatch) => {
  try {
    dispatch({
      type: USER_FORGET_PASSWORD_REQUEST
    })

    const config = {
      headers: {
        "Content-type": "application/json"
      }
    }
    const {data} = await axios.get(
      `${base_url}/auth/forgot-password/${mobile}`,
      config
    )

    dispatch({
      type: USER_FORGET_PASSWORD_SUCCESS,
      payload: data
    })

    dispatch({
      type: SET_SUCCESS,
      payload: data.message
    })
    setTimeout(
      () =>
        dispatch({
          type: RESET_SUCCESS
        }),
      3500
    )
  } catch (error) {
    dispatch({
      type: USER_FORGET_PASSWORD_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    })
  }
}

export const register = (userData) => async (dispatch) => {
  try {
    dispatch({
      type: USER_REGISTER_REQUEST
    })

    const config = {
      headers: {
        "Content-type": "application/json"
      }
    }
    userData["churchId"] = churchId

    const file = userData?.image || 0
    delete userData["image"]

    const {data} = await axios.post(`${base_url}/auth/signup`, userData, config)

    if (file) {
      let formData = new FormData()

      formData.append("file", file)
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
          Authorization: `Bearer ${data.token}`
        }
      }
      await axios.patch(
        `${base_url}/user/profile-image/${data.user._id}`,
        formData,
        config
      )
    }

    dispatch({
      type: USER_REGISTER_SUCCESS,
      payload: data
    })
    dispatch(login({mobile: userData.mobile}, userData.password, "REGISTER"))
  } catch (error) {
    notifications.show({
      id: "registration-error",
      position: "bottom-center",
      color: "red",
      title: "Error",
      message: error?.response?.data?.message
        ? error?.response?.data?.message
        : "753 System Error",
      autoClose: 5000
    })

    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    })
  }
}

export const log_out = () => (dispatch) => {
  localStorage.removeItem("userInfo")
  localStorage.removeItem("mobile")
  localStorage.removeItem("id")
  localStorage.removeItem("password")
  localStorage.removeItem("lastLogin")
  localStorage.removeItem("servantIn")
  localStorage.removeItem("servedBy")
  localStorage.removeItem("servedByLastUpdate")
  dispatch({type: USER_LOGOUT})
  dispatch({type: USER_DETAILS_RESET})
  dispatch({type: SET_AUTH_MODAL})
}

export const getClientDetailsByMobile =
  (mobile) => async (dispatch, getState) => {
    console.log(base_url)
    try {
      dispatch({
        type: CLIENT_DETAILS_REQUEST
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
        `${base_url}/user/mobile/${mobile}`,
        config
      )

      dispatch({
        type: CLIENT_DETAILS_SUCCESS,
        payload: data
      })
    } catch (error) {
      dispatch({
        type: CLIENT_DETAILS_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
      })
    }
  }

export const addNewUser = (user) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_ADD_REQUEST
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
    const file = user?.image || 0
    delete user["image"]

    const {data} = await axios.post(`${base_url}/user`, user, config)

    if (file) dispatch(updateMyProfileImage(file, data._id, ""))

    dispatch({
      type: USER_ADD_SUCCESS
    })
    dispatch({type: RESET_ADD_UPDATE_USER_MODAL})
  } catch (error) {
    notifications.show({
      id: "error-response",
      color: "red",
      title: "Error",
      message: error.response?.data?.message || "An error occurred",
      autoClose: 5000
    })

    dispatch({
      type: USER_ADD_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    })
  }
}

export const getUsers = (filters) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_LIST_REQUEST
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
    console.log(filters)

    const {data} = await axios.post(`${base_url}/report`, filters, config)
    if (filters.requestType == "RESPONSE") {
      if (data.length == 0)
        notifications.show({
          id: "no-data",
          color: "red",
          title: "Error",
          message: "No Data Found",
          autoClose: 5000
        })

      dispatch({
        type: USER_LIST_SUCCESS,
        payload: data
      })
    } else {
      dispatch({
        type: USER_LIST_SUCCESS,
        payload: []
      })
      notifications.show({
        id: "success-notification",
        color: "green",
        title: "Success",
        message: data.message || "Operation completed successfully",
        autoClose: 5000
      })
    }
  } catch (error) {
    notifications.show({
      id: "error-response",
      color: "red",
      title: "Error",
      message: error.response?.data?.message || "An error occurred",
      autoClose: 5000
    })

    dispatch({
      type: USER_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    })
  }
}

export const sendAttendanceReport = (filters) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_LIST_REQUEST
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
    console.log(filters)

    const {data} = await axios.post(
      `${base_url}/report/attendance`,
      filters,
      config
    )
    if (filters.requestType == "RESPONSE") {
      if (data.length == 0)
        notifications.show({
          id: "no-data",
          color: "red",
          title: "Error",
          message: "No Data Found",
          autoClose: 5000
        })

      dispatch({
        type: USER_LIST_SUCCESS,
        payload: data
      })
    } else {
      dispatch({
        type: USER_LIST_SUCCESS,
        payload: []
      })
      notifications.show({
        id: "success-notification",
        color: "green",
        title: "Success",
        message: data.message || "Operation completed successfully",
        autoClose: 5000
      })
    }
  } catch (error) {
    notifications.show({
      id: "error-response",
      color: "red",
      title: "Error",
      message: error.response?.data?.message || "An error occurred",
      autoClose: 5000
    })

    dispatch({
      type: USER_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    })
  }
}

export const updateUser = (id, user) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_UPDATE_REQUEST
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

    const {data} = await axios.patch(`${base_url}/user/${id}`, user, config)

    dispatch({
      type: USER_UPDATE_SUCCESS
    })
    notifications.show({
      id: "updated-successfully",
      color: "green",
      title: "Success",
      // message: "",
      autoClose: 2000
    })
  } catch (error) {
    notifications.show({
      id: "error-response",
      color: "red",
      title: "Error",
      message: error.response?.data?.message || "An error occurred",
      autoClose: 5000
    })

    dispatch({
      type: USER_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    })
  }
}

export const getMyProfile = () => async (dispatch, getState) => {
  const {userLogin} = getState()
  const {userInfo} = userLogin

  if (!userInfo || userInfo.profileFetched) return

  const body = {
    churchId: churchId,
    mobile: userInfo.user.mobile,
    password: localStorage.getItem("password")
  }
  try {
    dispatch({type: GET_USER_PROFILE_REQUEST})

    const config = {
      headers: {"Content-type": "application/json"}
    }

    const {data} = await axios.post(`${base_url}/auth/signin`, body, config)

    dispatch({type: GET_USER_PROFILE_SUCCESS, payload: data})
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data
    })
  } catch (error) {
    dispatch({
      type: GET_USER_PROFILE_FAIL,
      payload: error.response?.data?.message || "Error fetching profile"
    })
  }
}

export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_UPDATE_PROFILE_REQUEST
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
    const {data} = await axios.patch(`${base_url}/user/profile`, user, config)

    notifications.show({
      id: "success-done",
      color: "green",
      title: "Success",
      message: "Done",
      autoClose: 5000
    })

    dispatch({
      type: USER_UPDATE_PROFILE_SUCCESS,
      payload: data
    })
    localStorage.setItem("userInfo", JSON.stringify(data))
  } catch (error) {
    notifications.show({
      id: "error-response",
      color: "red",
      title: "Error",
      message: error.response?.data?.message || "An error occurred",
      autoClose: 5000
    })

    dispatch({
      type: USER_UPDATE_PROFILE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.response.data.message
    })
  }
}

export const updateMyProfileImage =
  (file, userId, token) => async (dispatch, getState) => {
    try {
      dispatch({
        type: USER_UPDATE_PROFILE_REQUEST
      })

      const {
        userLogin: {userInfo}
      } = getState()

      let formData = new FormData()

      formData.append("file", file)
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
          Authorization: `Bearer ${userInfo?.token || token}`
        }
      }
      const {data} = await axios.patch(
        `${base_url}/user/profile-image/${userId}`,
        formData,
        config
      )

      const myProfileData = JSON.parse(localStorage.getItem("userInfo"))
      myProfileData.image = data.imageUrl
      userInfo["user"].image = data.imageUrl
      // dispatch({
      //   type: USER_LOGIN_SUCCESS,
      //   payload: userInfo
      // })
      dispatch({
        type: USER_UPDATE_PROFILE_SUCCESS,
        payload: myProfileData
      })

      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: myProfileData
      })

      localStorage.setItem("userInfo", JSON.stringify(myProfileData))
    } catch (error) {
      dispatch({
        type: USER_UPDATE_PROFILE_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
      })
    }
  }

export const changePhoneRequest = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_CHANGE_PHONE_OTP_REQUEST
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
      `${base_url}/user/change-mobile-request`,
      config
    )

    dispatch({
      type: USER_CHANGE_PHONE_OTP_SUCCESS,
      payload: data
    })
  } catch (error) {
    dispatch({
      type: USER_CHANGE_PHONE_OTP_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.response
    })
  }
}

export const changePhone = (body) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_CHANGE_PHONE_REQUEST
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
      `${base_url}/user/change-mobile`,
      body,
      config
    )

    dispatch({
      type: USER_CHANGE_PHONE_SUCCESS,
      payload: data
    })

    localStorage.setItem("userInfo", JSON.stringify(data))
    localStorage.setItem("mobile", data.mobile)
  } catch (error) {
    dispatch({
      type: USER_CHANGE_PHONE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.response
    })
  }
}

export const changePassword = (user) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_CHANGE_PASSWORD_REQUEST
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
    const {data} = await axios.patch(`${base_url}/user/profile`, user, config)

    dispatch({
      type: USER_CHANGE_PASSWORD_SUCCESS,
      payload: data
    })

    dispatch({
      type: SET_SUCCESS,
      payload: "Done"
    })
    setTimeout(
      () =>
        dispatch({
          type: RESET_SUCCESS
        }),
      2500
    )

    localStorage.setItem("userInfo", JSON.stringify(data))
    localStorage.setItem("password", user.password)
  } catch (error) {
    notifications.show({
      id: "error-message",
      color: "red",
      title: "Error",
      message: error.message || "An error occurred",
      autoClose: 5000
    })
    dispatch({
      type: USER_CHANGE_PASSWORD_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message
    })
  }
}

export const postAttend = (filter) => async (dispatch, getState) => {
  try {
    dispatch({
      type: FIND_TO_ATTEND_REQUEST
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
      `${base_url}/user/find-to-attend${filter}`,
      config
    )
    dispatch({
      type: FIND_TO_ATTEND_SUCCESS,
      payload: data
    })
  } catch (error) {
    dispatch({
      type: FIND_TO_ATTEND_FAIL,
      payload: {
        message:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.response.data.message,
        code: error.response.status
      }
    })
  }
}

export const getUserCredentials =
  (mobileToSendTo, userId, body) => async (dispatch, getState) => {
    try {
      dispatch({
        type: GET_USER_CREDENTIALS_REQUEST
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
        `${base_url}/user/user-credentials/${userId}`,
        body,
        config
      )
      const smsUrl = `sms:${mobileToSendTo}?body=${encodeURIComponent(
        `user Id: ${userId}\npassword: ${data.password}`
      )}`
      window.location.href = smsUrl
      dispatch({
        type: GET_USER_CREDENTIALS_SUCCESS,
        payload: data
      })
    } catch (error) {
      notifications.show({
        id: "error-response-message",
        color: "red",
        title: "Error",
        message: error.response?.data?.message || "An error occurred",
        autoClose: 5000
      })

      dispatch({
        type: GET_USER_CREDENTIALS_FAIL,
        payload: {
          message:
            error.response && error.response.data.detail
              ? error.response.data.detail
              : error.response.data.message,
          code: error.response.status
        }
      })
    }
  }
