/**
 * Created by superman on 2017/3/20.
 */

import React, { PropTypes } from 'react'

function Todo({ onClick, onRemoveTodoClick, completed, text }) {

  return (
    <li
      className={completed ? 'completed' : ''}
    >
      <div className="view">
        <input className="toggle" type="checkbox" onClick={onClick}/>
        <label>{text}</label>
        <button className="destroy" onClick={onRemoveTodoClick}></button>
      </div>
    </li>
  )
}

  Todo.propTypes = {
    onClick: PropTypes.func.isRequired,
    completed: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired
  };

  export default Todo