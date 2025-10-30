import React, {useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {RESET_ADD_TO_SERVICE_MODAL} from "../constants/modalsConstants"
import {addService_AuthorizedKhadem} from "../actions/adminActions"
import {useTranslation} from "react-i18next"
import {Modal, Button, Select, Stack, Group} from "@mantine/core"

function AddServantServiceModal() {
  const dispatch = useDispatch()
  const {t} = useTranslation()

  const [serviceId, setServiceId] = useState("")

  const addToServiceModal = useSelector((state) => state.addToServiceModal)
  const {status, data} = addToServiceModal

  const servicesList = useSelector((state) => state.servicesList)
  const {services} = servicesList

  const AddToServiceHandler = (role) => {
    dispatch({type: RESET_ADD_TO_SERVICE_MODAL})
    dispatch(
      addService_AuthorizedKhadem(data.listData, data.index, {
        userId: data.servantId,
        serviceId: serviceId,
        role: role
      })
    )
    setServiceId("")
  }

  return (
    <Modal
      opened={status}
      onClose={() => dispatch({type: RESET_ADD_TO_SERVICE_MODAL})}
      title={t("Add_To_Service")}
    >
      <Stack spacing="md">
        <Group position="apart" align="center">
          <img
            src={data?.servantImage}
            alt=""
            style={{width: "45px", height: "45px"}}
            className="rounded-circle"
          />
          <div>
            <p className="fw-bold mb-1">{data?.servantName}</p>
          </div>
        </Group>

        <Select
          data={services?.map((service) => ({
            label: service.name,
            value: service._id
          }))}
          onChange={(value) => setServiceId(value)}
          placeholder={t("Select_Service")}
        />

        {serviceId && (
          <Stack>
            <Button
              variant="outline"
              onClick={() => AddToServiceHandler("AMEN")}
            >
              {t("AMEN")}
            </Button>
            <Button
              variant="outline"
              onClick={() => AddToServiceHandler("MOSAED")}
            >
              {t("MOSAED")}
            </Button>
            <Button
              variant="outline"
              onClick={() => AddToServiceHandler("KHADEM")}
            >
              {t("KHADEM")}
            </Button>
          </Stack>
        )}
      </Stack>
    </Modal>
  )
}

export default AddServantServiceModal
