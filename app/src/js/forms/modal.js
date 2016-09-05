import React from 'react'

const ESCAPE = 27

export default class Modal extends React.Component {
  componentDidMount() {
    this.listenForEscape()
  }

  componentWillUnmount() {
    this.stopListeningForEscape()
  }

  listenForEscape() {
    document.onkeydown = function(evt) {
      evt = evt || window.event;
      if (evt.keyCode === ESCAPE) {
        this.props.onClose()
      }
    }.bind(this)
  }

  stopListeningForEscape() {
    document.onkeydown = null
  }

  onContainerClick(e) {
    if (e.target === this.refs.container) {
      this.props.onClose()
    }
  }

  render() {
    const extraClass = this.props.className || ''

    return (
      <div className="modal-container" ref="container" onClick={this.onContainerClick.bind(this)}>
        <div className={`modal ${extraClass}`}>
          {this.props.children}
        </div>
      </div>
    )
  }
}
