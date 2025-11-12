import {
  DASHBOARD_STATS_REQUEST,
  DASHBOARD_STATS_SUCCESS,
  DASHBOARD_STATS_FAIL,
  DASHBOARD_STATS_RESET
} from "../constants/dashboardStatsConstants"

export const dashboardStatsReducer = (state = {}, action) => {
  switch (action.type) {
    case DASHBOARD_STATS_REQUEST:
      return {loading: true}
    case DASHBOARD_STATS_SUCCESS:
      return {loading: false, stats: action.payload}
    case DASHBOARD_STATS_FAIL:
      return {loading: false, error: action.payload}
    case DASHBOARD_STATS_RESET:
      return {}
    default:
      return state
  }
}
