import {useDispatch, useSelector} from "react-redux"

import {LinkContainer} from "react-router-bootstrap"
import {useHistory} from "react-router-dom"
import {useState} from "react"
import {SET_SERVEDBYMODAL} from "../constants/servedByConstants"
import {Loader} from "@mantine/core"

function StickyTopBar() {
  const dispatch = useDispatch()
  const history = useHistory()

  const currentServedBy =
    localStorage.getItem("servedBy") || JSON.stringify({name: "خدمتك"})

  const userLogin = useSelector((state) => state.userLogin)
  const {userInfo, loading} = userLogin

  const servedBy = useSelector((state) => state.servedBy)
  const {status, service} = servedBy

  const gotoDashboard = () => {
    history.push(`/`)
  }
  const servedByHandler = () => {
    dispatch({type: SET_SERVEDBYMODAL})
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Group
          className="m-0 p-0 justify-content-between"
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
        >
          {/* <Stack className="p-0 m-0" xs={3} sm={2} md={2} lg={2} xl={1}>
          <Image
            style={{width: "100%"}}
            src="https://storage.googleapis.com/mado-marche-oms/assets/left_logo.gif"
            rounded
          />
        </Stack> */}
          <Stack
            className="p-0 pt-2 m-1"
            xs={4}
            sm={4}
            md={4}
            lg={3}
            xl={3}
            style={{textAlign: "left"}}
          >
            {userInfo?.user?.servedBy?.length ? (
              <Button
                variant="outline-primary"
                onClick={() => servedByHandler()}
                size="sm"
                fontSize="0.65rem"
                className="rounded"
              >
                {JSON.parse(currentServedBy)?.name}
              </Button>
            ) : (
              ""
            )}
          </Stack>
          <Stack
            className="p-0 pt-2 m-1"
            xs={4}
            sm={4}
            md={4}
            lg={3}
            xl={3}
            style={{textAlign: "right"}}
          >
            {userInfo?.user?.servantIn?.length ? (
              <>
                <Button
                  variant="outline-primary"
                  onClick={() => gotoDashboard()}
                  size="sm"
                  fontSize="0.65rem"
                  className="rounded"
                >
                  خادم
                </Button>
              </>
            ) : (
              ""
            )}
          </Stack>
        </Group>
      )}
    </>
  )
}

export default StickyTopBar
