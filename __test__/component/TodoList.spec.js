import React from 'react'
import TodoList from '../../src/component/TodoList'
import { render } from 'enzyme'

const setup = () => {
  const props = {
    todos: [
      {
        text: 'todo-1',
        completed: false
      },
      {
        text: 'todo-2',
        completed: false
      },
      {
        text: 'todo-3',
        completed: false
      }
    ],
    onTodoClick: jest.fn(),
    onRemoveTodoClick: jest.fn()
  }
  const wrapper = render(<TodoList {...props} />)
  return {
    props,
    wrapper
  }
}

describe('TodoList', () => {
  const { props, wrapper } = setup()
  it('TodoList length should be 3', () => {
    expect(wrapper.find('li').length).toBe(3)
  })
})

