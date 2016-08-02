import React from 'react'

export default class InputWithError extends React.Component {
  renderError() {
    if (this.props.error) {
      return (
        <div className="icon">
          <div data-tooltip={this.props.error}>
            <i className="ion-close error" />
          </div>
        </div>
      )
    }

    return false
  }

  render() {
    return (
      <div className="input-with-icon-right">
        <input type={this.props.type} placeholder={this.props.placeholder} onChange={this.props.onChange} value={this.props.value} />
        {this.renderError()}
      </div>
    )
  }
}

