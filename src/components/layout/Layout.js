import React, {useEffect, useState} from "react"
import {AppShell, Burger, Group, Button, Text} from "@mantine/core"
import {useDisclosure} from "@mantine/hooks"
import {MantineLogo} from "@mantinex/mantine-logo"
import {useNavigate, Link, useLocation} from "react-router-dom"
// import Views from "@/components/Layout/Views"
// import navigationConfig from "@/configs/navigation.config"
// import {LinksGroup} from "@/components/Layout/LinksGroup"
// import classes from "@/components/Layout/LayoutTypes/SimpleSideBar.module.css"
// import SimpleSideBarBottomContent from "@/components/Layout/LayoutTypes/SimpleSideBarBottomContent"
// import AuthorityCheck from "@/route/AuthorityCheck"
// import {setLang, useAppDispatch, useAppSelector} from "@/store"

function SideBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [active, setActive] = useState("")
  const userAuthority = useAppSelector((state) => state.auth.user.role)

  useEffect(() => {
    const currentPath = location.pathname.split("/")[1]
    setActive(currentPath)
  }, [location.pathname])

  const links = navigationConfig.map((item, index) => {
    let links = []

    if (item.subMenu && item.subMenu.length > 0) {
      links = item.subMenu.map((i) => ({
        label: i.title,
        link: i.path
      }))
      return (
        <LinksGroup
          key={index}
          icon={item.icon}
          label={item.title}
          links={links}
        />
      )
    } else {
      return (
        <AuthorityCheck
          userAuthority={userAuthority ? userAuthority : []}
          authority={item.authority}
          key={index}
        >
          <Link
            className={classes.link}
            data-active={
              item.path.split("/")[1] === active ? "true" : undefined
            }
            to={item.path}
            onClick={(event) => {
              event.preventDefault()
              setActive(item.path.split("/")[1])
              navigate(item.path)
            }}
          >
            <item.icon className={classes.linkIcon} stroke={1.5} />
            <span>{item.title}</span>
          </Link>
        </AuthorityCheck>
      )
    }
  })

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>{links}</div>
      <div className={classes.footer}>
        <SimpleSideBarBottomContent />
      </div>
    </nav>
  )
}

export default function AppShellLayout() {
  const dispatch = useAppDispatch()

  const navigate = useNavigate()
  const [mobileOpened, {toggle: toggleMobile}] = useDisclosure(false)
  const [desktopOpened, {toggle: toggleDesktop}] = useDisclosure(true)

  return (
    <AppShell
      header={{height: 60}}
      navbar={{
        width: 300,
        breakpoint: "md",
        collapsed: {mobile: !mobileOpened, desktop: !desktopOpened}
      }}
      aside={{
        width: 300,
        breakpoint: "md",
        collapsed: {desktop: false, mobile: true}
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" style={{justifyContent: "space-between"}}>
          <Group h="100%" px="md">
            <Burger
              opened={mobileOpened}
              onClick={toggleMobile}
              hiddenFrom="md"
              size="md"
            />
            <Burger
              opened={desktopOpened}
              onClick={toggleDesktop}
              visibleFrom="md"
              size="md"
            />
            <Link
              to={"/"}
              onClick={(event) => {
                event.preventDefault()
                navigate("/")
              }}
            >
              <MantineLogo size={30} />
            </Link>
          </Group>

          {/* Language button on the right */}
          <Button
          // onClick={() => handleLanguage(i18n.language === "en" ? "ar" : "en")}
          >
            {/* {i18n.language === "en" ? "عربي" : "ENGLISH"} */} lang
          </Button>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <SideBar />
      </AppShell.Navbar>
      {/* Main content section */}
      <AppShell.Main>
        <Views /> {/* This is where your main page content goes */}
      </AppShell.Main>

      <AppShell.Aside p="md">
        <Text>Aside Area</Text>
        {/* <AsideHome /> */}
      </AppShell.Aside>
    </AppShell>
  )
}
