import React from 'react'
import fecha from 'fecha'

import pert from 'stories/pert'

const largestAllowedEstimate = 1000
const ESCAPE = 27

function isDigit(val) {
  return /^[0-9]+$/.test(val)
}

function splitTags(tags) {
  return tags.split(',')
    .map((tag) => tag.replace(/^\s+|\s+$/g, ''))
    .filter((tag) => tag !== '')
}

class StoryModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: props.story.name,
      state: props.story.state,
      acceptance_criteria: props.story.acceptance_criteria,
      estimate: props.story.estimate,
      optimistic: props.story.optimistic,
      realistic: props.story.realistic,
      pessimistic: props.story.pessimistic,
      tags: props.story.tags.join(','),
      assignee_id: props.story.assignee ? props.story.assignee.id : null
    }
  }

  componentDidMount() {
    this.listenForEscape()
  }

  componentWillUnmount() {
    this.stopListeningForEscape()
  }

  listenForEscape() {
    document.onkeydown = function(evt) {
      evt = evt || window.event;
      if (evt.keyCode === ESCAPE) {
        this.props.onClose()
      }
    }.bind(this)
  }

  stopListeningForEscape() {
    document.onkeydown = null
  }

  handleSubmit(e) {
    e.preventDefault()
    const story = Object.assign({}, this.state, {
      id: this.props.story.id,
      project_id: this.props.project.id,
      state: this.props.story.state,
      tags: splitTags(this.state.tags)
    })

    this.props.onSubmit(story)
  }

  nameChanged(e) {
    this.setState({name: e.target.value})
  }

  acceptanceCriteriaChanged(e) {
    this.setState({acceptance_criteria: e.target.value})
  }

  tagsChanged(e) {
    this.setState({tags: e.target.value})
  }

  extractEstimate(e, estimate) {
    if (isDigit(e.target.value)) {
      return Math.min(Number(e.target.value), largestAllowedEstimate)
    } else if (e.target.value === '') {
      return null
    } else {
      return this.state[estimate]
    }
  }

  estimateChanged(type) {
    return function(e) {
      const newEstimate = this.extractEstimate(e, type)
      const estimateData = Object.assign({}, this.state, {[type]: newEstimate})

      this.setState({
        [type]: newEstimate,
        estimate: pert(estimateData)
      })
    }.bind(this)
  }

  displayEstimate(estimate) {
    if (this.state[estimate] === null) return ''
    return this.state[estimate].toString()
  }

  bottomSection() {
    const {story} = this.props;

    if (story.id) {
      const date = new Date(story.created_at)
      const formattedDate = fecha.format(date, 'mediumDate')
      return (
        <div>
          <span>Created by {story.creator.name} on {formattedDate}</span>
          <a className="pull-right clickable text-red" onClick={this.props.onDelete}>Delete</a>
        </div>
      )
    }
  }

  assigneeChanged(e) {
    this.setState({assignee_id: Number(e.target.value) || null})
  }

  renderAssigneeSelect() {
    const options = this.props.project.collaborators.map((user) => {
      return <option key={user.id} value={user.id}>{user.name}</option>
    })
    options.unshift(
      <option key="unassigned">Unassigned</option>
    )

    const value = this.state.assignee_id || ''

    return (
      <section className="form-group">
        <label>Assigned user</label>
        <select onChange={this.assigneeChanged.bind(this)} value={value} className="assigned-user__select">
          {options}
        </select>
      </section>
    )
  }

  onContainerClick(e) {
    if (e.target === this.refs.container) {
      this.props.onClose()
    }
  }

  render() {
    return (
      <div className="modal-container" ref="container" onClick={this.onContainerClick.bind(this)}>
          <div className="modal">
            <header className="modal__header">
              <h3>{this.props.header}</h3>
              <i className="ion-android-close modal__close" onClick={this.props.onClose}></i>
            </header>
            <div className="modal__body row">
              <form onSubmit={this.handleSubmit.bind(this)}>
                <div className="eight-columns">
                  <section className="form-group">
                    <label>Name</label>
                    <input autoFocus="true" type="text" value={this.state.name} onChange={this.nameChanged.bind(this)}/>
                  </section>

                  <label>Acceptance criteria</label>
                  <textarea rows="15" value={this.state.acceptance_criteria} onChange={this.acceptanceCriteriaChanged.bind(this)}></textarea>
                </div>
                <div className="four-columns story-right">
                  <div className="estimate-form">
                    <section className="estimate-form__group">
                      <label className="estimate-form__left">Optimistic:</label>
                      <input type="text" className="estimate-form__right" value={this.displayEstimate('optimistic')} onChange={this.estimateChanged('optimistic')} />
                    </section>
                    <section className="estimate-form__group">
                      <label className="estimate-form__left">Realistic:</label>
                      <input type="text" className="estimate-form__right" value={this.displayEstimate('realistic')} onChange={this.estimateChanged('realistic')} />
                    </section>
                    <section className="estimate-form__group">
                      <label className="estimate-form__left">Pessimistic:</label>
                      <input type="text" className="estimate-form__right" value={this.displayEstimate('pessimistic')} onChange={this.estimateChanged('pessimistic')}/>
                    </section>
                    <section className="estimate-form__total">
                      <label className="estimate-form__left">Estimate:</label>
                      <span className="estimate-form__right">{this.state.estimate}</span>
                    </section>
                  </div>

                  {this.renderAssigneeSelect()}

                  <section className="form-group">
                    <label>Tags</label>
                    <input type="text" placeholder="Comma-separated" value={this.state.tags} onChange={this.tagsChanged.bind(this)}/>
                  </section>

                  <button className="button primary save-story-button">{this.props.buttonText}</button>
                </div>
              </form>
            </div>
            <div className="modal__footer row">
              <div className="eight-columns">
                {this.bottomSection()}
              </div>
            </div>
          </div>
        </div>

    )
  }
}

export default StoryModal
