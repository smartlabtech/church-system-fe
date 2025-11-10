import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import ChurchManagement from "../components/admin/ChurchManagement"

function ChurchManagementScreen() {
  const navigate = useNavigate()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    // Only allow owner access (church management requires owner role)
    if (!userInfo || (userInfo?.user?.role !== "owner" && userInfo?.user?.role !== "admin")) {
      navigate("/")
    }
  }, [userInfo, navigate])

  return <ChurchManagement />
}

export default ChurchManagementScreen
