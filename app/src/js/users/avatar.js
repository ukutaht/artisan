import React from 'react'

const ICON_ASPECT_RATIO_CORRECTION = -0.1625
const ICON_ASPECT_RATIO = 4/3

export default function Avatar({src, size}) {
  if (src) {
    return <img className="avatar" width={size} height={size} src={src} />
  } else {
    return <div className="avatar" style={{
      fontSize: size * ICON_ASPECT_RATIO,
      width: size,
      height: size,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <i className="ion-person" style={{
        position: 'absolute',
        top: size * ICON_ASPECT_RATIO_CORRECTION,
      }}/>
    </div>
  }
}
