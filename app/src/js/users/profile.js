import React from 'react'
import update from 'react/lib/update'

import Spinner from 'spinner'
import AvatarSelect from 'users/avatar-select'
import Avatar from 'users/avatar'
import * as users from 'users/service'

const formStates = {
  initial: 'initial',
  saving: 'saving',
  success: 'success',
  error: 'error'
}

export default class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: users.current(),
      selectingNewAvatar: false,
      formState: formStates.initial
    }
  }

  componentDidMount() {
    document.title = 'Profile'
  }

  onSubmit(e) {
    e.preventDefault()
    this.setState({formState: formStates.saving})

    users.updateProfile(this.state.user)
      .then(() => {
        this.setState({
          user: users.current(),
          formState: formStates.success,
        })
      })
      .catch(() => {
        this.setState({
          formState: formStates.error,
        })
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

  closeAvatarSelect() {
    this.setState({selectingNewAvatar: false})
  }

  avatarChanged(newUrl) {
    this.setState(update(this.state, {
      user: {avatar: {$set: newUrl}},
      formState: {$set: formStates.initial}
    }))
  }

  nameChanged(e) {
    this.setState(update(this.state, {
      user: {name: {$set: e.target.value}},
      formState: {$set: formStates.initial}
    }))
  }

  emailChanged(e) {
    this.setState(update(this.state, {
      user: {email: {$set: e.target.value}},
      formState: {$set: formStates.initial}
    }))
  }

  avatarSelect() {
    if (this.state.selectingNewAvatar) {
      return <AvatarSelect onChange={this.avatarChanged.bind(this)} onClose={this.closeAvatarSelect.bind(this)} />
    } else {
      return (
        <button onClick={this.selectNewAvatar.bind(this)}
          className="button primary">
          Change avatar
        </button>
      )
    }
  }

  renderFormState() {
    if (this.state.formState === formStates.saving) {
      return <Spinner />
    } else if (this.state.formState === formStates.success) {
      return <i className="ion-checkmark success" />
    } else if (this.state.formState === formStates.error) {
      return <i className="ion-close error" />
    }

    return null
  }

  render() {
    return (
      <div className="profile">
        <h2>Profile</h2>
        <form onSubmit={this.onSubmit.bind(this)}>
          <span>Avatar</span>
          <div className="profile__avatar-section">
            <div className="profile__avatar-section__image">
              <Avatar src={this.state.user.avatar} size={80} />
            </div>
            <div className="profile__avatar-section__form">
              {this.avatarSelect()}
            </div>
          </div>
          <div className="form-group">
            <span>Name</span>
            <input type="text" onChange={this.nameChanged.bind(this)} value={this.state.user.name}/>
          </div>
          <div className="form-group">
            <span>Email</span>
            <input type="text" onChange={this.emailChanged.bind(this)} value={this.state.user.email}/>
          </div>
          <div className="button-with-loader">
            <button className="button primary no-margin">Update profile</button>
            {this.renderFormState()}
          </div>
        </form>
      </div>
    )
  }
}
