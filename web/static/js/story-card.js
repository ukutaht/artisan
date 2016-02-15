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

  displayEstimate() {
    if (this.props.story.estimate !== null) {
      return (
       <span className="story-card__estimate">
         <i className="ion-connection-bars right-padded-icon"></i>
         {this.props.story.estimate}
       </span>
      )
    }
  }

  renderModal() {
    if (this.state.showModal) {
      return (
        <StoryModal story={this.props.story}
                    onClose={this.hideModal.bind(this)}
                    onSubmit={this.updateStory.bind(this)}
                    header="Edit story"
                    buttonText="Update" />
      )
    }
  }

  render() {
    return (
      <div>
        <li className="story-card">
          <div>
            <a href="javascript://" title={this.props.story.name} className="truncated-text" onClick={this.showModal.bind(this)}>
              {this.props.story.number}. {this.props.story.name}
            </a>
            {this.displayEstimate()}
          </div>
          <div className="story-card__second-line">
            <ul className="story-card__tags">
              {this.props.story.tags.map((tag) => {
                return <li className="story-card__tags__item" key={tag}>{tag}</li>
              })}
            </ul>
            <i className="ion-person story-card__second-line__assignee"></i>
          </div>
        </li>
        {this.renderModal()}
      </div>
    )
  }
}

export default StoryCard
