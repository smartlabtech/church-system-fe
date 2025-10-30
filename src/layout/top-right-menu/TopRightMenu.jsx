import {
  Menu,
  Button,
  rem,
  Group,
  Stack,
  Tooltip,
  Drawer,
  Text,
  Modal
} from "@mantine/core"
import {notifications} from "@mantine/notifications"

import {useDispatch} from "react-redux"
import {useNavigate} from "react-router-dom"

import {
  FaArrowCircleDown,
  FaGlobe,
  FaRegQuestionCircle,
  FaSignInAlt
} from "react-icons/fa"

import {FaImagePortrait} from "react-icons/fa6"
import {useDisclosure} from "@mantine/hooks"

import {log_out} from "../../actions/userActions"
import {useTranslation} from "react-i18next"
import {BsGearWide, BsTranslate} from "react-icons/bs"
import SystemPurpose from "../../screens/sys-purpose/SystemPurpose"

// import {
//   IconSettings,
//   IconSearch,
//   IconPhoto,
//   IconMessageCircle,
//   IconTrash,
//   IconArrowsLeftRight
// } from "@tabler/icons-react"

const TopRightMenu = ({userInfo}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [t, i18n] = useTranslation()

  const [opened, {open, close}] = useDisclosure(false)

  const profileEdit = () => {
    navigate("/my-profile")
    // open()
  }
  const logout = () => {
    localStorage.removeItem("phone")
    localStorage.removeItem("password")
    dispatch(log_out())

    notifications.show({
      loading: false,
      color: "red",
      title: "تم الخروج من الحساب",
      autoClose: 3000,
      withCloseButton: false
    })
  }
  const [whyOpened, {open: openWhy, close: closeWhy}] = useDisclosure(false)

  return (
    <Group>
      {/* <Drawer
        zIndex={301}
        dir={t("Dir")}
        opened={whyOpened}
        onClose={closeWhy}
        title="لو عندك مشكله من دول ... السيستم ده هيحلها"
        // position="right"
        size="xl"
        overlayProps={{backgroundOpacity: 0.5, blur: 4}}
      >
        <SystemPurpose />
      </Drawer> */}
      <Modal
        zIndex={301}
        dir={t("Dir")}
        opened={whyOpened}
        onClose={closeWhy}
        size="xl"
        withCloseButton={false}
        title="دي المشاكل اللي اتبني علي أساسها السيستم لحلها:"
        overlayProps={{backgroundOpacity: 0.5, blur: 4}}
      >
        <SystemPurpose />
      </Modal>
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <Group style={{direction: "rtl"}}>
            <Button
              rightSection={<FaArrowCircleDown />}
              //   color="white"
              style={{direction: "rtl"}}
              styles={{
                root: {
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" // Add shadow to the root element
                }
              }}
            >
              {`اهلا ${userInfo?.user?.firstName || ""}`}
            </Button>{" "}
          </Group>
        </Menu.Target>

        <Menu.Dropdown dir={t("Dir")}>
          {/* <Menu.Label>Application</Menu.Label>
        <Menu.Item
          leftSection={
            <IconSettings style={{width: rem(14), height: rem(14)}} />
          }
        >
          Settings
        </Menu.Item>
        <Menu.Item
          leftSection={
            <IconMessageCircle style={{width: rem(14), height: rem(14)}} />
          }
        >
          Messages
        </Menu.Item>
        <Menu.Item
          leftSection={<IconPhoto style={{width: rem(14), height: rem(14)}} />}
        >
          Gallery
        </Menu.Item>
        <Menu.Item
          leftSection={<IconSearch style={{width: rem(14), height: rem(14)}} />}
          rightSection={
            <Text size="xs" c="dimmed">
              ⌘K
            </Text>
          }
        >
          Search
        </Menu.Item>

        <Menu.Divider />
*/}
          {/* <Menu.Label>Danger zone</Menu.Label> */}
          <Menu.Item
            leftSection={
              <FaImagePortrait style={{width: rem(14), height: rem(14)}} />
            }
            onClick={() => profileEdit()}
          >
            {t("Update_My_Data")}
          </Menu.Item>
          {userInfo && userInfo?.user?.authorizedKhadem && (
            <Menu.Item
              leftSection={
                <FaImagePortrait style={{width: rem(14), height: rem(14)}} />
              }
              onClick={() => navigate("/dashboard")}
            >
              {t("Dashboard")}
            </Menu.Item>
          )}
          {userInfo && userInfo?.user?.role === "admin" && (
            <Menu.Item
              leftSection={
                <BsGearWide style={{width: rem(14), height: rem(14)}} />
              }
              onClick={() => navigate("/admin-panel")}
            >
              {t("Admin")}
            </Menu.Item>
          )}
          <Menu.Item
            color="red"
            leftSection={
              <FaSignInAlt style={{width: rem(14), height: rem(14)}} />
            }
            onClick={() => logout()}
          >
            {t("Logout")}
          </Menu.Item>
          <Stack style={{width: "100%"}}>
            <Button
              variant={
                i18n.language === "ar" ? "outline-primary" : "outline-secondary"
              }
              color={i18n.language === "ar" ? "blue" : "green"}
              leftSection={
                i18n.language === "ar" ? <FaGlobe /> : <BsTranslate />
              }
              sx={(theme) => ({
                fontSize: theme.fontSizes.sm,
                borderRadius: theme.radius.md
              })}
              onClick={() => {
                const newLang = i18n.language === "ar" ? "en" : "ar"
                const newDir = newLang === "ar" ? "rtl" : "ltr"
                localStorage.setItem("lang", newLang)
                localStorage.setItem("dir", newDir)
                i18n.changeLanguage(newLang)
              }}
            >
              {i18n.language === "ar"
                ? "Switch to English"
                : "التبديل إلى العربية"}
            </Button>
            {userInfo?.user?.authorizedKhadem && (
              <Group justify="center" gap={6} onClick={openWhy} c="orange">
                <Text
                  size="sm"
                  style={{cursor: "pointer", textDecorationLine: "underline"}}
                >
                  {t("Why")}
                </Text>

                <FaRegQuestionCircle
                  // size={"1.5rem"}
                  cursor={"pointer"}
                />
              </Group>
            )}
          </Stack>
        </Menu.Dropdown>
      </Menu>
    </Group>
  )
}

export default TopRightMenu
