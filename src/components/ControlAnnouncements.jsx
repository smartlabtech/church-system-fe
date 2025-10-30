import React, {useState, useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"

import {useTranslation} from "react-i18next"

import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncements,
  updateAnnouncement
} from "../actions/announcementActions"
import {Loader} from "@mantine/core"

function ControlAnnouncements(service) {
  const [t, i18n] = useTranslation()

  const dispatch = useDispatch()

  const announcement = useSelector((state) => state.announcement)
  const {loading, announcements} = announcement

  const getAnnouncementsHandler = () => {
    if (service?.service?._id || 0)
      dispatch(getAnnouncements(service.service._id))
  }

  const [url, setUrl] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState()
  const [recordId, setRecordId] = useState("")
  const [addorlist, setAddorlist] = useState("list")

  const deleteHandler = (index, id) => {
    dispatch(deleteAnnouncement(announcements, index, id))
  }

  const submitHandler = () => {
    dispatch(
      createAnnouncement(announcements, {
        serviceId: service.service._id,
        startDate: new Date(Date.parse(startDate) + 2 * 60 * 60 * 1000),
        endDate: new Date(Date.parse(endDate) + 2 * 60 * 60 * 1000),
        url: url
      })
    )
  }
  return (
    <>
      <Group
        data-mdb-toggle="modal"
        data-mdb-target="#manage-announcements"
        className="m-0 p-0 module card"
        onClick={() => getAnnouncementsHandler()}
        style={{direction: t("Dir")}}
      >
        <Stack
          className="m-0 p-3 justify-content-start"
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
        >
          <p className="p-0 m-0">
            {t("Announcements")}
            <span style={{color: "green"}}>
              <i className="bi bi-shield-fill-check"></i>
            </span>
          </p>
          <i className="p-0 m-0 large-size bi bi-megaphone"></i>
        </Stack>
      </Group>
      <div
        className="modal fade"
        id="manage-announcements"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="p-0 m-0" style={{width: "100%"}}>
              <Group
                className="p-2 m-0 justify-content-end"
                style={{width: "100%"}}
              >
                <Stack className="p-0 m-0" sm={2} xs={2} md={2} lg={2} xl={2}>
                  {addorlist === "list" ? (
                    <i
                      className="bi bi-plus-square-dotted"
                      style={{fontSize: "26px", color: "green"}}
                      onClick={() => setAddorlist("add")}
                    ></i>
                  ) : (
                    <i
                      class="bi bi-list-task"
                      style={{fontSize: "26px"}}
                      onClick={() => setAddorlist("list")}
                    ></i>
                  )}
                </Stack>
              </Group>

              {addorlist === "add" ? (
                <Group
                  className="p-0 m-0"
                  style={{width: "100%", direction: t("Dir")}}
                >
                  <Form onSubmit={submitHandler}>
                    <Stack className="p-0 m-0">
                      <Form.Label
                        htmlFor="announcement-url"
                        className="update-create-form-label"
                      >
                        {t("Banner_Image_Url")}
                      </Form.Label>
                      <Form.Control
                        id="announcement-url"
                        className="mb-2 mt-2 outline rounded"
                        required
                        type="text"
                        placeholder={t("Image_Link")}
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                      ></Form.Control>
                    </Stack>
                    <Stack className="p-0 m-0">
                      <Form.Label
                        htmlFor="announcement-start-date"
                        className="update-create-form-label"
                      >
                        {t("Banner_Start_Date")}
                      </Form.Label>
                      <Form.Control
                        id="announcement-start-date"
                        className="mb-2 outline rounded"
                        required
                        type="datetime-local"
                        placeholder="Start Date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      ></Form.Control>
                    </Stack>
                    <Stack className="p-0 m-0">
                      <Form.Label
                        htmlFor="announcement-end-date"
                        className="update-create-form-label"
                      >
                        {t("Banner_End_Date")}
                      </Form.Label>
                      <Form.Control
                        id="announcement-end-date"
                        className="mb-2 outline rounded"
                        required
                        type="datetime-local"
                        placeholder="End Date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      ></Form.Control>
                    </Stack>
                    <Stack className="p-0 m-0">
                      {loading ? (
                        <Loader />
                      ) : (
                        <>
                          <Button
                            className="p-2 m-1 rounded"
                            style={{width: "100%"}}
                            type="submit"
                            variant="success"
                          >
                            {t("Create")}
                          </Button>
                        </>
                      )}
                    </Stack>
                  </Form>
                </Group>
              ) : (
                ""
              )}

              {addorlist === "list" ? (
                loading ? (
                  <Loader />
                ) : (
                  <>
                    {announcements?.length > 0 ? (
                      announcements?.map((announcement, index) => (
                        <Group
                          key={index}
                          className="m-0 mt-2 p-0 rounded"
                          style={{
                            width: "100%",
                            outline: "auto",
                            outlineStackor: "grey",
                            outlineWidth: "2px",
                            outlineStyle: "groove"
                          }}
                        >
                          <Stack className="p-0 m-0" xs={11}>
                            <Group className="p-0 m-0">
                              <Image
                                className="p-0 m-0 rounded"
                                style={{
                                  maxHeight: "150px"
                                }}
                                src={announcement.url}
                                alt="announcements-images"
                              />
                            </Group>
                            <Group className="p-1 m-0">
                              <Stack>
                                <p
                                  className="p-0 m-0"
                                  style={{fontSize: "8px"}}
                                >
                                  {announcement.startDate.split(".")[0]}
                                </p>
                              </Stack>
                              <Stack>
                                <p
                                  className="p-0 m-0"
                                  style={{fontSize: "8px"}}
                                >
                                  {announcement.endDate.split(".")[0]}
                                </p>
                              </Stack>
                              <Stack>
                                {Date.now() <
                                Date.parse(
                                  announcement.startDate.split(".")[0]
                                ) ? (
                                  <h6
                                    className="p-0 m-0"
                                    style={{
                                      fontSize: "12px",
                                      color: "black"
                                    }}
                                  >
                                    {t("Soon")}
                                  </h6>
                                ) : (
                                  ""
                                )}
                                {Date.now() >
                                Date.parse(
                                  announcement.endDate.split(".")[0]
                                ) ? (
                                  <h6
                                    className="p-0 m-0"
                                    style={{
                                      fontSize: "12px",
                                      color: "red"
                                    }}
                                  >
                                    {t("Expired")}
                                  </h6>
                                ) : (
                                  ""
                                )}
                                {Date.now() >
                                  Date.parse(
                                    announcement.startDate.split(".")[0]
                                  ) &&
                                Date.now() <
                                  Date.parse(
                                    announcement.endDate.split(".")[0]
                                  ) ? (
                                  <h6
                                    className="p-0 m-0"
                                    style={{fontSize: "12px", color: "green"}}
                                  >
                                    {t("Active")}
                                  </h6>
                                ) : (
                                  ""
                                )}
                              </Stack>
                            </Group>
                          </Stack>

                          <Stack
                            className="p-0 m-0 rounded"
                            xs={1}
                            style={{
                              outline: "auto",
                              outlineStackor: "red",
                              outlineWidth: "1px",
                              outlineStyle: "groove"
                            }}
                          >
                            <Group
                              className="p-0 m-0"
                              style={{height: "100%", justifyContent: "center"}}
                            >
                              <i
                                className="p-0 m-0 bi bi-trash3"
                                style={{color: "red", fontSize: "16px"}}
                                onClick={() =>
                                  deleteHandler(index, announcement._id)
                                }
                              ></i>
                            </Group>
                          </Stack>
                        </Group>
                      ))
                    ) : (
                      <h5>{t("Empty")}</h5>
                    )}
                  </>
                )
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ControlAnnouncements
