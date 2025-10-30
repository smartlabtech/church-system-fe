import React, {useState, useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import ChangePhoneModal from "./ChangePhoneModal"

function ChangeNumberCard() {
  const userLogin = useSelector((state) => state.userLogin)
  const {userInfo} = userLogin

  const [mobile, setMobile] = useState(userInfo?.user?.mobile)

  return (
    <Card bg={"light"} text={"dark"} className="my-1 p-2 rounded">
      <Card.Body>
        <h5 className={"p-0 m-2"}>
          Phone <i className="fas fa-phone"></i>
          <span style={{color: "DodgerBlue", float: "right"}}>{mobile}</span>
        </h5>
        <ChangePhoneModal />
      </Card.Body>
    </Card>
  )
}
export default ChangeNumberCard
