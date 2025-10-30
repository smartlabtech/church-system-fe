import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {getMyProfile, updateMyProfileImage} from "../actions/userActions"
import {useTranslation} from "react-i18next"
import resizeFile from "../helpers/imageResizer"
import {Button, Avatar, Stack} from "@mantine/core"

function UpdatePhotoCard() {
  const dispatch = useDispatch()
  const [t] = useTranslation()

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile)
  const {loading} = userUpdateProfile

  const userLogin = useSelector((state) => state.userLogin)
  const {userInfo} = userLogin

  useEffect(() => {
    if (userInfo) {
      dispatch(getMyProfile())
    }
  }, [dispatch])

  const imageChangedHandler = async (event) => {
    if (event.target.files[0]) {
      try {
        const result = await resizeFile(event.target.files[0])
        dispatch(updateMyProfileImage(result.file, userInfo.user._id, ""))
      } catch (err) {}
    }
  }

  return (
    <Stack align="center">
      <Avatar
        src={userInfo?.image || userInfo?.user?.image}
        alt="it's me"
        size={"xl"}
      />
      <Button component="label" disabled={loading}>
        {t("Change_Photo")}
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={imageChangedHandler}
        />
      </Button>
    </Stack>
  )
}

export default UpdatePhotoCard
