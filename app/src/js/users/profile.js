import React from 'react'
import update from 'react/lib/update'

import AvatarSelect from 'users/avatar-select'
import Avatar from 'users/avatar'
import UserService from 'users/service'
const users = new UserService()

export default class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: users.current,
      selectingNewAvatar: false
    }
  }

  onSubmit(e) {
    e.preventDefault()
    users.updateProfile(this.state.user)
      .then(() => {
        this.setState({user: users.current})
      })
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

  selectNewAvatar() {
    this.setState({selectingNewAvatar: true})
  }

  avatarChanged(newUrl) {
    this.setState(update(this.state, {
      user: {avatar: {$set: newUrl}}
    }))
  }

  nameChanged(e) {
    this.setState(update(this.state, {
      user: {name: {$set: e.target.value}}
    }))
  }

  avatarSelect() {
    if (this.state.selectingNewAvatar) {
      return <AvatarSelect onChange={this.avatarChanged.bind(this)}/>
    } else {
      return (
        <button onClick={this.selectNewAvatar.bind(this)}
          className="button primary">
          Change avatar
        </button>
      )
    }
  }

  render() {
    return (
      <div className="six-columns">
        <h2>Profile</h2>
        <form onSubmit={this.onSubmit.bind(this)}>
          <span>Avatar</span>
          <div className="row space-top-small space-bottom">
            <div className="four-columns">
              <Avatar src={this.state.user.avatar} size={80} />
            </div>
            <div className="eight-columns">
              {this.avatarSelect()}
            </div>
          </div>
          <div className="form-group">
            <span>Name</span>
            <input type="text" onChange={this.nameChanged.bind(this)} value={this.state.user.name}/>
          </div>
          <button className="button primary no-margin">Update profile</button>
        </form>
      </div>
    )
  }
}
