import React from "react"
import {useTranslation} from "react-i18next"

function ControlReportsDataCard() {
  const [t, i18n] = useTranslation()

  return (
    <>
      <Group
        data-mdb-toggle="modal"
        data-mdb-target="#reportModal"
        className="m-0 p-0 module card"
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
            {t("Data_Reports")}
            <span style={{color: "red"}}>
              <i className="bi bi-shield-fill-x"></i>
            </span>
          </p>
          <i className="p-0 m-0 large-size bi bi-filetype-csv"></i>
        </Stack>
      </Group>
      <div
        className="modal fade"
        id="reportModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              {/* <h5 className="modal-title"></h5> */}
              <button
                type="button"
                className="btn-close"
                data-mdb-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <h4>{t("Soon")}</h4>
          </div>
        </div>
      </div>
    </>
  )
}

export default ControlReportsDataCard
