import React from 'react'

import Avatar from 'users/avatar'

class Card extends React.Component {
  onClick() {
    this.props.onClick(this.props.story)
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

  shouldComponentUpdate(nextProps) {
    return nextProps.story !== this.props.story
  }

  render() {
    const story = this.props.story
    const tags = story.tags || []
    const avatar = story.assignee ? story.assignee.avatar : null

    return (
      <li className="story-card" data-id={this.props.story.id}>
        <div className="story-card__first-line">
          <a title={story.name} className="truncated-text clickable" onClick={this.onClick.bind(this)}>
            {story.number}. {story.name}
          </a>
          {this.displayEstimate()}
        </div>
        <div className="story-card__second-line">
          <ul className="story-card__tags">
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
