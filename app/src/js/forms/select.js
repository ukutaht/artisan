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

  open() {
    this.setState({isOpen: true})
  }

  selectOption(newValue) {
    this.props.onChange(newValue)
    this.setState({isOpen: false})
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
    } else  {
      return <i className="ion-arrow-down-b" />
    }
  }

  render() {
    const selected = this.props.options.find((option) => option.value === this.props.value);

    return (
      <div className={`dropdown select ${this.openClass()}`}>
        <input value={selected.label} readOnly onClick={this.open.bind(this)}></input>
        {this.renderIcon()}
        {this.renderOptions()}
      </div>
    )
  }
}

