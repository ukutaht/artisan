import React from 'react'
import update from 'react/lib/update'

import StoryService from './stories/service'
import IterationService from './iterations/service'
import StoryBoard from './storyboard'
import BoardSocket from './board-socket'

const stories = new StoryService()
const iterations = new IterationService()

class IterationView extends React.Component {
  constructor(props) {
    super(props)
    this.projectId = this.props.routeParams.projectId
    this.state = {
      iteration: null,
      allIterations: null,
      stories: null
    }
  }

  componentDidMount() {
    iterations.current(this.projectId, (res) => {
      this.setState({
        iteration: res.iteration,
        allIterations: res.all_iterations,
        stories: res.stories
      })
    })

    let boardSocket = new BoardSocket(this.projectId)
    boardSocket.join({
      onAddStory: this.doAddStory.bind(this),
      onUpdateStory: this.doUpdateStory.bind(this),
      onMoveStory: this.doMoveStory.bind(this),
    })
  }

  addStory(story) {
    let storyWithData = update(story, {project_id: {$set: this.projectId}})

    stories.add(this.projectId, storyWithData, this.doAddStory.bind(this))
  }

  doAddStory(story) {
    this.setState(
      update(this.state, {stories: {[story.state]: {$unshift: [story]}}})
    )
  }

  updateStory(story) {
    stories.update(story, this.doUpdateStory.bind(this))
  }

  doUpdateStory(story) {
    this.setState(
      update(this.state, {stories: {[story.state]: {$apply: (column) => {
        let index = column.findIndex((existing) => existing.number == story.number)
        return update(column, {[index]: {$set: story}})
      }}}})
    )
  }

  moveStory(storyId, toColumn, toIndex, done) {
    stories.move(storyId, toColumn, toIndex, (updated) => {
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
    stories.del(story.id, () => {
      let updated = update(this.state, {stories: {[story.state]: {$apply: (column) => {
        return column.filter((existing) => existing.id !== story.id);
      }}}})

      this.setState(updated)
    })
  }

  newIteration() {
    iterations.create(this.projectId, (res) => {
      this.setState({
        iteration: res.iteration,
        stories: res.stories
      })
    })
  }

  startIteration() {
    iterations.start(this.state.iteration.id, (updated) => {
      this.setState({
        iteration: updated,
      })
    })
  }

  completeIteration() {
    iterations.complete(this.state.iteration.id, (res) => {
      this.setState({
        iteration: res.iteration,
        stories: res.stories
      })
    })
  }

  changeIteration(number) {
    iterations.get(this.projectId, number, (res) => {
      this.setState({
        iteration: res.iteration,
        allIterations: res.all_iterations,
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
        changeIteration={this.changeIteration.bind(this)}
        moveStory={this.moveStory.bind(this)}
        updateStory={this.updateStory.bind(this)}
        deleteStory={this.deleteStory.bind(this)}
        addStory={this.addStory.bind(this)}
        newIteration={this.newIteration.bind(this)}
        startIteration={this.startIteration.bind(this)}
        completeIteration={this.completeIteration.bind(this)}
        projectId={this.projectId}
      />
    )
  }
}

export default IterationView
