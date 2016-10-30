import React from 'react'
import Link from 'react-router/lib/Link'

import * as projects from 'projects/service'
import * as users from 'users/service'
import StoryCard from 'stories/card'

export default class Dashboard extends React.Component {
  componentWillMount() {
    document.title = 'Artisan'
    this.setState({projects: [], stories: []})

    projects.all().then((projects) => {
      this.setState({projects: projects})
    })

    users.currentStories().then((stories) => {
      this.setState({stories: stories})
    })
  }

  renderStory(story) {
    return (
      <StoryCard story={story} hideTags={true} />
    )
  }

  render() {
    return (
      <div>
        <div className="dashboard-column stories">
          <h2 className="dashboard-column__header">Current Stories</h2>
          <ul className="current-stories-list">
            { this.state.stories.map(this.renderStory) }
          </ul>
        </div>

        <div className="dashboard-column projects">
          <h2 className="dashboard-column__header">Projects
            <Link to="/projects/new">
              <button className="button primary create-project no-margin">Create project</button>
            </Link>
          </h2>

          <ul className="projects-list">
            {
              this.state.projects.map((project) => {
                return (
                  <li className="projects-list__item" key={project.id}>
                    <Link to={`${project.slug}`}>{project.name}</Link>
                    <Link to={`${project.slug}/settings`} className="projects-list__item__settings">
                      <i className="ion-gear-b right-padded-icon"></i>Settings
                    </Link>
                  </li>
                )
              })
            }
          </ul>
        </div>
      </div>
    )
  }
}
