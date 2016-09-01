import React from 'react'
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup'
import browserHistory from 'react-router/lib/browserHistory'

import ProjectNav from 'projects/nav'
import StoryBoard from 'storyboard'
import ProjectSocket from 'projects/socket'
import * as iterations from 'iterations/service'
import * as storyCollection from 'stories/collection'

let socket = null;

const newStory = {
  name: '',
  acceptance_criteria: '',
  estimate: null,
  optimistic: null,
  realistic: null,
  pessimistic: null,
  tags: [],
}

export default class IterationView extends React.Component {
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

  componentWillMount() {
    const {project, routeParams} = this.props
    document.title = project.name

    if (routeParams.storyNumber === 'new') {
      this.loadIteration(project.id, 'current')
      this.setState({selectedStory: newStory})
    } else if (routeParams.storyNumber) {
      this.loadIterationByStory(project.id, routeParams.storyNumber)
    } else if (routeParams.iterationNumber) {
      this.loadIteration(project.id, routeParams.iterationNumber)
    } else {
      this.loadIteration(project.id, 'current')
    }

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

    if (routeParams.storyNumber === 'new') {
      this.setState({selectedStory: newStory})
    } else if (location.state && location.state.selectedStory !== undefined) {
      this.setState({selectedStory: location.state.selectedStory})
    } else if (routeParams.iterationNumber) {
      this.setState({selectedStory: null})
      this.loadIterationIfNeeded(project.id, routeParams.iterationNumber)
    } else {
      this.setState({selectedStory: null})
      this.loadIterationIfNeeded(project.id, 'current')
    }
  }

  connectionAlive() {
    if (this.state.online) return;
    const {project, routeParams} = this.props

    this.loadIteration(project.id, routeParams.iterationNumber || 'current')
      .then(() => this.setState({online: true}))
  }

  loadIterationIfNeeded(projectId, iterationNumber) {
    const currentIteration = this.state.allIterations[this.state.allIterations.length - 1];

    if (iterationNumber === 'current' && currentIteration.number !== this.state.iteration.number) {
      this.loadIteration(projectId, iterationNumber)
    } else if (iterationNumber !== 'current' && this.state.iteration.number !== parseInt(iterationNumber)) {
      this.loadIteration(projectId, iterationNumber)
    }
  }

  loadIteration(projectId, iterationNumber) {
    return iterations.get(projectId, iterationNumber).then((res) => {
      this.setState({
        iteration: res.iteration,
        allIterations: res.all_iterations,
        stories: res.stories
      })
    })
  }

  loadIterationByStory(projectId, storyNumber) {
    return iterations.getByStory(projectId, storyNumber).then((res) => {
      this.setState({
        iteration: res.iteration,
        allIterations: res.all_iterations,
        stories: res.stories,
        selectedStory: res.story
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
      this.setState({iteration: updated})
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
      browserHistory.push({pathname: `/${this.props.project.slug}/stories/${story.number}`, state: {selectedStory: story}})
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
