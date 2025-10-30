import React, {useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {updateUserProfile} from "../actions/userActions"
import {validMobileRegex, validPhoneRegex} from "../myRegexp"
import {useTranslation} from "react-i18next"
import {
  FaFemale,
  FaMap,
  FaMapMarked,
  FaMapMarkerAlt,
  FaMapPin,
  FaMapSigns,
  FaSearchLocation
} from "react-icons/fa"

import {Card, TextInput, Button, Group, Stack, Divider} from "@mantine/core"
import {notifications} from "@mantine/notifications"
import Lottie from "react-lottie-player"
import no from "../assets/lottie/No.json"

function UpdateProfileCard() {
  const dispatch = useDispatch()
  const [t] = useTranslation()

  const userLogin = useSelector((state) => state.userLogin)
  const {userInfo} = userLogin

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile)
  const {loading} = userUpdateProfile

  const [fullName, setFullName] = useState(
    `${userInfo?.user.firstName} ${userInfo?.user.fatherName}`
  )

  const [fatherOfConfession, setFatherOfConfession] = useState(
    userInfo?.user.fatherOfConfession || ""
  )

  const [anotherMobile, setAnotherMobile] = useState(
    userInfo?.user.anotherMobile || ""
  )
  const [homePhone, setHomePhone] = useState(userInfo?.user.homePhone || "")
  const [motherMobile, setMotherMobile] = useState(
    userInfo?.user.motherMobile || ""
  )
  const [fatherMobile, setFatherMobile] = useState(
    userInfo?.user.fatherMobile || ""
  )

  const [city, setCity] = useState(userInfo?.user?.address?.city || "")
  const [region, setRegion] = useState(userInfo?.user?.address?.region || "")
  const [street, setStreet] = useState(
    userInfo?.user?.address?.street_compound || ""
  )
  const [building, setBuilding] = useState(
    userInfo?.user?.address?.building || ""
  )
  const [floor, setFloor] = useState(userInfo?.user?.address?.floor || "")
  const [flat, setFlat] = useState(userInfo?.user?.address?.flat || "")
  const [mark, setMark] = useState(userInfo?.user?.address?.mark || "")
  const [location, setLocation] = useState(
    userInfo?.user?.address?.location || ""
  )

  const submitHandler = () => {
    let pass = true
    let updateProfile = {}
    let address = userInfo?.user?.address

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

    updateProfile["address"] = address

    if (validMobileRegex.test(anotherMobile) || anotherMobile === "") {
      updateProfile["anotherMobile"] = anotherMobile
    } else {
      pass = false
      notifications.show({
        loading: false,
        color: "red",
        title: (
          <Group justify="space-between">
            <Text>{t("Invalid Secondary Mobile Number")}</Text>
            <Lottie play loop animationData={no} style={{height: 120}} />
          </Group>
        ),
        autoClose: 3000,
        withCloseButton: false
      })
    }

    if (validPhoneRegex.test(homePhone) || homePhone === "") {
      updateProfile["homePhone"] = homePhone
    } else {
      pass = false
      notifications.show({
        loading: false,
        color: "red",
        title: (
          <Group justify="space-between">
            <Text>{t("Invalid Home Phone")}</Text>
            <Lottie play loop animationData={no} style={{height: 120}} />
          </Group>
        ),
        autoClose: 3000,
        withCloseButton: false
      })
    }

    if (validMobileRegex.test(motherMobile) || motherMobile === "") {
      updateProfile["motherMobile"] = motherMobile
    } else {
      pass = false
      notifications.show({
        loading: false,
        color: "red",
        title: (
          <Group justify="space-between">
            <Text>{t("Invalid Mother's Mobile Number")}</Text>
            <Lottie play loop animationData={no} style={{height: 120}} />
          </Group>
        ),
        autoClose: 3000,
        withCloseButton: false
      })
    }

    if (validMobileRegex.test(fatherMobile) || fatherMobile === "") {
      updateProfile["fatherMobile"] = fatherMobile
    } else {
      pass = false
      notifications.show({
        loading: false,
        color: "red",
        title: (
          <Group justify="space-between">
            <Text>{t("Invalid Father's Mobile Number")}</Text>
            <Lottie play loop animationData={no} style={{height: 120}} />
          </Group>
        ),
        autoClose: 3000,
        withCloseButton: false
      })
    }

    updateProfile["fatherOfConfession"] = fatherOfConfession

    if (pass) dispatch(updateUserProfile(updateProfile))
  }

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

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder dir={t("Dir")}>
      <Stack>
        {/* <TextInput
          label={t("Full Name")}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled
          
        /> */}
        <TextInput
          label={t("Father_Confession")}
          value={fatherOfConfession}
          onChange={(e) => setFatherOfConfession(e.target.value)}
        />
        <TextInput
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
        <TextInput
          label={t("Home_Phone")}
          value={homePhone}
          placeholder="0227012345"
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
        <TextInput
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
        <TextInput
          label={t("City")}
          placeholder="المعادي"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <TextInput
          label={t("Region")}
          placeholder="صقر قريش - المعادي الجديدة ..."
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        />
        <TextInput
          label={t("Street_Compound")}
          value={street}
          onChange={(e) => setStreet(e.target.value)}
        />
        <TextInput
          label={t("Building")}
          value={building}
          onChange={(e) => setBuilding(e.target.value)}
        />
        <TextInput
          label={t("Floor")}
          value={floor}
          onChange={(e) => setFloor(e.target.value)}
          type="number"
          inputMode="numeric" // Further enforces numeric input
        />
        <TextInput
          label={t("Flat")}
          value={flat}
          onChange={(e) => setFlat(e.target.value)}
          type="number"
          inputMode="numeric" // Further enforces numeric input
        />
        <TextInput
          label={t("Distinctive_Sign")}
          placeholder="بجوار صيدلية ..."
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

        <Button onClick={submitHandler} mt="lg" loading={loading}>
          {t("Update")}
        </Button>
      </Stack>
    </Card>
  )
}

export default UpdateProfileCard
