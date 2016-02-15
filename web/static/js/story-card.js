import React from 'react'
import { Link } from 'react-router'
import StoryModal from './story-modal'

class StoryCard extends React.Component {
  constructor(props) {
    super(props);
    this.story = props.story
    this.state = {showModal: false}
  }

  showModal() {
    this.setState({showModal: true})
  }

  hideModal() {
    this.setState({showModal: false})
  }

  render() {
    var modal;
    if (this.state.showModal) {
      modal = <StoryModal story={this.story}
                          onClose={this.hideModal.bind(this)} />
    }

    return (
      <div>
        <li className="stories-list__item">
          <div>
            <a href="javascript://" title={this.story.name} className="truncated-text" onClick={this.showModal.bind(this)}>
              #{this.story.number} {this.story.name}
            </a>
            <span className="stories-list__item__estimate">
              <i className="ion-connection-bars right-padded-icon"></i>{this.story.estimate}
            </span>
          </div>
          <div className="stories-list__item__assignee-line">
            <i className="ion-person"></i>
          </div>
        </li>
        {modal}
      </div>
    )
  }
}

export default StoryCard
