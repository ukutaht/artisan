import React from "react"
import { render } from "react-dom"
import IndexRoute from 'react-router/lib/IndexRoute'
import Router from 'react-router/lib/Router'
import Route from 'react-router/lib/Route'
import browserHistory from 'react-router/lib/browserHistory'

import Layout from "./layout"
import Dashboard from "./dashboard"
import NewProject from "./new-project"
import ProjectBoard from "./project-board"

let mountNode = document.getElementById('mount')

render((
  <Router history={browserHistory}>
    <Route path="/" component={Layout}>
      <IndexRoute component={Dashboard} />
      <Route path="projects/new" component={NewProject} />
      <Route path="projects/:projectId" component={ProjectBoard} />
    </Route>
  </Router>
), mountNode)
