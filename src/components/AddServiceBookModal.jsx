import React from "react"
import {useSelector} from "react-redux"
import {Modal, Button, Select, Stack, Group, Loader} from "@mantine/core"
import {useTranslation} from "react-i18next"

function AddServiceBookModal({
  status,
  bookId,
  classes,
  onShow,
  onAdd,
  onSelectBook,
  onSelectClass
}) {
  const {t} = useTranslation()

  const booksGet = useSelector((state) => state.booksGet)
  const {books, loading} = booksGet

  return (
    <>
      <Group position="left">
        <Button variant="outline" color="green" onClick={() => onShow(true)}>
          <i className="bi bi-plus-square" style={{fontSize: "18px"}}></i>
        </Button>
      </Group>

      <Modal
        opened={status}
        onClose={() => onShow(false)}
        title={t("Add_Study")}
      >
        {loading ? (
          <Loader />
        ) : (
          <Stack spacing="md">
            <Select
              label={t("Select_Book")}
              data={books?.map((book) => ({
                label: book.name[t("lang")],
                value: book._id
              }))}
              onChange={(value) => onSelectBook(value)}
              placeholder={t("Choose_a_book")}
            />

            {bookId && (
              <>
                <Select
                  label={t("Select_Class")}
                  data={classes?.map((classData) => ({
                    label: classData.name,
                    value: classData._id
                  }))}
                  onChange={(value) => onSelectClass(value)}
                  placeholder={t("Choose_a_class")}
                />

                <Button variant="outline" mt="md" onClick={() => onAdd()}>
                  {t("Add")}
                </Button>
              </>
            )}
          </Stack>
        )}
      </Modal>
    </>
  )
}

export default AddServiceBookModal
