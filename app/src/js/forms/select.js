import React from 'react'
import ReactDOM from 'react-dom'

export default class Select extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isOpen: false,
    }

    this.handleDocumentClick = this.handleDocumentClick.bind(this)
  }

  componentDidMount () {
    document.addEventListener('click', this.handleDocumentClick, false)
    document.addEventListener('touchend', this.handleDocumentClick, false)
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.handleDocumentClick, false)
    document.removeEventListener('touchend', this.handleDocumentClick, false)
  }

  handleDocumentClick (event) {
    if (!ReactDOM.findDOMNode(this).contains(event.target)) {
      this.setState({isOpen: false})
    }
  }

  openClass() {
    return this.state.isOpen ? 'open' : ''
  }

  toggle() {
    this.setState({isOpen: true})
  }

  selectOption(newValue) {
    this.props.onChange(newValue)
    this.setState({isOpen: false})
  }

  discard(e) {
    this.selectOption(null);
    e.stopPropagation()
  }

  renderOption(option) {
    return (
      <a onClick={this.selectOption.bind(this, option.value)} key={option.value}>{option.label}</a>
    )
  }

  renderOptions() {
    if (this.state.isOpen) {
      return (
        <div className="dropdown__content">
          {this.props.options.map(this.renderOption.bind(this))}
        </div>
      )
    }
    return false
  }

  renderIcon() {
    if (this.state.isOpen) {
      return <i className="ion-arrow-up-b" />
    } else if (this.props.value) {
      return <i className="ion-backspace-outline clickable" onClick={this.discard.bind(this)} />
    } else {
      return <i className="ion-arrow-down-b" />
    }
  }

  value() {
    if (this.props.value) {
      const selected = this.props.options.find((option) => option.value === this.props.value);
      return selected.label
    } else {
      return this.props.placeholder
    }
  }

  render() {
    return (
      <div className={`dropdown select ${this.openClass()}`}>
        <div onClick={this.toggle.bind(this)}>
          <input value={this.value()} readOnly />
          {this.renderIcon()}
        </div>
        {this.renderOptions()}
      </div>
    )
  }
}

