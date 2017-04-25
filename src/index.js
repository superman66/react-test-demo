import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import todoApp from './reducers/index'
import Router from './routes/index'
import './index.css';
import 'todomvc-app-css/index.css'

ReactDOM.render(
    Router,
    document.getElementById('root')
)
;
