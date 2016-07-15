import React from 'react'
import update from 'react/lib/update'

import pert from 'stories/pert'

const largestAllowedEstimate = 9999999999999999999
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
    super(props);
    this.state = {
      name: props.story.name,
      number: props.story.number,
      acceptance_criteria: props.story.acceptance_criteria,
      estimate: props.story.estimate,
      optimistic: props.story.optimistic,
      realistic: props.story.realistic,
      pessimistic: props.story.pessimistic,
      tags: props.story.tags.join(',')
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
    const formStory = update(this.state, {tags: {$set: splitTags(this.state.tags)}})
    const story = update(this.props.story, {$merge: formStory})
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
      const estimateData = update(this.state, {[type]: {$set: newEstimate}})

      this.setState({
        [type]: newEstimate,
        estimate: pert(estimateData)
      })
    }.bind(this)
  }

  displayEstimate(estimate) {
    return this.state[estimate] == null ? '' : this.state[estimate].toFixed()
  }

  bottomSection() {
    let {story} = this.props;

    if (story.id) {
      return (
        <div>
          <span>Created by {story.creator.name} on 2 Jan 2015</span>
          <a href="javascript://" className="pull-right clickable" onClick={this.props.onDelete}>Delete story</a>
        </div>
      )
    }
  }

  render() {
    return (
        <div className="modal-container">
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
                  {this.bottomSection()}
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

                  <section className="form-group">
                    <label>Assigned user</label>
                    <select className="assigned-user__select">
                      <option>Uku Taht</option>
                      <option>Felipe Sere</option>
                      <option>Makis Otman</option>
                      <option>Iris Varsi</option>
                    </select>
                  </section>

                  <section className="form-group">
                    <label>Tags</label>
                    <input type="text" placeholder="Comma-separated" value={this.state.tags} onChange={this.tagsChanged.bind(this)}/>
                  </section>

                  <button className="button primary save-story-button">{this.props.buttonText}</button>
                </div>
              </form>
            </div>
          </div>
        </div>

    )
  }
}

export default StoryModal
