import React from "react"
import {Select, Text} from "@mantine/core"
import {useTranslation} from "react-i18next"

const ClassesList = ({classId, classes, selected, onChange, style}) => {
  const [t] = useTranslation()

  return (
    <>
      <Text className={style} weight={500} mb="xs">
        {t("Class")}
      </Text>
      <Select
        data={classes?.map((classData) => ({
          label: classData.name,
          value: classData._id
        }))}
        value={selected?.value}
        onChange={(value) =>
          onChange({value, label: classes.find((c) => c._id === value)?.name})
        }
        placeholder={t("Select a class")}
        searchable
        nothingFound={t("No classes available")}
      />
    </>
  )
}

export default ClassesList
