import React, {useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {
  addNewUser,
  updateMyProfileImage,
  updateUser
} from "../actions/userActions"
import {validEmailRegex, validMobileRegex} from "../myRegexp"
import resizeFile from "../helpers/imageResizer"
import {
  Modal,
  Button,
  Card,
  Stack,
  Loader,
  TextInput,
  Radio,
  Avatar,
  FileInput,
  Title,
  Group,
  Divider,
  TagsInput
} from "@mantine/core"
import {useTranslation} from "react-i18next"
import {notifications} from "@mantine/notifications"
import Lottie from "react-lottie-player"
import no from "../assets/lottie/No.json"
import {FaMapMarkerAlt} from "react-icons/fa"
import UserStatus from "./User_Status"

function AddUpdateUserModal({userDetails, serviceId, classId, status, onShow}) {
  const dispatch = useDispatch()
  const {t} = useTranslation()

  const userAdd = useSelector((state) => state.userAdd)
  const {loading} = userAdd

  const userUpdate = useSelector((state) => state.userUpdate)
  const {loading: userUpdateLoading} = userUpdate

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile)
  const {loading: userUpdateProfileLoading} = userUpdateProfile

  const [profileImage, setProfileImage] = useState(userDetails?.image)
  const [firstName, setFirstName] = useState(userDetails?.firstName || "")
  const [fatherName, setFatherName] = useState(userDetails?.fatherName || "")
  const [grandFaName, setGrandFaName] = useState(userDetails?.grandFaName || "")
  const [familyName, setFamilyName] = useState(userDetails?.familyName || "")
  const [mobile, setMobile] = useState(userDetails?.mobile || "")
  const [fatherOfConfession, setFatherOfConfession] = useState(
    userDetails?.fatherOfConfession || ""
  )
  const [anotherMobile, setAnotherMobile] = useState(
    userDetails?.anotherMobile || ""
  )
  const [homePhone, setHomePhone] = useState(userDetails?.homePhone || "")
  const [motherMobile, setMotherMobile] = useState(
    userDetails?.motherMobile || ""
  )
  const [fatherMobile, setFatherMobile] = useState(
    userDetails?.fatherMobile || ""
  )

  const [email, setEmail] = useState(userDetails?.email || "")
  const [gender, setGender] = useState(userDetails?.gender || "MALE")
  const [birthDay, setBirthDay] = useState(() => {
    const year = userDetails?.birthday?.year || ""
    const month = String(userDetails?.birthday?.month || "").padStart(2, "0")
    const day = String(userDetails?.birthday?.day || "").padStart(2, "0")
    return year && month && day ? `${year}-${month}-${day}` : ""
  })

  const [city, setCity] = useState(userDetails?.address?.city || "")
  const [region, setRegion] = useState(userDetails?.address?.region || "")
  const [street, setStreet] = useState(
    userDetails?.address?.street_compound || ""
  )
  const [building, setBuilding] = useState(userDetails?.address?.building || "")
  const [floor, setFloor] = useState(userDetails?.address?.floor || "")
  const [flat, setFlat] = useState(userDetails?.address?.flat || "")
  const [mark, setMark] = useState(userDetails?.address?.mark || "")
  const [location, setLocation] = useState(userDetails?.address?.location || "")

  const [userStatus, setUserStatus] = useState(userDetails?.status || "")

  // Study and skills fields (both are arrays now)
  const [study, setStudy] = useState(
    Array.isArray(userDetails?.study) ? userDetails.study : []
  )
  const [skills, setSkills] = useState(
    Array.isArray(userDetails?.skills) ? userDetails.skills : []
  )

  const locationHandler = () => {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const crd = pos.coords
        setLocation(
          `https://maps.google.com/maps?q=${crd.latitude},${crd.longitude}&hl=en&z=14&output=embed`
        )
      },
      (err) => {
        console.warn(`ERROR(${err.code}): ${err.message}`)
      },
      options
    )
  }

  const imageChangedHandler = async (file) => {
    if (file) {
      try {
        const result = await resizeFile(file)
        setProfileImage(result.base64)
        if (userDetails?._id) {
          dispatch(updateMyProfileImage(result.file, userDetails._id, ""))
        }
      } catch (err) {
        console.error("Error uploading image", err)
      }
    }
  }

  const submitHandler = (e) => {
    e.preventDefault()

    let address = userDetails?.address

    address = {
      city,
      region,
      street_compound: street,
      building,
      floor,
      flat,
      location,
      mark
    }

    const userData = {
      serviceId,
      firstName,
      fatherName,
      grandFaName,
      familyName,
      mobile,
      anotherMobile,
      homePhone,
      motherMobile,
      fatherMobile,
      fatherOfConfession,
      email,
      gender,
      birthday: birthDay,
      address: address,
      status: userStatus,
      study: study.filter(s => s && s.trim().length > 0),
      skills: skills.filter(s => s && s.trim().length > 0)
    }

    if (birthDay) {
      const [year, month, day] = birthDay.split("-")
      userData.birthday = {
        day: Number(day),
        month: Number(month),
        year: Number(year)
      }
    }

    if (!validMobileRegex.test(mobile)) {
      notifications.show({
        loading: false,
        color: "red",

        title: (
          <Group justify="space-between">
            <Text>{t("Invalid Mobile Number")}</Text>
            <Lottie play loop animationData={no} style={{height: 120}} />
          </Group>
        ),
        autoClose: 3000,
        withCloseButton: false
      })
      return
    }

    if (email && !validEmailRegex.test(email)) {
      notifications.show({
        loading: false,
        color: "red",
        title: (
          <Group justify="space-between">
            <Text>{t("Invalid Email Address")}</Text>
            <Lottie play loop animationData={no} style={{height: 120}} />
          </Group>
        ),
        autoClose: 3000,
        withCloseButton: false
      })
      return
    }
    if (userDetails?._id) {
      dispatch(updateUser(userDetails._id, userData))
    } else {
      dispatch(addNewUser(userData))
    }
    // onShow(false, "-")
  }

  return (
    <Modal
      opened={status}
      onClose={() => onShow(false, "-")}
      // title={
      //   <Title order={3}>
      //     {userDetails?._id ? t("Update User") : t("Add User")}
      //   </Title>
      // }
      withCloseButton={false}
      size="lg"
    >
      <Card shadow="sm" padding="lg" radius="md" dir={t("Dir")}>
        <form onSubmit={submitHandler}>
          {userDetails?._id && (
            <Stack align="center" spacing="md">
              <Avatar src={profileImage} size="xl" radius="50%" />
              <FileInput
                label={t("")}
                placeholder={t("Change image")}
                accept="image/*"
                onChange={imageChangedHandler}
              />
            </Stack>
          )}

          <Stack mt={"md"}>
            <Group w={"fullWidth"} style={{display: "flex"}}>
              <TextInput
                flex={1}
                label={t("First_Name")}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <TextInput
                flex={1}
                label={t("Father_Name")}
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
                required
              />
            </Group>

            <Group w={"fullWidth"} style={{display: "flex"}}>
              <TextInput
                flex={1}
                label={t("Grand_Father")}
                value={grandFaName}
                onChange={(e) => setGrandFaName(e.target.value)}
              />
              <TextInput
                flex={1}
                label={t("Family_Name")}
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
              />
            </Group>
            <Group w={"fullWidth"} style={{display: "flex"}}>
              <TextInput
                flex={1}
                label={t("Main_Mobile")}
                placeholder={t("Mobile_placeholder")}
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
                type="tel"
              />
              <TextInput
                flex={1}
                label={t("Another_Mobile")}
                value={anotherMobile}
                maxLength={11}
                minLength={11}
                onChange={(event) => {
                  const input = event.currentTarget.value
                  // Accept only numeric values
                  if (/^\d*$/.test(input)) {
                    setAnotherMobile(input)
                  }
                }}
                type="tel" // Ensures numeric keyboard on mobile
                inputMode="numeric" // Further enforces numeric input
              />
            </Group>

            <TextInput
              label={t("Home_Phone")}
              value={homePhone}
              placeholder={t("Home_phone_placeholder")}
              maxLength={10}
              minLength={10}
              onChange={(event) => {
                const input = event.currentTarget.value
                // Accept only numeric values
                if (/^\d*$/.test(input)) {
                  setHomePhone(input)
                }
              }}
              type="tel" // Ensures numeric keyboard on mobile
              inputMode="numeric" // Further enforces numeric input
            />
            <Group w={"fullWidth"} style={{display: "flex"}}>
              <TextInput
                flex={1}
                label={t("Mother_Mobile")}
                value={motherMobile}
                maxLength={11}
                minLength={11}
                onChange={(event) => {
                  const input = event.currentTarget.value
                  // Accept only numeric values
                  if (/^\d*$/.test(input)) {
                    setMotherMobile(input)
                  }
                }}
                type="tel" // Ensures numeric keyboard on mobile
                inputMode="numeric" // Further enforces numeric input
              />
              <TextInput
                flex={1}
                label={t("Father_Mobile")}
                value={fatherMobile}
                maxLength={11}
                minLength={11}
                onChange={(event) => {
                  const input = event.currentTarget.value
                  // Accept only numeric values
                  if (/^\d*$/.test(input)) {
                    setFatherMobile(input)
                  }
                }}
                type="tel" // Ensures numeric keyboard on mobile
                inputMode="numeric" // Further enforces numeric input
              />
            </Group>
            <Radio.Group
              label={t("Gender")}
              value={gender}
              onChange={setGender}
              required
            >
              <Group mt="sm">
                <Radio value="MALE" label={t("Male")} />
                <Radio value="FEMALE" label={t("Female")} />
              </Group>
            </Radio.Group>

            <TextInput
              label={t("Birthday")}
              value={birthDay}
              onChange={(e) => setBirthDay(e.target.value)}
              required
              placeholder={t("Select your birthday")}
              type="date"
            />
            <TextInput
              label={t("E-mail")}
              placeholder={t("Email_placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
            <TextInput
              label={t("Father_Confession")}
              placeholder={t("Father_confession_placeholder")}
              value={fatherOfConfession}
              onChange={(e) => setFatherOfConfession(e.target.value)}
            />

            <Group w={"fullWidth"} style={{display: "flex"}}>
              <TextInput
                flex={1}
                label={t("City")}
                placeholder={t("City_placeholder")}
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <TextInput
                flex={1}
                label={t("Region")}
                placeholder={t("Region_placeholder")}
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              />
            </Group>
            <TextInput
              label={t("Street_Compound")}
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />
            <Group w={"fullWidth"} style={{display: "flex"}}>
              <TextInput
                flex={1}
                label={t("Building")}
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
              />
              <TextInput
                label={t("Floor")}
                flex={1}
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                type="number"
                inputMode="numeric" // Further enforces numeric input
              />
              <TextInput
                label={t("Flat")}
                flex={1}
                value={flat}
                onChange={(e) => setFlat(e.target.value)}
                type="number"
                inputMode="numeric" // Further enforces numeric input
              />
            </Group>
            <TextInput
              label={t("Distinctive_Sign")}
              placeholder={t("Distinctive_sign_placeholder")}
              value={mark}
              onChange={(e) => setMark(e.target.value)}
            />
            <Group justify="center">
              {location && (
                <iframe
                  src={location}
                  width="100%"
                  height="300"
                  style={{border: 0, marginTop: "1rem"}}
                  allowFullScreen
                  loading="lazy"
                />
              )}
              {!location && (
                <Button
                  leftSection={<FaMapMarkerAlt color="yellow" />}
                  onClick={locationHandler}
                >
                  {t("On_Map")}
                </Button>
              )}
              {location && (
                <Button onClick={() => setLocation("")}>{t("Clear")}</Button>
              )}
            </Group>

            <Divider label={t("Education_and_Professional_Info")} labelPosition="center" mt="xl" />

            <TagsInput
              label={t("Study")}
              placeholder={t("Study_placeholder")}
              value={study}
              onChange={setStudy}
              splitChars={[',', '،']}
              clearable
            />

            <TagsInput
              label={t("Skills")}
              placeholder={t("Skills_placeholder")}
              value={skills}
              onChange={setSkills}
              splitChars={[',', '،']}
              clearable
            />

            {userDetails?._id && (
              <UserStatus status={userStatus} onUpdateStatus={setUserStatus} />
            )}
          </Stack>

          <Button
            type="submit"
            fullWidth
            mt="md"
            loading={loading || userUpdateLoading || userUpdateProfileLoading}
          >
            {userDetails?._id ? t("Update_User") : t("Add_User")}
          </Button>
        </form>
      </Card>
    </Modal>
  )
}

export default AddUpdateUserModal
