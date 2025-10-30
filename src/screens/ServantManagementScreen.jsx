import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import ServantManagement from "../components/admin/ServantManagement"

function ServantManagementScreen() {
  const navigate = useNavigate()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    // Only allow admin access
    if (!userInfo || userInfo?.user?.role !== "admin") {
      navigate("/")
    }
  }, [userInfo, navigate])

  return <ServantManagement />
}

export default ServantManagementScreen