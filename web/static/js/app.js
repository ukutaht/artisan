import "phoenix_html"
import React from "react"
import { render } from "react-dom"
import { IndexRoute, Router, Route, browserHistory } from 'react-router'
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
