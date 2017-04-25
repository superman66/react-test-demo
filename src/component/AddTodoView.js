/**
 * Created by superman on 2017/3/20.
 */

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
    if (e.keyCode == 13) {
      const node = this.refs.input;
      const text = node.value.trim();
      this.props.onAddClick(text);
      node.value = '';
    }
  }

}

AddTodoView.propTypes = {
  onAddClick: PropTypes.func.isRequired
};

export default AddTodoView