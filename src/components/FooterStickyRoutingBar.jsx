import React, {useState, useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"

import {LinkContainer} from "react-router-bootstrap"
import {useHistory} from "react-router-dom"
import {logout} from "../actions/userActions"
import {useTranslation} from "react-i18next"

function FooterStickyRoutingBar() {
  const history = useHistory()
  const [t, i18n] = useTranslation()
  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const {userInfo} = userLogin

  const logoutHandler = () => {
    dispatch(logout())
    history.push("/auth")
  }

  const openNav = () => {
    if (document.getElementById("mySidenav").style.width === "250px")
      document.getElementById("mySidenav").style.width = "0"
    else document.getElementById("mySidenav").style.width = "250px"
  }

  const closeNav = () => {
    document.getElementById("mySidenav").style.width = "0"
  }

  return (
    <>
      <div
        className="modal fade"
        id="QRCodeModal"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel1"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              {/* QR Code */}
              <Group className="p-0 m-0 d-flex justify-content-center">
                <Stack className="p-0 m-0" xs={6} sm={6} md={6} lg={6} xl={6}>
                  <Image
                    className="p-0 m-0"
                    style={{width: "100%"}}
                    src={`https://barcode.tec-it.com/barcode.ashx?data=${userInfo.user._id}&code=MobileQRCode&eclevel=L`}
                    rounded
                  />
                </Stack>
              </Group>
            </div>
          </div>
        </div>
      </div>
      <div id="mySidenav" className="p-0 m-0 sidenav">
        <a
          href="javascript:void(0)"
          className="closebtn"
          onClick={() => {
            closeNav()
          }}
        >
          &times;
        </a>

        <Group className="mt-5 p-0" style={{width: "100%"}}>
          <Stack className="m-0 p-0" style={{width: "100%"}}>
            <LinkContainer
              className="link-container"
              to="/account"
              onClick={() => closeNav()}
            >
              <a>
                <span>
                  <i
                    style={{
                      fontSize: "20px"
                    }}
                    className="m-1 bi bi-person-check-fill"
                  ></i>
                </span>{" "}
                {t("My_Account")}
              </a>
            </LinkContainer>

            <LinkContainer
              className="link-container"
              to="/"
              onClick={() => closeNav()}
            >
              <a>
                <span>
                  <i
                    style={{
                      fontSize: "20px"
                    }}
                    className="m-1 bi bi-book"
                  ></i>
                </span>{" "}
                {t("My_Bible_Answers")}
                <br />
                <p className="pl-5 m-0" style={{width: "100%", color: "green"}}>
                  ({t("Soon")})
                </p>
              </a>
            </LinkContainer>

            {/* <LinkContainer
              className="link-container"
              to="/orders"
              onClick={() => closeNav()}
            >
              <a>
                <span>
                  <i
                    style={{
                      fontSize: "20px"
                    }}
                    className="m-1 bi bi-gift"
                  ></i>
                </span>{" "}
                {t("My_Orders")}
              </a>
            </LinkContainer> */}

            {/* <LinkContainer
              className="link-container"
              to="/"
              onClick={() => closeNav()}
            >
              <a>
                <span>
                  <i
                    style={{
                      fontSize: "20px"
                    }}
                    className="m-1 bi bi-journal-bookmark"
                  ></i>
                </span>{" "}
                {t("Spirtual_Note")}
                <br />
                <p className="pl-5 m-0" style={{width: "100%", color: "green"}}>
                  ({t("Soon")})
                </p>
              </a>
            </LinkContainer> */}

            {/* <LinkContainer
              className="link-container"
              to="/"
              onClick={() => closeNav()}
            >
              <a>
                <span>
                  <i
                    style={{
                      fontSize: "20px"
                    }}
                    className="m-1 bi bi-bell"
                  ></i>
                </span>{" "}
                {t("Notifications")}
                <br />
                <p className="pl-5 m-0" style={{width: "100%", color: "green"}}>
                  ({t("Soon")})
                </p>
              </a>
            </LinkContainer> */}

            <LinkContainer
              className="link-container"
              to="/log"
              onClick={() => closeNav()}
            >
              <a>
                <span>
                  <i
                    style={{
                      fontSize: "20px"
                    }}
                    className="m-1 bi bi-clock-history"
                  ></i>
                </span>{" "}
                {t("Actions_Log")}
              </a>
            </LinkContainer>
          </Stack>
        </Group>

        {userInfo.user.role === "admin" && (
          <Group className="mt-5 p-0" style={{width: "100%"}}>
            <LinkContainer
              className="link-container"
              to="/admin"
              onClick={() => closeNav()}
            >
              <a>
                <span>
                  <i
                    style={{
                      fontSize: "20px"
                    }}
                    className="m-1 bi bi-kanban"
                  ></i>
                </span>{" "}
                {t("Manage_Servants")}
              </a>
            </LinkContainer>
          </Group>
        )}
        <div className="relative m-0 p-0" style={{width: "100%"}}>
          <Stack style={{width: "100%"}}>
            <Button
              className="rounded"
              variant="outline-info"
              onClick={() => {
                const newLang = i18n.language === "ar" ? "en" : "ar"
                const newDir = newLang === "ar" ? "rtl" : "ltr"
                localStorage.setItem("lang", newLang)
                localStorage.setItem("dir", newDir)
                i18n.changeLanguage(newLang)
              }}
            >
              {i18n.language === "ar" ? "English" : "عربي"}
            </Button>
          </Stack>
        </div>
        <div className="absolute m-0 p-0 bottom" style={{width: "100%"}}>
          <Stack onClick={() => logoutHandler()} style={{width: "100%"}}>
            <i
              className="fa fa-sign-out"
              style={{
                fontSize: "20px",
                color: "#dc3545"
              }}
            >
              {t("Logout")}
            </i>
          </Stack>
        </div>
      </div>
      <Navbar className="m-0 p-0 fixed-bottom bg-white">
        <Group
          className="m-0 p-0 justify-content-between"
          style={{width: "100%", borderTop: "1px solid #17a2b8"}}
        >
          {/* <Stack
            className="m-0 p-0 justify-content-around rounded"
            style={{
              maxWidth: "20%",
              border: "2px solid grey"
            }}
          >
            <LinkContainer to="/">
              <Group
                className="m-0 p-0 justify-content-around"
                style={{width: "100%"}}
              >
                <span
                  style={{
                    fontSize: "10px",
                    rotate: "-90deg"
                  }}
                >
                  {t("Home")}
                </span>
              </Group>
            </LinkContainer>
          </Stack> */}

          <Stack
            className="m-0 p-1 justify-content-around rounded"
            style={{
              width: "20%"
              // border: "1px solid DodgerBlue"
            }}
          >
            <LinkContainer to="/">
              <div>
                <Group
                  className="m-0 p-0 justify-content-around"
                  style={{width: "100%"}}
                >
                  <a
                    target="_blank" //to open in a new tab
                    href=""
                    className="m-1 fa fa-home"
                    style={{
                      fontSize: "18px",
                      color: "#343a40",
                      textDecoration: "none"
                    }} // textdecoration: nono to remove under line when hover icon
                  ></a>
                </Group>
                <Group
                  className="m-0 p-0 justify-content-around"
                  style={{width: "100%"}}
                >
                  <span
                    style={{
                      fontSize: "8px"
                    }}
                  >
                    {t("Home")}
                  </span>
                </Group>
              </div>
            </LinkContainer>
          </Stack>
          <Stack
            data-mdb-toggle="modal"
            data-mdb-target="#QRCodeModal"
            className="m-0 p-1 justify-content-around rounded"
            style={{
              width: "20%"
              // border: "1px solid DodgerBlue"
            }}
          >
            <Group
              className="m-0 p-0 justify-content-around "
              style={{width: "100%"}}
            >
              <i
                className="m-1 fa fa-qrcode"
                style={{
                  fontSize: "18px",
                  color: "#343a40"
                }}
              ></i>
            </Group>
            <Group
              className="m-0 p-0 justify-content-around"
              style={{width: "100%"}}
            >
              <span
                style={{
                  fontSize: "8px"
                }}
              >
                {t("QR_Code")}
              </span>
            </Group>
          </Stack>
          <Stack
            onClick={() => {
              openNav()
            }}
            className="m-0 p-1 justify-content-around rounded"
            style={{
              width: "20%"
              // border: "1px solid DodgerBlue"
            }}
          >
            <div>
              <Group
                className="m-0 p-0 justify-content-around"
                style={{width: "100%"}}
              >
                <i
                  className="bi bi-three-dots"
                  style={{
                    fontSize: "18px",
                    color: "#343a40"
                  }}
                ></i>
              </Group>
              <Group
                className="m-0 p-0 justify-content-around"
                style={{width: "100%"}}
              >
                <span
                  style={{
                    fontSize: "8px"
                  }}
                >
                  {t("More")}
                </span>
              </Group>
            </div>
          </Stack>

          {/* <Stack
            className="m-0 p-1 justify-content-around rounded"
            style={{
              maxWidth: "70px",
              border: "2px solid grey"
            }}
          >
            <LinkContainer to="/">
              <Group
                className="m-0 p-0 justify-content-around"
                style={{width: "100%"}}
              >
                <span
                  style={{
                    fontSize: "10px",
                    rotate: "-90deg"
                  }}
                >
                  {t("Home")}
                </span>
              </Group>
            </LinkContainer>
          </Stack> */}
        </Group>
      </Navbar>
    </>
  )
}

export default FooterStickyRoutingBar
