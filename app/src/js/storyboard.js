import React from 'react'
import Immutable from 'immutable'

import Column from './column'
import StoryModal from './stories/modal'
import Story from './stories/story'

const allColumns = Immutable.List(["backlog", "ready", "working", "completed"])

const iterationColumns = Immutable.fromJS({
  planning: ["backlog", "ready"],
  working: ["ready", "working", "completed"],
  completed: ["completed"]
})

const canToggleBacklog = Immutable.fromJS({
  planning: false,
  working: true,
  completed: false
})

class StoryBoard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visibleColumns: iterationColumns.get(props.iteration.state),
      addingStory: false,
      editingStory: null
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.iteration.state != this.props.iteration.state)
    this.setState({
      visibleColumns: iterationColumns.get(nextProps.iteration.state)
    })
  }

  openEditStory(story) {
    this.setState({editingStory: story})
  }

  closeEditStory() {
    this.setState({editingStory: null})
  }

  updateStory(story) {
    this.props.updateStory(story)
    this.setState({editingStory: null})
  }

  openAddStory() {
    this.setState({addingStory: true})
  }

  closeAddStory() {
    this.setState({addingStory: false})
  }

  addStory(story) {
    this.props.addStory(story)
    this.setState({addingStory: false})
  }

  isBacklogVisible() {
    return this.state.visibleColumns.first() === "backlog";
  }

  showBacklog() {
    this.setState({visibleColumns: this.state.visibleColumns.unshift("backlog")});
  }

  hideBacklog() {
    this.setState({visibleColumns: this.state.visibleColumns.shift()});
  }

  canToggleBacklog() {
    return canToggleBacklog.get(this.props.iteration.state)
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
              <select value={this.props.iteration.number} onChange={ (e) => this.props.changeIteration(e.target.value)}>
                {
                  this.props.allIterations.map((iteration) => {
                    return <option key={iteration.number} value={iteration.number}>Iteration {iteration.number}</option>
                  })
                }
              </select>
            </li>
          </ul>

          <select className="board__nav__dropdown">
            <option>Go to...</option>
            <option>Story board</option>
            <option>Full backlog</option>
          </select>
        </nav>

        <div className="board__actions">
          <div className="board__actions__left">
            { this.renderBacklogLink() }
          </div>

          <div className="board__actions__right">
            { this.renderActions() }
          </div>
        </div>

        { this.renderColumns() }
        { this.renderAddStoryModal() }
        { this.renderEditStoryModal() }
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
        <StoryModal story={new Story({state: this.state.visibleColumns.first()})}
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
                    header="Edit story"
                    buttonText="Update" />
      )
    }
  }

  renderColumns() {
    let count = this.state.visibleColumns.size

    return this.state.visibleColumns.map((column) => {
      return <Column stories={this.props.stories.get(column)}
              key={column}
              count={count}
              name={column}
              onStoryClick={this.openEditStory.bind(this)}
              onDrag={this.props.moveStory}
              />
    })
  }

  renderActions() {
    if (this.props.iteration.state == "completed") {
      return (
        <button className="button primary"
                onClick={this.props.newIteration}>
          Start new iteration
        </button>
      )
    } else if (this.props.iteration.state == "planning") {
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
    }
    else {
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
