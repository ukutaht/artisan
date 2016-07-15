import React from 'react'
import { render } from 'react-dom'
import IndexRoute from 'react-router/lib/IndexRoute'
import Router from 'react-router/lib/Router'
import Route from 'react-router/lib/Route'
import browserHistory from 'react-router/lib/browserHistory'

import Layout from 'layout'
import Dashboard from 'dashboard'
import NewProject from 'projects/new'
import ProjectSettings from 'projects/settings'
import IterationView from 'iteration-view'
import Signup from 'users/signup'
import Login from 'users/login'
import NotFound from 'not_found'

const mountNode = document.getElementById('mount')

render((
  <Router history={browserHistory}>
    <Route path="/signup" component={Signup} />
    <Route path="/login" component={Login} />
    <Route path="/404" component={NotFound}/>
    <Route path="/" component={Layout}>
      <IndexRoute component={Dashboard} />
      <Route path="projects/new" component={NewProject} />
      <Route path="projects/:projectId" component={IterationView} />
      <Route path="projects/:projectId/settings" component={ProjectSettings} />
    </Route>
    <Route path="*" component={NotFound}/>
  </Router>
), mountNode)
