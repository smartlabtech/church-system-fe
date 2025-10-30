import React from "react"
import "./ProgressBar.scss"

const ProgressBar = ({percentage}) => {
  return (
    <div className="progress-bar">
      <div
        className={`progress`}
        style={{
          width: `${percentage}%`,
          backgroundStackor: percentage < 65 ? "green" : "red"
        }}
      >
        {percentage} %
      </div>
    </div>
  )
}

export default ProgressBar
