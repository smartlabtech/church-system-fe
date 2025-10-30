import React, {useState, useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import Message from "./Message"
import {changePhone, changePhoneRequest} from "../actions/userActions"
import {validMobileRegex} from "../myRegexp"
import {Button, Loader, Modal} from "@mantine/core"
import {Form} from "@mantine/form"

function ChangePhoneModal() {
  const dispatch = useDispatch()

  const [newPhone, setNewPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [mobileError, setMobileError] = useState("")

  const [show, setShow] = useState(false)

  const userChangePhone = useSelector((state) => state.userChangePhone)
  const {error, loading, success} = userChangePhone

  const changePhoneHandler = () => {
    if (validMobileRegex.test(newPhone)) {
      let data = {}
      data.newPhone = newPhone
      data.changeMobileOTB = otp
      dispatch(changePhone(data))
      setMobileError("")
    } else {
      setMobileError("010... /011.. /012... /015...")
    }
  }

  const onStartModalHandler = () => {
    setShow(true)
    dispatch(changePhoneRequest())
  }
  return (
    <>
      <Button
        // variant="outline-info"
        // className="btn-md"
        className={"rounded"}
        style={{width: "100%"}}
        xs={12}
        sm={12}
        md={12}
        lg={12}
        variant="primary"
        onClick={() => onStartModalHandler()}
      >
        Change
      </Button>

      <Modal opened={show} onClose={() => setShow(false)}>
        <Modal.Header>
          <Modal.Title>Change Phone Number</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Message variant="danger" children={error} />}
          {success && (
            <Message variant="success" children={"Changed Succesfuly"} />
          )}
          <Form>
            {/* New Phone Number */}
            <Form.Group className="mb-3">
              <Form.Label style={{display: "flex", justifyContent: "flex-end"}}>
                New Phone Number
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="New mobile"
                onChange={(e) => setNewPhone(e.target.value)}
              />
            </Form.Group>
            {mobileError.length > 0 && (
              <p style={{color: "red"}}>{mobileError}</p>
            )}
            {/*Old Phone Number*/}
            <Form.Group className="mb-3">
              <Form.Label style={{display: "flex", justifyContent: "flex-end"}}>
                Verification Code sent to your old mobile
              </Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="OTP"
                onChange={(e) => setOtp(e.target.value)}
              />
            </Form.Group>

            {loading ? (
              <Loader />
            ) : (
              <div style={{display: "flex", justifyContent: "flex-end"}}>
                <Button
                  disabled={false}
                  variant="outline-primary"
                  onClick={() => changePhoneHandler()}
                >
                  Change
                </Button>
              </div>
            )}
          </Form>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default ChangePhoneModal
