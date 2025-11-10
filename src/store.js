import {createStore, combineReducers, applyMiddleware, compose} from "redux"
import {thunk} from "redux-thunk"
import {
  userLoginReducer,
  userForgetPasswordReducer,
  userChangePasswordReducer,
  userChangePhoneOTPReducer,
  userChangePhoneReducer,
  userRegisterReducer,
  userDetailsReducer,
  clientDetailsReducer,
  userUpdateProfileReducer,
  userListReducer,
  userDeleteReducer,
  userUpdateReducer,
  findToAttendReducer,
  userAddReducer,
  userRequestCredentialsReducer
} from "./reducers/userReducers"

import {
  servantInListMyReducer,
  servantInListReducer
} from "./reducers/servantInReducers"

import {authModalReducer} from "./reducers/authModalReducers"
import {announceReducer} from "./reducers/announceReducers"

import {successAlertReducer} from "./reducers/successReducers"
import {
  servedByDeleteReducer,
  servedByReducer
} from "./reducers/servedByReducers"
import {authScreenReducer} from "./reducers/authScreenReducers"
import {logReducer} from "./reducers/logReducers"
import {
  userFollowUpUpdateReducer,
  userServiceMetaReducer
} from "./reducers/userServiceMetaReducers"
import {adminReducer} from "./reducers/adminReducers"
import {
  addToServiceModalReducer,
  add_updateUserModalReducer,
  roleModalReducer,
  updateServantServiceModalReducer
} from "./reducers/modalsReducers"
import {servicesListReducer} from "./reducers/servicesReducers"
import {
  downloadExpenseReducer,
  getExpensesReducer,
  postExpenseReducer
} from "./reducers/expenseReducers"
import {announcementReducer} from "./reducers/announcementReducers"
import {storeReducer} from "./reducers/storeReducers"
import {
  orderCreateReducer,
  orderDeleteReducer,
  orderGetReducer,
  orderUpdateReducer
} from "./reducers/orderReducers"

import {
  productCreateReducer,
  productDeleteReducer,
  productGetReducer,
  productUpdateReducer
} from "./reducers/productReducers"
import {
  MCQListReducer,
  MCQCreateReducer,
  MCQDeleteReducer,
  MCQGetReducer,
  MCQUpdateReducer,
  MCQAnswerSubmitReducer,
  MCQAnswerListReducer
} from "./reducers/MCQReducers"
import {
  bibleMCQDeleteReducer,
  bibleMCQUpdateReducer
} from "./reducers/bibleMCQReducers"

import {booksGetReducer} from "./reducers/booksReducers"
import {usersFiltersReducer} from "./reducers/setUsersFiltersReducers"
import {shababEventRegisterReducer} from "./reducers/shababEventRegisterReducers"
import {
  serviceListReducer,
  serviceCreateReducer,
  serviceUpdateReducer,
  serviceDeleteReducer
} from "./reducers/serviceReducers"
import {
  classListReducer,
  classCreateReducer,
  classUpdateReducer,
  classDetailsReducer
} from "./reducers/classReducers"
import {
  bookListReducer,
  bookCreateReducer,
  bookUpdateReducer,
  bookDetailsReducer
} from "./reducers/bookReducers"
import {
  serviceBookListReducer,
  serviceBookCreateReducer,
  serviceBookUpdateReducer,
  serviceBookDetailsReducer
} from "./reducers/serviceBookReducers"
import {
  sendMessageReducer,
  communicationHistoryReducer
} from "./reducers/communicationReducers"
import {
  churchListReducer,
  churchCreateReducer,
  churchUpdateReducer,
  churchDeleteReducer
} from "./reducers/churchReducers"

const reducer = combineReducers({
  successAlert: successAlertReducer,

  announce: announceReducer,
  authScreen: authScreenReducer,

  servedBy: servedByReducer,
  servedByDelete: servedByDeleteReducer,

  authModal: authModalReducer,

  findToAttend: findToAttendReducer,
  userLogin: userLoginReducer,
  userForgetPassword: userForgetPasswordReducer,
  userChangePassword: userChangePasswordReducer,
  userChangePhoneOTP: userChangePhoneOTPReducer,
  userChangePhone: userChangePhoneReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  clientDetails: clientDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  userUpdate: userUpdateReducer,
  servantInList: servantInListReducer,
  servantInListMy: servantInListMyReducer,
  log: logReducer,
  userServiceMeta: userServiceMetaReducer,
  admin: adminReducer,
  roleModal: roleModalReducer,
  addToServiceModal: addToServiceModalReducer,
  add_updateUserModal: add_updateUserModalReducer,
  UpdateServantServiceModal: updateServantServiceModalReducer,
  servicesList: servicesListReducer,
  getExpenses: getExpensesReducer,
  postExpense: postExpenseReducer,
  downloadExpense: downloadExpenseReducer,
  announcement: announcementReducer,
  store: storeReducer,
  orderCreate: orderCreateReducer,
  orderGet: orderGetReducer,
  orderUpdate: orderUpdateReducer,
  orderDelete: orderDeleteReducer,
  productCreate: productCreateReducer,
  productGet: productGetReducer,
  productUpdate: productUpdateReducer,
  productDelete: productDeleteReducer,
  bibleMCQUpdate: bibleMCQUpdateReducer,
  bibleMCQDelete: bibleMCQDeleteReducer,
  MCQList: MCQListReducer,
  MCQCreate: MCQCreateReducer,
  MCQGet: MCQGetReducer,
  MCQUpdate: MCQUpdateReducer,
  MCQDelete: MCQDeleteReducer,
  MCQAnswerSubmit: MCQAnswerSubmitReducer,
  MCQAnswerList: MCQAnswerListReducer,
  booksGet: booksGetReducer,
  userAdd: userAddReducer,
  usersFilters: usersFiltersReducer,
  userFollowUpUpdate: userFollowUpUpdateReducer,
  userRequestCredentials: userRequestCredentialsReducer,
  shababEventRegister: shababEventRegisterReducer,
  serviceList: serviceListReducer,
  serviceCreate: serviceCreateReducer,
  serviceUpdate: serviceUpdateReducer,
  serviceDelete: serviceDeleteReducer,
  classList: classListReducer,
  classCreate: classCreateReducer,
  classUpdate: classUpdateReducer,
  classDetails: classDetailsReducer,
  bookList: bookListReducer,
  bookCreate: bookCreateReducer,
  bookUpdate: bookUpdateReducer,
  bookDetails: bookDetailsReducer,
  serviceBookList: serviceBookListReducer,
  serviceBookCreate: serviceBookCreateReducer,
  serviceBookUpdate: serviceBookUpdateReducer,
  serviceBookDetails: serviceBookDetailsReducer,
  sendMessage: sendMessageReducer,
  communicationHistory: communicationHistoryReducer,
  churchList: churchListReducer,
  churchCreate: churchCreateReducer,
  churchUpdate: churchUpdateReducer,
  churchDelete: churchDeleteReducer
})

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null

const initialState = {
  userLogin: {userInfo: userInfoFromStorage}
}

localStorage.setItem("authModal", false)

const middleware = [thunk]

// Configure compose to use Redux DevTools if available and in development
const composeEnhancers =
  (process.env.NODE_ENV === "development" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose

const store = createStore(
  reducer,
  initialState,
  composeEnhancers(applyMiddleware(...middleware))
)

export default store
