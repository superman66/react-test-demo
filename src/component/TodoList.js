/**
 * Created by superman on 2017/3/20.
 */

import React, { Component, PropTypes } from 'react'
import Todo from './Todo'

class TodoList extends Component {
  render() {
    const { todos, onTodoClick, onRemoveTodoClick } = this.props;
    return (
      <ul className="todo-list">
        {todos.map((todo, index) =>
          <Todo
            {...todo}
            onClick={() => onTodoClick(index)}
            onRemoveTodoClick = { () => onRemoveTodoClick(index)}
            key={index}
          />
        )}
      </ul>
    )
  }
}
TodoList.propTypes = {
  onRemoveTodoClick: PropTypes.func.isRequired,
  onTodoClick: PropTypes.func.isRequired,
  todos: PropTypes.arrayOf(PropTypes.shape({
    completed: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired
  }).isRequired).isRequired
};

export default TodoList