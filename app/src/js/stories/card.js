import React from 'react'

import Avatar from 'users/avatar'

export default class Card extends React.Component {
  onClick() {
    this.props.onClick(this.props.story)
  }

  shouldComponentUpdate(nextProps) {
    return nextProps !== this.props
  }

  renderEstimate() {
    if (this.props.story.estimate) {
      return (
       <span className="story-card__estimate">
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

  renderAvatar() {
    if (this.props.story.assignee) {
      return <Avatar src={this.props.story.assignee.avatar} size={20} />
    }
    return null
  }

  renderSecondLine() {
    if (this.props.hideTags) return null
    const tags = this.props.story.tags || []

    return (
      <div className="story-card__second-line">
        <ul className="story-card__tags truncated">
          {tags.map((tag) => {
            return <li className="story-card__tags__item" key={tag}>{tag}</li>
          })}
        </ul>
        {this.renderAvatar()}
      </div>
    )
  }

  render() {
    const disabledClass = this.props.disabled ? 'disabled' : ''

    return (
      <li className={`story-card ${disabledClass}`} data-id={this.props.story.id}>
        <div className="story-card__first-line">
          {this.renderTitle()}
          {this.renderEstimate()}
        </div>
        {this.renderSecondLine()}
      </li>
    )
  }
}
