import React from 'react'
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup'
import browserHistory from 'react-router/lib/browserHistory'

import ProjectNav from 'projects/nav'
import StoryBoard from 'storyboard'
import ProjectSocket from 'projects/socket'
import * as iterations from 'iterations/service'
import * as storyCollection from 'stories/collection'

let socket = null;

class IterationView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      iteration: null,
      allIterations: null,
      stories: null,
      online: true,
      selectedStory: null,
    }
  }

  componentDidMount() {
    this.loadIteration(this.props.project.id, this.props.routeParams.iterationNumber || 'current')
    document.title = `${this.props.project.name}`

    socket = new ProjectSocket(this.props.project.id, {
      onAddStory: this.doAddStory.bind(this),
      onUpdateStory: this.doUpdateStory.bind(this),
      onMoveStory: this.doMoveStory.bind(this),
      onDeleteStory: this.doDeleteStory.bind(this),
      connectionDropped: () => { this.setState({online: false}) },
      connectionAlive: this.connectionAlive.bind(this),
    })

    socket.join()
  }

  componentWillUnmount() {
    socket.leave()
    socket = null;
  }

  componentWillReceiveProps(newProps) {
    this.loadIteration(newProps.project.id, newProps.routeParams.iterationNumber || 'current')
  }

  connectionAlive() {
    if (this.state.online) return;
    const {project, routeParams} = this.props

    this.loadIteration(project.id, routeParams.iterationNumber || 'current')
      .then(() => this.setState({online: true}))
  }

  loadIteration(projectId, iterationId) {
    return iterations.get(projectId, iterationId).then((res) => {
      this.setState({
        iteration: res.iteration,
        allIterations: res.all_iterations,
        stories: res.stories
      })
    })
  }

  addStory(state, story) {
    const newStory = Object.assign({}, story, {
      state: state,
      project_id: this.props.project.id
    })

    return socket.addStory(newStory).then((created) => this.doAddStory(created, {selectedStory: null}))
  }

  doAddStory(story, overrides = {}) {
    const updatedStories = storyCollection.addStory(this.state.stories, story)
    this.setState(Object.assign({stories: updatedStories}, overrides))
  }

  updateStory(id, story) {
    return socket.updateStory(id, story).then((updated) => this.doUpdateStory(updated, {selectedStory: null}))
  }

  doUpdateStory(story, overrides = {}) {
    const updated = storyCollection.updateStory(this.state.stories, story)
    this.setState(Object.assign({stories: updated}, overrides))
  }

  moveStory(storyId, toColumn, toIndex, dragDone, dragAbort) {
    socket.moveStory(storyId, toColumn, toIndex).then((updated) => {
      dragDone()
      this.doMoveStory(updated)
    }).catch(() => {
      dragAbort()
    })
  }

  doMoveStory(moveEvent) {
    const updated = storyCollection.moveStory(this.state.stories, moveEvent)
    this.setState({stories: updated})
  }

  deleteStory(storyId) {
    socket.deleteStory(storyId).then((deleted) => this.doDeleteStory(deleted, {selectedStory: null}))
  }

  doDeleteStory(deleteEvent, overrides = {}) {
    const updated = storyCollection.deleteStory(this.state.stories, deleteEvent)

    this.setState(Object.assign({stories: updated}, overrides))
  }

  newIteration() {
    iterations.create(this.props.project.id).then(() => {
      browserHistory.push(`/${this.props.project.slug}`)
    })
  }

  startIteration() {
    iterations.start(this.state.iteration.id).then((updated) => {
      this.setState({
        iteration: updated,
      })
    })
  }

  completeIteration() {
    iterations.complete(this.state.iteration.id).then((res) => {
      this.setState({
        iteration: res.iteration,
        stories: res.stories
      })
    })
  }

  changeView(e) {
    browserHistory.push(e.target.value)
  }

  iterationRoute(iterationNumber) {
    const currentIteration = this.state.allIterations[this.state.allIterations.length - 1];

    if (iterationNumber === currentIteration.number) {
      return `/${this.props.project.slug}`;
    } else {
      return `/${this.props.project.slug}/iterations/${iterationNumber}`;
    }
  }

  selectStory(story) {
    this.setState({selectedStory: story})
  }

  renderBreadCrumb() {
    if (!this.state.iteration || !this.state.allIterations) return null

    return (
      <select value={this.iterationRoute(this.state.iteration.number)} onChange={this.changeView}>
        {
          this.state.allIterations.map((iteration) => {
            return <option key={iteration.number} value={this.iterationRoute(iteration.number)}>Iteration {iteration.number}</option>
          })
        }
      </select>
    )
  }

  renderProjectNav() {
    return (
      <ProjectNav activeTab="storyboard" project={this.props.project}>
        {this.renderBreadCrumb()}
      </ProjectNav>
    )
  }

  renderStoryBoard() {
    if (!this.state.stories) return null

    return (
      <StoryBoard
        stories={this.state.stories}
        selectedStory={this.state.selectedStory}
        selectStory={this.selectStory.bind(this)}
        iteration={this.state.iteration}
        allIterations={this.state.allIterations}
        moveStory={this.moveStory.bind(this)}
        updateStory={this.updateStory.bind(this)}
        deleteStory={this.deleteStory.bind(this)}
        addStory={this.addStory.bind(this)}
        newIteration={this.newIteration.bind(this)}
        startIteration={this.startIteration.bind(this)}
        completeIteration={this.completeIteration.bind(this)}
        project={this.props.project}
        online={this.state.online}
      />
    )
  }

  renderOfflineAlert() {
    if (!this.state.online) {
      return (
        <div className="offline-alert">
          <strong>Unable to reach the server, please check your connection</strong>
        </div>

      )
    }
  }

  render() {
    return (
      <div>
        <ReactCSSTransitionGroup transitionName="offline-alert" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
          {this.renderOfflineAlert()}
        </ReactCSSTransitionGroup>
        {this.renderProjectNav()}
        {this.renderStoryBoard()}
      </div>
    )
  }
}

export default IterationView
