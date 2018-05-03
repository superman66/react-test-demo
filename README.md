# 基于 Jest + Enzyme 的 React 单元测试
* Jest 和 Enzyme 的基本介绍
* 测试环境搭建
* 测试脚本编写
  * UI 组件测试
  * Reducer 测试
* 运行并调试
* 参考资料

## Jest、Enzyme 介绍
Jest 是 Facebook 发布的一个开源的、基于 `Jasmine` 框架的 JavaScript 单元测试工具。提供了包括内置的测试环境 DOM API 支持、断言库、Mock 库等，还包含了 Spapshot Testing、 Instant Feedback 等特性。

Airbnb开源的 React 测试类库 Enzyme 提供了一套简洁强大的 API，并通过 jQuery 风格的方式进行DOM 处理，开发体验十分友好。不仅在开源社区有超高人气，同时也获得了React 官方的推荐。

## 测试环境搭建
在开发 React 应用的基础上（默认你用的是 Webpack + Babel 来打包构建应用），你需要安装 `Jest` `Enzyme`，以及对应的 `babel-jest`
```
npm install jest enzyme babel-jest --save-dev
```
下载 npm 依赖包之后，你需要在 `package.json` 中新增属性，配置 Jest：

```json
  "jest": {
    "moduleFileExtensions": [
      "js",
      "jsx"
    ],
    "moduleNameMapper": {
      "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
      ".*\\.(css|less|scss)$": "<rootDir>/__mocks__/styleMock.js"
    },
    "transform": {
      "^.+\\.js$": "babel-jest"
    }
  },
```
并新增`test scripts`
```
"scripts": {
    "dev": "NODE_ENV=development webpack-dev-server  --inline --progress --colors --port 3000 --host 0.0.0.0 ",
    "test": "jest"
  }
```
其中 :
* `moduleFileExtensions`：代表支持加载的文件名，与 Webpack 中的 `resolve.extensions` 类似
* `moduleNameMapper`：代表需要被 Mock 的资源名称。如果需要 Mock 静态资源（如less、scss等），则需要配置 Mock 的路径 `<rootDir>/__mocks__/yourMock.js`
* `transform` 用于编译 ES6/ES7 语法，需配合 `babel-jest` 使用

上面三个是常用的配置，更多 Jest 配置见官方文档：[Jest Configuration](https://facebook.github.io/jest/docs/configuration.html)

## 测试脚本编写
### UI 组件测试
环境搭建好了，就可以开始动手写测试脚本了。在开始之前，先分析下 Todo 应用的组成部分。

![](https://github.com/superman66/react-test-demo/blob/master/screenshot/todo.png)

应用主体结构如下 `src/component/App.js`：
```javascript
class App extends Component {
  render() {
    const { params } = this.props;
    return (
      <section className="todoapp">
        <div className="main">
          <AddTodo />
          <VisibleTodoList filter={params.filter || 'all'} />
        </div>
         <Footer />
      </section>
    )
  }
}
```

可以发现 整个应用可以分为三个组件:
* 最外层的 `<App />`
* 中间的 Input 输入框 `<AddTodo />`
* 下面的 TODO 列表 `<VisibleTodoList />`

其中 `<App/>` 是 UI 组件，`<AddTodo />` 和 `<VisibleTodoList />` 是智能组件，我们需要找到智能组件所对应的 UI 组件 `<AddTodoView/>` 和 `<TodoList/>`。


`<AddTodoView/>` 就是一个 `Input` 输入框，接受文字输入，敲下回车键，创建一个 Todo。代码如下 `src/component/AddTodoView.js`：

```javascript
import React, { Component, PropTypes } from 'react'
class AddTodoView extends Component {
  render() {
    return (
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          type="text"
          onKeyUp={e => this.handleClick(e)}
          placeholder="input todo item"
          ref='input' />
      </header>
    )
  }

  handleClick(e) {
    if (e.keyCode === 13) {
      const node = this.refs.input;
      const text = node.value.trim();
      text && this.props.onAddClick(text);
      node.value = '';
    }
  }
}
```
了解了该组件的功能之后，我们首先需要明确该组件需要测试哪些点：
* 组件是否正常渲染
* 当用户输入内容敲下回车键时，是否能正常的调用 `props` 传递的 `onAddClick(text)` 方法
* 创建完成后清除 Input 的值
* 当用户没有输入任何值时，敲下回车时，应该不调用 `props` 传递的 `onAddClick(text)` 方法

经过上面的分析之后，我们就可以开始编写单元测试脚本了。

#### 第一步：引入相关 lib

```javascript
import React from 'react'
import App from '../../src/component/App'
import { shallow } from 'enzyme'
```
在这里我们引入了 `shallow` 方法，它是 `Enzyme` 提供的 API 之一，可以实现**浅渲染**。其作用是仅仅渲染至虚拟节点，不会返回真实的节点，能极大提高测试性能。但是它不适合测试包含子组件、需要测试声明周期的组件。
`Enzyme` 还提供了其他两个 API：
* `mount`：Full Rendering，非常适用于存在于 DOM API 存在交互组件，或者需要测试组件完整的声明周期
* `render`：Static Rendering，用于 将 React 组件渲染成静态的 HTML 并分析生成的 HTML 结构。`render` 返回的 `wrapper` 与其他两个 API 类似。不同的是 `render` 使用了第三方 HTML 解析器和 `Cheerio`。

一般情况下，`shallow` 就已经足够用了，偶尔情况下会用到 `mount`。

#### 第二步：模拟 Props，渲染组件创建 Wrapper
这一步，我们可以创建一个 `setup` 函数来实现。

```javascript
const setup = () => {
  // 模拟 props
  const props = {
    // Jest 提供的mock 函数
    onAddClick: jest.fn()
  }

  // 通过 enzyme 提供的 shallow(浅渲染) 创建组件
  const wrapper = shallow(<AddTodoView {...props} />)
  return {
    props,
    wrapper
  }
}
```
`Props` 中包含函数的时候，我们需要使用 Jest 提供的 [mockFunction](https://facebook.github.io/jest/docs/mock-function-api.html#content)

#### 第四步：编写 Test Case
这里的 Case 根据我们前面分析需要测试的点编写。

**Case1：测试组件是否正常渲染**


```javascript
describe('AddTodoView', () => {
  const { wrapper, props } = setup();

  // case1
  // 通过查找存在 Input,测试组件正常渲染
  it('AddTodoView Component should be render', () => {
    //.find(selector) 是 Enzyme shallow Rendering 提供的语法, 用于查找节点
    // 详细用法见 Enzyme 文档 http://airbnb.io/enzyme/docs/api/shallow.html
    expect(wrapper.find('input').exists());
  })
})
```
写完第一个测试用例之后，我们可以运行看看测试的效果。在 Terminal 中输入 `npm run test`,效果如下:

![](https://github.com/superman66/react-test-demo/blob/master/screenshot/case1-test-result.png)

**Case2: 输入内容并敲下回车键，测试组件调用props的方法**


```javascript
  it('When the Enter key was pressed, onAddClick() shoule be called', () => {
    // mock input 输入和 Enter事件
    const mockEvent = {
      keyCode: 13, // enter 事件
      target: {
        value: 'Test'
      }
    }
    // 通过 Enzyme 提供的 simulate api 模拟 DOM 事件
    wrapper.find('input').simulate('keyup',mockEvent)
    // 判断 props.onAddClick 是否被调用
    expect(props.onAddClick).toBeCalled()
  })
```
上面的代码与第一个 case 多了两点：
* 增加了 `mockEvent`,用于模拟 DOM 事件
* 使用 `Enzyme` 提供的 `.simulate(’keyup‘, mockEvent)` 来模拟点击事件,这里的 `keyup` 会自动转换成 React 组件中的 `onKeyUp` 并调用。

我们再运行 `npm run test` 看看测试效果：

![](https://github.com/superman66/react-test-demo/blob/master/screenshot/case12-test-result.png)

经过上面两个 Test Case 的分析，接下来的 Case3 和 Case4 思路也是一样，具体写法见代码： [__test__/component/AddTodoView.spec.js](https://github.com/superman66/react-test-demo/blob/master/__test__/component/AddTodoView.spec.js)，这里就不一一讲解了。

### Reducer 测试
由于 Reducer 是纯函数，因此对 Reducer 的测试非常简单，Redux 官方文档也提供了测试的例子，代码如下：
```javascript
import reducer from '../../reducers/todos'
import * as types from '../../constants/ActionTypes'

describe('todos reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual([
      {
        text: 'Use Redux',
        completed: false,
        id: 0
      }
    ])
  })

  it('should handle ADD_TODO', () => {
    expect(
      reducer([], {
        type: types.ADD_TODO,
        text: 'Run the tests'
      })
    ).toEqual(
      [
        {
          text: 'Run the tests',
          completed: false,
          id: 0
        }
      ]
    )

    expect(
      reducer(
        [
          {
            text: 'Use Redux',
            completed: false,
            id: 0
          }
        ],
        {
          type: types.ADD_TODO,
          text: 'Run the tests'
        }
      )
    ).toEqual(
      [
        {
          text: 'Run the tests',
          completed: false,
          id: 1
        },
        {
          text: 'Use Redux',
          completed: false,
          id: 0
        }
      ]
    )
  })
})

```
更多关于 Redux 的测试可以看官网提供的例子：[编写测试-Redux文档](http://cn.redux.js.org/docs/recipes/WritingTests.html)

## 调试及测试覆盖率报告
在运行测试脚本过程，`Jest` 的错误提示信息友好，通过错误信息一般都能找到问题的所在。
同时 `Jest` 还提供了生成测试覆盖率报告的命令，只需要添加上 `--coverage` 这个参数既可生成。不仅会在终端中显示：

![](https://github.com/superman66/react-test-demo/blob/master/screenshot/coverage-report.png)

而且还会在项目中生成 `coverage` 文件夹，非常方便。
# 资料
* [聊一聊前端自动化测试](https://github.com/tmallfe/tmallfe.github.io/issues/37)
* [Enzyme API](http://airbnb.io/enzyme/docs/api/index.html)
* [Jest](https://facebook.github.io/jest/)

