import React from "react"
import Link from 'react-router/lib/Link'

class Layout extends React.Component {
  render() {
    return (
      <div>
        <nav className="top-nav">
          <div className="top-nav__brand">
            <Link to="/">
              <img src="/images/artisan-logo.png" />
            </Link>
          </div>
        </nav>

        <main className="container">
          { this.props.children }
        </main>
      </div>
    )
  }
}

export default Layout
