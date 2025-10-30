import React from "react"
import {useTranslation} from "react-i18next"

function ControlBibleStudy({service, history}) {
  const [t, i18n] = useTranslation()

  return (
    <>
      <Group
        className="m-0 p-0 module card"
        style={{direction: t("Dir")}}
        onClick={() =>
          history.push(`/bible-study-manage?serviceId=${service._id}`)
        }
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
            {t("Bible Study")}
            <span style={{color: "green"}}>
              <i className="bi bi-shield-fill-check"></i>
            </span>
          </p>
          <i className="p-0 m-0 large-size bi bi-book"></i>
        </Stack>
      </Group>
    </>
  )
}

export default ControlBibleStudy
