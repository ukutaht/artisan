import React from 'react'
import Immutable from 'immutable'

import Pert from './pert'

const largestAllowedEstimate = 9999999999999999999

function isDigit(val) {
  return /^[0-9]+$/.test(val)
}

function joinTags(tags) {
  return Immutable.List(tags).join(",")
}

function splitTags(tags) {
  return Immutable.List(tags.split(","))
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
      tags: joinTags(props.story.tags)
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
      if (evt.keyCode == 27) {
          this.props.onClose()
      }
    }.bind(this)
  }

  stopListeningForEscape() {
    document.onkeydown = null
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.onSubmit(this.props.story.merge(this.state, {tags: splitTags(this.state.tags)}))
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
    } else if (e.target.value === "") {
      return null
    } else {
      return this.state[estimate]
    }
  }

  estimateChanged(type) {
    return function(e) {
      let newEstimate = this.extractEstimate(e, type)
      let estimateData = Immutable.Map(this.state).set(type, newEstimate)

      this.setState({
        [type]: newEstimate,
        estimate: Pert.estimate(estimateData.toJS())
      })
    }.bind(this)
  }

  displayEstimate(estimate) {
    return this.state[estimate] == null ? "" : this.state[estimate].toFixed()
  }

  render() {
    return (
        <div className="modal-container">
          <div className="modal">
            <header className="modal__header">
              <h4>{this.props.header}</h4>
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
                  <span>Created by Uku Taht on 2 Jan 2015</span>
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
