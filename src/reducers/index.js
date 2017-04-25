/**
 * Created by superman on 2017/3/20.
 */

import {combineReducers} from 'redux'
import {ADD_TODO, TOGGLE_TODO, REMOVE_TODO, SET_VISIBILITY_FILTER} from '../constants/actionTypes'
import {VisibilityFilters} from '../constants/filterTypes'


// reducer 接收旧的state和action,返回新的state
function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return [
        ...state,
        {
          text: action.text,
          completed: false
        }
      ]
    case TOGGLE_TODO:
      return state.map((todo, index) => {
        if (index === action.id) {
          return {
            ...todo,
            completed: !todo.completed
          }
        }
        return todo;
      })
      case REMOVE_TODO:
      return state.filter((todo, index) => {
        return index !== action.id
      })
    default:
      return state
  }

}


function visibilityFilter(state = 'all', action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return action.filter
    default:
      return state
  }
}


const todoApp = combineReducers({
  visibilityFilter,
  todos
})

export default todoApp