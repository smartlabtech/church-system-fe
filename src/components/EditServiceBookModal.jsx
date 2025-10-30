import React from "react"
import {useTranslation} from "react-i18next"
import {Button, Group, Modal, Stack, Select, Text} from "@mantine/core"

function EditServiceBookModal({
  status,
  selectedServiceBook,
  classes,
  onShow,
  onEdit,
  onSelectClass
}) {
  const {t} = useTranslation()

  return (
    <>
      <Group position="apart" style={{width: "100%"}}>
        <Stack spacing="xs" align="flex-start">
          <Text size="md" color="gold">
            {selectedServiceBook?.bookDetails.name[t("lang")]}
            <Text
              component="span"
              color="gray"
              size="sm"
              style={{cursor: "pointer", marginLeft: 8}}
              onClick={() => onShow(true)}
            >
              <i className="bi bi-pencil-square"></i>
            </Text>
          </Text>
        </Stack>
      </Group>

      <Modal
        opened={status}
        onClose={() => onShow(false)}
        title={t("Add_Study_To")}
      >
        <Stack spacing="md">
          <Text size="md" color="gold">
            {selectedServiceBook?.bookDetails.name[t("lang")]}
          </Text>

          <Select
            data={classes?.map((classData) => ({
              label: classData.name,
              value: classData._id
            }))}
            onChange={(value) => onSelectClass(value)}
            placeholder={t("Select_Class")}
          />

          <Button variant="outline" mt="md" onClick={() => onEdit()}>
            {t("Edit")}
          </Button>
        </Stack>
      </Modal>
    </>
  )
}

export default EditServiceBookModal
