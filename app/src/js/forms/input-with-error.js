import React from 'react'

function renderError(props) {
  if (props.error) {
    return (
      <div className="icon">
        <div data-tooltip={props.error}>
          <i className="ion-close error" />
        </div>
      </div>
    )
  }

  return false
}

export default function InputWithError(props) {
  return (
    <div className="input-with-icon-right">
      <input type={props.type} placeholder={props.placeholder} onChange={props.onChange} value={props.value} />
      {renderError(props)}
    </div>
  )
}

