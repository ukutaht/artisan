import React from 'react'
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup'

import Column from 'column'
import StoryModal from 'stories/modal'

const iterationColumns = {
  planning: ['backlog', 'ready'],
  working: ['ready', 'working', 'completed'],
  workingWithBacklog: ['backlog', 'ready', 'working', 'completed'],
  completed: ['completed']
}

const canToggleBacklog = {
  planning: false,
  working: true,
  completed: false
}

const newStory = {
  id: null,
  project_id: null,
  name: '',
  acceptance_criteria: '',
  number: null,
  estimate: null,
  optimistic: null,
  realistic: null,
  pessimistic: null,
  state: 'backlog',
  position: 0,
  tags: [],
}

export default class StoryBoard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visibleColumns: iterationColumns[props.iteration.state],
      editingStory: null
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.iteration.state !== this.props.iteration.state) {
      this.setState({
        visibleColumns: iterationColumns[nextProps.iteration.state]
      })
    }
  }

  openEditStory(story) {
    this.setState({editingStory: story})
  }

  closeEditStory() {
    this.setState({editingStory: null})
  }

  updateStory(id, story) {
    this.props.updateStory(id, story).then(this.closeEditStory.bind(this))
  }

  deleteStory(storyId) {
    this.props.deleteStory(storyId)
    this.closeEditStory()
  }

  addStory(story) {
    const newStory = Object.assign({}, story, {
      state: this.state.visibleColumns[0],
      project_id: this.props.project.id
    })

    this.props.addStory(newStory).then(this.closeEditStory.bind(this))
  }

  isBacklogVisible() {
    return this.state.visibleColumns[0] === 'backlog';
  }

  showBacklog() {
    this.setState({visibleColumns: iterationColumns.workingWithBacklog});
  }

  hideBacklog() {
    this.setState({visibleColumns: iterationColumns.working});
  }

  canToggleBacklog() {
    return canToggleBacklog[this.props.iteration.state]
  }

  render() {
    return (
      <div>
        <div className="board">
          <div className="board__actions">
            <div className="board__actions__right">
              {this.renderActions()}
            </div>
          </div>
          {this.renderColumnsWithTransition()}
        </div>
        {this.renderEditStoryModal()}
      </div>
    )
  }

  renderColumnsWithTransition() {
    if (this.canToggleBacklog()) {
      return (
        <ReactCSSTransitionGroup component="div" className="board__columns" transitionName="column" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
          {this.renderColumns()}
        </ReactCSSTransitionGroup>
      )
    } else {
      return (
        <div className="board__columns">
          {this.renderColumns()}
        </div>
      )
    }
  }

  renderBacklogLink(column) {
    if (!this.canToggleBacklog()) return null

    if (this.isBacklogVisible() && column === 'backlog') {
      return (
        <i className="clickable ion-chevron-left" onClick={this.hideBacklog.bind(this)}></i>
      )
    } else if (!this.isBacklogVisible() && column === 'ready') {
      return (
        <i className="clickable ion-chevron-right" onClick={this.showBacklog.bind(this)}></i>
      )
    }

    return null
  }

  renderEditStoryModal() {
    const story = this.state.editingStory
    if (story) {
      return (
        <StoryModal story={story}
                    project={this.props.project}
                    onClose={this.closeEditStory.bind(this)}
                    addStory={this.addStory.bind(this)}
                    updateStory={this.updateStory.bind(this, story.id)}
                    onDelete={this.deleteStory.bind(this, story)}
                    disabled={!this.props.online} />
      )
    }
  }

  renderColumns() {
    const count = this.state.visibleColumns.length;

    return this.state.visibleColumns.map((column) => {
      return (
        <Column stories={this.props.stories[column]}
          key={column}
          count={count}
          name={column}
          onStoryClick={this.openEditStory.bind(this)}
          onDrag={this.props.moveStory}
          online={this.props.online}>
          {this.renderBacklogLink(column)}
        </Column>
      )
    })
  }

  renderActions() {
    const currentIteration = this.props.allIterations[this.props.allIterations.length - 1];

    if (this.props.iteration.state === 'completed' && this.props.iteration.number === currentIteration.number) {
      return (
        <button className="button primary"
                disabled={!this.props.online}
                onClick={this.props.newIteration}>
          Start new iteration
        </button>
      )
    } else if (this.props.iteration.state === 'planning') {
      return (
        <div>
          <button className="button primary" disabled={!this.props.online} onClick={this.openEditStory.bind(this, newStory)}>
            <i className="right-padded-icon ion-plus"></i> Add story
          </button>
          <button className="button primary" disabled={!this.props.online} onClick={this.props.startIteration}>
            Start iteration
          </button>
        </div>
      )
    } else if (this.props.iteration.state === 'working') {
      return (
        <div>
          <button className="button primary" disabled={!this.props.online} onClick={this.openEditStory.bind(this, newStory)}>
            <i className="right-padded-icon ion-plus"></i> Add story
          </button>
          <button className="button primary" disabled={!this.props.online} onClick={this.props.completeIteration}>
            Complete iteration
          </button>
        </div>
      )
    }

    return false
  }
}
