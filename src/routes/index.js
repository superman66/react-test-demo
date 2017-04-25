/**
 * Created by superman on 2017/3/21.
 */

import React from 'react'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import {Router, Route, hashHistory} from 'react-router'
import todoApp from '../reducers/index'
import App from '../component/App'

let store = createStore(todoApp);
export default (
    <Provider store={store}>
      <Router history={hashHistory}>
        <Route path='/(:filter)' component={App}/>
      </Router>
    </Provider>

)