import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_CHANGE_PASSWORD_REQUEST,
  USER_CHANGE_PASSWORD_SUCCESS,
  USER_CHANGE_PASSWORD_FAIL,
  USER_FORGET_PASSWORD_REQUEST,
  USER_FORGET_PASSWORD_SUCCESS,
  USER_FORGET_PASSWORD_FAIL,
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
  USER_ADD_REQUEST,
  USER_ADD_SUCCESS,
  USER_ADD_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  USER_DETAILS_RESET,
  CLIENT_DETAILS_REQUEST,
  CLIENT_DETAILS_SUCCESS,
  CLIENT_DETAILS_FAIL,
  CLIENT_DETAILS_RESET,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_RESET,
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  USER_LIST_RESET,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAIL,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAIL,
  USER_UPDATE_RESET,
  FIND_TO_ATTEND_REQUEST,
  FIND_TO_ATTEND_SUCCESS,
  FIND_TO_ATTEND_FAIL,
  FIND_TO_ATTEND_RESET,
  GET_USER_CREDENTIALS_REQUEST,
  GET_USER_CREDENTIALS_SUCCESS,
  GET_USER_CREDENTIALS_FAIL,
  GET_USER_PROFILE_REQUEST,
  GET_USER_PROFILE_SUCCESS,
  GET_USER_PROFILE_FAIL
} from "../constants/userConstants"

export const userLoginReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return {loading: true}

    case USER_LOGIN_SUCCESS:
      return {loading: false, userInfo: action.payload}

    case USER_LOGIN_FAIL:
      return {loading: false, error: action.payload}

    case USER_LOGOUT:
      return {}

    default:
      return state
  }
}

export const userForgetPasswordReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_FORGET_PASSWORD_REQUEST:
      return {loading: true}

    case USER_FORGET_PASSWORD_SUCCESS:
      return {loading: false, result: action.payload}

    case USER_FORGET_PASSWORD_FAIL:
      return {loading: false, error: action.payload}

    default:
      return state
  }
}

export const userRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_REGISTER_REQUEST:
      return {loading: true}

    case USER_REGISTER_SUCCESS:
      return {loading: false, userInfo: action.payload}

    case USER_REGISTER_FAIL:
      return {loading: false, error: action.payload}

    case USER_LOGOUT:
      return {}

    default:
      return state
  }
}

export const userDetailsReducer = (state = {user: {}}, action) => {
  switch (action.type) {
    case USER_DETAILS_REQUEST:
      return {...state, loading: true}

    case USER_DETAILS_SUCCESS:
      return {loading: false, user: action.payload}

    case USER_DETAILS_FAIL:
      return {loading: false, error: action.payload}

    case USER_DETAILS_RESET:
      return {user: {}}

    default:
      return state
  }
}

export const clientDetailsReducer = (state = {client: {}}, action) => {
  switch (action.type) {
    case CLIENT_DETAILS_REQUEST:
      return {...state, loading: true}

    case CLIENT_DETAILS_SUCCESS:
      return {loading: false, client: action.payload}

    case CLIENT_DETAILS_FAIL:
      return {loading: false, error: action.payload}

    case CLIENT_DETAILS_RESET:
      return {client: {}}

    default:
      return state
  }
}

export const userUpdateProfileReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_UPDATE_PROFILE_REQUEST:
      return {loading: true}

    case USER_UPDATE_PROFILE_SUCCESS:
      return {loading: false, success: true, userInfo: action.payload}

    case USER_UPDATE_PROFILE_FAIL:
      return {loading: false, error: action.payload}

    case USER_UPDATE_PROFILE_RESET:
      return {}

    default:
      return state
  }
}

export const userChangePasswordReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_CHANGE_PASSWORD_REQUEST:
      return {loading: true}

    case USER_CHANGE_PASSWORD_SUCCESS:
      return {loading: false, success: true, userInfo: action.payload}

    case USER_CHANGE_PASSWORD_FAIL:
      return {loading: false, error: action.payload}

    default:
      return state
  }
}

export const userChangePhoneOTPReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_CHANGE_PHONE_OTP_REQUEST:
      return {loading: true}

    case USER_CHANGE_PHONE_OTP_SUCCESS:
      return {loading: false, success: true}

    case USER_CHANGE_PHONE_OTP_FAIL:
      return {loading: false, error: action.payload}

    default:
      return state
  }
}

export const userChangePhoneReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_CHANGE_PHONE_REQUEST:
      return {loading: true}

    case USER_CHANGE_PHONE_SUCCESS:
      return {loading: false, success: true}

    case USER_CHANGE_PHONE_FAIL:
      return {loading: false, error: action.payload}

    default:
      return state
  }
}

export const userListReducer = (state = {users: []}, action) => {
  switch (action.type) {
    case USER_LIST_REQUEST:
      return {loading: true}

    case USER_LIST_SUCCESS:
      return {loading: false, users: action.payload}

    case USER_LIST_FAIL:
      return {loading: false, error: action.payload}

    case USER_LIST_RESET:
      return {users: []}

    default:
      return state
  }
}

export const userDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_DELETE_REQUEST:
      return {loading: true}

    case USER_DELETE_SUCCESS:
      return {loading: false, success: true}

    case USER_DELETE_FAIL:
      return {loading: false, error: action.payload}

    default:
      return state
  }
}

export const userUpdateReducer = (state = {user: {}}, action) => {
  switch (action.type) {
    case USER_UPDATE_REQUEST:
      return {loading: true}

    case USER_UPDATE_SUCCESS:
      return {loading: false, success: true}

    case USER_UPDATE_FAIL:
      return {loading: false, error: action.payload}

    case USER_UPDATE_RESET:
      return {user: {}}

    default:
      return state
  }
}

export const findToAttendReducer = (state = {userData: {}}, action) => {
  switch (action.type) {
    case FIND_TO_ATTEND_REQUEST:
      return {...state, loading: true}

    case FIND_TO_ATTEND_SUCCESS:
      return {loading: false, userData: action.payload}

    case FIND_TO_ATTEND_FAIL:
      return {loading: false, error: action.payload}

    case FIND_TO_ATTEND_RESET:
      return {userData: {}}

    default:
      return state
  }
}

// add new user
export const userAddReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_ADD_REQUEST:
      return {loading: true}

    case USER_ADD_SUCCESS:
      return {loading: false, userInfo: action.payload}

    case USER_ADD_FAIL:
      return {loading: false, error: action.payload}

    default:
      return state
  }
}

export const userRequestCredentialsReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_USER_CREDENTIALS_REQUEST:
      return {loading: true}

    case GET_USER_CREDENTIALS_SUCCESS:
      return {loading: false, userInfo: action.payload}

    case GET_USER_CREDENTIALS_FAIL:
      return {loading: false, error: action.payload}

    default:
      return state
  }
}

export const userRequestProfileReducer = (
  state = {profileFetched: false},
  action
) => {
  switch (action.type) {
    case GET_USER_PROFILE_REQUEST:
      return {...state, loading: true}

    case GET_USER_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        userInfo: action.payload,
        profileFetched: true
      }

    case GET_USER_PROFILE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        profileFetched: false
      }

    default:
      return state
  }
}
