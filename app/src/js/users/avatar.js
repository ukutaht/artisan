import React from 'react'

export default class Avatar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedSocial: 'twitter',
      userName: ''
    }
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

  change() {
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
            Change
          </button>
        </div>
      </div>
    )
  }
}
