import axios from "axios"
import {
  DASHBOARD_STATS_REQUEST,
  DASHBOARD_STATS_SUCCESS,
  DASHBOARD_STATS_FAIL,
  DASHBOARD_STATS_RESET
} from "../constants/dashboardStatsConstants"

const base_url = import.meta.env.VITE_API_BASE_URL || "/api/ar"

export const getDashboardStats = (serviceId) => async (dispatch, getState) => {
  try {
    dispatch({
      type: DASHBOARD_STATS_REQUEST
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

    // Get current month (1-12)
    const currentMonth = new Date().getMonth() + 1

    // Fetch all three stats in parallel
    const [birthdaysResponse, attendanceResponse, followUpResponse] = await Promise.all([
      // This month's birthdays
      axios.post(
        `${base_url}/report`,
        {
          serviceId,
          requestType: "RESPONSE",
          status: "IN_CHURCH",
          birthdayIn: [currentMonth]
        },
        config
      ),
      // Haven't attended in last 2 weeks
      axios.post(
        `${base_url}/report`,
        {
          serviceId,
          requestType: "RESPONSE",
          status: "IN_CHURCH",
          lastAttendance: 2
        },
        config
      ),
      // Haven't been followed up in last 3 months
      axios.post(
        `${base_url}/report`,
        {
          serviceId,
          requestType: "RESPONSE",
          status: "IN_CHURCH",
          lastFollowUp: 3
        },
        config
      )
    ])

    dispatch({
      type: DASHBOARD_STATS_SUCCESS,
      payload: {
        birthdays: birthdaysResponse.data?.length || 0,
        attendance: attendanceResponse.data?.length || 0,
        followUp: followUpResponse.data?.length || 0,
        currentMonth
      }
    })
  } catch (error) {
    dispatch({
      type: DASHBOARD_STATS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    })
  }
}

export const resetDashboardStats = () => (dispatch) => {
  dispatch({type: DASHBOARD_STATS_RESET})
}
