/**
 * Created by superman on 2017/3/21.
 */

import {connect} from 'react-redux'
import {addTodo} from '../actions/index'
import AddTodoView from '../component/AddTodoView'


function mapState2Props(state) {
  return {

  }
}

function mapDispatch2Props(dispatch) {
  return {
    onAddClick: (text) => {
      dispatch(addTodo(text))
    }
  }
}

export default connect(
    mapState2Props,
    mapDispatch2Props
)(AddTodoView)