import React from 'react'
import browserHistory from 'react-router/lib/browserHistory'

import ProjectNav from 'projects/nav'
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

  updateStory(id, story) {
    this.props.updateStory(id, story).then(this.closeEditStory.bind(this))
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
    const newStory = Object.assign({}, story, {
      state: this.state.visibleColumns[0],
      project_id: this.props.project.id
    })

    this.props.addStory(newStory).then(this.closeAddStory.bind(this))
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

  iterationRoute(iterationNumber) {
    const currentIteration = this.props.allIterations[0];

    if (iterationNumber === currentIteration.number) {
      return `/${this.props.project.slug}`;
    } else {
      return `/${this.props.project.slug}/iterations/${iterationNumber}`;
    }
  }

  renderProjectNav() {
    return (
      <ProjectNav activeTab="storyboard" project={this.props.project}>
        <select value={this.iterationRoute(this.props.iteration.number)} onChange={this.changeView}>
          {
            this.props.allIterations.map((iteration) => {
              return <option key={iteration.number} value={this.iterationRoute(iteration.number)}>Iteration {iteration.number}</option>
            })
          }
        </select>
      </ProjectNav>
    )
  }

  render() {
    return (
      <div>
        {this.renderProjectNav()}
        <div className="board">
          <div className="board__actions">
            <div className="board__actions__left">
              {this.renderBacklogLink()}
            </div>

            <div className="board__actions__right">
              {this.renderActions()}
            </div>
          </div>
          <div className="board__columns">
            {this.renderColumns()}
          </div>
        </div>
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
      return (
        <StoryModal story={newStory}
                    project={this.props.project}
                    onClose={this.closeAddStory.bind(this)}
                    onSubmit={this.addStory.bind(this)}
                    header="Add"
                    buttonText="Create" />
      )
    }
  }

  renderEditStoryModal() {
    if (this.state.editingStory) {
      return (
        <StoryModal story={this.state.editingStory}
                    project={this.props.project}
                    onClose={this.closeEditStory.bind(this)}
                    onSubmit={this.updateStory.bind(this, this.state.editingStory.id)}
                    onDelete={() => this.deleteStory(this.state.editingStory)}
                    header="Edit"
                    buttonText="Update" />
      )
    }
  }

  renderColumns() {
    const count = this.state.visibleColumns.length;

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
    const currentIteration = this.props.allIterations[0]

    if (this.props.iteration.state === 'completed' && this.props.iteration.id === currentIteration.id) {
      return (
        <button className="button primary"
                onClick={this.props.newIteration}>
          Start new iteration
        </button>
      )
    } else if (this.props.iteration.state === 'planning') {
      return (
        <div>
          <button className="button primary" onClick={this.openAddStory.bind(this)}>
            <i className="right-padded-icon ion-plus"></i> Add story
          </button>
          <button className="button primary" onClick={this.props.startIteration}>
            Start iteration
          </button>
        </div>
      )
    } else if (this.props.iteration.state === 'working') {
      return (
        <div>
          <button className="button primary" onClick={this.openAddStory.bind(this)}>
            <i className="right-padded-icon ion-plus"></i> Add story
          </button>
          <button className="button primary" onClick={this.props.completeIteration}>
            Complete iteration
          </button>
        </div>
      )
    }

    return false
  }
}
