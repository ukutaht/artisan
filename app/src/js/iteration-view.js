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
    const {project, location, routeParams} = newProps
    if (location.state && location.state.selectedStory !== undefined) {
      this.setState({selectedStory: location.state.selectedStory})
    } else {
      this.loadIteration(project.id, routeParams.iterationNumber || 'current')
    }
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

    return socket.addStory(newStory).then(this.doAddStory.bind(this)).then(this.selectStory.bind(this, null))
  }

  doAddStory(story) {
    this.setState({stories: storyCollection.addStory(this.state.stories, story)})
  }

  updateStory(id, story) {
    return socket.updateStory(id, story).then(this.doUpdateStory.bind(this)).then(this.selectStory.bind(this, null))
  }

  doUpdateStory(story) {
    this.setState({stories: storyCollection.updateStory(this.state.stories, story)})
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
    this.setState({stories: storyCollection.moveStory(this.state.stories, moveEvent)})
  }

  deleteStory(storyId) {
    socket.deleteStory(storyId).then(this.doDeleteStory.bind(this)).then(this.selectStory.bind(this, null))
  }

  doDeleteStory(deleteEvent) {
    this.setState({stories: storyCollection.deleteStory(this.state.stories, deleteEvent)})
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

  changeView(e) { browserHistory.push(e.target.value) }

  iterationRoute(iterationNumber) {
    const currentIteration = this.state.allIterations[this.state.allIterations.length - 1];

    if (iterationNumber === currentIteration.number) {
      return `/${this.props.project.slug}`;
    } else {
      return `/${this.props.project.slug}/iterations/${iterationNumber}`;
    }
  }

  selectStory(story) {
    if (!story) {
      browserHistory.push({pathname: this.iterationRoute(this.state.iteration.number), state: {selectedStory: story}})
    } else if (story.id) {
      browserHistory.push({pathname: `/${this.props.project.slug}/stories/${story.id}`, state: {selectedStory: story}})
    } else {
      browserHistory.push({pathname: `/${this.props.project.slug}/stories/new`, state: {selectedStory: story}})
    }
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
