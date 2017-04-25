import React from 'react'
import App from '../../src/component/App'
import { shallow } from 'enzyme'

const setup = () => {

  // 模拟 props
  const props = {
    params: 'all'
  };

  // 通过 shallow 渲染 App 组件
  const wrapper = shallow(<App {...props} />)

  return {
    props,
    wrapper
  }
}

// UI 组件测试
describe('components', () => {
  describe('App', () => {
    const { wrapper, props } = setup();

    it('app component should render', () => {
      // 利用 enzyme 提供的语法查找对于的节点是否存在
      expect(wrapper.find('.todoapp').exists())
    })
  })
})
