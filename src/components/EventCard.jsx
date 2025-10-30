import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"

const EventCard = ({slides}) => {
  useEffect(() => {}, [])

  if (!Array.isArray(slides) || slides.length <= 0) return null

  return (
    <>
      <Group className="m-0 p-0 justify-content-center" style={{width: "100%"}}>
        <h5>Events</h5>
      </Group>

      <div style={{width: "100%", overflow: "auto", display: "flex"}}>
        {slides.map((data, index) => (
          <div style={{margin: "3px"}} key={index}>
            <Card
              border="secondary"
              className="m-1 p-0 rounded"
              style={{
                width: "15rem"
                // height: "25.7rem"
              }}
            >
              <Card.Img src={data.image} />
              <Card.Body className="p-0 mt-1">
                <Button className="m-0 p-0 rounded" style={{width: "100%"}}>
                  بدأ الحجز
                </Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </>
  )
}

export default EventCard
