import {
  SET_ROLE_MODAL,
  RESET_ROLE_MODAL,
  SET_ADD_TO_SERVICE_MODAL,
  RESET_ADD_TO_SERVICE_MODAL,
  SET_UPDATE_SERVANT_SERVICE_MODAL,
  RESET_UPDATE_SERVANT_SERVICE_MODAL,
  SET_ADD_UPDATE_USER_MODAL,
  RESET_ADD_UPDATE_USER_MODAL
} from "../constants/modalsConstants"

export const roleModalReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_ROLE_MODAL:
      return {
        status: true,
        data: action.payload
      }

    case RESET_ROLE_MODAL:
      return {
        status: false,
        data: {}
      }

    default:
      return state
  }
}

export const addToServiceModalReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_ADD_TO_SERVICE_MODAL:
      return {
        status: true,
        data: action.payload
      }

    case RESET_ADD_TO_SERVICE_MODAL:
      return {
        status: false,
        data: {}
      }

    default:
      return state
  }
}

export const updateServantServiceModalReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_UPDATE_SERVANT_SERVICE_MODAL:
      return {
        status: true,
        data: action.payload
      }

    case RESET_UPDATE_SERVANT_SERVICE_MODAL:
      return {
        status: false,
        data: {}
      }

    default:
      return state
  }
}

export const add_updateUserModalReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_ADD_UPDATE_USER_MODAL:
      return {
        status: true,
        selectedIdToEdit: action.payload
      }

    case RESET_ADD_UPDATE_USER_MODAL:
      return {
        status: false
      }

    default:
      return state
  }
}
