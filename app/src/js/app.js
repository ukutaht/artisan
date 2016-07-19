import React from 'react'
import { render } from 'react-dom'
import IndexRoute from 'react-router/lib/IndexRoute'
import Router from 'react-router/lib/Router'
import Route from 'react-router/lib/Route'
import browserHistory from 'react-router/lib/browserHistory'

import Layout from 'layout'
import Dashboard from 'dashboard'
import NewProject from 'projects/new'
import ProjectContainer from 'projects/container'
import ProjectSettings from 'projects/settings'
import ProjectSettingsTab from 'projects/settings-tab'
import ProjectCollaboratorsTab from 'projects/collaborators-tab'
import IterationView from 'iteration-view'
import Profile from 'users/profile'
import Signup from 'users/signup'
import Login from 'users/login'
import NotFound from 'not_found'

const router = (
  <Router history={browserHistory}>
    <Route path="/signup" component={Signup} />
    <Route path="/login" component={Login} />
    <Route path="/404" component={NotFound}/>
    <Route path="/" component={Layout}>
      <IndexRoute component={Dashboard} />
      <Route path="profile" component={Profile} />
      <Route path="projects/new" component={NewProject} />
      <Route path="projects/:projectId" component={ProjectContainer}>
        <Route path="iterations/:iterationNumber" component={IterationView} />
        <Route path="settings" component={ProjectSettings}>
          <IndexRoute component={ProjectSettingsTab} />
          <Route path="collaborators" component={ProjectCollaboratorsTab} />
        </Route>
      </Route>
    </Route>
    <Route path="*" component={NotFound}/>
  </Router>
)

const mountNode = document.getElementById('mount')
if (mountNode) {
  render(router, mountNode)
}
