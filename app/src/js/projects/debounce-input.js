import React from 'react'

function debounce(func, wait) {
  let timeout;
  return () => {
    const context = this, args = arguments
    function later() {
      timeout = null
      func.apply(context, args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export default class DebounceInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: props.value
    }
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      value: newProps.value
    })
  }

  componentWillMount() {
    this.handleInputDebounced = debounce(() => {
      this.props.onChange.apply(this, [this.state.value]);
    }, this.props.delay);
  }

  onChange(e) {
    this.handleInputDebounced()
    this.setState({value: e.target.value})
  }

  render() {
    return (
      <input type="text" value={this.state.value} onChange={this.onChange.bind(this)} />
    )
  }
}
