/**
 * Created by superman on 2017/3/20.
 */
import {ADD_TODO, TOGGLE_TODO, REMOVE_TODO, SET_VISIBILITY_FILTER} from '../constants/actionTypes'
import {VisibilityFilters} from '../constants/filterTypes'

export function addTodo(text) {
  return {
    type: ADD_TODO,
    text
  }
}

export function toggleTodo(id) {
  return {
    type: TOGGLE_TODO,
    id
  }
}

export function removeTodo(id){
  return {
    type: REMOVE_TODO,
    id
  }
}

export function setVisibilityFilter(filter) {
  return {
    type: SET_VISIBILITY_FILTER,
    filter
  }
}


