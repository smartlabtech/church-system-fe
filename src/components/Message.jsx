import React from "react"

function Message({variant, children}) {
  return (
    <Alert className="alert message" variant={variant}>
      {children}
    </Alert>
  )
}

export default Message
