import React from 'react'
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
      connectionAlive: () => { this.setState({online: true}) },
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

  loadIteration(projectId, iterationId) {
    iterations.get(projectId, iterationId).then((res) => {
      this.setState({
        iteration: res.iteration,
        allIterations: res.all_iterations,
        stories: res.stories
      })
    })
  }

  addStory(story) {
    return socket.addStory(story).then(this.doAddStory.bind(this))
  }

  doAddStory(story) {
    const updated = storyCollection.addStory(this.state.stories, story)
    this.setState({stories: updated})
  }

  updateStory(id, story) {
    return socket.updateStory(id, story).then(this.doUpdateStory.bind(this))
  }

  doUpdateStory(event) {
    const updated = storyCollection.updateStory(this.state.stories, event)
    this.setState({stories: updated})
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

  deleteStory(story) {
    socket.deleteStory(story.id).then(this.doDeleteStory.bind(this))
  }

  doDeleteStory(deleteEvent) {
    const updated = storyCollection.deleteStory(this.state.stories, deleteEvent)

    this.setState({stories: updated})
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
    const currentIteration = this.state.allIterations[0];

    if (iterationNumber === currentIteration.number) {
      return `/${this.props.project.slug}`;
    } else {
      return `/${this.props.project.slug}/iterations/${iterationNumber}`;
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

  render() {
    return (
      <div>
        {this.renderProjectNav()}
        {this.renderStoryBoard()}
      </div>
    )
  }
}

export default IterationView
