import React from "react"

function AspectRatioBox(props) {
  return (
    <div className="aspect-ratio-box" style={{paddingTop: `${props.ratio}%`}}>
      <div className="content">{props.children}</div>
    </div>
  )
}

export default AspectRatioBox
