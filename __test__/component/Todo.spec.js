import React from 'react'
import Todo from '../../src/component/Todo.js'
import { shallow } from 'enzyme'

const setup = () => {
  const props = {
    text: 'todo-1',
    completed: false,
    onClick: jest.fn(),
    onRemoveTodoClick: jest.fn()
  }
  const wrapper = shallow(<Todo {...props} />)
  return {
    props,
    wrapper
  }
}

describe('Todo', () => {
  const { props, wrapper } = setup()

  // 通过 input 是否存在来判断 Todo组件是否被渲染
  it('Todo item should  render', () => {
    expect(wrapper.find('input').exists())
  })

  // 当点击 单选按钮，onClick 方法应该被调用
  it('click checkbox input, onClick called', () => {
    const mockEvent = {
      key: 'Click',
    }
    wrapper.find('input').simulate('click', mockEvent)
    expect(props.onClick).toBeCalled()
  })

  it('the item should remove when click remove button', () => {
     const mockEvent = {
      key: 'Click',
    }
    wrapper.find('button').simulate('click', mockEvent)
    expect(props.onRemoveTodoClick).toBeCalled()
  })
})
