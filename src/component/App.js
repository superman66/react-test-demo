/**
 * Created by superman on 2017/3/20.
 */

import React, { Component, PropTypes } from 'react'
import AddTodo from '../containers/AddTodo'
import VisibleTodoList from '../containers/VisibleTodoList'
import Footer from '../component/Footer'

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

export default App;