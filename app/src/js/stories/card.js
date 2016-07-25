import React from 'react'

import Avatar from 'users/avatar'

class Card extends React.Component {
  onClick() {
    this.props.onClick(this.props.story)
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.story !== this.props.story
  }

  renderEstimate() {
    if (this.props.story.estimate) {
      return (
       <span className="story-card__estimate">
         <i className="ion-connection-bars right-padded-icon show-desk-and-up"></i>
         {this.props.story.estimate}
       </span>
      )
    }
  }

  renderTitle() {
    const story = this.props.story
    const truncated = story.estimate ? 'truncated' : ''

    return (
      <a title={story.name} className={`story-card__title ${truncated}`} onClick={this.onClick.bind(this)}>
        {story.number}. {story.name}
      </a>
    )
  }

  render() {
    const story = this.props.story
    const tags = story.tags || []
    const avatar = story.assignee ? story.assignee.avatar : null

    return (
      <li className="story-card" data-id={this.props.story.id}>
        <div className="story-card__first-line">
          {this.renderTitle()}
          {this.renderEstimate()}
        </div>
        <div className="story-card__second-line">
          <ul className="story-card__tags truncated">
            {tags.map((tag) => {
              return <li className="story-card__tags__item" key={tag}>{tag}</li>
            })}
          </ul>
          <Avatar src={avatar} size={20} />
        </div>
      </li>
    )
  }
}

export default Card
