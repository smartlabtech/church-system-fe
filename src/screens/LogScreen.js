import React, {useState, useEffect} from "react"

import {useDispatch, useSelector} from "react-redux"
import UpdateProfileCard from "../components/updateProfileCard"
import ChangeNumberCard from "../components/changeNumberCard"
import ChangePwCard from "../components/changePwCard"
import StickyTopBar from "../components/StickyTopBar"

import ChangeEmailCard from "../components/ChangeEmailCard"
import ChangeMobileCard from "../components/ChangeMobileCard"
import {listMyLog} from "../actions/logActions"
import {useTranslation} from "react-i18next"
import {useNavigate} from "react-router-dom"
import {Loader} from "@mantine/core"

function LogScreen() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [t, i18n] = useTranslation()

  const userLogin = useSelector((state) => state.userLogin)
  const {userInfo} = userLogin

  const log = useSelector((state) => state.log)
  const {myLogs, loading} = log

  useEffect(() => {
    if (userInfo) {
      dispatch(listMyLog())
    } else navigate(`/`)
  }, [dispatch])

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="m-0 p-0">
          {myLogs?.length ? (
            myLogs?.map((log, index) => (
              <Group className="p-0 mt-2" key={index}>
                <p
                  className="p-0 m-0"
                  style={{fontSize: "10px", color: "green"}}
                >
                  {log.createdAt}
                </p>
                <p style={{fontSize: "12px", fontWeight: "bold"}}>
                  {log.description[t("lang")]}
                </p>
                <hr
                  style={{
                    height: "1px",
                    width: "80%",
                    borderWidth: "0",
                    color: "red",
                    backgroundStackor: "red"
                  }}
                />
              </Group>
            ))
          ) : (
            <h4
              className="p-5 m-0"
              style={{width: "100%", textAlign: "center"}}
            >
              {t("No_Logs")}
            </h4>
          )}
        </div>
      )}
    </>
  )
}

export default LogScreen
