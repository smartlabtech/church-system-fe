import React, {useState, useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"

import {getAuthorizedKhadem} from "../actions/adminActions"

import {useTranslation} from "react-i18next"
import {listBooks} from "../actions/booksActions"
import AddServiceBookModal from "../components/AddServiceBookModal"
import {
  serviceBookPost,
  serviceBooksList,
  serviceBookUpdate
} from "../actions/serviceBooksActions"
import EditServiceBookModal from "../components/EditServiceBookModal"
import {MCQsGet} from "../actions/MCQActions"
import {MCQ_GET_SUCCESS} from "../constants/MCQConstants"
import {Loader} from "@mantine/core"

function BibleStudyManageScreen({history}) {
  const dispatch = useDispatch()
  const [t, i18n] = useTranslation()

  const [selectedService, setSelectedService] = useState("")

  const [bookId, setBookId] = useState("")
  const [classId, setClassId] = useState("")

  const [bookModalStatus, setBookModalStatus] = useState(false)

  const [editServiceBookModalStatus, setEditServiceBookModalStatus] =
    useState(false)

  const [selectedServiceBook, setSelectedServiceBook] = useState("")

  const userLogin = useSelector((state) => state.userLogin)
  const {userInfo} = userLogin

  const serviceBooksGet = useSelector((state) => state.serviceBooksGet)
  const {serviceBooks, loading} = serviceBooksGet

  const MCQGet = useSelector((state) => state.MCQGet)
  const {MCQs, loading: MCQsLoading} = MCQGet

  useEffect(() => {
    const serviceData = localStorage.getItem("servantIn")
    if (serviceData === "") history.push("/")
    else setSelectedService(JSON.parse(serviceData))

    if (userInfo && userInfo.user?.authorizedKhadem) {
      dispatch({
        type: MCQ_GET_SUCCESS,
        payload: []
      })
      dispatch(serviceBooksList(`${history.location.search}`))
    } else history.push("/")
  }, [dispatch])

  const listQuestions = (serviceBook) => {
    setSelectedServiceBook(serviceBook)
    // Nowadays, in modern browsers you can use the URLSearchParams constructor:
    const params = new URLSearchParams(history.location.search)
    // You can access specific parameters:
    const serviceId = params.get("serviceId")
    dispatch(
      MCQsGet(`serviceId=${serviceId}&bookId=${serviceBook.bookDetails._id}`)
    )
  }

  const onShowBookModal = (status) => {
    setBookId("")
    setClassId("")
    dispatch(listBooks(""))
    setBookModalStatus(status)
  }

  const onShowEditServiceBookModal = (status) => {
    setClassId("")
    setEditServiceBookModalStatus(status)
  }

  const onAddServiceBook = () => {
    var data = {serviceId: selectedService._id, bookId: bookId}
    if (classId !== "") data["classId"] = classId

    dispatch(serviceBookPost(data, serviceBooks))
    setBookModalStatus(false)
  }

  const onEditServiceBook = () => {
    var data = {
      serviceId: selectedServiceBook.serviceId
    }
    data["classId"] = classId
    dispatch(serviceBookUpdate(selectedServiceBook._id, data))
    setEditServiceBookModalStatus(false)
  }

  return (
    <div style={{margin: "auto", direction: t("Dir")}}>
      <Group
        className="m-0 p-0"
        style={{
          width: "100%",
          display: "inline"
        }}
      >
        <Stack className="m-2 p-0" xs={12} sm={12} md={12} lg={12} xl={12}>
          <p style={{fontSize: "16px", color: "goldenrod"}}>
            {selectedService?.name}
          </p>
        </Stack>
      </Group>
      {loading && <Loader />}
      <Group className="m-0 mb-1 p-0">
        <Stack
          className="m-0 p-0 justify-content-start"
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          style={{
            width: "100%",
            borderRadius: "15px 15px",
            outline: "auto",
            outlineStackor: "green",
            outlineWidth: "1px",
            outlineStyle: "groove"
          }}
        >
          <AddServiceBookModal
            status={bookModalStatus}
            bookId={bookId}
            classes={selectedService.classes}
            onShow={onShowBookModal}
            onAdd={onAddServiceBook}
            onSelectBook={setBookId}
            onSelectClass={setClassId}
          />
          {serviceBooks?.length || 0
            ? serviceBooks?.map((serviceBook, index) => (
                <Button
                  key={index}
                  className="m-1 p-1 rounded"
                  variant="link"
                  onClick={() => listQuestions(serviceBook)}
                >
                  {`${serviceBook?.bookDetails.name[t("lang")]}`}
                  {serviceBook?.classDetails?.code ? (
                    <span style={{color: "goldenrod"}}>
                      {`(${serviceBook?.classDetails?.code || ""})`}
                    </span>
                  ) : (
                    ""
                  )}
                </Button>
              ))
            : t("No_Books_Added_Yet")}
        </Stack>
      </Group>
      {selectedServiceBook !== "" ? (
        <EditServiceBookModal
          status={editServiceBookModalStatus}
          selectedServiceBook={selectedServiceBook}
          classes={selectedService.classes}
          onShow={onShowEditServiceBookModal}
          onEdit={onEditServiceBook}
          onSelectClass={setClassId}
        />
      ) : (
        ""
      )}
      {MCQsLoading ? (
        <Loader />
      ) : (
        <>
          {selectedServiceBook !== "" && (
            <Group
              className="m-0 p-0 justify-content-start"
              style={{width: "100%"}}
            >
              <Stack className="m-0 p-0" xs={2} sm={2} md={2} lg={2} xl={2}>
                <i
                  className="bi bi-plus-square"
                  style={{fontSize: "18px", color: "green"}}
                ></i>
              </Stack>
            </Group>
          )}

          <Group
            className="m-0 p-0 justify-content-around"
            style={{width: "100%"}}
          >
            {MCQs?.map((MCQ, index) => (
              <Stack
                key={index}
                className="m-0 p-2"
                xs={12}
                sm={12}
                md={6}
                lg={4}
                xl={4}
              >
                <div
                  key={index}
                  className="p-3 m-0"
                  style={{
                    borderRadius: "15px 15px",
                    outline: "auto",
                    outlineStackor: "grey",
                    outlineWidth: "2px",
                    outlineStyle: "dashed",
                    width: "100%",
                    height: "100%"
                  }}
                >
                  {/* <Group
                    className="m-0 p-0"
                    style={{width: "100%", textAlign: "left"}}
                  >
                    <i className="bi bi-trash2" style={{color: "red"}}></i>
                  </Group>
                  <hr
                    style={{
                      color: "green",
                      backgroundStackor: "black",
                      height: "1px"
                    }}
                  /> */}
                  <Group
                    className="m-0 p-0"
                    style={{
                      width: "100%",
                      textAlign: "left",
                      display: "inline"
                    }}
                  >
                    {MCQ?.startDate?.trim(".") || t("No_Date_Selected")}
                    <span>
                      <i className="bi bi-pencil-square"></i>
                    </span>
                  </Group>
                  <hr
                    style={{
                      color: "green",
                      backgroundStackor: "black",
                      height: "1px"
                    }}
                  />
                  <Group
                    className="m-0 p-0"
                    style={{width: "100%", color: "goldenrod"}}
                  >
                    {`(${t("chapter")} ${MCQ.chapter} : ${MCQ.fromVerse} - ${
                      MCQ.toVerse
                    })`}
                  </Group>
                  <Group
                    className="m-0 p-0"
                    style={{width: "100%", display: "inline"}}
                  >
                    {MCQ.question[t("lang")]}
                    <span>
                      <i className="bi bi-pencil-square"></i>
                    </span>
                  </Group>
                  <hr
                    style={{
                      color: "green",
                      backgroundStackor: "black",
                      height: "1px"
                    }}
                  />
                  {MCQ.choices.map((choice, choiceIndex) => (
                    <Group className="p-1 m-0" style={{width: "100%"}}>
                      <Stack
                        className="m-0 p-0"
                        xs={10}
                        sm={10}
                        md={10}
                        lg={10}
                        xl={10}
                        style={{
                          borderRadius: "15px 15px",
                          outline: "auto",
                          outlineStackor: `${choice.check ? "green" : "grey"}`,
                          outlineWidth: "2px",
                          outlineStyle: "double"
                        }}
                      >
                        {choice.choice[t("lang")]}
                      </Stack>
                      <Stack
                        className="m-0 p-0"
                        xs={2}
                        sm={2}
                        md={2}
                        lg={2}
                        xl={2}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </Stack>
                    </Group>
                  ))}
                </div>
              </Stack>
            ))}
          </Group>
        </>
      )}
    </div>
  )
}

export default BibleStudyManageScreen
