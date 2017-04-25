/**
 * Created by superman on 2017/3/20.
 */

import React, {Component, PropTypes} from 'react'
import {VisibilityFilters} from '../constants/filterTypes'
import FilterLink from '../containers/FilterLink'

class Footer extends Component {

  render() {
    return (
        <footer className="footer">
          <ul className="filters">
            <li>
              <FilterLink filter='all'>All</FilterLink>
            </li>
            <li>
              <FilterLink filter="completed">Completed</FilterLink>
            </li>
            <li>
              <FilterLink filter="active">Active</FilterLink>
            </li>
          </ul>
        </footer>
    )
  }
}

export default Footer