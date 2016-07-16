import React from 'react'
import update from 'react/lib/update'
import browserHistory from 'react-router/lib/browserHistory'

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

class StoryBoard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visibleColumns: iterationColumns[props.iteration.state],
      addingStory: false,
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

  updateStory(story) {
    this.props.updateStory(story)
    this.closeEditStory()
  }

  deleteStory(storyId) {
    this.props.deleteStory(storyId)
    this.closeEditStory()
  }

  openAddStory() {
    this.setState({addingStory: true})
  }

  closeAddStory() {
    this.setState({addingStory: false})
  }

  addStory(story) {
    this.props.addStory(story)
    this.closeAddStory()
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

  changeView(e) {
    browserHistory.push(e.target.value)
  }

  render() {
    return (
      <div className="board">
        <nav className="board__nav">
          <ul className="board__nav__breadcrumb">
            <li>
              <span>Faros</span>
            </li>

            <li>
              <select value={this.props.iteration.number} onChange={(e) => this.props.changeIteration(e.target.value)}>
                {
                  this.props.allIterations.map((iteration) => {
                    return <option key={iteration.number} value={iteration.number}>Iteration {iteration.number}</option>
                  })
                }
              </select>
            </li>
          </ul>

          <select className="board__nav__dropdown" onChange={this.changeView.bind(this)}>
            <option>Go to...</option>
            <option value={`/projects/${this.props.projectId}`}>Story board</option>
            <option value={`/projects/${this.props.projectId}/settings`}>Settings</option>
          </select>
        </nav>

        <div className="board__actions">
          <div className="board__actions__left">
            {this.renderBacklogLink()}
          </div>

          <div className="board__actions__right">
            {this.renderActions()}
          </div>
        </div>

        {this.renderColumns()}
        {this.renderAddStoryModal()}
        {this.renderEditStoryModal()}
      </div>
    )
  }

  renderBacklogLink() {
    if (!this.canToggleBacklog()) return null

    if (this.isBacklogVisible()) {
      return (
        <a href="javascript://" onClick={this.hideBacklog.bind(this)}>
          Hide Backlog
          <i className="left-padded-icon ion-chevron-right"></i>
        </a>
      )
    } else {
      return (
        <a href="javascript://" onClick={this.showBacklog.bind(this)}>
          <i className="right-padded-icon ion-chevron-left"></i>
          Show Backlog
        </a>
      )
    }
  }

  renderAddStoryModal() {
    if (this.state.addingStory) {
      const story = Object.assign({}, newStory, {
        state: this.state.visibleColumns[0],
        project_id: this.props.projectId,
      })

      return (
        <StoryModal story={story}
                    onClose={this.closeAddStory.bind(this)}
                    onSubmit={this.addStory.bind(this)}
                    header="Add story"
                    buttonText="Create" />
      )
    }
  }

  renderEditStoryModal() {
    if (this.state.editingStory) {
      return (
        <StoryModal story={this.state.editingStory}
                    onClose={this.closeEditStory.bind(this)}
                    onSubmit={this.updateStory.bind(this)}
                    onDelete={() => this.deleteStory(this.state.editingStory)}
                    header="Edit story"
                    buttonText="Update" />
      )
    }
  }

  renderColumns() {
    const count = this.state.visibleColumns.length

    return this.state.visibleColumns.map((column) => {
      return <Column stories={this.props.stories[column]}
              key={column}
              count={count}
              name={column}
              onStoryClick={this.openEditStory.bind(this)}
              onDrag={this.props.moveStory}
              />
    })
  }

  renderActions() {
    if (this.props.iteration.state === 'completed') {
      return (
        <button className="button primary"
                onClick={this.props.newIteration}>
          Start new iteration
        </button>
      )
    } else if (this.props.iteration.state === 'planning') {
      return (
        <div>
          <button className="button primary" onClick={this.props.startIteration}>
            Start iteration
          </button>
          <button className="button primary" onClick={this.openAddStory.bind(this)}>
            <i className="right-padded-icon ion-plus"></i> Add story
          </button>
        </div>
      )
    } else {
      return (
        <div>
          <button className="button primary" onClick={this.props.completeIteration}>
            Complete iteration
          </button>
          <button className="button primary" onClick={this.openAddStory.bind(this)}>
            <i className="right-padded-icon ion-plus"></i> Add story
          </button>
        </div>
      )
    }
  }

}

export default StoryBoard
