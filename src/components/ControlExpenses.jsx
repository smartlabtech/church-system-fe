import React, {useState, useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"

import {
  setExpense,
  listExpenses,
  downloadExpenses
} from "../actions/expenseActions"

import {useTranslation} from "react-i18next"

import {Loader} from "@mantine/core"
import {notifications} from "@mantine/notifications"
import Lottie from "react-lottie-player"
import no from "../assets/lottie/No.json"

function ControlExpenses(service) {
  const dispatch = useDispatch()
  const [t, i18n] = useTranslation()

  const [listOrAdd, setListOrAdd] = useState("list")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState(0)

  const downloadExpense = useSelector((state) => state.downloadExpense)
  const {loading: downloadExpensesLoading} = downloadExpense

  const getExpenses = useSelector((state) => state.getExpenses)
  const {loading, expenses} = getExpenses

  const postExpenseHandler = (type) => {
    let pass = true
    if (amount <= 0) {
      pass = false
      notifications.show({
        loading: false,
        color: "red",
        title: (
          <Group justify="space-between">
            <Text>{t("Amount Must be Greater Than 0")}</Text>
            <Lottie play loop animationData={no} style={{height: 120}} />
          </Group>
        ),
        autoClose: 3000,
        withCloseButton: false
      })
    }

    if (description == "" && pass) {
      pass = false
      notifications.show({
        loading: false,
        color: "red",
        title: (
          <Group justify="space-between">
            <Text>{t("Please Add Description")}</Text>
            <Lottie play loop animationData={no} style={{height: 120}} />
          </Group>
        ),
        autoClose: 3000,
        withCloseButton: false
      })
    }
    if (pass) {
      dispatch(
        setExpense(
          {
            serviceId: service.service._id,
            type: type,
            description: description,
            amount: amount
          },
          expenses
        )
      )
      setAmount(0)
      setDescription("")
    }
  }

  const getExpensesHandler = () => {
    if (service?.service?._id || 0)
      dispatch(listExpenses({serviceId: service.service._id}))
  }

  const downloadExpenseHandler = () => {
    dispatch(downloadExpenses({serviceId: service.service._id}))
  }

  return (
    <>
      <Group
        data-mdb-toggle="modal"
        data-mdb-target="#manage-expenses"
        className="m-0 p-0 module card"
        onClick={() => getExpensesHandler()}
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
            {t("Expenses")}
            <span style={{color: "green"}}>
              <i className="bi bi-shield-fill-check"></i>
            </span>
          </p>
          <i className="p-0 m-0 large-size bi bi-cash-coin"></i>
        </Stack>
      </Group>

      <div
        className="p-0 m-0 modal fade"
        id="manage-expenses"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="p-0 m-0" style={{width: "100%"}}>
              {loading ? (
                <Loader />
              ) : (
                <>
                  <Group
                    className="m-0 p-0 module card"
                    style={{width: "100%", direction: t("Dir")}}
                  >
                    <Stack
                      className="m-0 p-3 justify-content-start"
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                    >
                      <p className="p-0 m-0 large-size">
                        <span style={{color: "grey"}}>{t("Balance")}</span>{" "}
                        {expenses?.length ? expenses[0].accumulated : 0}{" "}
                        <span style={{color: "grey"}}>{t("LE")}</span>
                      </p>
                    </Stack>
                  </Group>

                  <Group
                    className="m-0 p-0 justify-content-between"
                    style={{width: "100%", direction: t("Dir")}}
                  >
                    {listOrAdd === "list" && (
                      <>
                        <Stack
                          className="mt-2 p-0 module card"
                          xs={2}
                          sm={2}
                          md={2}
                          lg={2}
                          xl={2}
                          onClick={() => setListOrAdd("add")}
                        >
                          <i className="p-0 m-0 large-size bi bi-plus-slash-minus"></i>
                        </Stack>

                        <Stack
                          className="mt-2 p-0 module card"
                          xs={2}
                          sm={2}
                          md={2}
                          lg={2}
                          xl={2}
                          onClick={() => downloadExpenseHandler()}
                        >
                          {downloadExpensesLoading ? (
                            <Loader />
                          ) : (
                            <i className="p-0 m-0 large-size bi bi-cloud-download"></i>
                          )}
                        </Stack>
                      </>
                    )}
                    {listOrAdd === "add" && (
                      <Stack
                        className="p-0 mt-2 module card"
                        xs={2}
                        onClick={() => setListOrAdd("list")}
                      >
                        <i className="p-0 m-0 large-size bi bi-arrow-return-right"></i>
                      </Stack>
                    )}
                  </Group>

                  <div
                    className="p-0 m-0 scroll-vertical"
                    style={{width: "100%", direction: t("Dir")}}
                  >
                    {expenses?.map((expense, index) => (
                      <Group
                        hidden={listOrAdd !== "list"}
                        key={index}
                        className="m-0 mt-3 p-0"
                        style={{width: "100%"}}
                      >
                        <Stack className="p-0 m-0" xs={4}>
                          <p className="p-0 m-0">
                            {expense.createdAt.split("T")[0]}
                          </p>
                        </Stack>
                        <Stack className="p-0 m-0" xs={4}>
                          <p className="p-0 m-0">{expense.description}</p>
                        </Stack>
                        <Stack className="p-0 m-0" xs={2}>
                          <p
                            className="m-0 p-0"
                            style={{
                              color: expense.type === "IN" ? "green" : "red"
                            }}
                          >
                            {expense.type === "IN"
                              ? expense.amount
                              : expense.amount * -1}
                          </p>
                        </Stack>
                        <Stack className="p-0 m-0" xs={2}>
                          <p className="p-0 m-0">{expense.accumulated}</p>
                        </Stack>
                      </Group>
                    ))}
                  </div>
                  <Group
                    hidden={listOrAdd === "list"}
                    className="m-0 mt-3 p-0"
                    style={{width: "100%"}}
                  >
                    <Form>
                      <Form.Control
                        id="update-profile-street"
                        className="m-2 update-create-form-control-right rounded"
                        required
                        type="text"
                        value={description}
                        placeholder={t("Transaction_Description")}
                        onChange={(e) => setDescription(e.target.value)}
                      ></Form.Control>
                      <Form.Control
                        id="update-profile-street"
                        className="m-2 update-create-form-control-right rounded"
                        required
                        type="number"
                        value={amount}
                        placeholder="456"
                        onChange={(e) => setAmount(e.target.value)}
                      ></Form.Control>
                      <Group className="p-0 m-2" style={{width: "100%"}}>
                        <Button
                          variant="outline-success"
                          className="m-1 p-1 rounded"
                          style={{width: "45%"}}
                          onClick={() => postExpenseHandler("IN")}
                        >
                          {t("Income")}
                        </Button>
                        <Button
                          variant="outline-danger"
                          className="m-1 p-1 rounded"
                          style={{width: "45%"}}
                          onClick={() => postExpenseHandler("OUT")}
                        >
                          {t("Outcome")}
                        </Button>
                      </Group>
                    </Form>
                  </Group>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ControlExpenses
