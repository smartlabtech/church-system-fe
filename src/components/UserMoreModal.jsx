import React, {useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {useTranslation} from "react-i18next"
import {
  Button,
  Group,
  Loader,
  Modal,
  Stack,
  Text,
  Title,
  Divider
} from "@mantine/core"
import AddUpdateUserModal from "./Add_UpdateUserModal"
import {
  RESET_ADD_UPDATE_USER_MODAL,
  SET_ADD_UPDATE_USER_MODAL
} from "../constants/modalsConstants"
import {getUserCredentials} from "../actions/userActions"

const UserMoreModal = ({
  index,
  userDetails,
  onDelete,
  classId,
  onFollowUp,
  selectedService
}) => {
  const dispatch = useDispatch()
  const [t, i18n] = useTranslation()

  const [show, setShow] = useState(false)
  const servedByDelete = useSelector((state) => state.servedByDelete)
  const {loading} = servedByDelete

  const userRequestCredentials = useSelector(
    (state) => state.userRequestCredentials
  )
  const {loading: userRequestCredentialsLoading} = userRequestCredentials

  const userFollowUpUpdate = useSelector((state) => state.userFollowUpUpdate)
  const {loading: userFollowUpUpdateLoading} = userFollowUpUpdate

  const add_updateUserModal = useSelector((state) => state.add_updateUserModal)
  const {status, selectedIdToEdit} = add_updateUserModal

  const onShow = (status, type) => {
    if (type === "editUser" || type === "-") {
      setShow(false)
      status
        ? dispatch({type: SET_ADD_UPDATE_USER_MODAL, payload: userDetails._id})
        : dispatch({type: RESET_ADD_UPDATE_USER_MODAL})
    }
  }

  const shareViaSMS = (mobileToSendTo) => {
    const body = {
      serviceId: selectedService._id,
      classId
    }
    dispatch(getUserCredentials(mobileToSendTo, userDetails._id, body))
  }

  return (
    <>
      <AddUpdateUserModal
        userDetails={userDetails}
        serviceId={selectedService._id}
        classId={classId}
        status={status && selectedIdToEdit === userDetails?._id}
        classes={selectedService.classes}
        onShow={onShow}
      />
      <Button
        p={0}
        m={0}
        size="xs"
        variant="subtle"
        styles={{
          root: {
            textDecoration: "underline",
            color: "inherit",
            padding: 0,
            background: "none"
          }
        }}
        onClick={() => setShow(true)}
      >
        {t("More")}
      </Button>

      <Modal
        opened={show}
        onClose={() => setShow(false)}
        size="lg"
        withCloseButton={false}
      >
        <Stack spacing="md">
          <Group justify="center">
            <Button
              variant="outline"
              c="green"
              onClick={() => onFollowUp(userDetails._id)}
              loading={userFollowUpUpdateLoading}
            >
              {t("Follow_Up_Done")}
            </Button>
            <Button
              variant="outline"
              color="red"
              onClick={() => onDelete(index, userDetails._id)}
              loading={loading}
            >
              {t("Remove_From_Service")}
            </Button>
            <Button variant="outline" onClick={() => onShow(true, "editUser")}>
              {t("Edit")}
            </Button>
          </Group>

          <Divider />

          <Stack align="center" dir={t("Dir")}>
            <Text weight={500}>{`${userDetails.firstName} ${
              userDetails.fatherName
            } ${userDetails?.grandFaName || ""} ${
              userDetails?.familyName || ""
            }`}</Text>

            {userDetails?.birthday && (
              <Text>{`${userDetails?.birthday?.day} / ${userDetails?.birthday?.month} / ${userDetails?.birthday?.year}`}</Text>
            )}
            {userDetails?.email && <Text>{userDetails.email}</Text>}

            {userDetails?.fatherOfConfession && (
              <Text>{userDetails.fatherOfConfession}</Text>
            )}

            {userDetails?.address && (
              <Text>
                {userDetails.address.building}
                {userDetails.address.street_compound}
                {userDetails.address.region &&
                  ` - ${userDetails.address.region}`}
                {userDetails.address.floor &&
                  ` - الدور ${userDetails.address.floor}`}
                {userDetails.address.flat &&
                  ` - الشقة ${userDetails.address.flat}`}
              </Text>
            )}

            {userDetails?.address?.mark && (
              <Text c="red">{`علامة مميزة: ${userDetails.address.mark}`}</Text>
            )}

            {userDetails?.address?.location && (
              <iframe
                src={userDetails.address.location}
                width="100%"
                style={{border: 0}}
                allowFullScreen
                loading="lazy"
              ></iframe>
            )}

            <Text size="xs" color="dimmed">
              {`${t("Attendance")}: ${
                userDetails?.more?.lastAttendance?.split("T")[0] || "---"
              }`}
            </Text>
            <Text size="xs" color="dimmed">
              {`${t("Follow_Up")}: ${
                userDetails?.more?.lastFollowUp?.split("T")[0] || "---"
              }`}
            </Text>
          </Stack>

          {selectedService?.sendUserCredentials && (
            <Stack align="center">
              <Title order={6}>{t("Send_UserId_And_PW")}</Title>
              {userDetails.motherMobile && (
                <Button
                  variant="outline"
                  color="blue"
                  onClick={() => shareViaSMS(userDetails.motherMobile)}
                  loading={userRequestCredentialsLoading}
                >
                  {t("Mother")}
                </Button>
              )}
              {userDetails.fatherMobile && (
                <Button
                  variant="outline"
                  c="blue"
                  onClick={() => shareViaSMS(userDetails.fatherMobile)}
                  loading={userRequestCredentialsLoading}
                >
                  {t("Father")}
                </Button>
              )}
            </Stack>
          )}
        </Stack>
      </Modal>
    </>
  )
}

export default UserMoreModal
