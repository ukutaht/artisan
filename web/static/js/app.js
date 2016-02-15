import "phoenix_html"
import React from "react"
import { render } from "react-dom"
import IndexRoute from 'react-router/lib/IndexRoute'
import Router from 'react-router/lib/Router'
import Route from 'react-router/lib/Route'
import browserHistory from 'react-router/lib/browserHistory'

import Layout from "./layout"
import Dashboard from "./dashboard"
import Board from "./board"

let mountNode = document.getElementById('mount')

render((
  <Router history={browserHistory}>
    <Route path="/" component={Layout}>
      <IndexRoute component={Dashboard} />
      <Route path="/board" component={Board} />
    </Route>
  </Router>
), mountNode)
