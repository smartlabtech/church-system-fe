import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"

const BibleStydyCard = ({slides}) => {
  useEffect(() => {}, [])

  if (!Array.isArray(slides) || slides.length <= 0) return null

  return (
    <>
      <Group className="m-0 p-0 justify-content-center" style={{width: "100%"}}>
        <h5>The Bible Study</h5>
      </Group>

      <h5>Array Of Bible Study</h5>
    </>
  )
}

export default BibleStydyCard
