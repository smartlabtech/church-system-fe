import React from "react"
import {useDispatch, useSelector} from "react-redux"

import {RESET_UPDATE_SERVANT_SERVICE_MODAL} from "../constants/modalsConstants"
import {deleteService_AuthorizedKhadem} from "../actions/adminActions"
import {useTranslation} from "react-i18next"
import {Button, Group, Modal, Stack} from "@mantine/core"

function UpdateServantServiceModal() {
  const dispatch = useDispatch()
  const [t, i18n] = useTranslation()

  const UpdateServantServiceModal = useSelector(
    (state) => state.UpdateServantServiceModal
  )
  const {status, data} = UpdateServantServiceModal

  // const UpdateServantServiceHandler = (role) => {
  //   dispatch({type: RESET_UPDATE_SERVANT_SERVICE_MODAL})
  //   dispatch(
  //     updateService_AuthorizedKhadem(
  //       data.listData,
  //       data.index,
  //       data.indexData._id,
  //       role
  //     )
  //   )
  // }

  const RemoveServantServiceHandler = () => {
    dispatch({type: RESET_UPDATE_SERVANT_SERVICE_MODAL})
    dispatch(
      deleteService_AuthorizedKhadem(
        data.listData,
        data.index,
        data.indexData.servantInId
      )
    )
  }

  return (
    <Modal
      opened={status}
      onClose={() => dispatch({type: RESET_UPDATE_SERVANT_SERVICE_MODAL})}
    >
      <Modal.Header>
        <Modal.Title>{t("Remove_Servant_From_Service")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Group
          className="m-0 p-0 justify-content-center"
          style={{width: "100%"}}
        >
          <Stack
            className="m-0 p-0 justify-content-start"
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
          >
            <div className="d-flex align-items-center">
              <img
                src={data?.servantImage}
                alt=""
                style={{width: "45px", height: "45px"}}
                className="rounded-circle"
              />
              <div className="ms-3">
                <p className="fw-bold mb-1">{data?.servantName}</p>
                <p className="text-muted mb-0">
                  <span
                    className={`badge badge-success rounded-pill d-inline ${data?.servantRole}`}
                  >
                    {data?.indexData?.name}
                  </span>
                </p>
              </div>
            </div>
          </Stack>
          <Stack
            className="m-0 p-0 justify-content-start"
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
          >
            <Button
              variant="outline-danger"
              className="m-1 p-1 rounded"
              size="sm"
              style={{width: "100%"}}
              onClick={() => RemoveServantServiceHandler()}
            >
              {t("REMOVE")}
            </Button>
          </Stack>
        </Group>
      </Modal.Body>
    </Modal>
  )
}

export default UpdateServantServiceModal
