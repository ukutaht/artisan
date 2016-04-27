import React from 'react'

import StoryService from './story-service'
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
        iteration: res.get('iteration'),
        allIterations: res.get('all_iterations'),
        stories: res.get('stories')
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
    let storyWithData = story.merge({
      project_id: this.projectId
    })

    stories.add(this.projectId, storyWithData, this.doAddStory.bind(this))
  }

  doAddStory(story) {
    let updatedStories = this.state.stories.update(story.state, (column) => {
      return column.unshift(story)
    })

    this.setState({stories: updatedStories})
  }

  updateStory(story) {
    stories.update(story, this.doUpdateStory.bind(this))
  }

  doUpdateStory(story) {
    let updatedStories = this.state.stories.update(story.state, (column) => {
      let index = column.findIndex((existing) => existing.number == story.number)
      return column.update(index, (existing) => existing.merge(story))
    })

    this.setState({stories: updatedStories})
  }

  moveStory(storyId, toColumn, toIndex, done) {
    stories.move(storyId, toColumn, toIndex, (updated) => {
      done()
      this.doMoveStory(updated)
    })
  }

  doMoveStory(updatedStories) {
    this.setState({
      stories: this.state.stories.merge(updatedStories)
    })
  }

  newIteration() {
    iterations.create(this.projectId, (res) => {
      this.setState({
        iteration: res.get('iteration'),
        stories: res.get('stories')
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
        iteration: res.get('iteration'),
        stories: res.get('stories')
      })
    })
  }

  changeIteration(number) {
    iterations.get(this.projectId, number, (res) => {
      this.setState({
        iteration: res.get('iteration'),
        allIterations: res.get('all_iterations'),
        stories: res.get('stories')
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
        addStory={this.addStory.bind(this)}
        newIteration={this.newIteration.bind(this)}
        startIteration={this.startIteration.bind(this)}
        completeIteration={this.completeIteration.bind(this)}
      />
    )
  }
}

export default IterationView
