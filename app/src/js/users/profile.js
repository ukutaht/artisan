import React from 'react'
import update from 'react/lib/update'

import AvatarSelect from 'users/avatar'
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
      .then((res) => {
        console.log(res)
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

  renderAvatar() {
    if (this.state.user.avatar) {
      return <img className="avatar" src={this.state.user.avatar} width="78px" height="78px"/>
    } else {
      return <i className="ion-person avatar" />
    }
  }

  render() {
    return (
      <div className="six-columns">
        <h2>Profile</h2>
        <form onSubmit={this.onSubmit.bind(this)}>
          <span>Avatar</span>
          <div className="row spaced">
            <div className="four-columns">
              {this.renderAvatar()}
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
