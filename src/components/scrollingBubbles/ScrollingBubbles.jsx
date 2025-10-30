import React from "react"
import "./scrollingBubbles.css"
import {Group} from "@mantine/core"

const items = [
  "مسابقات",
  "سوق هدايا",
  "مؤتمرات",
  "أخر الأخبار",
  "مشاركة",
  "سؤال محيرني"
]

const ScrollingBubbles = () => {
  return (
    <div>
      {[25, 40].map((time, rowIndex) => (
        <div className="scroll" style={{"--time": `${time}s`}} key={rowIndex}>
          <div>
            {items.map((text, index) => (
              <span key={index}>{text}</span>
            ))}
            {items.map((text, index) => (
              <span key={`${index}-duplicate`}>{text}</span>
            ))}
            {items.map((text, index) => (
              <span key={`${index}-duplicate`}>{text}</span>
            ))}
            {items.map((text, index) => (
              <span key={`${index}-duplicate`}>{text}</span>
            ))}
          </div>
          <div>
            {items.map((text, index) => (
              <span key={index}>{text}</span>
            ))}
            {items.map((text, index) => (
              <span key={`${index}-duplicate-2`}>{text}</span>
            ))}
            {items.map((text, index) => (
              <span key={`${index}-duplicate-2`}>{text}</span>
            ))}
            {items.map((text, index) => (
              <span key={`${index}-duplicate-2`}>{text}</span>
            ))}
          </div>
        </div>
      ))}

      {/* Image-based scroll */}
      {/* <div className="scroll imgBox" style={{"--time": "25s"}}>
        <div>
          {items.map((text, index) => (
            <img
              key={index}
              src={`./images/${text.toLowerCase()}.png`}
              alt={text}
            />
          ))}
          {items.map((text, index) => (
            <img
              key={`${index}-duplicate`}
              src={`./images/${text.toLowerCase()}.png`}
              alt={text}
            />
          ))}
        </div>
        <div>
          {items.map((text, index) => (
            <img
              key={index}
              src={`./images/${text.toLowerCase()}.png`}
              alt={text}
            />
          ))}
          {items.map((text, index) => (
            <img
              key={`${index}-duplicate-2`}
              src={`./images/${text.toLowerCase()}.png`}
              alt={text}
            />
          ))}
        </div>
      </div> */}
    </div>
  )
}

export default ScrollingBubbles
