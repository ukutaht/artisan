import React from 'react'
import update from 'react/lib/update'
import browserHistory from 'react-router/lib/browserHistory'

import StoryBoard from 'storyboard'
import BoardSocket from 'board-socket'
import * as iterations from 'iterations/service'
import * as stories from 'stories/service'

class IterationView extends React.Component {
  constructor(props) {
    super(props)
    this.projectId = props.project.id
    this.state = {
      iteration: null,
      allIterations: null,
      stories: null
    }
  }

  componentDidMount() {
    this.loadIteration(this.props.project.id, this.props.routeParams.iterationNumber || 'current')
    document.title = `${this.props.project.name}`

    this.boardSocket = new BoardSocket(this.props.project.id)
    this.boardSocket.join({
      onAddStory: this.doAddStory.bind(this),
      onUpdateStory: this.doUpdateStory.bind(this),
      onMoveStory: this.doMoveStory.bind(this),
    })
  }

  componentWillUnmount() {
    this.boardSocket.leave()
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
    return stories.add(story).then(this.doAddStory.bind(this))
  }

  doAddStory(story) {
    this.setState(
      update(this.state, {stories: {[story.state]: {$unshift: [story]}}})
    )
  }

  updateStory(story) {
    return stories.update(story).then(this.doUpdateStory.bind(this))
  }

  doUpdateStory(story) {
    this.setState(
      update(this.state, {stories: {[story.state]: {$apply: (column) => {
        const index = column.findIndex((existing) => existing.id === story.id)
        return update(column, {[index]: {$set: story}})
      }}}})
    )
  }

  moveStory(storyId, toColumn, toIndex, done) {
    stories.move(storyId, toColumn, toIndex).then((updated) => {
      done()
      this.doMoveStory(updated)
    })
  }

  doMoveStory(updatedStories) {
    this.setState(
      update(this.state, {stories: {$merge: updatedStories}})
    )
  }

  deleteStory(story) {
    stories.del(story.id).then(() => {
      const updated = update(this.state, {stories: {[story.state]: {$apply: (column) => {
        return column.filter((existing) => existing.id !== story.id);
      }}}})

      this.setState(updated)
    })
  }

  newIteration() {
    iterations.create(this.projectId).then(() => {
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

  render() {
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
      />
    )
  }
}

export default IterationView
