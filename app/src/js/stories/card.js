import React from 'react'

class Card extends React.Component {
  constructor(props) {
    super(props);
  }

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
    const tags = this.props.story.tags || []

    return (
      <li className="story-card" data-id={this.props.story.id}>
        <div>
          <a href="javascript://" title={this.props.story.name} className="truncated-text" onClick={this.onClick.bind(this)}>
            {this.props.story.number}. {this.props.story.name}
          </a>
          {this.displayEstimate()}
        </div>
        <div className="story-card__second-line">
          <ul className="story-card__tags">
            {tags.map((tag) => {
              return <li className="story-card__tags__item" key={tag}>{tag}</li>
            })}
          </ul>
          <i className="ion-person story-card__second-line__assignee"></i>
        </div>
      </li>
    )
  }
}

export default Card
