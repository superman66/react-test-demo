/**
 * Created by superman on 2017/3/21.
 */

import { connect } from 'react-redux'
import TodoList from '../component/TodoList'
import { toggleTodo, removeTodo } from '../actions/index'
import { VisibilityFilters } from '../constants/filterTypes'

function visibleTodos(todos, filter) {
  switch (filter) {
    case 'all':
      return todos;
    case 'active':
      return todos.filter(todo => !todo.completed);
    case 'completed':
      return todos.filter(todo => todo.completed)
    default:
      return todos
  }
}

function mapState2Props(state, ownProps) {
  return {
    todos: visibleTodos(state.todos, ownProps.filter)
  }
}

function mapDispatch2Props(dispatch) {
  return {
    onTodoClick: (id) => {
      dispatch(toggleTodo(id))
    },
    onRemoveTodoClick: (id) => {
      dispatch(removeTodo(id))
    }
  }
}

export default connect(
  mapState2Props,
  mapDispatch2Props
)(TodoList)