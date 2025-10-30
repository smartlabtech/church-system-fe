import {FaTimes} from "react-icons/fa"

const Product = ({task, onDelete, onToggle}) => {
  return (
    <div
      className={`task ${task.reminder && "reminder"}`}
      onDoubleClick={() => onToggle(task.id)}
    >
      <h3 className="task h3">
        {task.text}{" "}
        <FaTimes
          style={{color: "red", cursor: "pointer"}}
          onClick={() => onDelete(task.id)}
        />
      </h3>
      <p className="task p">{task.day}</p>
    </div>
  )
}

export default Product
