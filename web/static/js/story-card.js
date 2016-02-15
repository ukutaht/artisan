import React from 'react'
import Link from 'react-router/lib/Link'
import StoryModal from './story-modal'

class StoryCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showModal: false}
  }

  showModal() {
    this.setState({showModal: true})
  }

  hideModal() {
    this.setState({showModal: false})
  }

  updateStory(story) {
    this.props.onUpdate(story)
    this.hideModal()
  }

  render() {
    return (
      <div>
        <li className="stories-list__item">
          <div>
            <a href="javascript://" title={this.props.story.name} className="truncated-text" onClick={this.showModal.bind(this)}>
              #{this.props.story.number} {this.props.story.name}
            </a>
            <span className="stories-list__item__estimate">
              <i className="ion-connection-bars right-padded-icon"></i>{this.props.story.estimate}
            </span>
          </div>
          <div className="stories-list__item__assignee-line">
            <i className="ion-person"></i>
          </div>
        </li>
      <StoryModal visible={this.state.showModal} story={this.props.story} onClose={this.hideModal.bind(this)} onSubmit={this.updateStory.bind(this)}/>
      </div>
    )
  }
}

export default StoryCard
