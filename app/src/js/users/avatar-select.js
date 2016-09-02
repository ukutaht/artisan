import React from 'react'

export default class AvatarSelect extends React.Component {
  componentWillMount() {
    this.setState({selectedSocial: 'twitter', userName: ''})
  }

  userNameChanged(e) {
    this.setState({userName: e.target.value})
  }

  selectSocial(social) {
    return () => {
      this.setState({selectedSocial: social})
    }
  }

  selectedClass(social) {
    if (this.state.selectedSocial === social) {
      return 'selected'
    }
  }

  isPreviewEnabled() {
    return this.state.userName !== ''
  }

  change(e) {
    e.preventDefault()
    const {selectedSocial, userName} = this.state

    let url = '';
    if (selectedSocial === 'github') {
      url = `https://github.com/${userName}.png?size=70`
    } else if (selectedSocial === 'twitter') {
      url = `https://twitter.com/${userName}/profile_image?size=bigger`
    }

    this.props.onChange(url)
  }

  render() {
    return (
      <div>
        <i className="ion-close pull-right clickable" onClick={this.props.onClose}/>
        <ul className="social-links">
          <li onClick={this.selectSocial('twitter')} className={this.selectedClass('twitter')}>
            <i className="ion-social-twitter" />
          </li>
          <li onClick={this.selectSocial('github')} className={this.selectedClass('github')}>
            <i className="ion-social-github" />
          </li>
        </ul>
        <div className="input-with-button">
          <input type="text" placeholder="Username" value={this.state.userName} onChange={this.userNameChanged.bind(this)}/>
          <button
            className="button primary"
            disabled={!this.isPreviewEnabled()}
            onClick={this.change.bind(this)}>
            Preview
          </button>
        </div>
      </div>
    )
  }
}
